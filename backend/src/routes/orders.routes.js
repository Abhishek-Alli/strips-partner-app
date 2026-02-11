/**
 * Orders Routes
 *
 * API routes for order management
 */

import express from 'express';
import * as ordersController from '../controllers/orders.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// ============================================================================
// USER ROUTES
// ============================================================================

/**
 * @route   GET /api/orders
 * @desc    Get current user's orders
 * @access  Authenticated
 */
router.get('/', authenticate, ordersController.getOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Authenticated (owner, dealer, or partner)
 */
router.get('/:id', authenticate, ordersController.getOrderById);

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Authenticated
 */
router.post('/', authenticate, ordersController.createOrder);

/**
 * @route   PATCH /api/orders/:id/cancel
 * @desc    Cancel order
 * @access  Authenticated (owner only)
 */
router.patch('/:id/cancel', authenticate, ordersController.cancelOrder);

/**
 * @route   GET /api/orders/:id/track
 * @desc    Track order
 * @access  Authenticated (owner, dealer, or partner)
 */
router.get('/:id/track', authenticate, ordersController.trackOrder);

export default router;
