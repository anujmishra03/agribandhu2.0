import path from 'path';
import fs from 'fs';

export interface ProcessedImageResult {
  imageUrl: string;
  thumbnailUrl: string;
  fileSize: number;
  mimeType: string;
  filename: string;
}

export class ImageProcessingService {
  private static MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

  public static validateImage(file: Express.Multer.File): void {
    if (!file) {
      throw new Error('No image file provided.');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('Image size exceeds the 10 MB limit.');
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!this.ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error('Unsupported format. Please upload a JPG, PNG, or WEBP image.');
    }
  }

  public static processImage(file: Express.Multer.File): ProcessedImageResult {
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
