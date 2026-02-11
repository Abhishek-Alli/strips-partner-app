/**
 * Partner Routes
 *
 * API endpoints for Partner features
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { checkRole } from '../middleware/role.js';
import {
  getPartnerDashboardStats,
  getPartnerWorks,
  getPartnerWorkById,
  createPartnerWork,
  updatePartnerWork,
  deletePartnerWork,
  getPartnerEnquiries,
  getPartnerEnquiryById,
  respondToPartnerEnquiry,
  getPartnerFeedbacks,
  respondToFeedback,
  reportFeedback,
  getPartnerOffers,
  getPartnerEvents,
  respondToEventInvite,
  getPartnerNotes,
  getPartnerGallery,
  getPartnerTransactions,
  getPartnerAnalytics
} from '../controllers/partner.controller.js';

const router = express.Router();

// All routes require authentication and PARTNER role
router.use(authenticate);
router.use(checkRole(['PARTNER', 'ADMIN']));

// Dashboard
router.get('/dashboard', getPartnerDashboardStats);

// Works (Portfolio)
router.get('/works', getPartnerWorks);
router.get('/works/:id', getPartnerWorkById);
router.post('/works', createPartnerWork);
router.put('/works/:id', updatePartnerWork);
router.delete('/works/:id', deletePartnerWork);

// Enquiries
router.get('/enquiries', getPartnerEnquiries);
router.get('/enquiries/:id', getPartnerEnquiryById);
router.post('/enquiries/:id/respond', respondToPartnerEnquiry);

// Feedbacks
router.get('/feedbacks', getPartnerFeedbacks);
router.post('/feedbacks/:id/respond', respondToFeedback);
router.post('/feedbacks/:id/report', reportFeedback);

// Offers
router.get('/offers', getPartnerOffers);

// Events
router.get('/events', getPartnerEvents);
router.post('/events/:eventId/respond', respondToEventInvite);

// Notes (from Admin)
router.get('/notes', getPartnerNotes);

// Gallery
router.get('/gallery', getPartnerGallery);

// Billing / Transactions
router.get('/transactions', getPartnerTransactions);

// Analytics
router.get('/analytics', getPartnerAnalytics);

export default router;
