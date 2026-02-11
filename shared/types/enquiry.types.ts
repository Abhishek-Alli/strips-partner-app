/**
 * Shared Enquiry & Feedback Types
 *
 * Data contracts for Enquiries, Feedbacks, and Reviews
 */

// ============================================================================
// ENUMS
// ============================================================================

export type EnquiryStatus = 'new' | 'viewed' | 'responded' | 'closed';

export type EnquiryPriority = 'low' | 'normal' | 'high' | 'urgent';

export type EnquiryCategory = 'general' | 'technical' | 'billing' | 'feedback' | 'complaint';

export type ServiceType = 'consultation' | 'quotation' | 'project' | 'other';

// ============================================================================
// GENERAL ENQUIRY (to Admin)
// ============================================================================

export interface GeneralEnquiry {
  id: string;
  userId?: string;

  // Contact Info
  name: string;
  email: string;
  phone?: string;

  // Enquiry Details
  subject: string;
  message: string;
  category?: EnquiryCategory;

  // Status
  status: EnquiryStatus;
  priority: EnquiryPriority;

  // Response
  assignedTo?: string;
  response?: string;
  respondedAt?: Date;
  respondedBy?: string;

  // Metadata
  source?: 'web' | 'mobile' | 'email';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// DEALER ENQUIRY
// ============================================================================

export interface DealerEnquiry {
  id: string;
  dealerId: string;
  userId: string;

  // Contact Info
  userName?: string;
  userEmail?: string;
  userPhone?: string;

  // Enquiry Details
  topic: string;
  message: string;
  productId?: string;

  // Status
  status: EnquiryStatus;

  // Response
  response?: string;
  respondedAt?: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PARTNER ENQUIRY
// ============================================================================

export interface PartnerEnquiry {
  id: string;
  partnerId: string;
  userId?: string;

  // Contact Info
  name: string;
  email: string;
  phone?: string;

  // Enquiry Details
  serviceType?: ServiceType;
  subject: string;
  message: string;
  budgetRange?: string;
  timeline?: string;

  // Project Details
  projectLocation?: string;
  projectType?: string;

  // Status
  status: EnquiryStatus;

  // Response
  response?: string;
  respondedAt?: Date;

  // Attachments
  attachments?: string[];

  // Metadata
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CREATE ENQUIRY REQUESTS
// ============================================================================

export interface CreateGeneralEnquiryRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category?: EnquiryCategory;
}

export interface CreateDealerEnquiryRequest {
  dealerId: string;
  topic: string;
  message: string;
  productId?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface CreatePartnerEnquiryRequest {
  partnerId: string;
  name: string;
  email: string;
  phone?: string;
  serviceType?: ServiceType;
  subject: string;
  message: string;
  budgetRange?: string;
  timeline?: string;
  projectLocation?: string;
  projectType?: string;
  attachments?: string[];
}

// ============================================================================
// RESPOND TO ENQUIRY
// ============================================================================

export interface RespondToEnquiryRequest {
  response: string;
  status?: EnquiryStatus;
}

// ============================================================================
// DEALER FEEDBACK
// ============================================================================

export interface DealerFeedback {
  id: string;
  dealerId: string;
  userId: string;

  // User Info
  userName?: string;

  // Rating
  rating: number; // 1-5

  // Review Details
  comment?: string;

  // Reporting
  isReported: boolean;
  reportedReason?: string;

  // Metadata
  createdAt: Date;
}

// ============================================================================
// PARTNER FEEDBACK
// ============================================================================

export interface PartnerFeedback {
  id: string;
  partnerId: string;
  userId: string;
  orderId?: string;

  // Rating
  rating: number; // 1-5

  // Review Details
  title?: string;
  comment?: string;

  // Detailed Ratings
  qualityRating?: number;
  serviceRating?: number;
  valueRating?: number;

  // Media
  images?: string[];

  // Status
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  isReported: boolean;
  reportedReason?: string;

  // Partner Response
  partnerResponse?: string;
  partnerRespondedAt?: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PRODUCT REVIEW
// ============================================================================

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  orderId?: string;

  // Rating
  rating: number; // 1-5

  // Review Details
  title?: string;
  comment?: string;
  pros?: string;
  cons?: string;

  // Media
  images?: string[];

  // Status
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  isReported: boolean;

  // Helpful Votes
  helpfulCount: number;

  // User Info (denormalized for display)
  userName?: string;
  userAvatar?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CREATE FEEDBACK REQUESTS
// ============================================================================

export interface CreateDealerFeedbackRequest {
  dealerId: string;
  rating: number;
  comment?: string;
}

export interface CreatePartnerFeedbackRequest {
  partnerId: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment?: string;
  qualityRating?: number;
  serviceRating?: number;
  valueRating?: number;
  images?: string[];
}

export interface CreateProductReviewRequest {
  productId: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment?: string;
  pros?: string;
  cons?: string;
  images?: string[];
}

// ============================================================================
// REPORT FEEDBACK
// ============================================================================

export interface ReportFeedbackRequest {
  feedbackId: string;
  feedbackType: 'dealer' | 'partner' | 'product';
  reason: string;
  details?: string;
}

// ============================================================================
// RESPOND TO FEEDBACK (Partner only)
// ============================================================================

export interface RespondToFeedbackRequest {
  feedbackId: string;
  response: string;
}

// ============================================================================
// FEEDBACK SUMMARY
// ============================================================================

export interface FeedbackSummary {
  entityId: string;
  entityType: 'dealer' | 'partner' | 'product';
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  // For partner/product
  averageQualityRating?: number;
  averageServiceRating?: number;
  averageValueRating?: number;
}

// ============================================================================
// ENQUIRY FILTERS
// ============================================================================

export interface EnquiryFilters {
  status?: EnquiryStatus | EnquiryStatus[];
  priority?: EnquiryPriority;
  category?: EnquiryCategory;
  assignedTo?: string;
  fromDate?: Date;
  toDate?: Date;
  search?: string;
}

export interface FeedbackFilters {
  rating?: number | number[];
  isVerifiedPurchase?: boolean;
  isApproved?: boolean;
  hasImages?: boolean;
  fromDate?: Date;
  toDate?: Date;
  sortBy?: 'rating' | 'date' | 'helpful';
  sortOrder?: 'asc' | 'desc';
}
