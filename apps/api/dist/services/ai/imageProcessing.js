"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProcessingService = void 0;
const path_1 = __importDefault(require("path"));
class ImageProcessingService {
    static MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    static ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
    static validateImage(file) {
        if (!file) {
            throw new Error('No image file provided.');
        }
        if (file.size > this.MAX_FILE_SIZE) {
            throw new Error('Image size exceeds the 10 MB limit.');
        }
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (!this.ALLOWED_EXTENSIONS.includes(ext)) {
            throw new Error('Unsupported format. Please upload a JPG, PNG, or WEBP image.');
        }
    }
    static processImage(file) {
        this.validateImage(file);
        const imageUrl = `/uploads/${file.filename}`;
        // Thumbnail uses same path or thumbnail copy in sandbox
        const thumbnailUrl = imageUrl;
        return {
            imageUrl,
            thumbnailUrl,
            fileSize: file.size,
            mimeType: file.mimetype,
            filename: file.filename,
        };
    }
}
exports.ImageProcessingService = ImageProcessingService;
