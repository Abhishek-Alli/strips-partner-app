/**
 * Upload Routes
 *
 * API endpoints for file uploads
 */

import express from 'express';
import multer from 'multer';

import { authenticate } from '../middleware/authenticate.js';
import { checkRole } from '../middleware/role.js';

import {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFilesByEntity,
  getUserFiles,
  adminUpload,
  getSignedUrl
} from '../controllers/upload.controller.js';

const router = express.Router();

/* ============================================================================
   MULTER CONFIGURATION
============================================================================ */

// Memory storage (recommended for Supabase uploads)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
  }
});

/* ============================================================================
   MULTER ERROR HANDLER
============================================================================ */

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ error: 'File size exceeds 50MB limit' });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ error: 'Maximum 10 files allowed' });
      default:
        return res.status(400).json({ error: err.message });
    }
  }

  if (err) {
    return res.status(400).json({ error: err.message });
  }

  next();
};

/* ============================================================================
   AUTHENTICATION (ALL ROUTES PROTECTED)
============================================================================ */

router.use(authenticate);

/* ============================================================================
   USER / DEALER / PARTNER ROUTES
============================================================================ */

// Upload single file
router.post(
  '/',
  upload.single('file'),
  handleMulterError,
  uploadFile
);

// Upload multiple files
router.post(
  '/multiple',
  upload.array('files', 10),
  handleMulterError,
  uploadMultipleFiles
);

// Get logged-in user's files
router.get('/my-files', getUserFiles);

// Get files linked to an entity (product, order, work, etc.)
router.get('/entity/:entityType/:entityId', getFilesByEntity);

// Get signed URL for private file access
router.get('/:id/signed-url', getSignedUrl);

// Delete file (owner or admin)
router.delete('/:id', deleteFile);

/* ============================================================================
   ADMIN ROUTES
============================================================================ */

// Admin upload (bypass ownership checks if needed)
router.post(
  '/admin',
  checkRole(['ADMIN']),
  upload.single('file'),
  handleMulterError,
  adminUpload
);

export default router;
