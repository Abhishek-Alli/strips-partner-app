/**
 * Admin Routes
 * 
 * API endpoints for Admin features
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { checkRole } from '../middleware/role.js';
import {
  getDashboardStats,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  approveDealerPartner,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  sendEventInvites,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getPartnerWorks,
  updatePartnerWork,
  deletePartnerWork,
  getSteelMarketUpdates,
  createSteelMarketUpdate,
  updateSteelMarketUpdate,
  deleteSteelMarketUpdate,
  getGuestLectures,
  createGuestLecture,
  updateGuestLecture,
  deleteGuestLecture,
  getTradingAdvices,
  createTradingAdvice,
  updateTradingAdvice,
  deleteTradingAdvice,
  getUpcomingProjects,
  createUpcomingProject,
  updateUpcomingProject,
  deleteUpcomingProject,
  getTenders,
  createTender,
  updateTender,
  deleteTender,
  getEducationPosts,
  createEducationPost,
  updateEducationPost,
  deleteEducationPost,
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizAttempts,
  getAdminNotes,
  createAdminNote,
  updateAdminNote,
  deleteAdminNote,
  getEnquiries,
  respondToEnquiry,
  getReportedFeedbacks,
  deleteFeedback,
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  getChecklists,
  createChecklist,
  updateChecklist,
  deleteChecklist,
  getVisualizationRequests,
  respondToVisualizationRequest,
  getShortcutsLinks,
  createShortcutLink,
  updateShortcutLink,
  deleteShortcutLink,
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getDealershipApplications,
  reviewDealershipApplication,
  getLoyaltyPoints,
  addLoyaltyPoints,
  getAdminReports,
} from '../controllers/admin.controller.js';

const router = express.Router();

// All routes require authentication and ADMIN role
router.use(authenticate);
router.use(checkRole(['ADMIN']));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User Management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/status', toggleUserStatus);
router.post('/users/:id/approve', approveDealerPartner);

// Events
router.get('/events', getEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.post('/events/:id/invites', sendEventInvites);

// Products (Master Catalogue)
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Partner Works
router.get('/partner-works', getPartnerWorks);
router.put('/partner-works/:id', updatePartnerWork);
router.delete('/partner-works/:id', deletePartnerWork);

// Content Management
// Steel Market Updates
router.get('/content/steel-updates', getSteelMarketUpdates);
router.post('/content/steel-updates', createSteelMarketUpdate);
router.put('/content/steel-updates/:id', updateSteelMarketUpdate);
router.delete('/content/steel-updates/:id', deleteSteelMarketUpdate);

// Guest Lectures
router.get('/content/lectures', getGuestLectures);
router.post('/content/lectures', createGuestLecture);
router.put('/content/lectures/:id', updateGuestLecture);
router.delete('/content/lectures/:id', deleteGuestLecture);

// Trading Advices
router.get('/content/trading-advices', getTradingAdvices);
router.post('/content/trading-advices', createTradingAdvice);
router.put('/content/trading-advices/:id', updateTradingAdvice);
router.delete('/content/trading-advices/:id', deleteTradingAdvice);

// Upcoming Projects
router.get('/content/projects', getUpcomingProjects);
router.post('/content/projects', createUpcomingProject);
router.put('/content/projects/:id', updateUpcomingProject);
router.delete('/content/projects/:id', deleteUpcomingProject);

// Tenders
router.get('/content/tenders', getTenders);
router.post('/content/tenders', createTender);
router.put('/content/tenders/:id', updateTender);
router.delete('/content/tenders/:id', deleteTender);

// Education Posts
router.get('/content/education-posts', getEducationPosts);
router.post('/content/education-posts', createEducationPost);
router.put('/content/education-posts/:id', updateEducationPost);
router.delete('/content/education-posts/:id', deleteEducationPost);

// Quiz Management
router.get('/quizzes', getQuizzes);
router.post('/quizzes', createQuiz);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);
router.get('/quizzes/:id/attempts', getQuizAttempts);

// Admin Notes
router.get('/notes', getAdminNotes);
router.post('/notes', createAdminNote);
router.put('/notes/:id', updateAdminNote);
router.delete('/notes/:id', deleteAdminNote);

// Enquiries
router.get('/enquiries', getEnquiries);
router.post('/enquiries/:id/respond', respondToEnquiry);

// Feedback Moderation
router.get('/feedbacks/reported', getReportedFeedbacks);
router.delete('/feedbacks/:id', deleteFeedback);

// Offers & Discounts
router.get('/offers', getOffers);
router.post('/offers', createOffer);
router.put('/offers/:id', updateOffer);
router.delete('/offers/:id', deleteOffer);

// Checklists
router.get('/checklists', getChecklists);
router.post('/checklists', createChecklist);
router.put('/checklists/:id', updateChecklist);
router.delete('/checklists/:id', deleteChecklist);

// Visualization Requests
router.get('/visualization-requests', getVisualizationRequests);
router.post('/visualization-requests/:id/respond', respondToVisualizationRequest);

// Shortcuts & Links
router.get('/shortcuts', getShortcutsLinks);
router.post('/shortcuts', createShortcutLink);
router.put('/shortcuts/:id', updateShortcutLink);
router.delete('/shortcuts/:id', deleteShortcutLink);

// Videos
router.get('/videos', getVideos);
router.post('/videos', createVideo);
router.put('/videos/:id', updateVideo);
router.delete('/videos/:id', deleteVideo);

// Dealership Applications
router.get('/dealership-applications', getDealershipApplications);
router.post('/dealership-applications/:id/review', reviewDealershipApplication);

// Loyalty Points
router.get('/loyalty-points', getLoyaltyPoints);
router.post('/loyalty-points', addLoyaltyPoints);

// Reports & Analytics
router.get('/reports', getAdminReports);

export default router;






