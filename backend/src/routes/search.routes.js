import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getRecentSearches,
  searchPartners,
  searchDealers,
  saveSearch,
  getSavedSearches,
} from '../controllers/search.controller.js';

const router = express.Router();

// Recent searches and saved searches require authentication
router.get('/recent', authenticate, getRecentSearches);
router.get('/saved', authenticate, getSavedSearches);
router.post('/saved', authenticate, saveSearch);

// Search endpoints can be public or authenticated (depending on requirements)
router.get('/partners', searchPartners);
router.get('/dealers', searchDealers);

export default router;

