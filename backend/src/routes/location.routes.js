import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { geocode, reverseGeocodeHandler, nearbyDealers } from '../controllers/location.controller.js';

const router = express.Router();

router.post('/geocode',         authenticate, geocode);
router.post('/reverse-geocode', authenticate, reverseGeocodeHandler);
router.get('/nearby-dealers',   authenticate, nearbyDealers);

export default router;
