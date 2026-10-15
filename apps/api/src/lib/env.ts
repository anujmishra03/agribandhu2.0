import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

/**
 * Load one or more .env files into process.env.
 *
 * - Files are loaded in the given order; the first file that defines a
 *   variable wins because we never override values that are already set.
 * - `override: false` (the default) guarantees deployment-provided variables
 *   (Vercel, Docker, CI secrets) always take precedence over local files.
 */
export function loadEnvFiles(paths: string[]): void {
  for (const envPath of paths) {
    if (envPath && fs.existsSync(envPath)) {
      dotenv.config({ path: envPath, override: false });
    }
  }
}

/**
 * Candidate `.env` locations. The list intentionally covers every way the API
 * may be started so a single command from the repo root OR from `apps/api`
 * both resolve the same file:
 *   - started from `apps/api`            -> cwd/.env
 *   - started from the repository root   -> cwd/apps/api/.env
 *   - compiled/dev relative to this file -> ../../.env (apps/api/.env)
 */
export function defaultEnvPaths(): string[] {
  return [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'apps/api/.env'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../../../.env'),
  ];
}

/**
 * Resolve the JWT signing/verification secret.
 *
 * The secret MUST be provided through the environment (JWT_SECRET). There is
 * intentionally no hardcoded fallback: a predictable default secret would let
 * anyone forge session tokens. Both token issuance and verification call this
 * helper so they always share the exact same configured secret. Callers are
 * expected to handle the thrown error and fail safely.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || !secret.trim()) {
    throw new Error('JWT_SECRET is not configured. Set the JWT_SECRET environment variable.');
  }
  return secret;
}

// Auto-load on import. Any module that needs configuration should import this
// module *first* (or be imported after it) so process.env is populated before
// values are read.
loadEnvFiles(defaultEnvPaths());
