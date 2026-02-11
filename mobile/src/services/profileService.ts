/**
 * Profile Service (Mobile)
 * 
 * Handles partner and dealer profile data
 */

import { apiClient } from './apiClient';
import { logger } from '../core/logger';

export interface PartnerProfile {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  profileImage?: string;
  location?: string;
  description?: string;
  feedbacks: Feedback[];
  previousWorks: PreviousWork[];
  media: MediaItem[];
  contactEmail: string;
}

export interface DealerProfile {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  profileImage?: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  distance?: number;
  description?: string;
  gallery: MediaItem[];
  productCatalogue: Product[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  feedbacks: Feedback[];
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PreviousWork {
  id: string;
  title: string;
  description: string;
  images: string[];
  completedAt: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'link';
  url: string;
  thumbnail?: string;
  title?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  price?: string;
  category: string;
}

class ProfileService {
  /**
   * Get partner profile
   */
  async getPartnerProfile(id: string): Promise<{ partner: PartnerProfile }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockPartnerProfile(id);
      }

      return apiClient.get<{ partner: PartnerProfile }>(`/partners/${id}`);
    } catch (error) {
      logger.error('Failed to get partner profile', error as Error);
      throw error;
    }
  }

  /**
   * Get dealer profile
   */
  async getDealerProfile(id: string, userLat?: number, userLon?: number): Promise<{ dealer: DealerProfile }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockDealerProfile(id, userLat, userLon);
      }

      return apiClient.get<{ dealer: DealerProfile }>(`/dealers/${id}`, {
        params: { userLat, userLon }
      });
    } catch (error) {
      logger.error('Failed to get dealer profile', error as Error);
      throw error;
    }
  }

  /**
   * Submit contact form
   */
  async submitContactForm(
    profileId: string,
    type: 'partner' | 'dealer',
    data: { subject: string; email: string; message: string }
  ): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Contact form submitted', { profileId, type, data });
        return;
      }

      await apiClient.post(`/${type}s/${profileId}/contact`, data);
    } catch (error) {
      logger.error('Failed to submit contact form', error as Error);
      throw error;
    }
  }

  /**
   * Submit enquiry form
   */
  async submitEnquiry(
    profileId: string,
    type: 'partner' | 'dealer',
    data: { topic: string; enquiry: string }
  ): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Enquiry submitted', { profileId, type, data });
        return;
      }

      await apiClient.post(`/${type}s/${profileId}/enquiry`, data);
    } catch (error) {
      logger.error('Failed to submit enquiry', error as Error);
      throw error;
    }
  }

  // Mock implementations
  private mockPartnerProfile(id: string): { partner: PartnerProfile } {
    return {
      partner: {
        id,
        name: 'Sample Partner',
        category: 'Architect',
        rating: 4.5,
        reviewCount: 25,
        location: 'Mumbai, Maharashtra',
        description: 'Experienced architect with 15+ years in residential and commercial projects.',
        contactEmail: 'partner@example.com',
        feedbacks: Array.from({ length: 5 }, (_, i) => ({
          id: `feedback_${i + 1}`,
          userId: `user_${i + 1}`,
          userName: `User ${i + 1}`,
          rating: 4 + (i % 2) * 0.5,
          comment: `Great service! ${i + 1}`,
          createdAt: new Date(Date.now() - i * 86400000).toISOString()
        })),
        previousWorks: Array.from({ length: 3 }, (_, i) => ({
          id: `work_${i + 1}`,
          title: `Project ${i + 1}`,
          description: `Completed project ${i + 1}`,
          images: [`https://picsum.photos/400/300?random=${i + 1}`],
          completedAt: new Date(Date.now() - i * 30 * 86400000).toISOString()
        })),
        media: [
          { id: '1', type: 'image', url: 'https://picsum.photos/400/300?random=1', title: 'Portfolio Image 1' },
          { id: '2', type: 'image', url: 'https://picsum.photos/400/300?random=2', title: 'Portfolio Image 2' }
        ]
      }
    };
  }

  private mockDealerProfile(id: string, userLat?: number, userLon?: number): { dealer: DealerProfile } {
    const dealerLat = 19.0760;
    const dealerLon = 72.8777;
    let distance: number | undefined;
    
    if (userLat && userLon) {
      const R = 6371;
      const dLat = (dealerLat - userLat) * Math.PI / 180;
      const dLon = (dealerLon - userLon) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userLat * Math.PI / 180) * Math.cos(dealerLat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distance = R * c;
    }

    return {
      dealer: {
        id,
        name: 'Sample Dealer',
        category: 'Materials',
        rating: 4.2,
        reviewCount: 18,
        location: {
          address: '123 Main Street, Mumbai, Maharashtra 400001',
          latitude: dealerLat,
          longitude: dealerLon
        },
        distance,
        description: 'Leading supplier of construction materials with quality assurance.',
        contactInfo: {
          email: 'dealer@example.com',
          phone: '+91 98765 43210',
          address: '123 Main Street, Mumbai, Maharashtra 400001'
        },
        feedbacks: Array.from({ length: 5 }, (_, i) => ({
          id: `feedback_${i + 1}`,
          userId: `user_${i + 1}`,
          userName: `User ${i + 1}`,
          rating: 4 + (i % 2) * 0.2,
          comment: `Good quality products! ${i + 1}`,
          createdAt: new Date(Date.now() - i * 86400000).toISOString()
        })),
        gallery: Array.from({ length: 6 }, (_, i) => ({
          id: `gallery_${i + 1}`,
          type: 'image' as const,
          url: `https://picsum.photos/400/300?random=${i + 10}`,
          title: `Gallery Image ${i + 1}`
        })),
        productCatalogue: Array.from({ length: 8 }, (_, i) => ({
          id: `product_${i + 1}`,
          name: `Product ${i + 1}`,
          description: `High quality product ${i + 1}`,
          image: `https://picsum.photos/200/200?random=${i + 20}`,
          price: `₹${(1000 + i * 500).toLocaleString()}`,
          category: ['Cement', 'Steel', 'Bricks', 'Tools'][i % 4]
        }))
      }
    };
  }
}

export const profileService = new ProfileService();






