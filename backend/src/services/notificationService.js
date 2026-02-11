/**
 * Backend Notification Service
 * 
 * Integrates with shared notification service
 * Handles notification sending from backend
 */

// Note: In a real implementation, this would import from shared/core/notifications
// For now, we'll create a simplified version for backend integration

// Placeholder notification types (will be replaced with shared types later)
const NotificationEvent = {
  OTP_SENT: 'otp_sent',
  OTP_VERIFIED: 'otp_verified',
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  ENQUIRY_RESPONSE: 'enquiry_response',
  ADMIN_MESSAGE: 'admin_message',
  PARTNER_APPROVED: 'partner_approved',
  DEALER_APPROVED: 'dealer_approved',
};

const NotificationChannel = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  IN_APP: 'in_app',
};

/**
 * Send notification helper
 */
async function sendNotification(event, recipient, variables = {}) {
  try {
    // Determine channels based on event type
    const channels = [];
    
    // Email for most events
    if (recipient.email) {
      channels.push(NotificationChannel.EMAIL);
    }
    
    // SMS for OTP events
    if ([
      NotificationEvent.OTP_SENT,
      NotificationEvent.OTP_VERIFIED,
      NotificationEvent.PASSWORD_RESET_REQUESTED
    ].includes(event) && recipient.phone) {
      channels.push(NotificationChannel.SMS);
    }
    
    // Push for important events
    if ([
      NotificationEvent.ENQUIRY_RESPONSE,
      NotificationEvent.ADMIN_MESSAGE,
      NotificationEvent.PARTNER_APPROVED,
      NotificationEvent.DEALER_APPROVED
    ].includes(event) && recipient.pushToken) {
      channels.push(NotificationChannel.PUSH);
    }
    
    // In-app for all events
    channels.push(NotificationChannel.IN_APP);

    const payload = {
      event,
      channel: channels,
      recipient,
      template: {
        title: variables.title || '',
        message: variables.message || '',
        variables: {
          ...variables,
          name: recipient.name || recipient.email || 'User'
        }
      },
      metadata: variables
    };

    // Send notification (non-blocking)
    notificationService.send(payload).catch(error => {
      console.error('Notification failed (non-blocking):', error);
    });

    return { success: true };
  } catch (error) {
    console.error('Notification error:', error);
    // Fail silently - don't block main flow
    return { success: false, error: error.message };
  }
}

export {
  sendNotification,
  NotificationEvent,
  NotificationChannel
};


