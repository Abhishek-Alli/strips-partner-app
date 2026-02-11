/**
 * Dealer-Specific Types
 * 
 * Data contracts for Dealer features
 */

export interface DealerProduct {
  id: string;
  dealerId: string;
  productId: string; // Reference to admin master product list
  productName: string;
  description?: string;
  price?: number;
  unit?: string;
  status: 'active' | 'inactive' | 'pending';
  images?: string[];
  specifications?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MasterProduct {
  id: string;
  name: string;
  category: string;
  description?: string;
  unit?: string;
  specifications?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
}

export interface DealerEnquiry {
  id: string;
  enquiryId: string; // Reference to main enquiry
  dealerId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  topic: string;
  message: string;
  status: 'new' | 'responded' | 'closed';
  response?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DealerFeedback {
  id: string;
  dealerId: string;
  userId: string;
  userName?: string;
  rating: number; // 1-5
  comment?: string;
  isReported: boolean;
  reportedReason?: string;
  createdAt: Date;
}

export interface DealerOffer {
  id: string;
  offerId: string; // Reference to main offer
  dealerId: string;
  isLiked: boolean;
  likedAt?: Date;
}

export interface DealerStats {
  totalProducts: number;
  activeProducts: number;
  totalEnquiries: number;
  newEnquiries: number;
  respondedEnquiries: number;
  customersContacted: number;
  totalFeedbacks: number;
  averageRating: number;
  totalOffers: number;
  likedOffers: number;
}






