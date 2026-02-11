import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getUnreadCount,
  getNotifications,
  markAsRead,
  markAllAsRead,
  registerPushToken,
  unregisterPushToken,
} from '../controllers/notifications.controller.js';

const router = express.Router();

// All notification routes require authentication
router.use(authenticate);

// In-app notifications
router.get('/in-app/unread-count', getUnreadCount);
router.get('/in-app', getNotifications);
router.patch('/in-app/:notificationId/read', markAsRead);
router.patch('/in-app/read-all', markAllAsRead);

// Push notifications
router.post('/push/register', registerPushToken);
router.post('/push/unregister', unregisterPushToken);

export default router;

