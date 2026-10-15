import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../lib/env';


export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const bearerToken =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

  const token = bearerToken || req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized: Session token missing.',
    });
  }

  let secret: string;

  try {
    secret = getJwtSecret();
  } catch {
    console.error('Authentication is misconfigured: JWT_SECRET is not set.');
    return res.status(500).json({
      error: 'Server authentication is not configured.',
    });
  }

  try {
    const decoded = jwt.verify(token, secret) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({
      error: 'Unauthorized: Session expired or invalid.',
    });
  }
}

export function roleMiddleware(allowedRoles: string[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized: User session missing.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden: Insufficient privileges.',
      });
    }

    return next();
  };
}