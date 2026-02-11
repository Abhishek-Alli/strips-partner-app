/**
 * Utilities Routes
 * 
 * API endpoints for utilities features (checklists, videos, converters, etc.)
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getChecklists,
  getVisualizationRequests,
  submitVisualizationRequest,
  getVideos,
  getUnitConverters,
  convertUnit,
  getVaastuPartners,
} from '../controllers/utilities.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Checklists
router.get('/checklists', getChecklists);

// Visualization Requests
router.get('/visualization', getVisualizationRequests);
router.post('/visualization', submitVisualizationRequest);

// Videos
router.get('/videos', getVideos);

// Unit Converters
router.get('/converters', getUnitConverters);
router.post('/convert', convertUnit);

// Vaastu Partners
router.get('/vaastu-partners', getVaastuPartners);

export default router;

