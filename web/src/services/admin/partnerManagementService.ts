/**
 * Admin Partner Management Service
 * 
 * Handles partner management operations for Admin
 */

import { apiClient } from '../apiClient';
import { logger } from '../../core/logger';

export interface Partner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  rating: number;
  reviewCount: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string;
  profileImage?: string;
  avatarUrl?: string;
  location?: string;
  description?: string;
  referralCode?: string;
}

export interface PartnerFilters {
  status?: string;
  category?: string;
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

class PartnerManagementService {
  /**
   * Get all partners with pagination and filters
   */
  async getPartners(
    page: number = 1,
    limit: number = 10,
    filters?: PartnerFilters
  ): Promise<PaginatedResponse<Partner>> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetPartners(page, limit, filters);
      }

      return apiClient.get<PaginatedResponse<Partner>>('/admin/partners', {
        params: { page, limit, ...filters }
      });
    } catch (error) {
      logger.error('Failed to get partners', error as Error);
      throw error;
    }
  }

  /**
   * Get partner by ID
   */
  async getPartnerById(id: string): Promise<{ partner: Partner }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetPartnerById(id);
      }

      return apiClient.get<{ partner: Partner }>(`/admin/partners/${id}`);
    } catch (error) {
      logger.error('Failed to get partner', error as Error);
      throw error;
    }
  }

  /**
   * Approve partner
   */
  async approvePartner(id: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Partner approved', { id });
        return;
      }

      await apiClient.post(`/admin/partners/${id}/approve`);
    } catch (error) {
      logger.error('Failed to approve partner', error as Error);
      throw error;
    }
  }

  /**
   * Reject partner
   */
  async rejectPartner(id: string, reason?: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Partner rejected', { id, reason });
        return;
      }

      await apiClient.post(`/admin/partners/${id}/reject`, { reason });
    } catch (error) {
      logger.error('Failed to reject partner', error as Error);
      throw error;
    }
  }

  /**
   * Suspend partner
   */
  async suspendPartner(id: string, reason?: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Partner suspended', { id, reason });
        return;
      }

      await apiClient.post(`/admin/partners/${id}/suspend`, { reason });
    } catch (error) {
      logger.error('Failed to suspend partner', error as Error);
      throw error;
    }
  }

  /**
   * Reactivate partner
   */
  async reactivatePartner(id: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Partner reactivated', { id });
        return;
      }

      await apiClient.post(`/admin/partners/${id}/reactivate`);
    } catch (error) {
      logger.error('Failed to reactivate partner', error as Error);
      throw error;
    }
  }

  /**
   * Update partner details
   */
  async updatePartner(id: string, data: Partial<Partner>): Promise<{ partner: Partner }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetPartnerById(id);
      }

      return apiClient.put<{ partner: Partner }>(`/admin/partners/${id}`, data);
    } catch (error) {
      logger.error('Failed to update partner', error as Error);
      throw error;
    }
  }

  // Mock implementations
  private mockGetPartners(page: number, limit: number, filters?: PartnerFilters): PaginatedResponse<Partner> {
    const allPartners: Partner[] = Array.from({ length: 50 }, (_, i) => ({
      id: `partner_${i + 1}`,
      name: `Partner ${i + 1}`,
      email: `partner${i + 1}@example.com`,
      phone: `+91 98765 ${String(10000 + i).slice(-5)}`,
      category: ['Architect', 'Engineer', 'Contractor', 'Consultant'][i % 4],
      rating: 3.5 + (i % 3) * 0.5,
      reviewCount: 10 + i * 5,
      status: ['pending', 'approved', 'rejected', 'suspended'][i % 4] as Partner['status'],
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      location: `Location ${i + 1}`
    }));

    let filtered = allPartners;
    if (filters?.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    if (filters?.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower)
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

  private mockGetPartnerById(id: string): { partner: Partner } {
    return {
      partner: {
        id,
        name: 'Sample Partner',
        email: 'partner@example.com',
        phone: '+91 98765 43210',
        category: 'Architect',
        rating: 4.5,
        reviewCount: 25,
        status: 'approved',
        createdAt: new Date().toISOString(),
        location: 'Mumbai, Maharashtra',
        description: 'Experienced architect with 15+ years in residential and commercial projects.'
      }
    };
  }
}

export const partnerManagementService = new PartnerManagementService();






