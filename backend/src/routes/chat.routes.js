import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  listConversations,
  createConversation,
  listMessages,
  sendMessage,
  markRead,
} from '../controllers/chat.controller.js';

const router = express.Router();

// All chat routes require authentication
router.use(authenticate);

router.get('/conversations',                listConversations);
router.post('/conversations',               createConversation);
router.get('/conversations/:id/messages',   listMessages);
router.post('/conversations/:id/messages',  sendMessage);
router.put('/conversations/:id/read',       markRead);

export default router;
