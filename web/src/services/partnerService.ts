/**
 * Partner Service
 *
 * Handles all partner-specific API calls
 */

import { apiClient } from './apiClient';
import { logger } from '../core/logger';

// ============================================================================
// INTERFACES
// ============================================================================

export interface PartnerWork {
  id: string;
  partner_id: string;
  title: string;
  description?: string;
  images: string[];
  videos: string[];
  links: string[];
  category?: string;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartnerEnquiry {
  id: string;
  partner_id: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  name: string;
  email: string;
  phone?: string;
  service_type?: string;
  subject: string;
  message: string;
  budget_range?: string;
  timeline?: string;
  project_location?: string;
  project_type?: string;
  status: 'new' | 'viewed' | 'responded' | 'closed';
  response?: string;
  responded_at?: string;
  created_at: string;
}

export interface PartnerFeedback {
  id: string;
  partner_id: string;
  user_id: string;
  user_name?: string;
  order_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  quality_rating?: number;
  service_rating?: number;
  value_rating?: number;
  images?: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  is_reported: boolean;
  partner_response?: string;
  partner_responded_at?: string;
  created_at: string;
}

export interface PartnerEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  event_date: string;
  is_active: boolean;
  invite_status?: 'pending' | 'accepted' | 'rejected';
  responded_at?: string;
}

export interface PartnerNote {
  id: string;
  title: string;
  content: string;
  visible_to_partners: boolean;
  created_by_name?: string;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  workId: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  category?: string;
  createdAt: string;
}

export interface PartnerOffer {
  id: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  valid_until?: string;
  applicable_to: 'partners' | 'dealers' | 'both';
  is_active: boolean;
}

export interface PartnerTransaction {
  id: string;
  user_id: string;
  order_id?: string;
  transaction_type: string;
  amount: number;
  currency: string;
  description?: string;
  reference_number?: string;
  status: string;
  created_at: string;
}

export interface PartnerDashboardStats {
  stats: {
    totalWorks: number;
    approvedWorks: number;
    totalEnquiries: number;
    newEnquiries: number;
    respondedEnquiries: number;
    totalFeedbacks: number;
    averageRating: number;
  };
  profile: any;
  recentEnquiries: PartnerEnquiry[];
  recentFeedbacks: PartnerFeedback[];
}

