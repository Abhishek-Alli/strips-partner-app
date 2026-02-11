/**
 * Utilities Service (Mobile)
 * 
 * Handles utilities, checklists, converters, videos, etc.
 */

import { apiClient } from './apiClient';
import { logger } from '../core/logger';

export interface Checklist {
  id: string;
  title: string;
  category: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface VisualizationRequest {
  id: string;
  type: 'VR' | '3D';
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export interface Video {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
  thumbnail?: string;
  description?: string;
}

export interface UnitConverter {
  id: string;
  name: string;
  category: string;
  fromUnit: string;
  toUnit: string;
  conversionFactor: number;
}

class UtilitiesService {
  /**
   * Get checklists by category
   */
  async getChecklists(category?: string): Promise<{ checklists: Checklist[] }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetChecklists(category);
      }

      return apiClient.get<{ checklists: Checklist[] }>('/utilities/checklists', {
        params: category ? { category } : {}
      });
    } catch (error) {
      logger.error('Failed to get checklists', error as Error);
      throw error;
    }
  }

  /**
   * Submit visualization request
   */
  async submitVisualizationRequest(type: 'VR' | '3D', description: string): Promise<{ request: VisualizationRequest }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockSubmitVisualizationRequest(type, description);
      }

      return apiClient.post<{ request: VisualizationRequest }>('/utilities/visualization', {
        type,
        description
      });
    } catch (error) {
      logger.error('Failed to submit visualization request', error as Error);
      throw error;
    }
  }

  /**
   * Get user visualization requests
   */
  async getVisualizationRequests(): Promise<{ requests: VisualizationRequest[] }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetVisualizationRequests();
      }

      return apiClient.get<{ requests: VisualizationRequest[] }>('/utilities/visualization');
    } catch (error) {
      logger.error('Failed to get visualization requests', error as Error);
      throw error;
    }
  }

  /**
   * Get videos by category
   */
  async getVideos(category?: string): Promise<{ videos: Video[] }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetVideos(category);
      }

      return apiClient.get<{ videos: Video[] }>('/utilities/videos', {
        params: category ? { category } : {}
      });
    } catch (error) {
      logger.error('Failed to get videos', error as Error);
      throw error;
    }
  }

  /**
   * Convert units
   */
  async convertUnit(value: number, converterId: string): Promise<{ result: number }> {
    try {
      if (apiClient.isMockMode()) {
        const converter = this.mockConverters.find(c => c.id === converterId);
        if (!converter) {
          throw new Error('Converter not found');
        }
        return { result: value * converter.conversionFactor };
      }

      return apiClient.post<{ result: number }>('/utilities/convert', {
        value,
        converterId
      });
    } catch (error) {
      logger.error('Failed to convert unit', error as Error);
      throw error;
    }
  }

  /**
   * Get unit converters
   */
  async getUnitConverters(): Promise<{ converters: UnitConverter[] }> {
    try {
      if (apiClient.isMockMode()) {
        return { converters: this.mockConverters };
      }

      return apiClient.get<{ converters: UnitConverter[] }>('/utilities/converters');
    } catch (error) {
      logger.error('Failed to get converters', error as Error);
      throw error;
    }
  }

  /**
   * Get Vaastu partners
   */
  async getVaastuPartners(): Promise<{ partners: Array<{ id: string; name: string; category: string }> }> {
    try {
      if (apiClient.isMockMode()) {
        return {
          partners: [
            { id: 'vaastu_1', name: 'Vaastu Expert 1', category: 'Vaastu Consultant' },
            { id: 'vaastu_2', name: 'Vaastu Expert 2', category: 'Vaastu Consultant' }
          ]
        };
      }

      return apiClient.get('/utilities/vaastu-partners');
    } catch (error) {
      logger.error('Failed to get Vaastu partners', error as Error);
      throw error;
    }
  }

  // Mock data
  private mockConverters: UnitConverter[] = [
    { id: 'length_m_ft', name: 'Meters to Feet', category: 'Length', fromUnit: 'm', toUnit: 'ft', conversionFactor: 3.28084 },
    { id: 'length_ft_m', name: 'Feet to Meters', category: 'Length', fromUnit: 'ft', toUnit: 'm', conversionFactor: 0.3048 },
    { id: 'area_sqm_sqft', name: 'Square Meters to Square Feet', category: 'Area', fromUnit: 'm²', toUnit: 'ft²', conversionFactor: 10.7639 },
    { id: 'weight_kg_lb', name: 'Kilograms to Pounds', category: 'Weight', fromUnit: 'kg', toUnit: 'lb', conversionFactor: 2.20462 }
  ];

  private mockGetChecklists(category?: string): { checklists: Checklist[] } {
    const allChecklists: Checklist[] = [
      {
        id: '1',
        title: 'Foundation Checklist',
        category: 'Foundation',
        items: [
          { id: '1-1', text: 'Soil testing completed', checked: false },
          { id: '1-2', text: 'Foundation excavation approved', checked: false },
          { id: '1-3', text: 'Reinforcement placed correctly', checked: false },
          { id: '1-4', text: 'Concrete mix approved', checked: false },
          { id: '1-5', text: 'Curing process started', checked: false }
        ]
      },
      {
        id: '2',
        title: 'Structural Checklist',
        category: 'Structure',
        items: [
          { id: '2-1', text: 'Column alignment verified', checked: false },
          { id: '2-2', text: 'Beam reinforcement checked', checked: false },
          { id: '2-3', text: 'Slab formwork inspected', checked: false },
          { id: '2-4', text: 'Concrete pouring approved', checked: false }
        ]
      },
      {
        id: '3',
        title: 'Plumbing Checklist',
        category: 'Plumbing',
        items: [
          { id: '3-1', text: 'Water supply lines installed', checked: false },
          { id: '3-2', text: 'Drainage system tested', checked: false },
          { id: '3-3', text: 'Fixture installation completed', checked: false }
        ]
      }
    ];

    const filtered = category
      ? allChecklists.filter(c => c.category.toLowerCase() === category.toLowerCase())
      : allChecklists;

    return { checklists: filtered };
  }

  private mockSubmitVisualizationRequest(type: 'VR' | '3D', description: string): { request: VisualizationRequest } {
    return {
      request: {
        id: `viz_${Date.now()}`,
        type,
        description,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    };
  }

  private mockGetVisualizationRequests(): { requests: VisualizationRequest[] } {
    return {
      requests: [
        {
          id: 'viz_1',
          type: '3D',
          description: '3D visualization for residential project',
          status: 'completed',
          createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          completedAt: new Date(Date.now() - 2 * 86400000).toISOString()
        },
        {
          id: 'viz_2',
          type: 'VR',
          description: 'VR walkthrough for commercial space',
          status: 'in_progress',
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
        }
      ]
    };
  }

  private mockGetVideos(category?: string): { videos: Video[] } {
    const allVideos: Video[] = [
      {
        id: '1',
        title: 'Foundation Construction Basics',
        category: 'Foundation',
        youtubeId: 'dQw4w9WgXcQ',
        description: 'Learn the basics of foundation construction'
      },
      {
        id: '2',
        title: 'Reinforcement Steel Placement',
        category: 'Structure',
        youtubeId: 'dQw4w9WgXcQ',
        description: 'Proper placement of reinforcement steel'
      },
      {
        id: '3',
        title: 'Plumbing Installation Guide',
        category: 'Plumbing',
        youtubeId: 'dQw4w9WgXcQ',
        description: 'Complete guide to plumbing installation'
      }
    ];

    const filtered = category
      ? allVideos.filter(v => v.category.toLowerCase() === category.toLowerCase())
      : allVideos;

    return { videos: filtered };
  }
}

export const utilitiesService = new UtilitiesService();






