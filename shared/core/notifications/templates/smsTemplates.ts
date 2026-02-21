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
    `Your SRJ OTP is ${getVariable(vars, 'otp', '')}. Valid for ${getVariable(vars, 'expiryMinutes', '10')} min. Do not share.`,

  [NotificationEvent.OTP_VERIFIED]: (_vars) =>
    `Your OTP has been verified successfully. Welcome to SRJ!`,

  [NotificationEvent.PASSWORD_RESET_REQUESTED]: (vars) => 
    `Your SRJ password reset OTP is ${getVariable(vars, 'otp', '')}. Valid for ${getVariable(vars, 'expiryMinutes', '10')} min.`,

  [NotificationEvent.PASSWORD_RESET_SUCCESS]: (_vars) =>
    `Your SRJ password has been reset successfully. If you didn't do this, contact support immediately.`,

  [NotificationEvent.USER_REGISTERED]: (_vars) =>
    `Welcome to SRJ! Your account has been created successfully. Start exploring now.`,

  [NotificationEvent.CONTACT_US_SUBMITTED]: (_vars) =>
    `Thank you for contacting SRJ. We have received your message and will respond soon.`,

  [NotificationEvent.ENQUIRY_SENT]: (vars) => 
    `Your enquiry has been sent to ${getVariable(vars, 'recipientName', 'the recipient')}. You'll be notified when they respond.`,

  [NotificationEvent.ENQUIRY_RESPONSE]: (vars) => 
    `New response to your enquiry from ${getVariable(vars, 'responderName', 'someone')}. Check your app for details.`,

  [NotificationEvent.ADMIN_MESSAGE]: (vars) => 
    `SRJ: ${getVariable(vars, 'message', 'You have a new message. Check your app for details.')}`,

  [NotificationEvent.PARTNER_APPROVED]: (_vars) =>
    `Congratulations! Your SRJ partner application has been approved. Access your dashboard now.`,

  [NotificationEvent.PARTNER_REJECTED]: (_vars) =>
    `Your SRJ partner application status has been updated. Please check your email or app for details.`,

  [NotificationEvent.DEALER_APPROVED]: (_vars) =>
    `Congratulations! Your SRJ dealer application has been approved. Access your dashboard now.`,

  [NotificationEvent.DEALER_REJECTED]: (_vars) =>
    `Your SRJ dealer application status has been updated. Please check your email or app for details.`,

  [NotificationEvent.SYSTEM_UPDATE]: (vars) => 
    `SRJ Update: ${getVariable(vars, 'message', 'System update notification. Check app for details.')}`,

  [NotificationEvent.PROMOTIONAL]: (vars) => 
    `SRJ: ${getVariable(vars, 'message', 'Special offer for you! Check app for details.')}`,

  [NotificationEvent.PAYMENT_SUCCESS]: (vars) => 
    `SRJ: Payment of ${getVariable(vars, 'amount', '')} for ${getVariable(vars, 'service', 'service')} successful. Payment ID: ${getVariable(vars, 'paymentId', '')}`,

  [NotificationEvent.PAYMENT_FAILED]: (vars) => 
    `SRJ: Payment of ${getVariable(vars, 'amount', '')} failed. Reason: ${getVariable(vars, 'reason', 'Payment error')}. Please retry.`,

  [NotificationEvent.PAYMENT_PENDING]: (vars) => 
    `SRJ: Payment of ${getVariable(vars, 'amount', '')} is being processed. You'll be notified once confirmed.`
};

