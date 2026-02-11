/**
 * Admin Feedback Moderation Service
 * 
 * Handles feedback moderation operations for Admin
 */

import { apiClient } from '../apiClient';
import { logger } from '../../core/logger';

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  profileId: string;
  profileType: 'partner' | 'dealer';
  profileName: string;
  rating: number;
  comment: string;
  status: 'visible' | 'hidden' | 'deleted';
  createdAt: string;
  reported?: boolean;
}

export interface FeedbackFilters {
  profileType?: 'partner' | 'dealer';
  profileId?: string;
  rating?: number;
  status?: string;
  search?: string;
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

class FeedbackService {
  /**
   * Get all feedbacks with pagination and filters
   */
  async getFeedbacks(
    page: number = 1,
    limit: number = 10,
    filters?: FeedbackFilters
  ): Promise<PaginatedResponse<Feedback>> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetFeedbacks(page, limit, filters);
      }

      return apiClient.get<PaginatedResponse<Feedback>>('/admin/feedback', {
        params: { page, limit, ...filters }
      });
    } catch (error) {
      logger.error('Failed to get feedbacks', error as Error);
      throw error;
    }
  }

  /**
   * Hide feedback
   */
  async hideFeedback(id: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Feedback hidden', { id });
        return;
      }

      await apiClient.post(`/admin/feedback/${id}/hide`);
    } catch (error) {
      logger.error('Failed to hide feedback', error as Error);
      throw error;
    }
  }

  /**
   * Show feedback
   */
  async showFeedback(id: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Feedback shown', { id });
        return;
      }

      await apiClient.post(`/admin/feedback/${id}/show`);
    } catch (error) {
      logger.error('Failed to show feedback', error as Error);
      throw error;
    }
  }

  /**
   * Delete feedback
   */
  async deleteFeedback(id: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Feedback deleted', { id });
        return;
      }

      await apiClient.delete(`/admin/feedback/${id}`);
    } catch (error) {
      logger.error('Failed to delete feedback', error as Error);
      throw error;
    }
  }

  // Mock implementations
  private mockGetFeedbacks(page: number, limit: number, filters?: FeedbackFilters): PaginatedResponse<Feedback> {
    const allFeedbacks: Feedback[] = Array.from({ length: 100 }, (_, i) => ({
      id: `feedback_${i + 1}`,
      userId: `user_${i + 1}`,
      userName: `User ${i + 1}`,
      profileId: i % 2 === 0 ? `partner_${Math.floor(i / 2) + 1}` : `dealer_${Math.floor(i / 2) + 1}`,
      profileType: i % 2 === 0 ? 'partner' : 'dealer',
      profileName: i % 2 === 0 ? `Partner ${Math.floor(i / 2) + 1}` : `Dealer ${Math.floor(i / 2) + 1}`,
      rating: 1 + (i % 5),
      comment: `This is a sample feedback comment ${i + 1}. ${i % 10 === 0 ? 'This might be inappropriate.' : ''}`,
      status: i % 10 === 0 ? 'hidden' : 'visible',
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      reported: i % 15 === 0
    }));

    let filtered = allFeedbacks;
    if (filters?.profileType) {
      filtered = filtered.filter(f => f.profileType === filters.profileType);
    }
    if (filters?.profileId) {
      filtered = filtered.filter(f => f.profileId === filters.profileId);
    }
    if (filters?.rating) {
      filtered = filtered.filter(f => f.rating === filters.rating);
    }
    if (filters?.status) {
      filtered = filtered.filter(f => f.status === filters.status);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(f =>
        f.comment.toLowerCase().includes(searchLower) ||
        f.userName.toLowerCase().includes(searchLower) ||
        f.profileName.toLowerCase().includes(searchLower)
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = filtered.slice(start, end);

    return {
      items,
      pagination: {
        page,
        limit,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit)
      }
    };
  }
}

export const feedbackService = new FeedbackService();






