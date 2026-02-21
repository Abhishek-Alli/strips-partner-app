import express from 'express';
import {
  login,
  register,
  registerWithSocial,
  sendRegistrationOTP,
  verifyRegistrationOTP,
  refreshToken,
  sendOTP,
  verifyOTPLogin,
  forgotPassword,
  resetPassword,
  getCurrentUser
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { loginLimiter, otpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Login (rate limited)
router.post('/login', loginLimiter, login);

// Registration
router.post('/register', register);
router.post('/register/social', registerWithSocial);
router.post('/register/send-otp', otpLimiter, sendRegistrationOTP);
router.post('/register/verify-otp', verifyRegistrationOTP);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Token refresh
router.post('/refresh', refreshToken);

// OTP login (rate limited)
router.post('/otp/send', otpLimiter, sendOTP);
router.post('/otp/verify', verifyOTPLogin);

// Current user
router.get('/me', authenticate, getCurrentUser);

// Social login (Google / Facebook)
import socialAuthRoutes from './socialAuth.routes.js';
router.use('/social', socialAuthRoutes);

export default router;
