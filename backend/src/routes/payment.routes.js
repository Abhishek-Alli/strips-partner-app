/**
 * Payment Routes
 * 
 * Routes for payment-related endpoints
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getPaymentHistory,
  createPaymentIntent
} from '../controllers/payment.controller.js';

const router = express.Router();

// All payment routes require authentication
router.use(authenticate);

// Get payment history
router.get('/history', getPaymentHistory);

// Create payment intent
router.post('/create-intent', createPaymentIntent);

export default router;
