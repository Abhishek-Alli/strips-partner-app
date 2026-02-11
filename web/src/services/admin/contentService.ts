/**
 * Admin Content Management Service
 * 
 * Handles utilities and content management for Admin
 */

import { apiClient } from '../apiClient';
import { logger } from '../../core/logger';

export interface Checklist {
  id: string;
  title: string;
  category: string;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
}

export interface Video {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
  description?: string;
  createdAt: string;
}

export interface VisualizationRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'VR' | '3D';
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export interface AdminNote {
  id: string;
  entityType: 'partner' | 'dealer' | 'enquiry';
  entityId: string;
  note: string;
  createdBy: string;
  createdAt: string;
}

class ContentService {
  /**
   * Checklists CRUD
   */
  async getChecklists(): Promise<{ checklists: Checklist[] }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetChecklists();
      }

      return apiClient.get<{ checklists: Checklist[] }>('/admin/content/checklists');
    } catch (error) {
      logger.error('Failed to get checklists', error as Error);
      throw error;
    }
  }

  async createChecklist(data: Omit<Checklist, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ checklist: Checklist }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockCreateChecklist(data);
      }

      return apiClient.post<{ checklist: Checklist }>('/admin/content/checklists', data);
    } catch (error) {
      logger.error('Failed to create checklist', error as Error);
      throw error;
    }
  }

  async updateChecklist(id: string, data: Partial<Checklist>): Promise<{ checklist: Checklist }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockUpdateChecklist(id, data);
      }

      return apiClient.put<{ checklist: Checklist }>(`/admin/content/checklists/${id}`, data);
    } catch (error) {
      logger.error('Failed to update checklist', error as Error);
      throw error;
    }
  }

  async deleteChecklist(id: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Checklist deleted', { id });
        return;
      }

      await apiClient.delete(`/admin/content/checklists/${id}`);
    } catch (error) {
      logger.error('Failed to delete checklist', error as Error);
      throw error;
    }
  }

  /**
   * Videos CRUD
   */
  async getVideos(): Promise<{ videos: Video[] }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetVideos();
      }

      return apiClient.get<{ videos: Video[] }>('/admin/content/videos');
    } catch (error) {
      logger.error('Failed to get videos', error as Error);
      throw error;
    }
  }

  async createVideo(data: Omit<Video, 'id' | 'createdAt'>): Promise<{ video: Video }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockCreateVideo(data);
      }

      return apiClient.post<{ video: Video }>('/admin/content/videos', data);
    } catch (error) {
      logger.error('Failed to create video', error as Error);
      throw error;
    }
  }

  async updateVideo(id: string, data: Partial<Video>): Promise<{ video: Video }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockUpdateVideo(id, data);
      }

      return apiClient.put<{ video: Video }>(`/admin/content/videos/${id}`, data);
    } catch (error) {
      logger.error('Failed to update video', error as Error);
      throw error;
    }
  }

  async deleteVideo(id: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Video deleted', { id });
        return;
      }

      await apiClient.delete(`/admin/content/videos/${id}`);
    } catch (error) {
      logger.error('Failed to delete video', error as Error);
      throw error;
    }
  }

  /**
   * Visualization Requests
   */
  async getVisualizationRequests(): Promise<{ requests: VisualizationRequest[] }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetVisualizationRequests();
      }

      return apiClient.get<{ requests: VisualizationRequest[] }>('/admin/content/visualization');
    } catch (error) {
      logger.error('Failed to get visualization requests', error as Error);
      throw error;
    }
  }

  async updateVisualizationRequest(id: string, status: VisualizationRequest['status']): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Visualization request updated', { id, status });
        return;
      }

      await apiClient.put(`/admin/content/visualization/${id}`, { status });
    } catch (error) {
      logger.error('Failed to update visualization request', error as Error);
      throw error;
    }
  }

  /**
   * Admin Notes
   */
  async getNotes(entityType: string, entityId: string): Promise<{ notes: AdminNote[] }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockGetNotes(entityType, entityId);
      }

      return apiClient.get<{ notes: AdminNote[] }>(`/admin/notes/${entityType}/${entityId}`);
    } catch (error) {
      logger.error('Failed to get notes', error as Error);
      throw error;
    }
  }

  async addNote(entityType: string, entityId: string, note: string): Promise<{ note: AdminNote }> {
    try {
      if (apiClient.isMockMode()) {
        return this.mockAddNote(entityType, entityId, note);
      }

      return apiClient.post<{ note: AdminNote }>(`/admin/notes/${entityType}/${entityId}`, { note });
    } catch (error) {
      logger.error('Failed to add note', error as Error);
      throw error;
    }
  }

  // Mock implementations
  private mockGetChecklists(): { checklists: Checklist[] } {
    return {
      checklists: [
        {
          id: '1',
          title: 'Foundation Checklist',
          category: 'Foundation',
          items: [
            { id: '1-1', text: 'Soil testing completed' },
            { id: '1-2', text: 'Foundation excavation approved' }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  }

  private mockCreateChecklist(data: Omit<Checklist, 'id' | 'createdAt' | 'updatedAt'>): { checklist: Checklist } {
    return {
      checklist: {
        ...data,
        id: `checklist_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  private mockUpdateChecklist(id: string, data: Partial<Checklist>): { checklist: Checklist } {
    return {
      checklist: {
        id,
        title: data.title || 'Updated Checklist',
        category: data.category || 'General',
        items: data.items || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  private mockGetVideos(): { videos: Video[] } {
    return {
      videos: [
        {
          id: '1',
          title: 'Foundation Construction Basics',
          category: 'Foundation',
          youtubeId: 'dQw4w9WgXcQ',
          description: 'Learn the basics',
          createdAt: new Date().toISOString()
        }
      ]
    };
  }

  private mockCreateVideo(data: Omit<Video, 'id' | 'createdAt'>): { video: Video } {
    return {
      video: {
        ...data,
        id: `video_${Date.now()}`,
        createdAt: new Date().toISOString()
      }
    };
  }

  private mockUpdateVideo(id: string, data: Partial<Video>): { video: Video } {
    return {
      video: {
        id,
        title: data.title || 'Updated Video',
        category: data.category || 'General',
        youtubeId: data.youtubeId || 'dQw4w9WgXcQ',
        description: data.description,
        createdAt: new Date().toISOString()
      }
    };
  }

  private mockGetVisualizationRequests(): { requests: VisualizationRequest[] } {
    return {
      requests: [
        {
          id: '1',
          userId: 'user_1',
          userName: 'User 1',
          type: '3D',
          description: '3D visualization request',
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]
    };
  }

  private mockGetNotes(entityType: string, entityId: string): { notes: AdminNote[] } {
    return {
      notes: [
        {
          id: '1',
          entityType: entityType as 'partner' | 'dealer' | 'enquiry',
          entityId,
          note: 'Sample admin note',
          createdBy: 'admin_1',
          createdAt: new Date().toISOString()
        }
      ]
    };
  }

  private mockAddNote(entityType: string, entityId: string, note: string): { note: AdminNote } {
    return {
      note: {
        id: `note_${Date.now()}`,
        entityType: entityType as 'partner' | 'dealer' | 'enquiry',
        entityId,
        note,
        createdBy: 'admin_1',
        createdAt: new Date().toISOString()
      }
    };
  }
}

export const contentService = new ContentService();






