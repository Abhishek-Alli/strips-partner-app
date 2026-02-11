import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers/favorites.controller.js';

const router = express.Router();

// All favorites routes require authentication
router.use(authenticate);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:profileType/:profileId', removeFavorite);
router.get('/check/:profileType/:profileId', checkFavorite);

export default router;

