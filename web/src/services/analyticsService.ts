/**
 * Web Analytics Service
 * 
 * Service layer for web app to interact with analytics backend
 */

import { apiClient } from './apiClient';
import { logger } from '../core/logger';
import {
  AdminDashboardMetrics,
  PartnerAnalytics,
  DealerAnalytics,
  UserActivityReport,
  EnquiryReport,
  PaymentReport,
  AnalyticsEvent,
  AnalyticsEventPayload,
} from '../../shared/core/analytics/analyticsTypes';

class WebAnalyticsService {
  /**
   * Track an analytics event
   */
  async trackEvent(payload: AnalyticsEventPayload): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        // In mock mode, just log
        logger.info('Analytics event tracked (mock)', payload.event);
        return;
      }

      await apiClient.post('/analytics/events', payload);
    } catch (error) {
      // Fail silently - analytics should never break the app
      logger.error('Failed to track analytics event', error as Error);
    }
  }

  /**
   * Get admin dashboard metrics
   */
  async getAdminDashboardMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<AdminDashboardMetrics> {
    try {
      if (apiClient.isMockMode()) {
        // Return mock data
        return this.getMockAdminMetrics(startDate, endDate);
      }

      const response = await apiClient.get<AdminDashboardMetrics>('/analytics/admin/dashboard', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch admin dashboard metrics', error as Error);
      throw error;
    }
  }

  /**
   * Get partner analytics
   */
  async getPartnerAnalytics(
    partnerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PartnerAnalytics> {
    try {
      if (apiClient.isMockMode()) {
        return this.getMockPartnerAnalytics(partnerId, startDate, endDate);
      }

      const response = await apiClient.get<PartnerAnalytics>('/analytics/partner', {
        params: {
          partnerId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch partner analytics', error as Error);
      throw error;
    }
  }

  /**
   * Get dealer analytics
   */
  async getDealerAnalytics(
    dealerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DealerAnalytics> {
    try {
      if (apiClient.isMockMode()) {
        return this.getMockDealerAnalytics(dealerId, startDate, endDate);
      }

      const response = await apiClient.get<DealerAnalytics>('/analytics/dealer', {
        params: {
          dealerId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch dealer analytics', error as Error);
      throw error;
    }
  }

  /**
   * Get user activity report
   */
  async getUserActivityReport(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<UserActivityReport[]> {
    try {
      if (apiClient.isMockMode()) {
        return this.getMockUserActivityReport(startDate, endDate);
      }

      const response = await apiClient.get<UserActivityReport[]>('/analytics/reports/user-activity', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          userId,
        },
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch user activity report', error as Error);
      throw error;
    }
  }

  /**
   * Get enquiry report
   */
  async getEnquiryReport(
    startDate: Date,
    endDate: Date
  ): Promise<EnquiryReport[]> {
    try {
      if (apiClient.isMockMode()) {
        return this.getMockEnquiryReport(startDate, endDate);
      }

      const response = await apiClient.get<EnquiryReport[]>('/analytics/reports/enquiries', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch enquiry report', error as Error);
      throw error;
    }
  }

  /**
   * Get payment report
   */
  async getPaymentReport(
    startDate: Date,
    endDate: Date
  ): Promise<PaymentReport[]> {
    try {
      if (apiClient.isMockMode()) {
        return this.getMockPaymentReport(startDate, endDate);
      }

      const response = await apiClient.get<PaymentReport[]>('/analytics/reports/payments', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch payment report', error as Error);
      throw error;
    }
  }

  /**
   * Export report as CSV
   */
  async exportReportAsCSV(
    reportType: 'user-activity' | 'enquiries' | 'payments',
    startDate: Date,
    endDate: Date
  ): Promise<Blob> {
    try {
      const response = await apiClient.get(`/analytics/reports/${reportType}/export`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          format: 'csv',
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      logger.error(`Failed to export ${reportType} report`, error as Error);
      throw error;
    }
  }

  // Mock data generators
  private getMockAdminMetrics(startDate: Date, endDate: Date): AdminDashboardMetrics {
    return {
      totalUsers: {
        general: 1250,
        partner: 45,
        dealer: 78,
        admin: 3,
      },
      activeUsers: {
        daily: 320,
        monthly: 980,
      },
      searches: {
        total: 5420,
        period: 'daily',
        startDate,
        endDate,
        breakdown: {},
      },
      enquiries: {
        total: 1230,
        period: 'daily',
        startDate,
        endDate,
        breakdown: {},
      },
      payments: {
        total: 456,
        successful: 432,
        failed: 24,
        revenue: 125000,
        currency: 'INR',
      },
      conversionFunnel: {
        searches: 5420,
        profileViews: 3240,
        enquiries: 1230,
        payments: 432,
        period: { start: startDate, end: endDate },
        conversionRates: {
          searchToView: 59.78,
          viewToEnquiry: 37.96,
          enquiryToPayment: 35.12,
        },
      },
      timeSeries: {
        users: [],
        searches: [],
        enquiries: [],
        revenue: [],
      },
    };
  }

  private getMockPartnerAnalytics(
    partnerId: string,
    startDate: Date,
    endDate: Date
  ): PartnerAnalytics {
    return {
      partnerId,
      period: { start: startDate, end: endDate },
      profileViews: 245,
      enquiriesReceived: 38,
      enquiriesResponded: 32,
      responseRate: 84.21,
      averageResponseTime: 18.5,
      feedbackRating: 4.5,
      feedbackCount: 28,
      paidPromotionViews: 45,
    };
  }

  private getMockDealerAnalytics(
    dealerId: string,
    startDate: Date,
    endDate: Date
  ): DealerAnalytics {
    return {
      dealerId,
      period: { start: startDate, end: endDate },
      profileViews: 189,
      mapClicks: 67,
      enquiriesReceived: 24,
      enquiriesResponded: 20,
      responseRate: 83.33,
      averageResponseTime: 16.2,
      feedbackRating: 4.3,
      feedbackCount: 15,
      averageDistance: 5.2,
    };
  }

  private getMockUserActivityReport(
    startDate: Date,
    endDate: Date
  ): UserActivityReport[] {
    return [
      {
        userId: 'user_123',
        role: 'general_user',
        totalLogins: 45,
        lastLogin: new Date(),
        totalSearches: 120,
        totalEnquiries: 8,
        totalPayments: 2,
        totalSpent: 1500,
        period: { start: startDate, end: endDate },
      },
    ];
  }

  private getMockEnquiryReport(
    startDate: Date,
    endDate: Date
  ): EnquiryReport[] {
    return [
      {
        enquiryId: 'enq_123',
        userId: 'user_123',
        entityType: 'partner',
        entityId: 'partner_456',
        status: 'responded',
        createdAt: new Date(),
        respondedAt: new Date(),
        responseTime: 18.5,
      },
    ];
  }

  private getMockPaymentReport(
    startDate: Date,
    endDate: Date
  ): PaymentReport[] {
    return [
      {
        paymentId: 'pay_123',
        userId: 'user_123',
        serviceType: 'BUDGET_ESTIMATION_REPORT',
        amount: 500,
        currency: 'INR',
        status: 'SUCCESS',
        createdAt: new Date(),
      },
    ];
  }
}

export const webAnalyticsService = new WebAnalyticsService();






