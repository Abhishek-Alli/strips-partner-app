/**
 * Analytics Types
 * 
 * Centralized type definitions for analytics and reporting system
 */

export enum AnalyticsEvent {
  // User Events
  APP_INSTALL = 'app_install',
  APP_FIRST_OPEN = 'app_first_open',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  
  // Search Events
  PARTNER_SEARCH = 'partner_search',
  DEALER_SEARCH = 'dealer_search',
  SEARCH_SAVED = 'search_saved',
  
  // Profile Events
  PROFILE_VIEWED = 'profile_viewed',
  PROFILE_UPDATED = 'profile_updated',
  
  // Enquiry Events
  ENQUIRY_SUBMITTED = 'enquiry_submitted',
  ENQUIRY_RESPONDED = 'enquiry_responded',
  
  // Calculator Events
  CALCULATOR_USED = 'calculator_used',
  BUDGET_ESTIMATION_USED = 'budget_estimation_used',
  
  // Payment Events
  PAYMENT_INITIATED = 'payment_initiated',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  
  // Admin Events
  PARTNER_APPROVED = 'partner_approved',
  PARTNER_REJECTED = 'partner_rejected',
  DEALER_APPROVED = 'dealer_approved',
  DEALER_REJECTED = 'dealer_rejected',
  CONTENT_UPDATED = 'content_updated',
  MANUAL_OVERRIDE = 'manual_override',
  
  // Feedback Events
  FEEDBACK_SUBMITTED = 'feedback_submitted',
  FEEDBACK_MODERATED = 'feedback_moderated',
}

export interface AnalyticsEventPayload {
  event: AnalyticsEvent;
  userId?: string;
  userRole?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  // No PII - use IDs only
}

export interface AnalyticsMetric {
  name: string;
  value: number;
  unit?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'all';
  date?: Date;
}

export interface AnalyticsTimeSeries {
  date: string;
  value: number;
  label?: string;
}

export interface AnalyticsAggregation {
  total: number;
  period: 'daily' | 'weekly' | 'monthly' | 'all';
  startDate?: Date;
  endDate?: Date;
  breakdown?: Record<string, number>;
}

export interface UserActivityReport {
  userId: string;
  role: string;
  totalLogins: number;
  lastLogin?: Date;
  totalSearches: number;
  totalEnquiries: number;
  totalPayments: number;
  totalSpent: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface EnquiryReport {
  enquiryId: string;
  userId: string;
  entityType: 'partner' | 'dealer';
  entityId: string;
  status: string;
  createdAt: Date;
  respondedAt?: Date;
  responseTime?: number; // in hours
}

export interface PaymentReport {
  paymentId: string;
  userId: string;
  serviceType: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
}

export interface ConversionFunnel {
  searches: number;
  profileViews: number;
  enquiries: number;
  payments: number;
  period: {
    start: Date;
    end: Date;
  };
  conversionRates: {
    searchToView: number; // percentage
    viewToEnquiry: number;
    enquiryToPayment: number;
  };
}

export interface PartnerAnalytics {
  partnerId: string;
  period: {
    start: Date;
    end: Date;
  };
  profileViews: number;
  enquiriesReceived: number;
  enquiriesResponded: number;
  responseRate: number; // percentage
  averageResponseTime: number; // in hours
  feedbackRating: number;
  feedbackCount: number;
  paidPromotionViews?: number;
}

export interface DealerAnalytics {
  dealerId: string;
  period: {
    start: Date;
    end: Date;
  };
  profileViews: number;
  mapClicks: number;
  enquiriesReceived: number;
  enquiriesResponded: number;
  responseRate: number; // percentage
  averageResponseTime: number; // in hours
  feedbackRating: number;
  feedbackCount: number;
  averageDistance: number; // in km
}

export interface AdminDashboardMetrics {
  totalUsers: {
    general: number;
    partner: number;
    dealer: number;
    admin: number;
  };
  activeUsers: {
    daily: number;
    monthly: number;
  };
  searches: AnalyticsAggregation;
  enquiries: AnalyticsAggregation;
  payments: {
    total: number;
    successful: number;
    failed: number;
    revenue: number;
    currency: string;
  };
  conversionFunnel: ConversionFunnel;
  timeSeries: {
    users: AnalyticsTimeSeries[];
    searches: AnalyticsTimeSeries[];
    enquiries: AnalyticsTimeSeries[];
    revenue: AnalyticsTimeSeries[];
  };
}






