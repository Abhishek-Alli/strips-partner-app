import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { cleanupExpiredOTPs } from './utils/otp.js';
import cron from 'node-cron';
import { apiLimiter } from './middleware/rateLimiter.js';
import './config/env.config.js'; // Validate environment on startup
import { initializeSocket } from './services/socket.service.js';

dotenv.config();

const app = express();
// Support both PORT and API_PORT environment variables
// Default to 3001 to match mobile app configuration
const PORT = process.env.PORT || process.env.API_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting (applied to all API routes)
app.use('/api', apiLimiter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'SRJ Backend API',
    version: '1.0.0',
    status: 'running',
      endpoints: {
        health: '/health',
        api: {
          auth: '/api/auth',
          users: '/api/users',
          user: '/api/user',
          contact: '/api/contact',
          dealer: '/api/dealer',
          admin: '/api/admin',
          analytics: '/api/analytics',
          business: '/api/business',
          utilities: '/api/utilities',
          favorites: '/api/favorites',
          search: '/api/search',
          notifications: '/api/notifications',
          payments: '/api/payments'
        }
      },
    documentation: 'See README.md for API documentation'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Cleanup expired OTPs every hour
cron.schedule('0 * * * *', () => {
  cleanupExpiredOTPs().catch(console.error);
});

// Create HTTP server + attach Socket.IO
const server = http.createServer(app);
const io = initializeSocket(server);
app.set('io', io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Socket.IO initialized`);
});



