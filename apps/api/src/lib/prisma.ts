import './env';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { PrismaClient } from '@prisma/client';

function setupDatabase() {
  const customUrl = process.env.DATABASE_URL;
  // If remote PostgreSQL/MySQL is provided, use it directly
  if (customUrl && !customUrl.startsWith('file:')) {
    return;
  }

  if (process.env.VERCEL) {
    const tmpDbPath = path.join(os.tmpdir(), 'dev.db');
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'dev.db'),
        path.join(process.cwd(), 'apps/api/dev.db'),
        path.join(__dirname, '../../dev.db'),
        path.join(__dirname, '../../../dev.db'),
        path.join(__dirname, '../../../prisma/dev.db'),
        path.join(__dirname, '../../prisma/dev.db'),
      ];

      let found = false;
      for (const cand of candidates) {
        if (fs.existsSync(cand)) {
          try {
            fs.copyFileSync(cand, tmpDbPath);
            found = true;
            console.log(`[Prisma] Initialized database in /tmp from ${cand}`);
            break;
          } catch (e) {
            console.error(`[Prisma] Failed to copy db from ${cand}:`, e);
          }
        }
      }

      if (!found) {
        console.warn('[Prisma] No candidate database found, creating empty database in /tmp');
        try {
          fs.writeFileSync(tmpDbPath, '');
        } catch {}
      }
    }

    process.env.DATABASE_URL = `file:${tmpDbPath}`;
  } else if (!process.env.DATABASE_URL) {
    const rootPrismaDb = path.resolve(__dirname, '../../../../prisma/dev.db');
    if (fs.existsSync(rootPrismaDb)) {
      process.env.DATABASE_URL = `file:${rootPrismaDb}`;
    } else {
      process.env.DATABASE_URL = 'file:./dev.db';
    }
  }
}

setupDatabase();

declare global {
  // eslint-disable-next-line no-var
  var prismaClientInstance: PrismaClient | undefined;
}

export const prisma =
  global.prismaClientInstance ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  global.prismaClientInstance = prisma;
}

export default prisma;
