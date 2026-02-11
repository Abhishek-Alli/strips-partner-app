/**
 * Centralized Service Exports
 * 
 * Single entry point for all services
 * Makes imports cleaner and easier to manage
 */

export { apiClient } from './apiClient';
export { authService } from './authService';
export { userService } from './userService';
export { dashboardService } from './dashboardService';
export { dealerService } from './dealerService';
export { partnerService } from './partnerService';
export { contactService } from './contactService';
export { uploadService } from './uploadService';

// Re-export types
export type { LoginCredentials, LoginResponse } from './authService';
export type { UsersResponse, CreateUserData, UpdateUserData } from './userService';
export type {
  AdminDashboardStats,
  PartnerDashboardStats,
  DealerDashboardStats
} from './dashboardService';
export type {
  ContactEnquiry,
  ContactEnquiryResponse,
  ContactEnquiriesResponse
} from './contactService';

export type {
  UploadedFile,
  UploadResponse,
  MultipleUploadResponse,
  UploadOptions,
  AdminUploadOptions
} from './uploadService';

export type {
  PartnerWork,
  PartnerEnquiry,
  PartnerFeedback,
  PartnerEvent,
  PartnerNote,
  GalleryItem,
  PartnerOffer,
  PartnerTransaction,
  PartnerDashboardStats as PartnerStats,
  PartnerAnalytics
} from './partnerService';

