/**
 * Rate Limiting Middleware
 * Protects endpoints from abuse
 */

import rateLimit from 'express-rate-limit';
import config from '../config/env.config.js';

// Safe fallback values
const windowMs = config?.rateLimit?.windowMs ?? 900000; // 15 min
const maxRequests = config?.rateLimit?.max ?? 100;
const loginMax = config?.rateLimit?.loginMax ?? 5;
const otpMax = config?.rateLimit?.otpMax ?? 3;

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: Number(windowMs),
  max: Number(maxRequests),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
});

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(loginMax),
  message: 'Too many login attempts, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// OTP rate limiter
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(otpMax),
  message: 'Too many OTP requests, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Payment rate limiter
const paymentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
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
