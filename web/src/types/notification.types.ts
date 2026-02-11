/**
 * Notification Types
 * 
 * Local definitions for notification system
 * (Re-exported from shared for Vite compatibility)
 */

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app'
}

export enum NotificationEvent {
  // Auth Events
  USER_REGISTERED = 'user_registered',
  OTP_SENT = 'otp_sent',
  OTP_VERIFIED = 'otp_verified',
  PASSWORD_RESET_REQUESTED = 'password_reset_requested',
  PASSWORD_RESET_SUCCESS = 'password_reset_success',
  
  // Contact & Enquiry Events
  CONTACT_US_SUBMITTED = 'contact_us_submitted',
  ENQUIRY_SENT = 'enquiry_sent',
  ENQUIRY_RESPONSE = 'enquiry_response',
  
  // Admin Events
  ADMIN_MESSAGE = 'admin_message',
  PARTNER_APPROVED = 'partner_approved',
  PARTNER_REJECTED = 'partner_rejected',
  DEALER_APPROVED = 'dealer_approved',
  DEALER_REJECTED = 'dealer_rejected',
  
  // Payment Events
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  PAYMENT_PENDING = 'payment_pending',
  
  // General
  SYSTEM_UPDATE = 'system_update',
  PROMOTIONAL = 'promotional'
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface NotificationRecipient {
  userId?: string;
  email?: string;
  phone?: string;
  pushToken?: string;
  role?: string;
}

export interface NotificationTemplate {
  subject?: string;
  title: string;
  message: string;
  htmlTemplate?: string;
  variables?: Record<string, any>;
}

export interface NotificationPayload {
  event: NotificationEvent;
  channel: NotificationChannel[];
  recipient: NotificationRecipient;
  template: NotificationTemplate;
  priority?: NotificationPriority;
  metadata?: Record<string, any>;
}

export interface NotificationResult {
  success: boolean;
  channel: NotificationChannel;
  messageId?: string;
  error?: string;
  timestamp: Date;
}

export interface NotificationLog {
  id: string;
  event: NotificationEvent;
  channel: NotificationChannel;
  recipient: NotificationRecipient;
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  result?: NotificationResult;
  createdAt: Date;
  sentAt?: Date;
  error?: string;
}

export interface NotificationPreferences {
  userId: string;
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
