import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import farmRoutes from './routes/farms';
import diseaseRoutes from './routes/disease';
import calendarRoutes from './routes/calendar';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Static uploads folder serving
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

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

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`[AgriBandhu API] Running on http://localhost:${PORT}`);
});
