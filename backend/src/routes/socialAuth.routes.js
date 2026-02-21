import express from 'express';
import { googleLogin, facebookLogin } from '../controllers/socialAuth.controller.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/google',   loginLimiter, googleLogin);
router.post('/facebook', loginLimiter, facebookLogin);

export default router;
