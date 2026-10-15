import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { getJwtSecret } from '../lib/env';

const router = Router();

const SESSION_EXPIRY = '7d';

// Configuration is read lazily on each request rather than captured at module
// load. This keeps the route correct regardless of import order / dotenv timing.
const getClientId = () => process.env.GOOGLE_CLIENT_ID;
const getClientSecret = () => process.env.GOOGLE_CLIENT_SECRET;
const getFrontendUrl = () =>
  (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
const getRedirectUri = () =>
  process.env.GOOGLE_REDIRECT_URI || `${getFrontendUrl()}/api/auth/google/callback`;
const isConfigured = () => Boolean(getClientId() && getClientSecret());
const isProduction = () => process.env.NODE_ENV === 'production';

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_TOKENINFO_ENDPOINT = 'https://oauth2.googleapis.com/tokeninfo';
const GOOGLE_ISSUERS = ['accounts.google.com', 'https://accounts.google.com'];

const setAuthCookie = (res: any, token: string) => {
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

interface GoogleClaims {
  sub: string;
  email?: string;
  email_verified?: boolean | string;
  name?: string;
  picture?: string;
}

// Verify a Google ID token on the server. Uses the trusted `google-auth-library`
// when installed, and otherwise falls back to Google's own tokeninfo endpoint
// (which performs signature, issuer, audience and expiry validation server-side).
async function verifyGoogleIdToken(idToken: string): Promise<GoogleClaims> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(getClientId());
    const ticket = await client.verifyIdToken({ idToken, audience: getClientId() });
    const payload = ticket.getPayload();
    if (!payload) throw new Error('Empty Google token payload.');
    return payload as GoogleClaims;
  } catch (libraryError) {
    // Fallback: ask Google to validate the token.
    const response = await fetch(`${GOOGLE_TOKENINFO_ENDPOINT}?id_token=${encodeURIComponent(idToken)}`);
    if (!response.ok) {
      throw new Error('Google ID token verification failed.');
    }
    const payload = (await response.json()) as GoogleClaims & {
      aud?: string;
      iss?: string;
      exp?: string;
    };

    if (payload.aud !== getClientId()) {
      throw new Error('Google ID token audience mismatch.');
    }
    if (!payload.iss || !GOOGLE_ISSUERS.includes(payload.iss)) {
      throw new Error('Google ID token issuer invalid.');
    }
    if (!payload.exp || Number(payload.exp) * 1000 < Date.now()) {
      throw new Error('Google ID token expired.');
    }
    return payload;
  }
}

// 1. START GOOGLE OAUTH FLOW
router.get('/google', (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      error: 'Google login is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
    });
  }

  const state = crypto.randomBytes(16).toString('hex');
  res.cookie('oauth_state', state, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000,
  });

  const params = new URLSearchParams({
    client_id: getClientId() as string,
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });

  res.redirect(`${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`);
});

// 2. GOOGLE OAUTH CALLBACK
router.get('/google/callback', async (req, res) => {
  const fail = (reason: string) =>
    res.redirect(`${getFrontendUrl()}/login?error=${encodeURIComponent(reason)}`);

  if (!isConfigured()) {
    return fail('google_not_configured');
  }

  try {
    const code = typeof req.query.code === 'string' ? req.query.code : undefined;
    const state = typeof req.query.state === 'string' ? req.query.state : undefined;
    const storedState = req.cookies?.oauth_state;

    if (!code || !state || !storedState || state !== storedState) {
      return fail('oauth_state_mismatch');
    }
    res.clearCookie('oauth_state');

    const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: getClientId() as string,
        client_secret: getClientSecret() as string,
        redirect_uri: getRedirectUri(),
        grant_type: 'authorization_code',
      }),
    });

    const tokens = (await tokenResponse.json()) as { id_token?: string };
    if (!tokenResponse.ok || !tokens.id_token) {
      console.error('Google token exchange failed.');
      return fail('oauth_token_exchange_failed');
    }

    let claims: GoogleClaims;
    try {
      claims = await verifyGoogleIdToken(tokens.id_token);
    } catch (verificationError) {
      console.error(
        'Google ID token verification failed:',
        verificationError instanceof Error ? verificationError.message : verificationError
      );
      return fail('oauth_invalid_token');
    }

    const email = claims.email?.toLowerCase();
    const emailVerified = claims.email_verified === true || claims.email_verified === 'true';
    if (!email || !emailVerified) {
      return fail('oauth_email_unavailable');
    }

    // Match on the unique, Google-verified email. This prevents duplicate accounts.
    // Existing password accounts are only linked when Google confirms the email.
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const randomPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
      user = await prisma.user.create({
        data: {
          name: claims.name || email.split('@')[0],
          email,
          phone: '',
          password: randomPassword,
          role: 'FARMER',
          avatar: claims.picture || null,
          emailVerified: new Date(),
        },
      });
    } else if (claims.picture && user.avatar !== claims.picture) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { avatar: claims.picture },
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, getJwtSecret(), {
      expiresIn: SESSION_EXPIRY,
    });

    setAuthCookie(res, token);
    res.redirect(`${getFrontendUrl()}/dashboard`);
  } catch (error) {
    console.error('Google OAuth error:', error instanceof Error ? error.message : error);
    return fail('oauth_failed');
  }
});

export default router;
