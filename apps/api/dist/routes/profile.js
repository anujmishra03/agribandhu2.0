"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Ensure upload directory exists
const uploadDir = path_1.default.join(__dirname, '../../public/uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Multer configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpg, jpeg, png, webp) are allowed.'));
    },
});
const profileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters.'),
    phone: zod_1.z.string().min(10, 'Phone number must be at least 10 digits.'),
    state: zod_1.z.string().min(2, 'State is required.'),
    district: zod_1.z.string().min(2, 'District is required.'),
    village: zod_1.z.string().min(2, 'Village is required.'),
    preferredLanguage: zod_1.z.string().min(2, 'Language is required.'),
    farmSize: zod_1.z.preprocess((val) => (val === '' || val === null || val === undefined ? 0 : Number(val)), zod_1.z.number().nonnegative('Farm size must be positive.')),
    experience: zod_1.z.preprocess((val) => (val === '' || val === null || val === undefined ? 0 : Number(val)), zod_1.z.number().int().nonnegative('Experience must be an integer.')),
    primaryCrop: zod_1.z.string().min(2, 'Primary crop is required.'),
    secondaryCrop: zod_1.z.string().optional().nullable(),
    bio: zod_1.z.string().optional().nullable(),
    // Phase 3 Extended Profile fields
    dob: zod_1.z.string().optional().nullable(),
    gender: zod_1.z.string().optional().nullable(),
    country: zod_1.z.string().optional().nullable(),
    pinCode: zod_1.z.string().optional().nullable(),
    farmerCategory: zod_1.z.string().optional().nullable(),
    preferredUnits: zod_1.z.string().optional().nullable(),
    organicFarming: zod_1.z.preprocess((val) => val === true || val === 'true' || val === 'on', zod_1.z.boolean().optional().default(false)),
    irrigationMethod: zod_1.z.string().optional().nullable(),
    emergencyContactName: zod_1.z.string().optional().nullable(),
    emergencyContactRelation: zod_1.z.string().optional().nullable(),
    emergencyContactPhone: zod_1.z.string().optional().nullable(),
});
// 1. GET PROFILE
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { profile: true },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('GET profile error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
// 2. PUT PROFILE (UPDATE)
router.put('/', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        const validated = profileSchema.parse(req.body);
        const updatedUser = await prisma.$transaction(async (tx) => {
            const userUpdate = await tx.user.update({
                where: { id: req.user.id },
                data: {
                    name: validated.name,
                    phone: validated.phone,
                },
            });
            const profileUpdate = await tx.profile.upsert({
                where: { userId: req.user.id },
                update: {
                    state: validated.state,
                    district: validated.district,
                    village: validated.village,
                    preferredLanguage: validated.preferredLanguage,
                    farmSize: validated.farmSize,
                    experience: validated.experience,
                    primaryCrop: validated.primaryCrop,
                    secondaryCrop: validated.secondaryCrop || null,
                    bio: validated.bio || null,
                    dob: validated.dob || null,
                    gender: validated.gender || null,
                    country: validated.country || 'India',
                    pinCode: validated.pinCode || null,
                    farmerCategory: validated.farmerCategory || null,
                    preferredUnits: validated.preferredUnits || 'Acres',
                    organicFarming: validated.organicFarming,
                    irrigationMethod: validated.irrigationMethod || null,
                    emergencyContactName: validated.emergencyContactName || null,
                    emergencyContactRelation: validated.emergencyContactRelation || null,
                    emergencyContactPhone: validated.emergencyContactPhone || null,
                },
                create: {
                    userId: req.user.id,
                    state: validated.state,
                    district: validated.district,
                    village: validated.village,
                    preferredLanguage: validated.preferredLanguage,
                    farmSize: validated.farmSize,
                    experience: validated.experience,
                    primaryCrop: validated.primaryCrop,
                    secondaryCrop: validated.secondaryCrop || null,
                    bio: validated.bio || null,
                    dob: validated.dob || null,
                    gender: validated.gender || null,
                    country: validated.country || 'India',
                    pinCode: validated.pinCode || null,
                    farmerCategory: validated.farmerCategory || null,
                    preferredUnits: validated.preferredUnits || 'Acres',
                    organicFarming: validated.organicFarming,
                    irrigationMethod: validated.irrigationMethod || null,
                    emergencyContactName: validated.emergencyContactName || null,
                    emergencyContactRelation: validated.emergencyContactRelation || null,
                    emergencyContactPhone: validated.emergencyContactPhone || null,
                },
            });
            return { ...userUpdate, profile: profileUpdate };
        });
        res.json(updatedUser);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('PUT profile error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
// 3. DELETE PROFILE (ACCOUNT DELETE)
router.delete('/', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        await prisma.user.delete({
            where: { id: req.user.id },
        });
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.json({ message: 'Account deleted successfully.' });
    }
    catch (error) {
        console.error('DELETE profile error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
// 4. POST PROFILE AVATAR UPLOAD
router.post('/avatar', auth_1.authMiddleware, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        if (!req.file)
            return res.status(400).json({ error: 'No image file provided.' });
        const avatarUrl = `/uploads/${req.file.filename}`;
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { avatar: avatarUrl },
            include: { profile: true },
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({ error: error.message || 'Failed to upload avatar.' });
    }
});
exports.default = router;
