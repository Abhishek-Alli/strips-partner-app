/**
 * Search Service (Mobile)
 * 
 * Handles partner and dealer search for General Users
 */

import { apiClient } from './apiClient';
import { logger } from '../core/logger';

export interface Partner {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  profileImage?: string;
  location?: string;
  description?: string;
}

export interface Dealer {
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
  distance?: number; // Distance in km
  description?: string;
}

export interface SearchFilters {
  name?: string;
  category?: string;
  rating?: number;
  location?: string;
  keywords?: string[];
  radius?: number; // For dealer search (km)
  latitude?: number;
  longitude?: number;
}

export interface SearchResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class SearchService {
  /**
   * Search partners
   */
  async searchPartners(
    filters: SearchFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResponse<Partner>> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockSearchPartners(filters, page, limit);
      }

      return apiClient.get<SearchResponse<Partner>>('/search/partners', {
        params: { ...filters, page, limit }
      });
    } catch (error) {
      logger.error('Failed to search partners', error as Error);
      throw error;
    }
  }

  /**
   * Search dealers with location
   */
  async searchDealers(
    filters: SearchFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResponse<Dealer>> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockSearchDealers(filters, page, limit);
      }

      return apiClient.get<SearchResponse<Dealer>>('/search/dealers', {
        params: { ...filters, page, limit }
      });
    } catch (error) {
      logger.error('Failed to search dealers', error as Error);
      throw error;
    }
  }

  /**
   * Save search
   */
  async saveSearch(name: string, filters: SearchFilters, type: 'partner' | 'dealer'): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        // Mock: just log
        logger.info('Search saved', { name, filters, type });
        return;
      }

      await apiClient.post('/search/saved', { name, filters, type });
    } catch (error) {
      logger.error('Failed to save search', error as Error);
      throw error;
    }
  }

  /**
   * Get saved searches
   */
  async getSavedSearches(): Promise<Array<{ id: string; name: string; filters: SearchFilters; type: 'partner' | 'dealer'; createdAt: string }>> {
    try {
      if (apiClient.isMockMode()) {
        return [];
      }

      return apiClient.get('/search/saved');
    } catch (error) {
      logger.error('Failed to get saved searches', error as Error);
      throw error;
    }
  }

  /**
   * Get recent searches
   */
  async getRecentSearches(): Promise<Array<{ id: string; query: string; type: 'partner' | 'dealer'; createdAt: string }>> {
    try {
      if (apiClient.isMockMode()) {
        return [];
      }

      return apiClient.get('/search/recent');
    } catch (error) {
      logger.error('Failed to get recent searches', error as Error);
      throw error;
    }
  }

  // Mock implementations
  private mockSearchPartners(filters: SearchFilters, page: number, limit: number): SearchResponse<Partner> {
    const mockPartners: Partner[] = Array.from({ length: 50 }, (_, i) => ({
      id: `partner_${i + 1}`,
      name: `Partner ${i + 1}`,
      category: ['Architect', 'Engineer', 'Contractor', 'Consultant'][i % 4],
      rating: 3.5 + (i % 3) * 0.5,
      reviewCount: 10 + i * 5,
      location: `Location ${i + 1}`,
      description: `Professional ${['Architect', 'Engineer', 'Contractor', 'Consultant'][i % 4]} with ${10 + i} years of experience`
    }));

    let filtered = mockPartners;
    if (filters.name) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.name!.toLowerCase()));
    }
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters.rating) {
      filtered = filtered.filter(p => p.rating >= filters.rating!);
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

  private mockSearchDealers(filters: SearchFilters, page: number, limit: number): SearchResponse<Dealer> {
    const mockDealers: Dealer[] = Array.from({ length: 50 }, (_, i) => ({
      id: `dealer_${i + 1}`,
      name: `Dealer ${i + 1}`,
      category: ['Materials', 'Equipment', 'Services', 'Tools'][i % 4],
      rating: 3.5 + (i % 3) * 0.5,
      reviewCount: 10 + i * 5,
      location: {
        address: `Address ${i + 1}`,
        latitude: 19.0760 + (i * 0.01),
        longitude: 72.8777 + (i * 0.01)
      },
      distance: filters.latitude && filters.longitude
        ? this.calculateDistance(filters.latitude, filters.longitude, 19.0760 + (i * 0.01), 72.8777 + (i * 0.01))
        : undefined,
      description: `Dealer specializing in ${['Materials', 'Equipment', 'Services', 'Tools'][i % 4]}`
    }));

    let filtered = mockDealers;
    if (filters.name) {
      filtered = filtered.filter(d => d.name.toLowerCase().includes(filters.name!.toLowerCase()));
    }
    if (filters.category) {
      filtered = filtered.filter(d => d.category === filters.category);
    }
    if (filters.rating) {
      filtered = filtered.filter(d => d.rating >= filters.rating!);
    }
    if (filters.radius && filters.latitude && filters.longitude) {
      filtered = filtered.filter(d => {
        const distance = this.calculateDistance(
          filters.latitude!,
          filters.longitude!,
          d.location.latitude,
          d.location.longitude
        );
        return distance <= filters.radius!;
      });
    }

    // Sort by distance if available
    if (filters.latitude && filters.longitude) {
      filtered.sort((a, b) => {
        const distA = a.distance || 0;
        const distB = b.distance || 0;
        return distA - distB;
      });
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

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const searchService = new SearchService();






