/**
 * SMS Templates
 * 
 * Short message templates for SMS notifications
 */

import { NotificationEvent } from '../notificationTypes';

const getVariable = (variables: Record<string, any>, key: string, defaultValue: string = ''): string => {
  return variables[key]?.toString() || defaultValue;
};

export const smsTemplates: Record<NotificationEvent, (variables: Record<string, any>) => string> = {
  [NotificationEvent.OTP_SENT]: (vars) => 
    `Your Shree Om OTP is ${getVariable(vars, 'otp', '')}. Valid for ${getVariable(vars, 'expiryMinutes', '10')} min. Do not share.`,

  [NotificationEvent.OTP_VERIFIED]: (vars) => 
    `Your OTP has been verified successfully. Welcome to Shree Om!`,

  [NotificationEvent.PASSWORD_RESET_REQUESTED]: (vars) => 
    `Your Shree Om password reset OTP is ${getVariable(vars, 'otp', '')}. Valid for ${getVariable(vars, 'expiryMinutes', '10')} min.`,

  [NotificationEvent.PASSWORD_RESET_SUCCESS]: (vars) => 
    `Your Shree Om password has been reset successfully. If you didn't do this, contact support immediately.`,

  [NotificationEvent.USER_REGISTERED]: (vars) => 
    `Welcome to Shree Om! Your account has been created successfully. Start exploring now.`,

  [NotificationEvent.CONTACT_US_SUBMITTED]: (vars) => 
    `Thank you for contacting Shree Om. We have received your message and will respond soon.`,

  [NotificationEvent.ENQUIRY_SENT]: (vars) => 
    `Your enquiry has been sent to ${getVariable(vars, 'recipientName', 'the recipient')}. You'll be notified when they respond.`,

  [NotificationEvent.ENQUIRY_RESPONSE]: (vars) => 
    `New response to your enquiry from ${getVariable(vars, 'responderName', 'someone')}. Check your app for details.`,

  [NotificationEvent.ADMIN_MESSAGE]: (vars) => 
    `Shree Om: ${getVariable(vars, 'message', 'You have a new message. Check your app for details.')}`,

  [NotificationEvent.PARTNER_APPROVED]: (vars) => 
    `Congratulations! Your Shree Om partner application has been approved. Access your dashboard now.`,

  [NotificationEvent.PARTNER_REJECTED]: (vars) => 
    `Your Shree Om partner application status has been updated. Please check your email or app for details.`,

  [NotificationEvent.DEALER_APPROVED]: (vars) => 
    `Congratulations! Your Shree Om dealer application has been approved. Access your dashboard now.`,

  [NotificationEvent.DEALER_REJECTED]: (vars) => 
    `Your Shree Om dealer application status has been updated. Please check your email or app for details.`,

  [NotificationEvent.SYSTEM_UPDATE]: (vars) => 
    `Shree Om Update: ${getVariable(vars, 'message', 'System update notification. Check app for details.')}`,

  [NotificationEvent.PROMOTIONAL]: (vars) => 
    `Shree Om: ${getVariable(vars, 'message', 'Special offer for you! Check app for details.')}`,

  [NotificationEvent.PAYMENT_SUCCESS]: (vars) => 
    `Shree Om: Payment of ${getVariable(vars, 'amount', '')} for ${getVariable(vars, 'service', 'service')} successful. Payment ID: ${getVariable(vars, 'paymentId', '')}`,

  [NotificationEvent.PAYMENT_FAILED]: (vars) => 
    `Shree Om: Payment of ${getVariable(vars, 'amount', '')} failed. Reason: ${getVariable(vars, 'reason', 'Payment error')}. Please retry.`,

  [NotificationEvent.PAYMENT_PENDING]: (vars) => 
    `Shree Om: Payment of ${getVariable(vars, 'amount', '')} is being processed. You'll be notified once confirmed.`
};

