import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import os from 'os';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import farmRoutes from './routes/farms';
import diseaseRoutes from './routes/disease';
import calendarRoutes from './routes/calendar';

dotenv.config();

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
app.use('/api/profile', profileRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/calendar', calendarRoutes);

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
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[AgriBandhu API] Running on http://localhost:${PORT}`);
  });
}

export default app;
