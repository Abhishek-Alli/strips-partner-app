/**
 * Admin Enquiry Management Service
 * 
 * Handles enquiry management operations for Admin
 */

import { apiClient } from '../apiClient';
import { logger } from '../../core/logger';

export interface Enquiry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  profileId: string;
  profileType: 'partner' | 'dealer';
  profileName: string;
  topic: string;
  message: string;
  status: 'new' | 'responded' | 'closed';
  createdAt: string;
  respondedAt?: string;
  response?: string;
}

export interface EnquiryFilters {
  profileType?: 'partner' | 'dealer';
  profileId?: string;
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

class EnquiryService {
  /**
   * Get all enquiries with pagination and filters
   */
  async getEnquiries(
    page: number = 1,
    limit: number = 10,
    filters?: EnquiryFilters
  ): Promise<PaginatedResponse<Enquiry>> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetEnquiries(page, limit, filters);
      }

      return apiClient.get<PaginatedResponse<Enquiry>>('/admin/enquiries', {
        params: { page, limit, ...filters }
      });
    } catch (error) {
      logger.error('Failed to get enquiries', error as Error);
      throw error;
    }
  }

  /**
   * Get enquiry by ID
   */
  async getEnquiryById(id: string): Promise<{ enquiry: Enquiry }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetEnquiryById(id);
      }

      return apiClient.get<{ enquiry: Enquiry }>(`/admin/enquiries/${id}`);
    } catch (error) {
      logger.error('Failed to get enquiry', error as Error);
      throw error;
    }
  }

  /**
   * Mark enquiry as responded
   */
  async markResponded(id: string, response?: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Enquiry marked as responded', { id, response });
        return;
      }

      await apiClient.post(`/admin/enquiries/${id}/respond`, { response });
    } catch (error) {
      logger.error('Failed to mark enquiry as responded', error as Error);
      throw error;
    }
  }

  /**
   * Close enquiry
   */
  async closeEnquiry(id: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Enquiry closed', { id });
        return;
      }

      await apiClient.post(`/admin/enquiries/${id}/close`);
    } catch (error) {
      logger.error('Failed to close enquiry', error as Error);
      throw error;
    }
  }

  /**
   * Add admin note to enquiry
   */
  async addNote(enquiryId: string, note: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Note added to enquiry', { enquiryId, note });
        return;
      }

      await apiClient.post(`/admin/enquiries/${enquiryId}/notes`, { note });
    } catch (error) {
      logger.error('Failed to add note', error as Error);
      throw error;
    }
  }

  // Mock implementations
  private mockGetEnquiries(page: number, limit: number, filters?: EnquiryFilters): PaginatedResponse<Enquiry> {
    const allEnquiries: Enquiry[] = Array.from({ length: 50 }, (_, i) => ({
      id: `enquiry_${i + 1}`,
      userId: `user_${i + 1}`,
      userName: `User ${i + 1}`,
      userEmail: `user${i + 1}@example.com`,
      profileId: i % 2 === 0 ? `partner_${Math.floor(i / 2) + 1}` : `dealer_${Math.floor(i / 2) + 1}`,
      profileType: i % 2 === 0 ? 'partner' : 'dealer',
      profileName: i % 2 === 0 ? `Partner ${Math.floor(i / 2) + 1}` : `Dealer ${Math.floor(i / 2) + 1}`,
      topic: ['Pricing', 'Availability', 'Services', 'General'][i % 4],
      message: `This is an enquiry message ${i + 1} regarding ${['Pricing', 'Availability', 'Services', 'General'][i % 4]}.`,
      status: ['new', 'responded', 'closed'][i % 3] as Enquiry['status'],
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      respondedAt: i % 3 !== 0 ? new Date(Date.now() - (i - 1) * 86400000).toISOString() : undefined,
      response: i % 3 !== 0 ? `Response to enquiry ${i + 1}` : undefined
    }));

    let filtered = allEnquiries;
    if (filters?.profileType) {
      filtered = filtered.filter(e => e.profileType === filters.profileType);
    }
    if (filters?.profileId) {
      filtered = filtered.filter(e => e.profileId === filters.profileId);
    }
    if (filters?.status) {
      filtered = filtered.filter(e => e.status === filters.status);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(e =>
        e.message.toLowerCase().includes(searchLower) ||
        e.topic.toLowerCase().includes(searchLower) ||
        e.userName.toLowerCase().includes(searchLower) ||
        e.profileName.toLowerCase().includes(searchLower)
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

  private mockGetEnquiryById(id: string): { enquiry: Enquiry } {
    return {
      enquiry: {
        id,
        userId: 'user_1',
        userName: 'User 1',
        userEmail: 'user1@example.com',
        profileId: 'partner_1',
        profileType: 'partner',
        profileName: 'Partner 1',
        topic: 'Pricing',
        message: 'I would like to know about your pricing for residential projects.',
        status: 'new',
        createdAt: new Date().toISOString()
      }
    };
  }
}

export const enquiryService = new EnquiryService();






