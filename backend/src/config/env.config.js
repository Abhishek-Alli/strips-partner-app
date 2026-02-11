/**
 * Environment Configuration
 * 
 * Validates and exports environment variables
 * Fails build if required variables are missing
 */

import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  
  // API
  API_PORT: process.env.API_PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Email (Production)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  
  // SMS (Production)
  SMS_PROVIDER: process.env.SMS_PROVIDER,
  SMS_API_KEY: process.env.SMS_API_KEY,
  
  // Payment Gateway
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  
  // OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  
  // reCAPTCHA
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  
  // Push Notifications
  FCM_SERVER_KEY: process.env.FCM_SERVER_KEY,
};

// Validate required variables in production
if (process.env.NODE_ENV === 'production') {
  const missingVars = [];
  
  const productionRequired = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RECAPTCHA_SECRET_KEY',
  ];
  
  productionRequired.forEach(varName => {
    if (!requiredEnvVars[varName]) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.error('❌ PRODUCTION ERROR: Missing required environment variables:');
    missingVars.forEach(v => console.error(`   - ${v}`));
    process.exit(1);
  }
  
  // Verify no test keys in production
  if (requiredEnvVars.RAZORPAY_KEY_ID?.includes('test') || 
      requiredEnvVars.RAZORPAY_KEY_ID?.includes('rzp_test')) {
    console.error('❌ PRODUCTION ERROR: Test Razorpay keys detected in production!');
    process.exit(1);
  }
  
  if (requiredEnvVars.GOOGLE_CLIENT_ID?.includes('test') ||
      requiredEnvVars.FACEBOOK_APP_ID?.includes('test')) {
    console.warn('⚠️  WARNING: Test OAuth keys detected. Verify production keys are set.');
  }
  
  console.log('✅ Production environment variables validated');
}

// Ensure no secrets are logged
const sanitizeForLogging = (value) => {
  if (!value) return '[NOT SET]';
  if (value.length > 20) {
    return value.substring(0, 8) + '...' + value.substring(value.length - 4);
  }
  return '***';
};

// Export configuration
const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isStaging: process.env.NODE_ENV === 'staging',
  
  // Server
  port: parseInt(process.env.API_PORT || '3000', 10),
  
  // Database
  database: {
    url: requiredEnvVars.DATABASE_URL,
    supabaseUrl: requiredEnvVars.SUPABASE_URL,
    supabaseKey: requiredEnvVars.SUPABASE_KEY,
  },
  
  // JWT
  jwt: {
    secret: requiredEnvVars.JWT_SECRET,
    refreshSecret: requiredEnvVars.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // Email
  email: {
    host: requiredEnvVars.SMTP_HOST,
    port: parseInt(requiredEnvVars.SMTP_PORT || '587', 10),
    user: requiredEnvVars.SMTP_USER,
    pass: requiredEnvVars.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'noreply@shreeom.com',
  },
  
  // SMS
  sms: {
    provider: requiredEnvVars.SMS_PROVIDER || 'twilio',
    apiKey: requiredEnvVars.SMS_API_KEY,
  },
  
  // Payment
  razorpay: {
    keyId: requiredEnvVars.RAZORPAY_KEY_ID,
    keySecret: requiredEnvVars.RAZORPAY_KEY_SECRET,
    isTestMode: process.env.NODE_ENV !== 'production',
  },
  
  // OAuth
  oauth: {
    google: {
      clientId: requiredEnvVars.GOOGLE_CLIENT_ID,
      clientSecret: requiredEnvVars.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      appId: requiredEnvVars.FACEBOOK_APP_ID,
      appSecret: requiredEnvVars.FACEBOOK_APP_SECRET,
    },
  },
  
  // reCAPTCHA
  recaptcha: {
    secretKey: requiredEnvVars.RECAPTCHA_SECRET_KEY,
    siteKey: process.env.RECAPTCHA_SITE_KEY,
  },
  
  // Push Notifications
  fcm: {
    serverKey: requiredEnvVars.FCM_SERVER_KEY,
  },
  
  // Feature Flags
  features: {
    enableMockAPI: process.env.ENABLE_MOCK_API === 'true' && process.env.NODE_ENV !== 'production',
    enableDebugLogs: process.env.ENABLE_DEBUG_LOGS === 'true' && process.env.NODE_ENV !== 'production',
    enableTestMode: process.env.NODE_ENV !== 'production',
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || (process.env.NODE_ENV === 'production' 
      ? ['https://app.shreeom.com', 'https://admin.shreeom.com']
      : ['http://localhost:3000', 'http://localhost:5173']),
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 100), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 100), // 100 requests per window
    loginMax: parseInt(process.env.RATE_LIMIT_LOGIN_MAX || '50', 100), // 5 login attempts
    otpMax: parseInt(process.env.RATE_LIMIT_OTP_MAX || '3', 100), // 3 OTP requests
  },
};

// Log configuration status (sanitized)
if (process.env.NODE_ENV === 'development') {
  console.log('📋 Environment Configuration:');
  console.log(`   Environment: ${config.env}`);
  console.log(`   Database: ${sanitizeForLogging(config.database.url)}`);
  console.log(`   JWT Secret: ${sanitizeForLogging(config.jwt.secret)}`);
  console.log(`   Email Host: ${config.email.host || '[NOT SET]'}`);
  console.log(`   Razorpay: ${config.razorpay.isTestMode ? 'TEST MODE' : 'PRODUCTION'}`);
  console.log(`   Mock API: ${config.features.enableMockAPI ? 'ENABLED' : 'DISABLED'}`);
}

export default config;

