/**
 * User Routes (plural - /api/users)
 * 
 * Admin user management endpoints
 * These are also available at /api/admin/users
 */

import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  approveDealerPartner,
} from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/status', toggleUserStatus);
router.post('/:id/approve', approveDealerPartner);

export default router;

