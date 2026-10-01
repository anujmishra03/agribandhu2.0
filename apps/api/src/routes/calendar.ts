import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware, type AuthenticatedRequest } from '../middlewares/auth';
import { ScheduleGeneratorService } from '../services/ai/scheduleGenerator';

const router = Router();
const prisma = new PrismaClient();

const eventSchema = z.object({
  farmId: z.string().min(1, 'Farm is required.'),
  cropId: z.string().optional().nullable(),
  title: z.string().min(2, 'Event title must be at least 2 characters.'),
  description: z.string().optional().nullable(),
  eventType: z.enum([
    'SEEDING',
    'IRRIGATION',
    'FERTILIZER',
    'PESTICIDE',
    'HERBICIDE',
    'PRUNING',
    'HARVEST',
    'LAND_PREP',
    'FIELD_CLEANING',
    'SOIL_TEST',
    'INSPECTION',
    'AI_RECOMMENDATION',
    'CUSTOM',
  ]).default('CUSTOM'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).default('Medium'),
  status: z.enum(['Upcoming', 'Today', 'Completed', 'Missed', 'Cancelled', 'Delayed']).default('Upcoming'),
  startDate: z.string().min(1, 'Start date is required.'),
  startTime: z.string().optional().default('08:00'),
  endDate: z.string().optional().nullable(),
  endTime: z.string().optional().default('09:00'),
  recurrence: z.enum(['NONE', 'DAILY', 'WEEKLY', 'EVERY_15_DAYS', 'MONTHLY', 'CUSTOM']).default('NONE'),
  assignedTo: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// 1. GET ALL CALENDAR EVENTS
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { farmId, cropId, eventType, priority, status, dateFrom, dateTo, search } = req.query;

    const where: any = { userId: req.user.id };
    if (farmId) where.farmId = String(farmId);
    if (cropId) where.cropId = String(cropId);
    if (eventType) where.eventType = String(eventType);
    if (priority) where.priority = String(priority);
    if (status) where.status = String(status);

    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } },
        { notes: { contains: String(search) } },
      ];
    }

    if (dateFrom || dateTo) {
      where.startDate = {};
      if (dateFrom) where.startDate.gte = String(dateFrom);
      if (dateTo) where.startDate.lte = String(dateTo);
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      orderBy: { startDate: 'asc' },
      include: {
        farm: { select: { id: true, name: true, village: true } },
        reminders: true,
        attachments: true,
      },
    });

    res.json(events);
  } catch (error) {
    console.error('GET calendar error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 2. CREATE CALENDAR EVENT
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const validated = eventSchema.parse(req.body);

    const farm = await prisma.farm.findUnique({ where: { id: validated.farmId } });
    if (!farm || farm.userId !== req.user.id) {
      return res.status(404).json({ error: 'Farm not found or unauthorized.' });
    }

    const newEvent = await prisma.calendarEvent.create({
      data: {
        userId: req.user.id,
        farmId: validated.farmId,
        cropId: validated.cropId || null,
        title: validated.title,
        description: validated.description || null,
        eventType: validated.eventType,
        priority: validated.priority,
        status: validated.status,
        startDate: validated.startDate,
        startTime: validated.startTime,
        endDate: validated.endDate || validated.startDate,
        endTime: validated.endTime,
        recurrence: validated.recurrence,
        assignedTo: validated.assignedTo || null,
        notes: validated.notes || null,
        createdBy: req.user.name,
      },
      include: {
        farm: { select: { name: true } },
      },
    });

    // Also record in farm timeline
    await prisma.farmActivity.create({
      data: {
        farmId: farm.id,
        title: `Task Scheduled: ${newEvent.title}`,
        description: `Scheduled for ${newEvent.startDate} (${newEvent.eventType})`,
        activityDate: newEvent.startDate,
      },
    });

    res.status(201).json(newEvent);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('POST calendar error:', error);
    res.status(500).json({ error: error.message || 'Internal server error.' });
  }
});

// 3. GENERATE AI FARMING SCHEDULE
router.post('/generate-ai-schedule', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { farmId } = req.body;
    if (!farmId) {
      return res.status(400).json({ error: 'Please select a farm to generate an AI schedule.' });
    }

    const farm = await prisma.farm.findUnique({
      where: { id: farmId },
      include: { crop: true, soil: true },
    });

    if (!farm || farm.userId !== req.user.id) {
      return res.status(404).json({ error: 'Farm not found or unauthorized.' });
    }

    const generatedTasks = ScheduleGeneratorService.generateSchedule(
      farm.crop?.cropName,
      farm.crop?.growthStage,
      farm.soil?.soilType
    );

    const createdEvents = [];
    const now = new Date();

    for (const task of generatedTasks) {
      const taskDate = new Date(now);
      taskDate.setDate(now.getDate() + task.offsetDays);
      const dateStr = taskDate.toISOString().split('T')[0];

      const evt = await prisma.calendarEvent.create({
        data: {
          userId: req.user.id,
          farmId: farm.id,
          cropId: farm.crop?.id || null,
          title: task.title,
          description: task.description,
          eventType: task.eventType,
          priority: task.priority,
          status: task.status,
          startDate: dateStr,
          startTime: task.startTime,
          endDate: dateStr,
          endTime: task.endTime,
          recurrence: task.recurrence,
          notes: task.notes,
          createdBy: 'AgriBandhu AI Engine',
        },
      });
      createdEvents.push(evt);
    }

    res.status(201).json({
      message: `AI Farming Schedule generated successfully with ${createdEvents.length} tasks!`,
      events: createdEvents,
    });
  } catch (error: any) {
    console.error('Generate AI Schedule error:', error);
    res.status(500).json({ error: error.message || 'AI Schedule Generation failed.' });
  }
});

// 4. GET SINGLE EVENT BY ID
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const event = await prisma.calendarEvent.findUnique({
      where: { id: req.params.id },
      include: {
        farm: { include: { crop: true, soil: true } },
        reminders: true,
        attachments: true,
      },
    });

    if (!event || event.userId !== req.user.id) {
      return res.status(404).json({ error: 'Calendar event not found.' });
    }

    res.json(event);
  } catch (error) {
    console.error('GET event error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 5. UPDATE EVENT
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const existing = await prisma.calendarEvent.findUnique({
      where: { id: req.params.id },
    });

    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ error: 'Calendar event not found.' });
    }

    const { title, status, priority, startDate, startTime, endDate, endTime, notes, description, eventType } = req.body;

    const updated = await prisma.calendarEvent.update({
      where: { id: req.params.id },
      data: {
        title: title || existing.title,
        status: status || existing.status,
        priority: priority || existing.priority,
        startDate: startDate || existing.startDate,
        startTime: startTime || existing.startTime,
        endDate: endDate || existing.endDate,
        endTime: endTime || existing.endTime,
        notes: notes !== undefined ? notes : existing.notes,
        description: description !== undefined ? description : existing.description,
        eventType: eventType || existing.eventType,
        completedAt: status === 'Completed' ? new Date() : existing.completedAt,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('PUT event error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 6. DELETE EVENT
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const existing = await prisma.calendarEvent.findUnique({
      where: { id: req.params.id },
    });

    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ error: 'Calendar event not found.' });
    }

    await prisma.calendarEvent.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('DELETE event error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
