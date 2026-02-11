/**
 * Shared Types Index
 *
 * Central export point for all shared type definitions
 */

// Authentication & User Types
export * from './auth.types';

// Business & Content Types
export * from './business.types';

// Dealer Types
export * from './dealer.types';

// Order & Payment Types
export * from './order.types';

// Profile Types
export * from './profile.types';

// Enquiry & Feedback Types
export * from './enquiry.types';

// Messaging & Notification Types
export * from './messaging.types';

// Notification Events (legacy)
export * from './notification.types';

// ============================================================================
// COMMON TYPES
// ============================================================================

/**
 * Standard API Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

/**
 * API Error
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Pagination Response
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

/**
 * Search Parameters
 */
export interface SearchParams extends PaginationParams {
  search?: string;
  filters?: Record<string, any>;
}

/**
 * Date Range
 */
export interface DateRange {
  from?: Date | string;
  to?: Date | string;
}

/**
 * Location
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

/**
 * File Upload
 */
export interface UploadedFile {
  id: string;
  filename: string;
  originalFilename: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
}

/**
 * Select Option (for dropdowns)
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Key-Value Pair
 */
export interface KeyValue {
  key: string;
  value: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * Dashboard Stats (Admin)
 */
export interface AdminDashboardStats {
  totalUsers: number;
  totalDealers: number;
  totalPartners: number;
  ordersToday: number;
  revenueToday: number;
  pendingEnquiries: number;
  pendingApplications: number;
  newUsersToday: number;
}

/**
 * Dashboard Stats (Dealer)
 */
export interface DealerDashboardStats {
  dealerId: string;
  businessName?: string;
  averageRating: number;
  totalReviews: number;
  totalOrders: number;
  totalRevenue: number;
  activeProducts: number;
  pendingEnquiries: number;
  pendingOrders: number;
}

/**
 * Dashboard Stats (Partner)
 */
export interface PartnerDashboardStats {
  partnerId: string;
  businessName?: string;
  averageRating: number;
  totalReviews: number;
  totalOrders: number;
  totalRevenue: number;
  totalWorks: number;
  pendingEnquiries: number;
  pendingOrders: number;
}

/**
 * Daily Stats
 */
export interface DailyStats {
  date: string;
  newUsers: number;
  activeUsers: number;
  newDealers: number;
  newPartners: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalEnquiries: number;
  totalFeedbacks: number;
  totalPageViews: number;
  newProducts: number;
}

/**
 * Revenue Analytics
 */
export interface RevenueAnalytics {
  period: 'day' | 'week' | 'month' | 'year';
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    growthPercent: number;
  };
}

/**
 * User Analytics
 */
export interface UserAnalytics {
  period: 'day' | 'week' | 'month' | 'year';
  data: Array<{
    date: string;
    newUsers: number;
    activeUsers: number;
    newDealers: number;
    newPartners: number;
  }>;
  summary: {
    totalUsers: number;
    activeUsersPercent: number;
    growthPercent: number;
    byRole: {
      generalUsers: number;
      dealers: number;
      partners: number;
      admins: number;
    };
  };
}

// ============================================================================
// LOYALTY TYPES
// ============================================================================

/**
 * Loyalty Balance
 */
export interface LoyaltyBalance {
  userId: string;
  currentBalance: number;
  totalEarned: number;
  totalRedeemed: number;
  totalExpired: number;
  expiringPoints?: {
    amount: number;
    expiresAt: Date;
  };
}

/**
 * Loyalty Transaction
 */
export interface LoyaltyTransaction {
  id: string;
  userId: string;
  transactionType: 'earn' | 'redeem' | 'expire' | 'adjust';
  points: number;
  balanceBefore: number;
  balanceAfter: number;
  source?: string;
  referenceType?: string;
  referenceId?: string;
  description?: string;
  expiresAt?: Date;
  createdAt: Date;
}

/**
 * Referral Info
 */
export interface ReferralInfo {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  successfulReferrals: number;
  totalPointsEarned: number;
  pendingReferrals: Array<{
    id: string;
    referredId: string;
    referredName?: string;
    status: string;
    createdAt: Date;
  }>;
}

// ============================================================================
// FAVORITES TYPES
// ============================================================================

/**
 * Favorite
 */
export interface Favorite {
  id: string;
  userId: string;
  entityType: 'product' | 'dealer' | 'partner' | 'work';
  entityId: string;
  notes?: string;
  createdAt: Date;

  // Populated entity info
  entity?: any;
}

/**
 * Add Favorite Request
 */
export interface AddFavoriteRequest {
  entityType: 'product' | 'dealer' | 'partner' | 'work';
  entityId: string;
  notes?: string;
}

// ============================================================================
// COST CONFIGURATION TYPES
// ============================================================================

/**
 * Cost Configuration
 */
export interface CostConfiguration {
  id: string;
  configKey: string;
  configName: string;
  configValue?: number;
  configUnit?: string;
  configType: 'percentage' | 'fixed' | 'tier';
  tierValues?: Array<{
    min: number;
    max: number;
    value: number;
  }>;
  applicableTo: 'all' | 'dealer' | 'partner' | 'user';
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Update Cost Configuration Request
 */
export interface UpdateCostConfigRequest {
  configValue?: number;
  tierValues?: Array<{
    min: number;
    max: number;
    value: number;
  }>;
  isActive?: boolean;
  description?: string;
}
