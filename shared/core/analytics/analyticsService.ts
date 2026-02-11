/**
 * Analytics Service
 * 
 * Centralized analytics and event tracking service
 * Handles event logging, aggregations, and metrics calculation
 */

import {
  AnalyticsEvent,
  AnalyticsEventPayload,
  AnalyticsMetric,
  AnalyticsTimeSeries,
  AnalyticsAggregation,
  AdminDashboardMetrics,
  PartnerAnalytics,
  DealerAnalytics,
  ConversionFunnel,
  UserActivityReport,
  EnquiryReport,
  PaymentReport,
} from './analyticsTypes';

// In-memory event store (in production, this would be a database)
const eventStore: AnalyticsEventPayload[] = [];
const MAX_EVENTS = 10000; // Keep last 10k events in memory

export class AnalyticsService {
  /**
   * Track an analytics event
   * Non-blocking, async
   */
  async trackEvent(payload: AnalyticsEventPayload): Promise<void> {
    try {
      // Ensure no PII in metadata
      const sanitizedPayload: AnalyticsEventPayload = {
        ...payload,
        metadata: this.sanitizeMetadata(payload.metadata || {}),
      };

      // Add to event store
      eventStore.push(sanitizedPayload);

      // Keep only last MAX_EVENTS
      if (eventStore.length > MAX_EVENTS) {
        eventStore.shift();
      }

      // In production, this would also send to analytics backend/database
      // For now, we'll just log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', payload.event, {
          userId: payload.userId?.substring(0, 8) + '...',
          role: payload.userRole,
          timestamp: payload.timestamp,
        });
      }
    } catch (error) {
      // Fail silently - analytics should never break the app
      console.error('[Analytics] Failed to track event:', error);
    }
  }

  /**
   * Get events filtered by criteria
   */
  getEvents(filters?: {
    event?: AnalyticsEvent;
    userId?: string;
    userRole?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AnalyticsEventPayload[] {
    let filtered = [...eventStore];

    if (filters?.event) {
      filtered = filtered.filter(e => e.event === filters.event);
    }

    if (filters?.userId) {
      filtered = filtered.filter(e => e.userId === filters.userId);
    }

    if (filters?.userRole) {
      filtered = filtered.filter(e => e.userRole === filters.userRole);
    }

    if (filters?.startDate) {
      filtered = filtered.filter(e => e.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      filtered = filtered.filter(e => e.timestamp <= filters.endDate!);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  /**
   * Get admin dashboard metrics
   */
  async getAdminDashboardMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<AdminDashboardMetrics> {
    const events = this.getEvents({ startDate, endDate });

    // Count users by role
    const userRoles = new Set<string>();
    const roleCounts: Record<string, number> = { general: 0, partner: 0, dealer: 0, admin: 0 };
    
    events.forEach(e => {
      if (e.userRole && !userRoles.has(`${e.userRole}_${e.userId}`)) {
        userRoles.add(`${e.userRole}_${e.userId}`);
        const role = e.userRole.toLowerCase();
        if (role === 'general_user') roleCounts.general++;
        else if (role === 'partner') roleCounts.partner++;
        else if (role === 'dealer') roleCounts.dealer++;
        else if (role === 'admin') roleCounts.admin++;
      }
    });

    // Active users
    const dailyActive = new Set<string>();
    const monthlyActive = new Set<string>();
    const today = new Date();
    const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    events.forEach(e => {
      if (e.userId) {
        if (e.timestamp >= oneDayAgo) dailyActive.add(e.userId);
        if (e.timestamp >= oneMonthAgo) monthlyActive.add(e.userId);
      }
    });

    // Searches
    const searches = this.aggregateEvents(events.filter(e => 
      e.event === AnalyticsEvent.PARTNER_SEARCH || e.event === AnalyticsEvent.DEALER_SEARCH
    ), startDate, endDate);

    // Enquiries
    const enquiries = this.aggregateEvents(events.filter(e => 
      e.event === AnalyticsEvent.ENQUIRY_SUBMITTED
    ), startDate, endDate);

    // Payments
    const paymentEvents = events.filter(e => 
      e.event === AnalyticsEvent.PAYMENT_SUCCESS || 
      e.event === AnalyticsEvent.PAYMENT_FAILED ||
      e.event === AnalyticsEvent.PAYMENT_INITIATED
    );
    const successfulPayments = paymentEvents.filter(e => e.event === AnalyticsEvent.PAYMENT_SUCCESS);
    const failedPayments = paymentEvents.filter(e => e.event === AnalyticsEvent.PAYMENT_FAILED);
    const totalRevenue = successfulPayments.reduce((sum, e) => {
      const amount = e.metadata?.amount || 0;
      return sum + amount;
    }, 0);

    // Conversion funnel
    const conversionFunnel = this.calculateConversionFunnel(events, startDate, endDate);

    // Time series data
    const timeSeries = this.generateTimeSeries(events, startDate, endDate);

    return {
      totalUsers: {
        general: roleCounts.general,
        partner: roleCounts.partner,
        dealer: roleCounts.dealer,
        admin: roleCounts.admin,
      },
      activeUsers: {
        daily: dailyActive.size,
        monthly: monthlyActive.size,
      },
      searches,
      enquiries,
      payments: {
        total: paymentEvents.length,
        successful: successfulPayments.length,
        failed: failedPayments.length,
        revenue: totalRevenue,
        currency: 'INR',
      },
      conversionFunnel,
      timeSeries,
    };
  }

  /**
   * Get partner analytics
   */
  async getPartnerAnalytics(
    partnerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PartnerAnalytics> {
    const events = this.getEvents({ startDate, endDate });

    // Profile views
    const profileViews = events.filter(e => 
      e.event === AnalyticsEvent.PROFILE_VIEWED && 
      e.metadata?.entityId === partnerId &&
      e.metadata?.entityType === 'partner'
    ).length;

    // Enquiries received
    const enquiriesReceived = events.filter(e => 
      e.event === AnalyticsEvent.ENQUIRY_SUBMITTED &&
      e.metadata?.entityId === partnerId &&
      e.metadata?.entityType === 'partner'
    ).length;

    // Enquiries responded
    const enquiriesResponded = events.filter(e => 
      e.event === AnalyticsEvent.ENQUIRY_RESPONDED &&
      e.metadata?.entityId === partnerId &&
      e.metadata?.entityType === 'partner'
    ).length;

    const responseRate = enquiriesReceived > 0 
      ? (enquiriesResponded / enquiriesReceived) * 100 
      : 0;

    // Average response time (mock - would need enquiry timestamps)
    const averageResponseTime = enquiriesResponded > 0 ? 24 : 0; // hours

    // Feedback (mock - would come from feedback service)
    const feedbackRating = 4.5;
    const feedbackCount = 10;

    return {
      partnerId,
      period: { start: startDate, end: endDate },
      profileViews,
      enquiriesReceived,
      enquiriesResponded,
      responseRate: Math.round(responseRate * 100) / 100,
      averageResponseTime,
      feedbackRating,
      feedbackCount,
      paidPromotionViews: events.filter(e => 
        e.event === AnalyticsEvent.PROFILE_VIEWED &&
        e.metadata?.entityId === partnerId &&
        e.metadata?.isPromoted === true
      ).length,
    };
  }

  /**
   * Get dealer analytics
   */
  async getDealerAnalytics(
    dealerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DealerAnalytics> {
    const events = this.getEvents({ startDate, endDate });

    // Profile views
    const profileViews = events.filter(e => 
      e.event === AnalyticsEvent.PROFILE_VIEWED && 
      e.metadata?.entityId === dealerId &&
      e.metadata?.entityType === 'dealer'
    ).length;

    // Map clicks
    const mapClicks = events.filter(e => 
      e.event === AnalyticsEvent.PROFILE_VIEWED &&
      e.metadata?.entityId === dealerId &&
      e.metadata?.entityType === 'dealer' &&
      e.metadata?.source === 'map'
    ).length;

    // Enquiries received
    const enquiriesReceived = events.filter(e => 
      e.event === AnalyticsEvent.ENQUIRY_SUBMITTED &&
      e.metadata?.entityId === dealerId &&
      e.metadata?.entityType === 'dealer'
    ).length;

    // Enquiries responded
    const enquiriesResponded = events.filter(e => 
      e.event === AnalyticsEvent.ENQUIRY_RESPONDED &&
      e.metadata?.entityId === dealerId &&
      e.metadata?.entityType === 'dealer'
    ).length;

    const responseRate = enquiriesReceived > 0 
      ? (enquiriesResponded / enquiriesReceived) * 100 
      : 0;

    const averageResponseTime = enquiriesResponded > 0 ? 18 : 0; // hours

    // Feedback (mock)
    const feedbackRating = 4.3;
    const feedbackCount = 8;

    // Average distance (mock - would come from location data)
    const averageDistance = 5.2; // km

    return {
      dealerId,
      period: { start: startDate, end: endDate },
      profileViews,
      mapClicks,
      enquiriesReceived,
      enquiriesResponded,
      responseRate: Math.round(responseRate * 100) / 100,
      averageResponseTime,
      feedbackRating,
      feedbackCount,
      averageDistance,
    };
  }

  /**
   * Calculate conversion funnel
   */
  private calculateConversionFunnel(
    events: AnalyticsEventPayload[],
    startDate: Date,
    endDate: Date
  ): ConversionFunnel {
    const searches = events.filter(e => 
      e.event === AnalyticsEvent.PARTNER_SEARCH || 
      e.event === AnalyticsEvent.DEALER_SEARCH
    ).length;

    const profileViews = events.filter(e => 
      e.event === AnalyticsEvent.PROFILE_VIEWED
    ).length;

    const enquiries = events.filter(e => 
      e.event === AnalyticsEvent.ENQUIRY_SUBMITTED
    ).length;

    const payments = events.filter(e => 
      e.event === AnalyticsEvent.PAYMENT_SUCCESS
    ).length;

    return {
      searches,
      profileViews,
      enquiries,
      payments,
      period: { start: startDate, end: endDate },
      conversionRates: {
        searchToView: searches > 0 ? Math.round((profileViews / searches) * 10000) / 100 : 0,
        viewToEnquiry: profileViews > 0 ? Math.round((enquiries / profileViews) * 10000) / 100 : 0,
        enquiryToPayment: enquiries > 0 ? Math.round((payments / enquiries) * 10000) / 100 : 0,
      },
    };
  }

  /**
   * Aggregate events by period
   */
  private aggregateEvents(
    events: AnalyticsEventPayload[],
    startDate: Date,
    endDate: Date
  ): AnalyticsAggregation {
    const breakdown: Record<string, number> = {};
    
    // Group by day
    events.forEach(e => {
      const dateKey = e.timestamp.toISOString().split('T')[0];
      breakdown[dateKey] = (breakdown[dateKey] || 0) + 1;
    });

    return {
      total: events.length,
      period: 'daily',
      startDate,
      endDate,
      breakdown,
    };
  }

  /**
   * Generate time series data
   */
  private generateTimeSeries(
    events: AnalyticsEventPayload[],
    startDate: Date,
    endDate: Date
  ): {
    users: AnalyticsTimeSeries[];
    searches: AnalyticsTimeSeries[];
    enquiries: AnalyticsTimeSeries[];
    revenue: AnalyticsTimeSeries[];
  } {
    const days: Record<string, {
      users: Set<string>;
      searches: number;
      enquiries: number;
      revenue: number;
    }> = {};

    // Initialize days
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      days[dateKey] = {
        users: new Set(),
        searches: 0,
        enquiries: 0,
        revenue: 0,
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Aggregate events
    events.forEach(e => {
      const dateKey = e.timestamp.toISOString().split('T')[0];
      if (days[dateKey]) {
        if (e.userId) days[dateKey].users.add(e.userId);
        
        if (e.event === AnalyticsEvent.PARTNER_SEARCH || e.event === AnalyticsEvent.DEALER_SEARCH) {
          days[dateKey].searches++;
        }
        
        if (e.event === AnalyticsEvent.ENQUIRY_SUBMITTED) {
          days[dateKey].enquiries++;
        }
        
        if (e.event === AnalyticsEvent.PAYMENT_SUCCESS) {
          days[dateKey].revenue += e.metadata?.amount || 0;
        }
      }
    });

    // Convert to time series
    const users: AnalyticsTimeSeries[] = [];
    const searches: AnalyticsTimeSeries[] = [];
    const enquiries: AnalyticsTimeSeries[] = [];
    const revenue: AnalyticsTimeSeries[] = [];

    Object.keys(days).sort().forEach(dateKey => {
      users.push({ date: dateKey, value: days[dateKey].users.size });
      searches.push({ date: dateKey, value: days[dateKey].searches });
      enquiries.push({ date: dateKey, value: days[dateKey].enquiries });
      revenue.push({ date: dateKey, value: days[dateKey].revenue });
    });

    return { users, searches, enquiries, revenue };
  }

  /**
   * Sanitize metadata to remove PII
   */
  private sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    const piiKeys = ['email', 'phone', 'name', 'address'];

    Object.keys(metadata).forEach(key => {
      if (!piiKeys.includes(key.toLowerCase())) {
        sanitized[key] = metadata[key];
      }
    });

    return sanitized;
  }
}

export const analyticsService = new AnalyticsService();






