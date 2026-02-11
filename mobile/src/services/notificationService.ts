/**
 * Mobile Notification Service
 * 
 * Client-side notification service for mobile app
 */

import { apiClient } from './apiClient';
import { logger } from '../core/logger';
import { NotificationChannel, NotificationEvent } from '../../shared/core/notifications/notificationTypes';

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  event: NotificationEvent;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

class MobileNotificationService {
  /**
   * Register device for push notifications
   */
  async registerPushToken(token: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Push token registered (mock)', { token: token.substring(0, 10) + '...' });
        return;
      }

      await apiClient.post('/notifications/push/register', { token });
    } catch (error) {
      logger.error('Failed to register push token', error as Error);
      // Don't throw - push registration failure shouldn't break app
    }
  }

  /**
   * Unregister device push token
   */
  async unregisterPushToken(token: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Push token unregistered (mock)', { token: token.substring(0, 10) + '...' });
        return;
      }

      await apiClient.post('/notifications/push/unregister', { token });
    } catch (error) {
      logger.error('Failed to unregister push token', error as Error);
    }
  }

  /**
   * Get in-app notifications
   */
  async getNotifications(params?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
  }): Promise<{ notifications: InAppNotification[]; total: number }> {
    try {
      if (apiClient.isMockMode()) {
        return {
          notifications: [],
          total: 0
        };
      }

      return apiClient.get<{ notifications: InAppNotification[]; total: number }>(
        '/notifications/in-app',
        { params }
      );
    } catch (error) {
      logger.error('Failed to get notifications', error as Error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Notification marked as read (mock)', { notificationId });
        return;
      }

      await apiClient.patch(`/notifications/in-app/${notificationId}/read`);
    } catch (error) {
      logger.error('Failed to mark notification as read', error as Error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('All notifications marked as read (mock)');
        return;
      }

      await apiClient.patch('/notifications/in-app/read-all');
    } catch (error) {
      logger.error('Failed to mark all notifications as read', error as Error);
      throw error;
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    try {
      if (apiClient.isMockMode()) {
        return 0;
      }

      const response = await apiClient.get<{ count: number }>('/notifications/in-app/unread-count');
      return response.count;
    } catch (error) {
      logger.error('Failed to get unread count', error as Error);
      return 0;
    }
  }
}

export const mobileNotificationService = new MobileNotificationService();






