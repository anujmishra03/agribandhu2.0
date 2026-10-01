import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware, type AuthenticatedRequest } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'agribandhu_secret';
const SESSION_EXPIRY = '24h';

// Helper to set HTTP-only cookie
const setAuthCookie = (res: any, token: string, rememberMe = false) => {
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
  });
};

// Validation Schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['FARMER', 'ADMIN', 'OFFICER']).default('FARMER'),
  state: z.string().min(2, 'State is required.'),
  district: z.string().min(2, 'District is required.'),
  village: z.string().min(2, 'Village is required.'),
  preferredLanguage: z.string().min(2, 'Language is required.'),
  farmSize: z.preprocess((val) => Number(val), z.number().nonnegative('Farm size must be positive.')),
  experience: z.preprocess((val) => Number(val), z.number().int().nonnegative('Experience must be an integer.')),
  primaryCrop: z.string().min(2, 'Primary crop is required.'),
  secondaryCrop: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean().optional().default(false),
});

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: validated.name,
          email: validated.email,
          phone: validated.phone,
          password: hashedPassword,
          role: validated.role,
        },
      });

      await tx.profile.create({
        data: {
          userId: newUser.id,
          state: validated.state,
          district: validated.district,
          village: validated.village,
          preferredLanguage: validated.preferredLanguage,
          farmSize: validated.farmSize,
          experience: validated.experience,
          primaryCrop: validated.primaryCrop,
          secondaryCrop: validated.secondaryCrop || null,
          bio: validated.bio || null,
        },
      });

      return newUser;
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: SESSION_EXPIRY,
    });

    setAuthCookie(res, token);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
      include: { profile: true },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(validated.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: validated.rememberMe ? '7d' : SESSION_EXPIRY,
    });

    setAuthCookie(res, token, validated.rememberMe);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 3. LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out successfully.' });
});

// 4. FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ message: 'If an account exists with that email, a password reset link has been sent.' });
    }

    const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.upsert({
      where: { email },
      update: { token: resetToken, expires },
      create: { email, token: resetToken, expires },
    });

    res.json({
      message: 'If an account exists with that email, a password reset link has been sent.',
      debugToken: resetToken,
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request data.' });
  }
});

// 5. RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = z
      .object({
        token: z.string(),
        password: z.string().min(6),
      })
      .parse(req.body);

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.expires < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { token },
    });

    res.json({ message: 'Password reset successful. Please login with your new password.' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request.' });
  }
});

// 6. GET CURRENT USER
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not logged in.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User session not found.' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      profile: user.profile,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
