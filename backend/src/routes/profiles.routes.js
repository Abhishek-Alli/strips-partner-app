/**
 * Profiles Routes
 *
 * API routes for user profile management
 */

import express from 'express';
import * as profilesController from '../controllers/profiles.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// ============================================================================
// AUTHENTICATED ROUTES
// ============================================================================

/**
 * @route   GET /api/profiles/me
 * @desc    Get current user's profile
 * @access  Authenticated
 */
router.get('/me', authenticate, profilesController.getMyProfile);

/**
 * @route   PATCH /api/profiles/me
 * @desc    Update current user's profile
 * @access  Authenticated
 */
router.patch('/me', authenticate, profilesController.updateMyProfile);

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

/**
 * @route   GET /api/profiles/dealers
 * @desc    Get list of dealers
 * @access  Public
 */
router.get('/dealers', profilesController.getDealers);

/**
 * @route   GET /api/profiles/partners
 * @desc    Get list of partners
 * @access  Public
 */
router.get('/partners', profilesController.getPartners);

/**
 * @route   GET /api/profiles/:id
 * @desc    Get public profile (dealer/partner)
 * @access  Public
 */
router.get('/:id', profilesController.getPublicProfile);

export default router;
