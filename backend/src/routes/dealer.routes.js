/**
 * Dealer Routes
 * 
 * API endpoints for Dealer features
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { checkRole } from '../middleware/role.js';
import {
  getMasterProducts,
  getDealerProducts,
  addDealerProduct,
  updateDealerProduct,
  deleteDealerProduct,
  getDealerEnquiries,
  getDealerEnquiryById,
  respondToEnquiry,
  sendEnquiryToAdmin,
  getDealerFeedbacks,
  reportFeedback,
  getDealerOffers,
  likeOffer,
  getDealerStats,
} from '../controllers/dealer.controller.js';

const router = express.Router();

// All routes require authentication and DEALER role
router.use(authenticate);
router.use(checkRole(['DEALER']));

// Master Products (read-only for dealers)
router.get('/master-products', getMasterProducts);

// Dealer Products
router.get('/products/:dealerId', getDealerProducts);
router.post('/products', addDealerProduct);
router.put('/products/:productId', updateDealerProduct);
router.delete('/products/:productId', deleteDealerProduct);

// Enquiries
router.get('/enquiries/:dealerId', getDealerEnquiries);
router.get('/enquiries', (req, res, next) => {
  req.params.dealerId = req.user.id;
  next();
}, getDealerEnquiries);
router.get('/enquiries/detail/:enquiryId', getDealerEnquiryById);
router.post('/enquiries/:enquiryId/respond', respondToEnquiry);
router.post('/enquiries/admin', sendEnquiryToAdmin);

// Feedbacks
router.get('/feedbacks/:dealerId', getDealerFeedbacks);
router.get('/feedbacks', (req, res, next) => {
  req.params.dealerId = req.user.id;
  next();
}, getDealerFeedbacks);
router.post('/feedbacks/:feedbackId/report', reportFeedback);

// Offers
router.get('/offers/:dealerId', getDealerOffers);
router.get('/offers', (req, res, next) => {
  req.params.dealerId = req.user.id;
  next();
}, getDealerOffers);
router.post('/offers/:offerId/like', likeOffer);

// Statistics
router.get('/stats/:dealerId', getDealerStats);
router.get('/stats', (req, res, next) => {
  req.params.dealerId = req.user.id;
  next();
}, getDealerStats);

export default router;

