import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware, type AuthenticatedRequest } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configurations
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, jpeg, png, webp) are allowed.'));
  },
});

// Zod schemas
const farmSchema = z.object({
  name: z.string().min(2, 'Farm name is required.'),
  farmType: z.string().min(2, 'Farm type is required.'),
  area: z.preprocess((val) => Number(val), z.number().positive('Area must be greater than 0.')),
  unit: z.enum(['Acres', 'Hectares']),
  state: z.string().min(2, 'State is required.'),
  district: z.string().min(2, 'District is required.'),
  village: z.string().min(2, 'Village is required.'),
  address: z.string().min(2, 'Address is required.'),
  latitude: z.preprocess((val) => Number(val), z.number().optional().nullable()),
  longitude: z.preprocess((val) => Number(val), z.number().optional().nullable()),
  // Optional initial crop/soil data
  cropName: z.string().optional().nullable(),
  cropVariety: z.string().optional().nullable(),
  sowingDate: z.string().optional().nullable(),
  harvestDate: z.string().optional().nullable(),
  growthStage: z.string().optional().nullable(),
  soilType: z.string().optional().nullable(),
  ph: z.preprocess((val) => Number(val), z.number().optional().nullable()),
  nitrogen: z.preprocess((val) => Number(val), z.number().optional().nullable()),
  phosphorus: z.preprocess((val) => Number(val), z.number().optional().nullable()),
  potassium: z.preprocess((val) => Number(val), z.number().optional().nullable()),
  organicCarbon: z.preprocess((val) => Number(val), z.number().optional().nullable()),
});

const cropSchema = z.object({
  farmId: z.string().min(1, 'Farm ID is required.'),
  cropName: z.string().min(2, 'Crop name is required.'),
  variety: z.string().min(2, 'Variety is required.'),
  sowingDate: z.string().min(1, 'Sowing date is required.'),
  harvestDate: z.string().min(1, 'Expected harvest date is required.'),
  growthStage: z.string().min(2, 'Growth stage is required.'),
});

const soilSchema = z.object({
  farmId: z.string().min(1, 'Farm ID is required.'),
  soilType: z.string().min(2, 'Soil type is required.'),
  ph: z.preprocess((val) => Number(val), z.number().nonnegative('pH must be a positive number.')),
  nitrogen: z.preprocess((val) => Number(val), z.number().nonnegative('Nitrogen must be positive.')),
  phosphorus: z.preprocess((val) => Number(val), z.number().nonnegative('Phosphorus must be positive.')),
  potassium: z.preprocess((val) => Number(val), z.number().nonnegative('Potassium must be positive.')),
  organicCarbon: z.preprocess((val) => Number(val), z.number().nonnegative('Organic carbon must be positive.')),
});

const activitySchema = z.object({
  title: z.string().min(2, 'Activity title is required.'),
  description: z.string().min(2, 'Activity description is required.'),
  activityDate: z.string().min(1, 'Activity date is required.'),
});

// Helper: check ownership
async function checkFarmOwnership(farmId: string, userId: string) {
  const farm = await prisma.farm.findUnique({
    where: { id: farmId },
  });
  if (!farm || farm.userId !== userId) {
    throw new Error('Farm not found or unauthorized.');
  }
  return farm;
}

