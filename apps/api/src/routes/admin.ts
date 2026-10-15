import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authMiddleware, roleMiddleware, type AuthenticatedRequest } from '../middlewares/auth';

const router = Router();

// Every admin endpoint requires an authenticated ADMIN session, enforced server-side.
router.use(authMiddleware, roleMiddleware(['ADMIN']));

const ROLES = ['FARMER', 'OFFICER', 'ADMIN'] as const;
const DAY_MS = 24 * 60 * 60 * 1000;

// 1. GET DASHBOARD STATS
router.get('/stats', async (_req: AuthenticatedRequest, res) => {
  try {
    const now = Date.now();
    const last7 = new Date(now - 7 * DAY_MS);
    const last30 = new Date(now - 30 * DAY_MS);

    const [
      totalUsers,
      admins,
      officers,
      farmers,
      newUsersLast7Days,
      newUsersLast30Days,
      totalFarms,
      totalDiseaseReports,
      totalCalendarEvents,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'OFFICER' } }),
      prisma.user.count({ where: { role: 'FARMER' } }),
      prisma.user.count({ where: { createdAt: { gte: last7 } } }),
      prisma.user.count({ where: { createdAt: { gte: last30 } } }),
      prisma.farm.count(),
      prisma.diseaseReport.count(),
      prisma.calendarEvent.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
    ]);

    res.json({
      totalUsers,
      roles: { admins, officers, farmers },
      newUsersLast7Days,
      newUsersLast30Days,
      totalFarms,
      totalDiseaseReports,
      totalCalendarEvents,
      recentUsers,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[admin] stats error:', error instanceof Error ? error.message : error);
    res.status(500).json({ error: 'Failed to load dashboard statistics.' });
  }
});

// 2. LIST / SEARCH USERS
router.get('/users', async (req: AuthenticatedRequest, res) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const role = typeof req.query.role === 'string' ? req.query.role : '';
    const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit ?? '10'), 10) || 10));

    const where: any = {};
    if (role && (ROLES as readonly string[]).includes(role)) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          avatar: true,
          emailVerified: true,
          createdAt: true,
          _count: { select: { farms: true, diseaseReports: true, calendarEvents: true } },
        },
      }),
    ]);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error('[admin] users error:', error instanceof Error ? error.message : error);
    res.status(500).json({ error: 'Failed to load users.' });
  }
});

// 3. GET SINGLE USER
router.get('/users/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
        _count: { select: { farms: true, diseaseReports: true, calendarEvents: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('[admin] user detail error:', error instanceof Error ? error.message : error);
    res.status(500).json({ error: 'Failed to load user.' });
  }
});

// 4. UPDATE USER ROLE
router.patch('/users/:id/role', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { role } = z.object({ role: z.enum(ROLES) }).parse(req.body);

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    if (id === req.user.id) {
      return res.status(400).json({ error: 'You cannot change your own role.' });
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (target.role === 'ADMIN' && role !== 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot demote the last remaining administrator.' });
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid role value.' });
    }
    console.error('[admin] update role error:', error instanceof Error ? error.message : error);
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

// 5. DELETE USER
router.delete('/users/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    if (id === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (target.role === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot delete the last remaining administrator.' });
      }
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: `User "${target.email}" deleted successfully.` });
  } catch (error) {
    console.error('[admin] delete user error:', error instanceof Error ? error.message : error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

export default router;
