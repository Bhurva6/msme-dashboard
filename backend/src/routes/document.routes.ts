import { Router } from 'express';
import multer from 'multer';
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
  downloadDocument,
} from '../controllers/document.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Configure multer for file uploads
// Using memory storage - files will be in req.file.buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed.'));
    }
  },
});

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/v1/documents/upload
 * @desc    Upload a document
 * @access  Private
 */
router.post('/upload', upload.single('file'), uploadDocument);

/**
 * @route   GET /api/v1/documents/:businessId
 * @desc    Get all documents for a business
 * @access  Private
 * @query   type - Optional document type filter
 */
router.get('/:businessId', getDocuments);

/**
 * @route   DELETE /api/v1/documents/:documentId
 * @desc    Delete a document
 * @access  Private
 */
router.delete('/:documentId', deleteDocument);

/**
 * @route   GET /api/v1/documents/:documentId/download
 * @desc    Get download URL for a document
 * @access  Private
 */
router.get('/:documentId/download', downloadDocument);

export default router;
