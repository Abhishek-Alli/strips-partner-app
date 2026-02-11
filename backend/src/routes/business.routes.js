/**
 * Business Routes
 * 
 * API endpoints for business features (Partners & Dealers)
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getStatistics,
  getSteelMarketUpdates,
  getWorks,
  createWork,
  updateWork,
  deleteWork,
  getEvents,
  getOffers,
  getLoyaltyPoints,
  getLectures,
  getTradingAdvices,
  getProjects,
  getTenders,
  getEducationPosts,
  getQuizzes,
  submitQuizAttempt,
  getReferrals,
  createReferral,
  getGallery,
  addGalleryItem,
  getNotes,
  createNote,
} from '../controllers/business.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Statistics
router.get('/statistics', getStatistics);

// Steel Market Updates
router.get('/steel-updates', getSteelMarketUpdates);

// Works (Partner Works)
router.get('/works', getWorks);
router.post('/works', createWork);
router.put('/works/:workId', updateWork);
router.delete('/works/:workId', deleteWork);

// Events
router.get('/events', getEvents);

// Offers
router.get('/offers', getOffers);

// Loyalty Points
router.get('/loyalty/:userId', getLoyaltyPoints);

// Lectures
router.get('/lectures', getLectures);

// Trading Advices
router.get('/trading-advices', getTradingAdvices);

// Projects
router.get('/projects', getProjects);

// Tenders
router.get('/tenders', getTenders);

// Education Posts
router.get('/education-posts', getEducationPosts);

// Quizzes
router.get('/quizzes', getQuizzes);
router.post('/quizzes/attempt', submitQuizAttempt);

// Referrals
router.get('/referrals/:userId', getReferrals);
router.post('/referrals', createReferral);

// Gallery
router.get('/gallery/:userId', getGallery);
router.post('/gallery', addGalleryItem);

// Notes
router.get('/notes/:userId', getNotes);
router.post('/notes', createNote);

export default router;

