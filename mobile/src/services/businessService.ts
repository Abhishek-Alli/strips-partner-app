/**
 * Mobile Business Service
 * 
 * Mobile-specific service layer for business features
 */

import { apiClient } from './apiClient';
import { logger } from '../core/logger';
import {
  Work,
  Event,
  Offer,
  LoyaltyPoint,
  SteelMarketUpdate,
  Lecture,
  TradingAdvice,
  Project,
  Tender,
  EducationPost,
  Quiz,
  QuizAttempt,
  Referral,
  GalleryItem,
  Note,
  Statistics,
} from '../../shared/types/business.types';

class MobileBusinessService {
  // Works
  async getWorks(userId: string, filters?: { category?: string }): Promise<Work[]> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getWorks(userId, filters);
      }
      const response = await apiClient.get<Work[]>(`/business/works`, { params: { userId, ...filters } });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch works', error as Error);
      throw error;
    }
  }

  async createWork(work: Omit<Work, 'id' | 'createdAt' | 'updatedAt'>): Promise<Work> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.createWork(work);
      }
      const response = await apiClient.post<Work>('/business/works', work);
      return response.data;
    } catch (error) {
      logger.error('Failed to create work', error as Error);
      throw error;
    }
  }

  async updateWork(workId: string, updates: Partial<Work>): Promise<Work> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.updateWork(workId, updates);
      }
      const response = await apiClient.put<Work>(`/business/works/${workId}`, updates);
      return response.data;
    } catch (error) {
      logger.error('Failed to update work', error as Error);
      throw error;
    }
  }

  async deleteWork(workId: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.deleteWork(workId);
      }
      await apiClient.delete(`/business/works/${workId}`);
    } catch (error) {
      logger.error('Failed to delete work', error as Error);
      throw error;
    }
  }

  // Events
  async getEvents(filters?: { eventType?: string; organizerId?: string }): Promise<Event[]> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getEvents(filters);
      }
      const response = await apiClient.get<Event[]>('/business/events', { params: filters });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch events', error as Error);
      throw error;
    }
  }

  // Offers
  async getOffers(filters?: { applicableTo?: string }): Promise<Offer[]> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getOffers(filters);
      }
      const response = await apiClient.get<Offer[]>('/business/offers', { params: filters });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch offers', error as Error);
      throw error;
    }
  }

  // Loyalty Points
  async getLoyaltyPoints(userId: string): Promise<{ total: number; history: LoyaltyPoint[] }> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getLoyaltyPoints(userId);
      }
      const response = await apiClient.get<{ total: number; history: LoyaltyPoint[] }>(`/business/loyalty/${userId}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch loyalty points', error as Error);
      throw error;
    }
  }

  // Steel Market Updates
  async getSteelMarketUpdates(filters?: { marketType?: string; region?: string }): Promise<SteelMarketUpdate[]> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getSteelMarketUpdates(filters);
      }
      const response = await apiClient.get<SteelMarketUpdate[]>('/business/steel-updates', { params: filters });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch steel market updates', error as Error);
      throw error;
    }
  }

  // Lectures
  async getLectures(filters?: { category?: string }): Promise<Lecture[]> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getLectures(filters);
      }
      const response = await apiClient.get<Lecture[]>('/business/lectures', { params: filters });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch lectures', error as Error);
      throw error;
    }
  }

  // Trading Advices
  async getTradingAdvices(filters?: { adviceType?: string; materialType?: string }): Promise<TradingAdvice[]> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getTradingAdvices(filters);
      }
      const response = await apiClient.get<TradingAdvice[]>('/business/trading-advices', { params: filters });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch trading advices', error as Error);
      throw error;
    }
  }

  // Projects
  async getProjects(filters?: { status?: string; projectType?: string }): Promise<Project[]> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getProjects(filters);
      }
      const response = await apiClient.get<Project[]>('/business/projects', { params: filters });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch projects', error as Error);
      throw error;
    }
  }

  // Tenders
  async getTenders(filters?: { status?: string; category?: string }): Promise<Tender[]> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getTenders(filters);
      }
      const response = await apiClient.get<Tender[]>('/business/tenders', { params: filters });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch tenders', error as Error);
      throw error;
    }
  }

  // Education Posts
  async getEducationPosts(filters?: { category?: string; tag?: string }): Promise<EducationPost[]> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getEducationPosts(filters);
      }
      const response = await apiClient.get<EducationPost[]>('/business/education-posts', { params: filters });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch education posts', error as Error);
      throw error;
    }
  }

  // Quizzes
  async getQuizzes(filters?: { category?: string; isActive?: boolean }): Promise<Quiz[]> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getQuizzes(filters);
      }
      const response = await apiClient.get<Quiz[]>('/business/quizzes', { params: filters });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch quizzes', error as Error);
      throw error;
    }
  }

  async submitQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completedAt'>): Promise<QuizAttempt> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.submitQuizAttempt(attempt);
      }
      const response = await apiClient.post<QuizAttempt>('/business/quizzes/attempt', attempt);
      return response.data;
    } catch (error) {
      logger.error('Failed to submit quiz attempt', error as Error);
      throw error;
    }
  }

  // Referrals
  async getReferrals(userId: string): Promise<Referral[]> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getReferrals(userId);
      }
      const response = await apiClient.get<Referral[]>(`/business/referrals/${userId}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch referrals', error as Error);
      throw error;
    }
  }

  async createReferral(referral: Omit<Referral, 'id' | 'createdAt' | 'status'>): Promise<Referral> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.createReferral(referral);
      }
      const response = await apiClient.post<Referral>('/business/referrals', referral);
      return response.data;
    } catch (error) {
      logger.error('Failed to create referral', error as Error);
      throw error;
    }
  }

  // Gallery
  async getGallery(userId: string, filters?: { category?: string }): Promise<GalleryItem[]> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getGallery(userId, filters);
      }
      const response = await apiClient.get<GalleryItem[]>(`/business/gallery/${userId}`, { params: filters });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch gallery', error as Error);
      throw error;
    }
  }

  async addGalleryItem(item: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<GalleryItem> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.addGalleryItem(item);
      }
      const response = await apiClient.post<GalleryItem>('/business/gallery', item);
      return response.data;
    } catch (error) {
      logger.error('Failed to add gallery item', error as Error);
      throw error;
    }
  }

  // Notes
  async getNotes(userId: string, filters?: { category?: string; isPinned?: boolean }): Promise<Note[]> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getNotes(userId, filters);
      }
      const response = await apiClient.get<Note[]>(`/business/notes/${userId}`, { params: filters });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch notes', error as Error);
      throw error;
    }
  }

  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.createNote(note);
      }
      const response = await apiClient.post<Note>('/business/notes', note);
      return response.data;
    } catch (error) {
      logger.error('Failed to create note', error as Error);
      throw error;
    }
  }

  // Statistics
  async getStatistics(userId: string, startDate: Date, endDate: Date): Promise<Statistics> {
    try {
      if (apiClient.isMockMode()) {
        const { businessService } = await import('../../shared/services/businessService');
        return businessService.getStatistics(userId, startDate, endDate);
      }
      const response = await apiClient.get<Statistics>('/business/statistics', {
        params: {
          userId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch statistics', error as Error);
      throw error;
    }
  }
}

export const mobileBusinessService = new MobileBusinessService();






