import './lib/env';
import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'itachimishra2@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Anujmishra2319';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Itachi Mishra';

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      role: 'ADMIN',
      password: hashedPassword,
    },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: '',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`[seed] Admin account ready: ${admin.email} (role: ${admin.role})`);
}

main()
  .catch((error) => {
    console.error('[seed] Failed to seed admin account:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
