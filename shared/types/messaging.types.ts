/**
 * Shared Messaging & Notification Types
 *
 * Data contracts for Notifications, Messages, and Conversations
 */

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType = 'push' | 'email' | 'sms' | 'in_app';

export type NotificationCategory =
  | 'order'
  | 'enquiry'
  | 'feedback'
  | 'offer'
  | 'event'
  | 'loyalty'
  | 'system';

export type DeliveryStatus = 'pending' | 'sent' | 'delivered' | 'failed';

// ============================================================================
// NOTIFICATION
// ============================================================================

export interface Notification {
  id: string;
  userId: string;

  // Content
  title: string;
  body: string;

  // Type & Category
  type: NotificationType;
  category?: NotificationCategory;

  // Action
  actionUrl?: string;
  actionData?: Record<string, any>;

  // Status
  isRead: boolean;
  readAt?: Date;

  // Delivery Status
  isSent: boolean;
  sentAt?: Date;
  deliveryStatus?: DeliveryStatus;

  // Metadata
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface NotificationSummary {
  id: string;
  title: string;
  body: string;
  category?: NotificationCategory;
  isRead: boolean;
  createdAt: Date;
}

// ============================================================================
// NOTIFICATION TEMPLATE
// ============================================================================

export interface NotificationTemplate {
  id: string;
  code: string;
  name: string;

  // Content
  titleTemplate: string;
  bodyTemplate: string;

  // Channels
  sendPush: boolean;
  sendEmail: boolean;
  sendSms: boolean;

  // Email Specific
  emailSubject?: string;
  emailHtmlTemplate?: string;

  // SMS Specific
  smsTemplate?: string;

  // Status
  isActive: boolean;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PUSH TOKEN
// ============================================================================

export interface PushToken {
  id: string;
  userId: string;
  token: string;
  deviceType: 'ios' | 'android' | 'web';
  deviceId?: string;
  deviceName?: string;
  isActive: boolean;
  lastUsedAt?: Date;
  createdAt: Date;
}

export interface RegisterPushTokenRequest {
  token: string;
  deviceType: 'ios' | 'android' | 'web';
  deviceId?: string;
  deviceName?: string;
}

// ============================================================================
// MESSAGE TYPES
// ============================================================================

export type MessageType = 'text' | 'image' | 'file' | 'location' | 'system';

// ============================================================================
// CONVERSATION
// ============================================================================

export interface Conversation {
  id: string;

  // Participants
  participant1Id: string;
  participant2Id: string;

  // Context
  contextType?: 'enquiry' | 'order' | 'general';
  contextId?: string;

  // Status
  isActive: boolean;

  // Last Message Info
  lastMessageId?: string;
  lastMessageAt?: Date;
  lastMessagePreview?: string;

  // Unread Counts
  participant1Unread: number;
  participant2Unread: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationWithParticipant extends Conversation {
  // Other participant info (for display)
  otherParticipant: {
    id: string;
    name: string;
    avatarUrl?: string;
    role: string;
    isOnline?: boolean;
  };
  unreadCount: number;
}

// ============================================================================
// MESSAGE
// ============================================================================

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;

  // Content
  messageType: MessageType;
  content?: string;

  // Media
  mediaUrl?: string;
  mediaType?: string;
  mediaSize?: number;

  // Location (for location messages)
  latitude?: number;
  longitude?: number;
  locationName?: string;

  // Status
  isRead: boolean;
  readAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;

  // Metadata
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface MessageWithSender extends Message {
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

// ============================================================================
// CREATE MESSAGE REQUESTS
// ============================================================================

export interface StartConversationRequest {
  participantId: string;
  contextType?: 'enquiry' | 'order' | 'general';
  contextId?: string;
  initialMessage?: string;
}

export interface SendMessageRequest {
  conversationId: string;
  messageType: MessageType;
  content?: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaSize?: number;
  latitude?: number;
  longitude?: number;
  locationName?: string;
}

// ============================================================================
// MARK AS READ
// ============================================================================

export interface MarkMessagesReadRequest {
  conversationId: string;
  messageIds?: string[]; // If not provided, mark all as read
}

// ============================================================================
// NOTIFICATION REQUESTS
// ============================================================================

export interface SendNotificationRequest {
  userId?: string;
  userIds?: string[];
  role?: string; // Send to all users of a role

  // Content
  title: string;
  body: string;
  category?: NotificationCategory;

  // Channels
  sendPush?: boolean;
  sendEmail?: boolean;
  sendSms?: boolean;

  // Action
  actionUrl?: string;
  actionData?: Record<string, any>;

  // Metadata
  metadata?: Record<string, any>;
}

export interface SendTemplatedNotificationRequest {
  userId?: string;
  userIds?: string[];
  role?: string;

  // Template
  templateCode: string;
  variables: Record<string, string>;

  // Action
  actionUrl?: string;
  actionData?: Record<string, any>;
}

// ============================================================================
// NOTIFICATION FILTERS
// ============================================================================

export interface NotificationFilters {
  isRead?: boolean;
  category?: NotificationCategory;
  fromDate?: Date;
  toDate?: Date;
}

// ============================================================================
// REAL-TIME EVENTS
// ============================================================================

export interface NewMessageEvent {
  type: 'new_message';
  conversationId: string;
  message: MessageWithSender;
}

export interface MessageReadEvent {
  type: 'message_read';
  conversationId: string;
  messageIds: string[];
  readBy: string;
}

export interface TypingEvent {
  type: 'typing';
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface NewNotificationEvent {
  type: 'new_notification';
  notification: NotificationSummary;
}

export type RealtimeEvent =
  | NewMessageEvent
  | MessageReadEvent
  | TypingEvent
  | NewNotificationEvent;
