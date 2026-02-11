import express from 'express';
import { submitEnquiry, getAllEnquiries, getEnquiryById } from '../controllers/contact.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public route - submit enquiry
router.post('/', submitEnquiry);

// Admin routes - view enquiries
router.get('/enquiries', authenticate, requireRole(['ADMIN']), getAllEnquiries);
router.get('/enquiries/:id', authenticate, requireRole(['ADMIN']), getEnquiryById);

export default router;






