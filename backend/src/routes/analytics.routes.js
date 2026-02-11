import express from 'express';
import {
  getUserActivityReport,
  getEnquiryReport,
  getPaymentReport,
  exportReportAsCSV
} from '../controllers/analytics.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All analytics routes require authentication
router.use(authenticate);

// Reports endpoints (Admin only)
router.get('/reports/user-activity', authorize('ADMIN'), getUserActivityReport);
router.get('/reports/enquiries', authorize('ADMIN'), getEnquiryReport);
router.get('/reports/payments', authorize('ADMIN'), getPaymentReport);
router.get('/reports/:reportType/export', authorize('ADMIN'), exportReportAsCSV);

export default router;





