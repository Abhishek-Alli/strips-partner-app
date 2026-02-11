/**
 * Favorites Service (Mobile)
 * 
 * Handles favorites and feedback for partners and dealers
 */

import { apiClient } from './apiClient';
import { logger } from '../core/logger';

export interface Favorite {
  id: string;
  profileId: string;
  profileType: 'partner' | 'dealer';
  name: string;
  category: string;
  rating: number;
  addedAt: string;
}

export interface FeedbackData {
  profileId: string;
  profileType: 'partner' | 'dealer';
  rating: number;
  comment: string;
}

class FavoritesService {
  /**
   * Get favorites
   */
  async getFavorites(type?: 'partner' | 'dealer'): Promise<{ favorites: Favorite[] }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetFavorites(type);
      }

      return apiClient.get<{ favorites: Favorite[] }>('/favorites', {
        params: type ? { type } : {}
      });
    } catch (error) {
      logger.error('Failed to get favorites', error as Error);
      throw error;
    }
  }

  /**
   * Add favorite
   */
  async addFavorite(profileId: string, profileType: 'partner' | 'dealer'): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Favorite added', { profileId, profileType });
        return;
      }

      await apiClient.post('/favorites', { profileId, profileType });
    } catch (error) {
      logger.error('Failed to add favorite', error as Error);
      throw error;
    }
  }

  /**
   * Remove favorite
   */
  async removeFavorite(profileId: string, profileType: 'partner' | 'dealer'): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Favorite removed', { profileId, profileType });
        return;
      }

      await apiClient.delete(`/favorites/${profileType}/${profileId}`);
    } catch (error) {
      logger.error('Failed to remove favorite', error as Error);
      throw error;
    }
  }

  /**
   * Check if favorite
   */
  async isFavorite(profileId: string, profileType: 'partner' | 'dealer'): Promise<boolean> {
    try {
      if (apiClient.isMockMode()) {
        return false;
      }

      const response = await apiClient.get<{ isFavorite: boolean }>(`/favorites/check/${profileType}/${profileId}`);
      return response.isFavorite;
    } catch (error) {
      logger.error('Failed to check favorite', error as Error);
      return false;
    }
  }

  /**
   * Submit feedback
   */
  async submitFeedback(data: FeedbackData): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Feedback submitted', data);
        return;
      }

      await apiClient.post('/feedback', data);
    } catch (error) {
      logger.error('Failed to submit feedback', error as Error);
      throw error;
    }
  }

  /**
   * Get user feedback for a profile
   */
  async getUserFeedback(profileId: string, profileType: 'partner' | 'dealer'): Promise<{ feedback: FeedbackData | null }> {
    try {
      if (apiClient.isMockMode()) {
        return { feedback: null };
      }

      return apiClient.get<{ feedback: FeedbackData | null }>(`/feedback/${profileType}/${profileId}`);
    } catch (error) {
      logger.error('Failed to get user feedback', error as Error);
      throw error;
    }
  }

  // Mock implementations
  private mockGetFavorites(type?: 'partner' | 'dealer'): { favorites: Favorite[] } {
    const favorites: Favorite[] = [];
    
    if (!type || type === 'partner') {
      favorites.push(
        {
          id: 'fav_1',
          profileId: 'partner_1',
          profileType: 'partner',
          name: 'Partner 1',
          category: 'Architect',
          rating: 4.5,
          addedAt: new Date(Date.now() - 5 * 86400000).toISOString()
        },
        {
          id: 'fav_2',
          profileId: 'partner_2',
          profileType: 'partner',
          name: 'Partner 2',
          category: 'Engineer',
          rating: 4.8,
          addedAt: new Date(Date.now() - 10 * 86400000).toISOString()
        }
      );
    }

    if (!type || type === 'dealer') {
      favorites.push(
        {
          id: 'fav_3',
          profileId: 'dealer_1',
          profileType: 'dealer',
          name: 'Dealer 1',
          category: 'Materials',
          rating: 4.2,
          addedAt: new Date(Date.now() - 3 * 86400000).toISOString()
        }
      );
    }

    return { favorites };
  }
}

export const favoritesService = new FavoritesService();






