// IMPORTANT: load environment variables before importing any module that reads
// process.env at module initialization (routes/google.ts, middleware, prisma).
// ES imports are hoisted, so this side-effect import MUST be first.
import './lib/env';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import os from 'os';
import type { NextFunction, Request, Response } from 'express';
import authRoutes from './routes/auth';
import googleAuthRoutes from './routes/google';
import profileRoutes from './routes/profile';
import farmRoutes from './routes/farms';
import diseaseRoutes from './routes/disease';
import calendarRoutes from './routes/calendar';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile, curl, SSR rewrites)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Static uploads folder serving (with fallback for serverless environment)
const uploadsPath = process.env.VERCEL
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, '../public/uploads');

try {
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
} catch {
  // Directory creation may be skipped if restricted
}

app.use('/uploads', express.static(uploadsPath));

// Simple Rate Limiting Middleware
const requestLimits = new Map<string, { count: number; resetTime: number }>();
app.use((req, res, next) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const limitWindow = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 300;

  const record = requestLimits.get(ip);
  if (!record || now > record.resetTime) {
    requestLimits.set(ip, { count: 1, resetTime: now + limitWindow });
    return next();
  }

  record.count += 1;
  if (record.count > maxRequests) {
    return res.status(429).json({ error: 'Too many requests from this IP. Please try again later.' });
  }

  next();
});

// Route Registrations
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({
    name: 'AgriBandhu AI API',
    status: 'online',
    message: 'Backend server is running successfully.',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      farms: '/api/farms',
      disease: '/api/disease',
      calendar: '/api/calendar',
      profile: '/api/profile',
      admin: '/api/admin',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// JSON 404 for unmatched API routes (keeps clients from receiving HTML).
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
});

// Global JSON error handler. Ensures every failure - including malformed JSON
// bodies and unexpected errors - is returned as JSON rather than HTML/text.
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body.' });
  }

  const status = Number(err?.status || err?.statusCode) || 500;
  console.error('[API Error]', err instanceof Error ? err.message : err);

  res.status(status).json({
    error: status >= 500 ? 'Internal server error.' : err?.message || 'Request failed.',
  });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[AgriBandhu API] Running on http://localhost:${PORT}`);
  });
}

export default app;
