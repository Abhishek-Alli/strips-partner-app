/**
 * Mobile Analytics Service
 * 
 * Service layer for mobile app to interact with analytics backend
 */

import { apiClient } from './apiClient';
import { logger } from '../core/logger';
import {
  AnalyticsEvent,
  AnalyticsEventPayload,
} from '../../shared/core/analytics/analyticsTypes';

class MobileAnalyticsService {
  /**
   * Track an analytics event
   * Non-blocking, async
   */
  async trackEvent(payload: AnalyticsEventPayload): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        // In mock mode, just log
        logger.info('Analytics event tracked (mock)', payload.event);
        return;
      }

      // Fire and forget - don't await to avoid blocking
      apiClient.post('/analytics/events', payload).catch(() => {
        // Silently fail
      });
    } catch (error) {
      // Fail silently - analytics should never break the app
      logger.error('Failed to track analytics event', error as Error);
    }
  }
}

export const mobileAnalyticsService = new MobileAnalyticsService();






