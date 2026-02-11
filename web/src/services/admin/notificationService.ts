/**
 * Admin Notification Service
 * 
 * Service for managing notifications in admin panel
 */

import { apiClient } from '../apiClient';
import { logger } from '../../core/logger';
import { NotificationChannel, NotificationEvent, NotificationLog } from '../../types/notification.types';

export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  events: {
    [key in NotificationEvent]?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
      inApp?: boolean;
    };
  };
}

class AdminNotificationService {
  /**
   * Get notification settings
   */
  async getSettings(): Promise<NotificationSettings> {
    try {
      if (apiClient.isMockMode()) {
        return {
          emailEnabled: true,
          smsEnabled: true,
          pushEnabled: true,
          inAppEnabled: true,
          events: {}
        };
      }

      return apiClient.get<NotificationSettings>('/admin/notifications/settings');
    } catch (error) {
      logger.error('Failed to get notification settings', error as Error);
      throw error;
    }
  }

  /**
   * Update notification settings
   */
  async updateSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Notification settings updated (mock)', settings);
        return settings as NotificationSettings;
      }

      return apiClient.put<NotificationSettings>('/admin/notifications/settings', settings);
    } catch (error) {
      logger.error('Failed to update notification settings', error as Error);
      throw error;
    }
  }

  /**
   * Get notification logs
   */
  async getLogs(filters?: {
    event?: NotificationEvent;
    channel?: NotificationChannel;
    userId?: string;
    role?: string;
    status?: 'pending' | 'sent' | 'failed' | 'delivered';
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: NotificationLog[]; total: number }> {
    try {
      if (apiClient.isMockMode()) {
        return {
          logs: [],
          total: 0
        };
      }

      return apiClient.get<{ logs: NotificationLog[]; total: number }>(
        '/admin/notifications/logs',
        { params: filters }
      );
    } catch (error) {
      logger.error('Failed to get notification logs', error as Error);
      throw error;
    }
  }
}

export const adminNotificationService = new AdminNotificationService();

