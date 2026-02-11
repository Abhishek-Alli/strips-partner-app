import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import userSingularRoutes from './user.routes.singular.js';
import contactRoutes from './contact.routes.js';
import dealerRoutes from './dealer.routes.js';
import adminRoutes from './admin.routes.js';
import analyticsRoutes from './analytics.routes.js';
import businessRoutes from './business.routes.js';
import utilitiesRoutes from './utilities.routes.js';
import favoritesRoutes from './favorites.routes.js';
import searchRoutes from './search.routes.js';
import notificationsRoutes from './notifications.routes.js';
import paymentRoutes from './payment.routes.js';
import ordersRoutes from './orders.routes.js';
import profilesRoutes from './profiles.routes.js';
import uploadRoutes from './upload.routes.js';
import partnerRoutes from './partner.routes.js';

const router = express.Router();

// Root API route - provide API information
router.get('/', (req, res) => {
  res.json({
    message: 'Shree Om API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      user: '/api/user',
      profiles: '/api/profiles',
      orders: '/api/orders',
      contact: '/api/contact',
      dealer: '/api/dealer',
      admin: '/api/admin',
      analytics: '/api/analytics',
      business: '/api/business',
      utilities: '/api/utilities',
      favorites: '/api/favorites',
      search: '/api/search',
      notifications: '/api/notifications',
      payments: '/api/payments',
      upload: '/api/upload',
      partner: '/api/partner'
    }
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes); // Admin user management (plural)
router.use('/user', userSingularRoutes); // User-specific endpoints (singular)
router.use('/profiles', profilesRoutes); // User profiles
router.use('/orders', ordersRoutes); // Order management
router.use('/contact', contactRoutes);
router.use('/dealer', dealerRoutes);
router.use('/admin', adminRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/business', businessRoutes);
router.use('/utilities', utilitiesRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/search', searchRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/payments', paymentRoutes);
router.use('/upload', uploadRoutes);
router.use('/partner', partnerRoutes);

export default router;



