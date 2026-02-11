/**
 * SMS Provider
 * 
 * Provider-agnostic SMS sending interface
 * Test mode implementation
 */

import { NotificationRecipient, NotificationResult } from '../notificationTypes';

export interface SMSProvider {
  sendSMS(
    recipient: NotificationRecipient,
    message: string,
    metadata?: Record<string, any>
  ): Promise<NotificationResult>;
}

/**
 * Test SMS Provider
 * 
 * Uses test SMS gateway configuration
 */
export class TestSMSProvider implements SMSProvider {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.SMS_ENABLED !== 'false';
  }

  async sendSMS(
    recipient: NotificationRecipient,
    message: string,
    metadata?: Record<string, any>
  ): Promise<NotificationResult> {
    if (!this.isEnabled) {
      return {
        success: false,
        channel: 'sms' as any,
        error: 'SMS notifications are disabled',
        timestamp: new Date()
      };
    }

    if (!recipient.phone) {
      return {
        success: false,
        channel: 'sms' as any,
        error: 'No phone number provided',
        timestamp: new Date()
      };
    }

    // Validate message length (SMS limit)
    if (message.length > 160) {
      return {
        success: false,
        channel: 'sms' as any,
        error: 'Message exceeds SMS length limit (160 characters)',
        timestamp: new Date()
      };
    }

    try {
      // In test mode, log the SMS instead of actually sending
      if (process.env.NODE_ENV === 'test' || process.env.SMS_MODE === 'test') {
        console.log('[TEST SMS]', {
          to: this.maskPhone(recipient.phone),
          message: message.substring(0, 50) + '...',
          length: message.length
        });

        return {
          success: true,
          channel: 'sms' as any,
          messageId: `test-sms-${Date.now()}`,
          timestamp: new Date()
        };
      }

      // Production mode would use actual SMS gateway (Twilio, AWS SNS, etc.)
      // For now, simulate successful send
      // In real implementation, integrate with SMS provider API
      
      return {
        success: true,
        channel: 'sms' as any,
        messageId: `sms-${Date.now()}`,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        channel: 'sms' as any,
        error: (error as Error).message,
        timestamp: new Date()
      };
    }
  }

  private maskPhone(phone: string): string {
    if (phone.length <= 4) return '***';
    return `***${phone.substring(phone.length - 4)}`;
  }
}

export const smsProvider = new TestSMSProvider();






