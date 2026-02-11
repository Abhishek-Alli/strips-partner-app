/**
 * Rate Limiting Middleware
 * 
 * Protects endpoints from abuse
 */

import rateLimit from 'express-rate-limit';
import config from '../config/env.config.js';

const rateLimitConfig = config.rateLimit;

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
});

// Login rate limiter (stricter)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: rateLimitConfig.loginMax,
  message: 'Too many login attempts, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

// OTP rate limiter (very strict)
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: rateLimitConfig.otpMax,
  message: 'Too many OTP requests, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Payment rate limiter
const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 payment attempts per minute
  message: 'Too many payment attempts, please try again in a moment.',
  standardHeaders: true,
  legacyHeaders: false,
});

export {
  apiLimiter,
  loginLimiter,
  otpLimiter,
  paymentLimiter,
};

