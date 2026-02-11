/**
 * Admin Dealer Management Service
 * 
 * Handles dealer management operations for Admin
 */

import { apiClient } from '../apiClient';
import { logger } from '../../core/logger';

export interface Dealer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  rating: number;
  reviewCount: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  profileImage?: string;
  description?: string;
}

export interface DealerFilters {
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

class DealerManagementService {
  /**
   * Get all dealers with pagination and filters
   */
  async getDealers(
    page: number = 1,
    limit: number = 10,
    filters?: DealerFilters
  ): Promise<PaginatedResponse<Dealer>> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetDealers(page, limit, filters);
      }

      return apiClient.get<PaginatedResponse<Dealer>>('/admin/dealers', {
        params: { page, limit, ...filters }
      });
    } catch (error) {
      logger.error('Failed to get dealers', error as Error);
      throw error;
    }
  }

  /**
   * Get dealer by ID
   */
  async getDealerById(id: string): Promise<{ dealer: Dealer }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetDealerById(id);
      }

      return apiClient.get<{ dealer: Dealer }>(`/admin/dealers/${id}`);
    } catch (error) {
      logger.error('Failed to get dealer', error as Error);
      throw error;
    }
  }

  /**
   * Approve dealer
   */
  async approveDealer(id: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Dealer approved', { id });
        return;
      }

      await apiClient.post(`/admin/dealers/${id}/approve`);
    } catch (error) {
      logger.error('Failed to approve dealer', error as Error);
      throw error;
    }
  }

  /**
   * Reject dealer
   */
  async rejectDealer(id: string, reason?: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Dealer rejected', { id, reason });
        return;
      }

      await apiClient.post(`/admin/dealers/${id}/reject`, { reason });
    } catch (error) {
      logger.error('Failed to reject dealer', error as Error);
      throw error;
    }
  }

  /**
   * Suspend dealer
   */
  async suspendDealer(id: string, reason?: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Dealer suspended', { id, reason });
        return;
      }

      await apiClient.post(`/admin/dealers/${id}/suspend`, { reason });
    } catch (error) {
      logger.error('Failed to suspend dealer', error as Error);
      throw error;
    }
  }

  /**
   * Reactivate dealer
   */
  async reactivateDealer(id: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Dealer reactivated', { id });
        return;
      }

      await apiClient.post(`/admin/dealers/${id}/reactivate`);
    } catch (error) {
      logger.error('Failed to reactivate dealer', error as Error);
      throw error;
    }
  }

  /**
   * Update dealer details
   */
  async updateDealer(id: string, data: Partial<Dealer>): Promise<{ dealer: Dealer }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetDealerById(id);
      }

      return apiClient.put<{ dealer: Dealer }>(`/admin/dealers/${id}`, data);
    } catch (error) {
      logger.error('Failed to update dealer', error as Error);
      throw error;
    }
  }

  // Mock implementations
  private mockGetDealers(page: number, limit: number, filters?: DealerFilters): PaginatedResponse<Dealer> {
    const allDealers: Dealer[] = Array.from({ length: 50 }, (_, i) => ({
      id: `dealer_${i + 1}`,
      name: `Dealer ${i + 1}`,
      email: `dealer${i + 1}@example.com`,
      phone: `+91 98765 ${String(10000 + i).slice(-5)}`,
      category: ['Materials', 'Equipment', 'Services', 'Tools'][i % 4],
      rating: 3.5 + (i % 3) * 0.5,
      reviewCount: 10 + i * 5,
      status: ['pending', 'approved', 'rejected', 'suspended'][i % 4] as Dealer['status'],
      location: {
        address: `Address ${i + 1}, Mumbai, Maharashtra`,
        latitude: 19.0760 + (i * 0.01),
        longitude: 72.8777 + (i * 0.01)
      },
      createdAt: new Date(Date.now() - i * 86400000).toISOString()
    }));

    let filtered = allDealers;
    if (filters?.status) {
      filtered = filtered.filter(d => d.status === filters.status);
    }
    if (filters?.category) {
      filtered = filtered.filter(d => d.category === filters.category);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchLower) ||
        d.email.toLowerCase().includes(searchLower) ||
        d.location.address.toLowerCase().includes(searchLower)
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

  private mockGetDealerById(id: string): { dealer: Dealer } {
    return {
      dealer: {
        id,
        name: 'Sample Dealer',
        email: 'dealer@example.com',
        phone: '+91 98765 43210',
        category: 'Materials',
        rating: 4.2,
        reviewCount: 18,
        status: 'approved',
        location: {
          address: '123 Main Street, Mumbai, Maharashtra 400001',
          latitude: 19.0760,
          longitude: 72.8777
        },
        createdAt: new Date().toISOString(),
        description: 'Leading supplier of construction materials with quality assurance.'
      }
    };
  }
}

export const dealerManagementService = new DealerManagementService();






