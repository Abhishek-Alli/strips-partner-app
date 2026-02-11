/**
 * Notification Service
 * 
 * Centralized notification service
 * Routes notifications to appropriate channels
 */

import {
  NotificationPayload,
  NotificationResult,
  NotificationChannel,
  NotificationEvent,
  NotificationRecipient,
  NotificationTemplate,
  NotificationLog
} from './notificationTypes';
import { emailTemplates } from './templates/emailTemplates';
import { smsTemplates } from './templates/smsTemplates';
import { emailProvider } from './providers/emailProvider';
import { smsProvider } from './providers/smsProvider';
import { pushProvider } from './providers/pushProvider';

export class NotificationService {
  private logs: NotificationLog[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  /**
   * Send notification across specified channels
   */
  async send(payload: NotificationPayload): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];

    // Process each channel
    for (const channel of payload.channel) {
      try {
        const result = await this.sendToChannel(payload, channel);
        results.push(result);

        // Log the notification
        this.logNotification(payload, channel, result);
      } catch (error) {
        const errorResult: NotificationResult = {
          success: false,
          channel,
          error: (error as Error).message,
          timestamp: new Date()
        };
        results.push(errorResult);
        this.logNotification(payload, channel, errorResult);
      }
    }

    return results;
  }

  /**
   * Send notification to a specific channel
   */
  private async sendToChannel(
    payload: NotificationPayload,
    channel: NotificationChannel
  ): Promise<NotificationResult> {
    switch (channel) {
      case NotificationChannel.EMAIL:
        return this.sendEmail(payload);
      
      case NotificationChannel.SMS:
        return this.sendSMS(payload);
      
      case NotificationChannel.PUSH:
        return this.sendPush(payload);
      
      case NotificationChannel.IN_APP:
        // In-app notifications are handled separately (stored in database)
        return {
          success: true,
          channel,
          messageId: `inapp-${Date.now()}`,
          timestamp: new Date()
        };
      
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(payload: NotificationPayload): Promise<NotificationResult> {
    if (!payload.recipient.email) {
      throw new Error('Email address required for email notification');
    }

    const templateFn = emailTemplates[payload.event];
    if (!templateFn) {
      throw new Error(`No email template found for event: ${payload.event}`);
    }

    const emailTemplate = templateFn({
      ...payload.template.variables,
      ...payload.metadata
    });

    return emailProvider.sendEmail(
      payload.recipient,
      emailTemplate,
      payload.metadata
    );
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(payload: NotificationPayload): Promise<NotificationResult> {
    if (!payload.recipient.phone) {
      throw new Error('Phone number required for SMS notification');
    }

    const templateFn = smsTemplates[payload.event];
    if (!templateFn) {
      throw new Error(`No SMS template found for event: ${payload.event}`);
    }

    const message = templateFn({
      ...payload.template.variables,
      ...payload.metadata
    });

    return smsProvider.sendSMS(
      payload.recipient,
      message,
      payload.metadata
    );
  }

  /**
   * Send push notification
   */
  private async sendPush(payload: NotificationPayload): Promise<NotificationResult> {
    if (!payload.recipient.pushToken) {
      throw new Error('Push token required for push notification');
    }

    return pushProvider.sendPush(
      payload.recipient,
      payload.template.title,
      payload.template.message,
      payload.metadata,
      payload.metadata
    );
  }

  /**
   * Log notification attempt
   */
  private logNotification(
    payload: NotificationPayload,
    channel: NotificationChannel,
    result: NotificationResult
  ): void {
    const log: NotificationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      event: payload.event,
      channel,
      recipient: {
        userId: payload.recipient.userId,
        email: this.maskPII(payload.recipient.email),
        phone: this.maskPII(payload.recipient.phone),
        role: payload.recipient.role
      },
      status: result.success ? 'sent' : 'failed',
      result,
      createdAt: new Date(),
      sentAt: result.success ? result.timestamp : undefined,
      error: result.error
    };

    this.logs.push(log);

    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Get notification logs
   */
  getLogs(filters?: {
    event?: NotificationEvent;
    channel?: NotificationChannel;
    userId?: string;
    role?: string;
    status?: 'pending' | 'sent' | 'failed' | 'delivered';
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): NotificationLog[] {
    let filtered = [...this.logs];

    if (filters?.event) {
      filtered = filtered.filter(log => log.event === filters.event);
    }

    if (filters?.channel) {
      filtered = filtered.filter(log => log.channel === filters.channel);
    }

    if (filters?.userId) {
      filtered = filtered.filter(log => log.recipient.userId === filters.userId);
    }

    if (filters?.role) {
      filtered = filtered.filter(log => log.recipient.role === filters.role);
    }

    if (filters?.status) {
      filtered = filtered.filter(log => log.status === filters.status);
    }

    if (filters?.startDate) {
      filtered = filtered.filter(log => log.createdAt >= filters.startDate!);
    }

    if (filters?.endDate) {
      filtered = filtered.filter(log => log.createdAt <= filters.endDate!);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply limit
    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  /**
   * Mask PII in logs
   */
  private maskPII(value?: string): string | undefined {
    if (!value) return undefined;
    if (value.includes('@')) {
      // Email
      const [local, domain] = value.split('@');
      return `${local.substring(0, 2)}***@${domain}`;
    }
    if (/^\d+$/.test(value)) {
      // Phone
      return `***${value.substring(value.length - 4)}`;
    }
    return value;
  }
}

export const notificationService = new NotificationService();