// 1. GET ALL FARMS
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const farms = await prisma.farm.findMany({
      where: { userId: req.user.id },
      include: { crop: true, soil: true, activities: true, images: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(farms);
  } catch (error) {
    console.error('GET farms error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 2. GET SINGLE FARM
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const farm = await prisma.farm.findUnique({
      where: { id: req.params.id },
      include: { crop: true, soil: true, activities: true, images: true },
    });

    if (!farm || farm.userId !== req.user.id) {
      return res.status(404).json({ error: 'Farm not found.' });
    }

    res.json(farm);
  } catch (error) {
    console.error('GET farm by ID error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 3. POST ADD FARM
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const validated = farmSchema.parse(req.body);

    const farm = await prisma.$transaction(async (tx) => {
      const newFarm = await tx.farm.create({
        data: {
          userId: req.user!.id,
          name: validated.name,
          farmType: validated.farmType,
          area: validated.area,
          unit: validated.unit,
          state: validated.state,
          district: validated.district,
          village: validated.village,
          address: validated.address,
          latitude: validated.latitude || null,
          longitude: validated.longitude || null,
        },
      });

      // Create crop if provided
      if (validated.cropName) {
        await tx.crop.create({
          data: {
            farmId: newFarm.id,
            cropName: validated.cropName,
            variety: validated.cropVariety || 'Standard',
            sowingDate: validated.sowingDate || new Date().toISOString().split('T')[0],
            harvestDate: validated.harvestDate || new Date().toISOString().split('T')[0],
            growthStage: validated.growthStage || 'Seedling',
          },
        });
      }

      // Create soil if provided
      if (validated.soilType) {
        await tx.soil.create({
          data: {
            farmId: newFarm.id,
            soilType: validated.soilType,
            ph: validated.ph || 6.5,
            nitrogen: validated.nitrogen || 0,
            phosphorus: validated.phosphorus || 0,
            potassium: validated.potassium || 0,
            organicCarbon: validated.organicCarbon || 0,
          },
        });
      }

      // Create activity logs for creation
      await tx.farmActivity.create({
        data: {
          farmId: newFarm.id,
          title: 'Farm Created',
          description: `Farm "${newFarm.name}" registered successfully.`,
          activityDate: new Date().toISOString().split('T')[0],
        },
      });

      return newFarm;
    });

    res.status(201).json(farm);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('POST farm error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 4. PUT UPDATE FARM
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    await checkFarmOwnership(req.params.id, req.user.id);

    const validated = farmSchema.parse(req.body);

    const farm = await prisma.$transaction(async (tx) => {
      const updatedFarm = await tx.farm.update({
        where: { id: req.params.id },
        data: {
          name: validated.name,
          farmType: validated.farmType,
          area: validated.area,
          unit: validated.unit,
          state: validated.state,
          district: validated.district,
          village: validated.village,
          address: validated.address,
          latitude: validated.latitude || null,
          longitude: validated.longitude || null,
        },
      });

      // Update crop if provided
      if (validated.cropName) {
        await tx.crop.upsert({
          where: { farmId: req.params.id },
          update: {
            cropName: validated.cropName,
            variety: validated.cropVariety || 'Standard',
            sowingDate: validated.sowingDate || new Date().toISOString().split('T')[0],
            harvestDate: validated.harvestDate || new Date().toISOString().split('T')[0],
            growthStage: validated.growthStage || 'Seedling',
          },
          create: {
            farmId: req.params.id,
            cropName: validated.cropName,
            variety: validated.cropVariety || 'Standard',
            sowingDate: validated.sowingDate || new Date().toISOString().split('T')[0],
            harvestDate: validated.harvestDate || new Date().toISOString().split('T')[0],
            growthStage: validated.growthStage || 'Seedling',
          },
        });
      }

      // Update soil if provided
      if (validated.soilType) {
        await tx.soil.upsert({
          where: { farmId: req.params.id },
          update: {
            soilType: validated.soilType,
            ph: validated.ph || 6.5,
            nitrogen: validated.nitrogen || 0,
            phosphorus: validated.phosphorus || 0,
            potassium: validated.potassium || 0,
            organicCarbon: validated.organicCarbon || 0,
          },
          create: {
            farmId: req.params.id,
            soilType: validated.soilType,
            ph: validated.ph || 6.5,
            nitrogen: validated.nitrogen || 0,
            phosphorus: validated.phosphorus || 0,
            potassium: validated.potassium || 0,
            organicCarbon: validated.organicCarbon || 0,
          },
        });
      }

      await tx.farmActivity.create({
        data: {
          farmId: req.params.id,
          title: 'Farm Updated',
          description: `Details of farm "${updatedFarm.name}" updated.`,
          activityDate: new Date().toISOString().split('T')[0],
        },
      });

      return updatedFarm;
    });

    res.json(farm);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('PUT farm error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 5. DELETE FARM
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    await checkFarmOwnership(req.params.id, req.user.id);

    await prisma.farm.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Farm deleted successfully.' });
  } catch (error) {
    console.error('DELETE farm error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 6. POST DUPLICATE FARM
router.post('/:id/duplicate', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const original = await prisma.farm.findUnique({
      where: { id: req.params.id },
      include: { crop: true, soil: true },
    });

    if (!original || original.userId !== req.user.id) {
      return res.status(404).json({ error: 'Farm not found.' });
    }

    const duplicated = await prisma.$transaction(async (tx) => {
      const newFarm = await tx.farm.create({
        data: {
          userId: original.userId,
          name: `${original.name} (Copy)`,
          farmType: original.farmType,
          area: original.area,
          unit: original.unit,
          state: original.state,
          district: original.district,
          village: original.village,
          address: original.address,
          latitude: original.latitude,
          longitude: original.longitude,
        },
      });

      if (original.crop) {
        await tx.crop.create({
          data: {
            farmId: newFarm.id,
            cropName: original.crop.cropName,
            variety: original.crop.variety,
            sowingDate: original.crop.sowingDate,
            harvestDate: original.crop.harvestDate,
            growthStage: original.crop.growthStage,
          },
        });
      }

      if (original.soil) {
        await tx.soil.create({
          data: {
            farmId: newFarm.id,
            soilType: original.soil.soilType,
            ph: original.soil.ph,
            nitrogen: original.soil.nitrogen,
            phosphorus: original.soil.phosphorus,
            potassium: original.soil.potassium,
            organicCarbon: original.soil.organicCarbon,
          },
        });
      }

      await tx.farmActivity.create({
        data: {
          farmId: newFarm.id,
          title: 'Farm Duplicated',
          description: `Duplicated from farm "${original.name}".`,
          activityDate: new Date().toISOString().split('T')[0],
        },
      });

      return newFarm;
    });

    res.status(201).json(duplicated);
  } catch (error) {
    console.error('Duplicate farm error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 7. POST STANDALONE CROPS CREATION
router.post('/crops', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const validated = cropSchema.parse(req.body);
    await checkFarmOwnership(validated.farmId, req.user.id);

    const crop = await prisma.crop.upsert({
      where: { farmId: validated.farmId },
      update: {
        cropName: validated.cropName,
        variety: validated.variety,
        sowingDate: validated.sowingDate,
        harvestDate: validated.harvestDate,
        growthStage: validated.growthStage,
      },
      create: validated,
    });

    res.status(201).json(crop);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 8. PUT UPDATE STANDALONE CROPS
router.put('/crops/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const crop = await prisma.crop.findUnique({ where: { id: req.params.id } });
    if (!crop) return res.status(404).json({ error: 'Crop record not found.' });
    await checkFarmOwnership(crop.farmId, req.user.id);

    const validated = cropSchema.omit({ farmId: true }).parse(req.body);
    const updatedCrop = await prisma.crop.update({
      where: { id: req.params.id },
      data: validated,
    });

    res.json(updatedCrop);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 9. POST STANDALONE SOIL CREATION
router.post('/soil', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const validated = soilSchema.parse(req.body);
    await checkFarmOwnership(validated.farmId, req.user.id);

    const soil = await prisma.soil.upsert({
      where: { farmId: validated.farmId },
      update: {
        soilType: validated.soilType,
        ph: validated.ph,
        nitrogen: validated.nitrogen,
        phosphorus: validated.phosphorus,
        potassium: validated.potassium,
        organicCarbon: validated.organicCarbon,
      },
      create: validated,
    });

    res.status(201).json(soil);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 10. PUT UPDATE STANDALONE SOIL
router.put('/soil/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const soil = await prisma.soil.findUnique({ where: { id: req.params.id } });
    if (!soil) return res.status(404).json({ error: 'Soil record not found.' });
    await checkFarmOwnership(soil.farmId, req.user.id);

    const validated = soilSchema.omit({ farmId: true }).parse(req.body);
    const updatedSoil = await prisma.soil.update({
      where: { id: req.params.id },
      data: validated,
    });

    res.json(updatedSoil);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 11. POST ADD FARM ACTIVITIES
router.post('/:id/activities', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    await checkFarmOwnership(req.params.id, req.user.id);

    const validated = activitySchema.parse(req.body);
    const newActivity = await prisma.farmActivity.create({
      data: {
        farmId: req.params.id,
        title: validated.title,
        description: validated.description,
        activityDate: validated.activityDate,
      },
    });

    res.status(201).json(newActivity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 12. POST UPLOAD FARM IMAGES
router.post('/:id/images', authMiddleware, upload.single('image'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ error: 'No image file uploaded.' });
    await checkFarmOwnership(req.params.id, req.user.id);

    const imageUrl = `/uploads/${req.file.filename}`;
    const newImage = await prisma.farmImage.create({
      data: {
        farmId: req.params.id,
        imageUrl,
        caption: req.body.caption || 'Farm Image',
      },
    });

    res.status(201).json(newImage);
  } catch (error: any) {
    console.error('Farm image upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload farm image.' });
  }
});

export default router;
