"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middlewares/auth");
const diseaseDetection_1 = require("../services/ai/diseaseDetection");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Ensure upload directory exists
const uploadDir = path_1.default.join(__dirname, '../../public/uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Unsupported file format. Only JPG, PNG, and WEBP images up to 10MB are allowed.'));
    },
});
// 1. POST UPLOAD IMAGE ONLY
router.post('/upload', auth_1.authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        if (!req.file)
            return res.status(400).json({ error: 'No image file uploaded.' });
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ imageUrl, thumbnailUrl: imageUrl, filename: req.file.filename });
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Image upload failed.' });
    }
});
// 2. POST ANALYZE IMAGE (MAIN AI PIPELINE)
router.post('/analyze', auth_1.authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        if (!req.file)
            return res.status(400).json({ error: 'Please upload a crop leaf image for AI analysis.' });
        const farmId = req.body.farmId;
        if (!farmId) {
            return res.status(400).json({ error: 'Please select a farm for disease detection.' });
        }
        // Verify farm ownership
        const farm = await prisma.farm.findUnique({
            where: { id: farmId },
            include: { crop: true },
        });
        if (!farm || farm.userId !== req.user.id) {
            return res.status(404).json({ error: 'Selected farm not found or unauthorized.' });
        }
        // Run AI Detection Pipeline Service
        const aiResult = await diseaseDetection_1.DiseaseDetectionService.analyzeImage(req.file);
        // Save DiseaseReport and DetectionHistory in transaction
        const savedReport = await prisma.$transaction(async (tx) => {
            const report = await tx.diseaseReport.create({
                data: {
                    userId: req.user.id,
                    farmId: farm.id,
                    cropId: farm.crop?.id || null,
                    imageUrl: aiResult.processedImage.imageUrl,
                    thumbnailUrl: aiResult.processedImage.thumbnailUrl,
                    prediction: aiResult.report.prediction,
                    confidence: aiResult.confidenceInfo.confidence,
                    severity: aiResult.report.severity,
                    summary: aiResult.report.summary,
                    symptoms: aiResult.report.symptoms,
                    causes: aiResult.report.causes,
                    treatment: aiResult.report.treatment,
                    organicRemedy: aiResult.report.organicRemedy,
                    prevention: aiResult.report.prevention,
                    status: aiResult.confidenceInfo.isLowConfidence ? 'FLAGGED_FOR_EXPERT' : 'COMPLETED',
                },
            });
            await tx.detectionHistory.create({
                data: {
                    reportId: report.id,
                    processingTime: aiResult.processingTimeMs,
                    modelVersion: aiResult.modelVersion,
                },
            });
            // Add to farm activity timeline
            await tx.farmActivity.create({
                data: {
                    farmId: farm.id,
                    title: `AI Disease Detected: ${aiResult.report.prediction}`,
                    description: `Confidence: ${aiResult.confidenceInfo.confidence}% | Severity: ${aiResult.report.severity}`,
                    activityDate: new Date().toISOString().split('T')[0],
                },
            });
            return report;
        });
        res.status(201).json({
            report: savedReport,
            confidenceRating: aiResult.confidenceInfo.confidenceRating,
            warningMessage: aiResult.confidenceInfo.warningMessage,
            processingTimeMs: aiResult.processingTimeMs,
        });
    }
    catch (error) {
        console.error('AI Analysis error:', error);
        res.status(500).json({ error: error.message || 'AI Disease analysis failed.' });
    }
});
// 3. GET REPORT HISTORY
router.get('/history', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        const { farmId, disease, severity, sort } = req.query;
        const where = { userId: req.user.id };
        if (farmId)
            where.farmId = String(farmId);
        if (disease)
            where.prediction = { contains: String(disease) };
        if (severity)
            where.severity = String(severity);
        let orderBy = { createdAt: 'desc' };
        if (sort === 'oldest')
            orderBy = { createdAt: 'asc' };
        if (sort === 'confidence')
            orderBy = { confidence: 'desc' };
        const reports = await prisma.diseaseReport.findMany({
            where,
            orderBy,
            include: {
                farm: { select: { name: true, village: true } },
                history: true,
            },
        });
        res.json(reports);
    }
    catch (error) {
        console.error('GET disease history error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
// 4. GET SINGLE REPORT BY ID
router.get('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        const report = await prisma.diseaseReport.findUnique({
            where: { id: req.params.id },
            include: {
                farm: true,
                user: { select: { name: true, email: true } },
                history: true,
            },
        });
        if (!report || report.userId !== req.user.id) {
            return res.status(404).json({ error: 'Disease report not found.' });
        }
        res.json(report);
    }
    catch (error) {
        console.error('GET report by ID error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
// 5. DELETE REPORT
router.delete('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        const report = await prisma.diseaseReport.findUnique({
            where: { id: req.params.id },
        });
        if (!report || report.userId !== req.user.id) {
            return res.status(404).json({ error: 'Disease report not found.' });
        }
        await prisma.diseaseReport.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Report deleted successfully.' });
    }
    catch (error) {
        console.error('DELETE disease report error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.default = router;
