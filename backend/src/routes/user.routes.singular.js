/**
 * User Routes (singular - /api/user)
 * 
 * User-specific endpoints (notes, messages, profile, etc.)
 * Different from /api/users which is for admin user management
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getUserNotes,
  getUserMessages,
  replyToMessage,
} from '../controllers/user.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// User Notes
router.get('/notes', getUserNotes);

// User Messages
router.get('/messages', getUserMessages);
router.post('/messages/:messageId/reply', replyToMessage);

export default router;

