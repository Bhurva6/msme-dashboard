/**
 * Storage Service for file uploads to cloud storage
 * Supports AWS S3 / Cloudflare R2 / Local storage
 * 
 * For production: Configure AWS S3 or Cloudflare R2 credentials
 * For development: Uses local file storage
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Environment variables for cloud storage (to be configured)
const USE_CLOUD_STORAGE = process.env.USE_CLOUD_STORAGE === 'true';
const STORAGE_BUCKET = process.env.STORAGE_BUCKET || 'msme-documents';
const STORAGE_REGION = process.env.STORAGE_REGION || 'ap-south-1';
const LOCAL_STORAGE_PATH = process.env.LOCAL_STORAGE_PATH || './uploads';

// Allowed file types and sizes
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
  path?: string;
}

export interface UploadResult {
  success: boolean;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  error?: string;
}

export class StorageService {
  /**
   * Validate file before upload
   */
  static validateFile(file: UploadedFile): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds 10MB limit. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      };
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: PDF, JPG, JPEG, PNG. Got: ${file.mimetype}`,
      };
    }

    return { valid: true };
  }

  /**
   * Generate unique file name
   */
  static generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomStr = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9]/g, '_');
    
    return `${baseName}_${timestamp}_${randomStr}${ext}`;
  }

  /**
   * Upload file to storage
   * @param file - Multer file object
   * @param folder - Folder path (e.g., 'financials', 'kyc', 'sanctions')
   */
  static async uploadFile(file: UploadedFile, folder: string = 'documents'): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: '',
          error: validation.error,
        };
      }

      const fileName = this.generateFileName(file.originalname);

      if (USE_CLOUD_STORAGE) {
        // TODO: Implement AWS S3 / Cloudflare R2 upload
        // For now, fallback to local storage
        console.log('Cloud storage not configured. Using local storage.');
        return await this.uploadToLocal(file, folder, fileName);
      } else {
        // Use local file storage
        return await this.uploadToLocal(file, folder, fileName);
      }
    } catch (error: any) {
      console.error('File upload error:', error);
      return {
        success: false,
        fileUrl: '',
        fileName: '',
        fileSize: 0,
        mimeType: '',
        error: error.message || 'File upload failed',
      };
    }
  }

  /**
   * Upload file to local storage
   */
  private static async uploadToLocal(
    file: UploadedFile,
    folder: string,
    fileName: string
  ): Promise<UploadResult> {
    try {
      // Create directory if it doesn't exist
      const uploadDir = path.join(LOCAL_STORAGE_PATH, folder);
      await fs.mkdir(uploadDir, { recursive: true });

      // Save file
      const filePath = path.join(uploadDir, fileName);
      
      if (file.buffer) {
        // If file is in buffer (memory storage)
        await fs.writeFile(filePath, file.buffer);
      } else if (file.path) {
        // If file is in temp path (disk storage)
        await fs.copyFile(file.path, filePath);
        // Delete temp file
        await fs.unlink(file.path);
      } else {
        throw new Error('No file buffer or path available');
      }

      // Generate public URL (for development, this would be served by Express)
      const fileUrl = `/uploads/${folder}/${fileName}`;

      return {
        success: true,
        fileUrl,
        fileName,
        fileSize: file.size,
        mimeType: file.mimetype,
      };
    } catch (error: any) {
      throw new Error(`Local storage upload failed: ${error.message}`);
    }
  }

  /**
   * Delete file from storage
   */
  static async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      if (USE_CLOUD_STORAGE) {
        // TODO: Implement S3 delete
        console.log('Cloud storage delete not implemented');
        return false;
      } else {
        // Delete from local storage
        const filePath = path.join(process.cwd(), fileUrl);
        await fs.unlink(filePath);
        return true;
      }
    } catch (error: any) {
      console.error('File delete error:', error);
      return false;
    }
  }

  /**
   * Generate presigned URL for secure download (for S3)
   * For local storage, returns the direct URL
   */
  static async generatePresignedUrl(fileUrl: string, expiresIn: number = 3600): Promise<string> {
    if (USE_CLOUD_STORAGE) {
      // TODO: Implement S3 presigned URL
      console.log('Presigned URL not implemented for cloud storage');
      return fileUrl;
    } else {
      // For local storage, return direct URL
      return fileUrl;
    }
  }

  /**
   * Get file extension from MIME type
   */
  static getExtensionFromMimeType(mimeType: string): string {
    const mimeMap: { [key: string]: string } = {
      'application/pdf': '.pdf',
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
    };

    return mimeMap[mimeType] || '';
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
