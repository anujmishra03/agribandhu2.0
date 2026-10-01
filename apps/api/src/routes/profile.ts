import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware, type AuthenticatedRequest } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, jpeg, png, webp) are allowed.'));
  },
});

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  state: z.string().min(2, 'State is required.'),
  district: z.string().min(2, 'District is required.'),
  village: z.string().min(2, 'Village is required.'),
  preferredLanguage: z.string().min(2, 'Language is required.'),
  farmSize: z.preprocess((val) => (val === '' || val === null || val === undefined ? 0 : Number(val)), z.number().nonnegative('Farm size must be positive.')),
  experience: z.preprocess((val) => (val === '' || val === null || val === undefined ? 0 : Number(val)), z.number().int().nonnegative('Experience must be an integer.')),
  primaryCrop: z.string().min(2, 'Primary crop is required.'),
  secondaryCrop: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  
  // Phase 3 Extended Profile fields
  dob: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  pinCode: z.string().optional().nullable(),
  farmerCategory: z.string().optional().nullable(),
  preferredUnits: z.string().optional().nullable(),
  organicFarming: z.preprocess((val) => val === true || val === 'true' || val === 'on', z.boolean().optional().default(false)),
  irrigationMethod: z.string().optional().nullable(),
  emergencyContactName: z.string().optional().nullable(),
  emergencyContactRelation: z.string().optional().nullable(),
  emergencyContactPhone: z.string().optional().nullable(),
});

// 1. GET PROFILE
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('GET profile error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 2. PUT PROFILE (UPDATE)
router.put('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const validated = profileSchema.parse(req.body);

    const updatedUser = await prisma.$transaction(async (tx) => {
      const userUpdate = await tx.user.update({
        where: { id: req.user!.id },
        data: {
          name: validated.name,
          phone: validated.phone,
        },
      });

      const profileUpdate = await tx.profile.upsert({
        where: { userId: req.user!.id },
        update: {
          state: validated.state,
          district: validated.district,
          village: validated.village,
          preferredLanguage: validated.preferredLanguage,
          farmSize: validated.farmSize,
          experience: validated.experience,
          primaryCrop: validated.primaryCrop,
          secondaryCrop: validated.secondaryCrop || null,
          bio: validated.bio || null,
          dob: validated.dob || null,
          gender: validated.gender || null,
          country: validated.country || 'India',
          pinCode: validated.pinCode || null,
          farmerCategory: validated.farmerCategory || null,
          preferredUnits: validated.preferredUnits || 'Acres',
          organicFarming: validated.organicFarming,
          irrigationMethod: validated.irrigationMethod || null,
          emergencyContactName: validated.emergencyContactName || null,
          emergencyContactRelation: validated.emergencyContactRelation || null,
          emergencyContactPhone: validated.emergencyContactPhone || null,
        },
        create: {
          userId: req.user!.id,
          state: validated.state,
          district: validated.district,
          village: validated.village,
          preferredLanguage: validated.preferredLanguage,
          farmSize: validated.farmSize,
          experience: validated.experience,
          primaryCrop: validated.primaryCrop,
          secondaryCrop: validated.secondaryCrop || null,
          bio: validated.bio || null,
          dob: validated.dob || null,
          gender: validated.gender || null,
          country: validated.country || 'India',
          pinCode: validated.pinCode || null,
          farmerCategory: validated.farmerCategory || null,
          preferredUnits: validated.preferredUnits || 'Acres',
          organicFarming: validated.organicFarming,
          irrigationMethod: validated.irrigationMethod || null,
          emergencyContactName: validated.emergencyContactName || null,
          emergencyContactRelation: validated.emergencyContactRelation || null,
          emergencyContactPhone: validated.emergencyContactPhone || null,
        },
      });

      return { ...userUpdate, profile: profileUpdate };
    });

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('PUT profile error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 3. DELETE PROFILE (ACCOUNT DELETE)
router.delete('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    await prisma.user.delete({
      where: { id: req.user.id },
    });

    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('DELETE profile error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 4. POST PROFILE AVATAR UPLOAD
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ error: 'No image file provided.' });

    const avatarUrl = `/uploads/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: avatarUrl },
      include: { profile: true },
    });

    res.json(updatedUser);
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload avatar.' });
  }
});

export default router;
