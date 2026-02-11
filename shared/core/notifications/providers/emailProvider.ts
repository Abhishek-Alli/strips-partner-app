/**
 * Email Provider
 * 
 * Provider-agnostic email sending interface
 * Test mode implementation using Nodemailer
 */

import { NotificationRecipient, NotificationResult } from '../notificationTypes';
import { EmailTemplate } from '../templates/emailTemplates';

export interface EmailProvider {
  sendEmail(
    recipient: NotificationRecipient,
    template: EmailTemplate,
    metadata?: Record<string, any>
  ): Promise<NotificationResult>;
}

/**
 * Test Email Provider (Nodemailer)
 * 
 * Uses test SMTP configuration from environment
 */
export class TestEmailProvider implements EmailProvider {
  private isEnabled: boolean;

  constructor() {
    // Check if email is enabled (from env or config)
    this.isEnabled = process.env.EMAIL_ENABLED !== 'false';
  }

  async sendEmail(
    recipient: NotificationRecipient,
    template: EmailTemplate,
    metadata?: Record<string, any>
  ): Promise<NotificationResult> {
    if (!this.isEnabled) {
      return {
        success: false,
        channel: 'email' as any,
        error: 'Email notifications are disabled',
        timestamp: new Date()
      };
    }

    if (!recipient.email) {
      return {
        success: false,
        channel: 'email' as any,
        error: 'No email address provided',
        timestamp: new Date()
      };
    }

    try {
      // In test mode, log the email instead of actually sending
      if (process.env.NODE_ENV === 'test' || process.env.EMAIL_MODE === 'test') {
        console.log('[TEST EMAIL]', {
          to: this.maskEmail(recipient.email),
          subject: template.subject,
          preview: template.text.substring(0, 100)
        });

        return {
          success: true,
          channel: 'email' as any,
          messageId: `test-${Date.now()}`,
          timestamp: new Date()
        };
      }

      // Production mode would use actual SMTP
      // For now, we'll simulate a successful send
      // In real implementation, integrate with Nodemailer or SendGrid
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@shreeom.com',
        to: recipient.email,
        subject: template.subject,
        text: template.text,
        html: template.html
      });

      return {
        success: true,
        channel: 'email' as any,
        messageId: info.messageId,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        channel: 'email' as any,
        error: (error as Error).message,
        timestamp: new Date()
      };
    }
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const maskedLocal = local.length > 2 
      ? `${local.substring(0, 2)}***` 
      : '***';
    return `${maskedLocal}@${domain}`;
  }
}

export const emailProvider = new TestEmailProvider();






