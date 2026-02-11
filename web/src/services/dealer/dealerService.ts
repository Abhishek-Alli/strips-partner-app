/**
 * Web Dealer Service
 * 
 * Web-specific service layer for Dealer features
 */

import { apiClient } from '../apiClient';
import { logger } from '../../core/logger';
import {
  DealerProduct,
  MasterProduct,
  DealerEnquiry,
  DealerFeedback,
  DealerOffer,
  DealerStats,
} from '../../../../shared/types/dealer.types';

class WebDealerService {
  // Products
  async getMasterProducts(): Promise<MasterProduct[]> {
    try {
      if (apiClient.isMockMode()) {
        const { dealerService } = await import('../../../../shared/services/dealerService');
        return dealerService.getMasterProducts();
      }
      return apiClient.get<MasterProduct[]>('/dealer/master-products');
    } catch (error) {
      logger.error('Failed to fetch master products', error as Error);
      throw error;
    }
  }

  async getDealerProducts(dealerId: string): Promise<DealerProduct[]> {
    try {
      if (apiClient.isMockMode()) {
        const { dealerService } = await import('../../../../shared/services/dealerService');
        return dealerService.getDealerProducts(dealerId);
      }
      return apiClient.get<DealerProduct[]>(`/dealer/products/${dealerId}`);
    } catch (error) {
      logger.error('Failed to fetch dealer products', error as Error);
      throw error;
    }
  }

  async addDealerProduct(product: Omit<DealerProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<DealerProduct> {
    try {
      if (apiClient.isMockMode()) {
        const { dealerService } = await import('../../../../shared/services/dealerService');
        return dealerService.addDealerProduct(product);
      }
      return apiClient.post<DealerProduct>('/dealer/products', product);
    } catch (error) {
      logger.error('Failed to add dealer product', error as Error);
      throw error;
    }
  }

  async updateDealerProduct(productId: string, updates: Partial<DealerProduct>): Promise<DealerProduct> {
    try {
      if (apiClient.isMockMode()) {
        const { dealerService } = await import('../../../../shared/services/dealerService');
        return dealerService.updateDealerProduct(productId, updates);
      }
      return apiClient.put<DealerProduct>(`/dealer/products/${productId}`, updates);
    } catch (error) {
      logger.error('Failed to update dealer product', error as Error);
      throw error;
    }
  }

  async deleteDealerProduct(productId: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        const { dealerService } = await import('../../../../shared/services/dealerService');
        return dealerService.deleteDealerProduct(productId);
      }
      await apiClient.delete(`/dealer/products/${productId}`);
    } catch (error) {
      logger.error('Failed to delete dealer product', error as Error);
      throw error;
    }
  }

  // Enquiries
  async getDealerEnquiries(dealerId: string, filters?: { status?: string }): Promise<DealerEnquiry[]> {
    try {
      if (apiClient.isMockMode()) {
        const { dealerService } = await import('../../../../shared/services/dealerService');
        return dealerService.getDealerEnquiries(dealerId, filters);
      }
      return apiClient.get<DealerEnquiry[]>(`/dealer/enquiries/${dealerId}`, { params: filters });
    } catch (error) {
      logger.error('Failed to fetch dealer enquiries', error as Error);
      throw error;
    }
  }

  async respondToEnquiry(enquiryId: string, response: string): Promise<DealerEnquiry> {
    try {
      if (apiClient.isMockMode()) {
        const { dealerService } = await import('../../../../shared/services/dealerService');
        return dealerService.respondToEnquiry(enquiryId, response);
      }
      return apiClient.post<DealerEnquiry>(`/dealer/enquiries/${enquiryId}/respond`, { response });
    } catch (error) {
      logger.error('Failed to respond to enquiry', error as Error);
      throw error;
    }
  }

  async sendEnquiryToAdmin(dealerId: string, topic: string, message: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        const { dealerService } = await import('../../../../shared/services/dealerService');
        return dealerService.sendEnquiryToAdmin(dealerId, topic, message);
      }
      await apiClient.post('/dealer/enquiries/admin', { topic, message });
    } catch (error) {
      logger.error('Failed to send enquiry to admin', error as Error);
      throw error;
    }
  }

  // Feedbacks
  async getDealerFeedbacks(dealerId: string): Promise<DealerFeedback[]> {
    try {
      if (apiClient.isMockMode()) {
        const { dealerService } = await import('../../../../shared/services/dealerService');
        return dealerService.getDealerFeedbacks(dealerId);
      }
      return apiClient.get<DealerFeedback[]>(`/dealer/feedbacks/${dealerId}`);
    } catch (error) {
      logger.error('Failed to fetch dealer feedbacks', error as Error);
      throw error;
    }
  }

  async reportFeedback(feedbackId: string, reason: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        const { dealerService } = await import('../../../../shared/services/dealerService');
        return dealerService.reportFeedback(feedbackId, reason);
      }
      await apiClient.post(`/dealer/feedbacks/${feedbackId}/report`, { reason });
    } catch (error) {
      logger.error('Failed to report feedback', error as Error);
      throw error;
    }
  }

  // Offers
  async getDealerOffers(dealerId: string): Promise<DealerOffer[]> {
    try {
      if (apiClient.isMockMode()) {
        const { dealerService } = await import('../../../../shared/services/dealerService');
        return dealerService.getDealerOffers(dealerId);
      }
      return apiClient.get<DealerOffer[]>(`/dealer/offers/${dealerId}`);
    } catch (error) {
      logger.error('Failed to fetch dealer offers', error as Error);
      throw error;
    }
  }

  async likeOffer(dealerId: string, offerId: string): Promise<DealerOffer> {
    try {
      if (apiClient.isMockMode()) {
        const { dealerService } = await import('../../../../shared/services/dealerService');
        return dealerService.likeOffer(dealerId, offerId);
      }
      return apiClient.post<DealerOffer>(`/dealer/offers/${offerId}/like`, { dealerId });
    } catch (error) {
      logger.error('Failed to like offer', error as Error);
      throw error;
    }
  }

  // Statistics
  async getDealerStats(dealerId: string): Promise<DealerStats> {
    try {
      if (apiClient.isMockMode()) {
        const { dealerService } = await import('../../../../shared/services/dealerService');
        return dealerService.getDealerStats(dealerId);
      }
      return apiClient.get<DealerStats>(`/dealer/stats/${dealerId}`);
    } catch (error) {
      logger.error('Failed to fetch dealer stats', error as Error);
      throw error;
    }
  }
}

export const webDealerService = new WebDealerService();