export interface PartnerAnalytics {
  enquiriesOverTime: { date: string; count: number }[];
  feedbacksOverTime: { date: string; count: number; avg_rating: number }[];
  worksByCategory: { category: string; count: number }[];
  ratingDistribution: { rating: number; count: number }[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

class PartnerService {
  // ============================================================================
  // DASHBOARD
  // ============================================================================

  async getDashboardStats(): Promise<PartnerDashboardStats> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockDashboardStats();
      }
      return apiClient.get<PartnerDashboardStats>('/partner/dashboard');
    } catch (error) {
      logger.error('Failed to get partner dashboard stats', error as Error);
      throw error;
    }
  }

  // ============================================================================
  // WORKS
  // ============================================================================

  async getWorks(): Promise<PartnerWork[]> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockWorks();
      }
      return apiClient.get<PartnerWork[]>('/partner/works');
    } catch (error) {
      logger.error('Failed to get partner works', error as Error);
      throw error;
    }
  }

  async getWorkById(id: string): Promise<PartnerWork> {
    try {
      return apiClient.get<PartnerWork>(`/partner/works/${id}`);
    } catch (error) {
      logger.error('Failed to get partner work', error as Error);
      throw error;
    }
  }

  async createWork(data: Partial<PartnerWork>): Promise<PartnerWork> {
    try {
      return apiClient.post<PartnerWork>('/partner/works', data);
    } catch (error) {
      logger.error('Failed to create partner work', error as Error);
      throw error;
    }
  }

  async updateWork(id: string, data: Partial<PartnerWork>): Promise<PartnerWork> {
    try {
      return apiClient.put<PartnerWork>(`/partner/works/${id}`, data);
    } catch (error) {
      logger.error('Failed to update partner work', error as Error);
      throw error;
    }
  }

  async deleteWork(id: string): Promise<void> {
    try {
      await apiClient.delete(`/partner/works/${id}`);
    } catch (error) {
      logger.error('Failed to delete partner work', error as Error);
      throw error;
    }
  }

  // ============================================================================
  // ENQUIRIES
  // ============================================================================

  async getEnquiries(status?: string): Promise<PartnerEnquiry[]> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockEnquiries();
      }
      const params = status && status !== 'all' ? `?status=${status}` : '';
      return apiClient.get<PartnerEnquiry[]>(`/partner/enquiries${params}`);
    } catch (error) {
      logger.error('Failed to get partner enquiries', error as Error);
      throw error;
    }
  }

  async getEnquiryById(id: string): Promise<PartnerEnquiry> {
    try {
      return apiClient.get<PartnerEnquiry>(`/partner/enquiries/${id}`);
    } catch (error) {
      logger.error('Failed to get partner enquiry', error as Error);
      throw error;
    }
  }

  async respondToEnquiry(id: string, response: string): Promise<PartnerEnquiry> {
    try {
      return apiClient.post<PartnerEnquiry>(`/partner/enquiries/${id}/respond`, { response });
    } catch (error) {
      logger.error('Failed to respond to enquiry', error as Error);
      throw error;
    }
  }

  // ============================================================================
  // FEEDBACKS
  // ============================================================================

  async getFeedbacks(): Promise<PartnerFeedback[]> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockFeedbacks();
      }
      return apiClient.get<PartnerFeedback[]>('/partner/feedbacks');
    } catch (error) {
      logger.error('Failed to get partner feedbacks', error as Error);
      throw error;
    }
  }

  async respondToFeedback(id: string, response: string): Promise<PartnerFeedback> {
    try {
      return apiClient.post<PartnerFeedback>(`/partner/feedbacks/${id}/respond`, {
        partner_response: response,
      });
    } catch (error) {
      logger.error('Failed to respond to feedback', error as Error);
      throw error;
    }
  }

  async reportFeedback(id: string, reason: string): Promise<void> {
    try {
      await apiClient.post(`/partner/feedbacks/${id}/report`, { reason });
    } catch (error) {
      logger.error('Failed to report feedback', error as Error);
      throw error;
    }
  }

  // ============================================================================
  // OFFERS
  // ============================================================================

  async getOffers(): Promise<PartnerOffer[]> {
    try {
      if (apiClient.isMockMode()) {
        return [];
      }
      return apiClient.get<PartnerOffer[]>('/partner/offers');
    } catch (error) {
      logger.error('Failed to get partner offers', error as Error);
      throw error;
    }
  }

  // ============================================================================
  // EVENTS
  // ============================================================================

  async getEvents(): Promise<PartnerEvent[]> {
    try {
      if (apiClient.isMockMode()) {
        return [];
      }
      return apiClient.get<PartnerEvent[]>('/partner/events');
    } catch (error) {
      logger.error('Failed to get partner events', error as Error);
      throw error;
    }
  }

  async respondToEventInvite(eventId: string, status: 'accepted' | 'rejected'): Promise<void> {
    try {
      await apiClient.post(`/partner/events/${eventId}/respond`, { status });
    } catch (error) {
      logger.error('Failed to respond to event invite', error as Error);
      throw error;
    }
  }

  // ============================================================================
  // NOTES
  // ============================================================================

  async getNotes(): Promise<PartnerNote[]> {
    try {
      if (apiClient.isMockMode()) {
        return [];
      }
      return apiClient.get<PartnerNote[]>('/partner/notes');
    } catch (error) {
      logger.error('Failed to get partner notes', error as Error);
      throw error;
    }
  }

  // ============================================================================
  // GALLERY
  // ============================================================================

  async getGallery(): Promise<GalleryItem[]> {
    try {
      if (apiClient.isMockMode()) {
        return [];
      }
      return apiClient.get<GalleryItem[]>('/partner/gallery');
    } catch (error) {
      logger.error('Failed to get partner gallery', error as Error);
      throw error;
    }
  }

  // ============================================================================
  // TRANSACTIONS
  // ============================================================================

  async getTransactions(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<PartnerTransaction>> {
    try {
      if (apiClient.isMockMode()) {
        return { items: [], pagination: { page, limit, total: 0, pages: 0 } };
      }
      return apiClient.get<PaginatedResponse<PartnerTransaction>>('/partner/transactions', {
        params: { page, limit },
      });
    } catch (error) {
      logger.error('Failed to get partner transactions', error as Error);
      throw error;
    }
  }

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  async getAnalytics(period: number = 30): Promise<PartnerAnalytics> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockAnalytics();
      }
      return apiClient.get<PartnerAnalytics>('/partner/analytics', {
        params: { period },
      });
    } catch (error) {
      logger.error('Failed to get partner analytics', error as Error);
      throw error;
    }
  }

  // ============================================================================
  // MOCK DATA
  // ============================================================================

  private mockDashboardStats(): PartnerDashboardStats {
    return {
      stats: {
        totalWorks: 12,
        approvedWorks: 10,
        totalEnquiries: 45,
        newEnquiries: 5,
        respondedEnquiries: 38,
        totalFeedbacks: 28,
        averageRating: 4.5,
      },
      profile: {
        business_name: 'Demo Partner Business',
        city: 'Mumbai',
      },
      recentEnquiries: [],
      recentFeedbacks: [],
    };
  }

  private mockWorks(): PartnerWork[] {
    return [
      {
        id: '1',
        partner_id: 'partner-1',
        title: 'Modern Kitchen Design',
        description: 'Complete kitchen renovation with modular design',
        images: [],
        videos: [],
        links: [],
        category: 'Kitchen',
        is_approved: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  private mockEnquiries(): PartnerEnquiry[] {
    return [
      {
        id: '1',
        partner_id: 'partner-1',
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Kitchen Renovation',
        message: 'Looking for kitchen renovation services',
        status: 'new',
        created_at: new Date().toISOString(),
      },
    ];
  }

  private mockFeedbacks(): PartnerFeedback[] {
    return [
      {
        id: '1',
        partner_id: 'partner-1',
        user_id: 'user-1',
        user_name: 'Happy Customer',
        rating: 5,
        title: 'Excellent Service',
        comment: 'Great work quality and on-time delivery',
        is_verified_purchase: true,
        is_approved: true,
        is_reported: false,
        created_at: new Date().toISOString(),
      },
    ];
  }

  private mockAnalytics(): PartnerAnalytics {
    return {
      enquiriesOverTime: [],
      feedbacksOverTime: [],
      worksByCategory: [],
      ratingDistribution: [],
    };
  }
}

export const partnerService = new PartnerService();
