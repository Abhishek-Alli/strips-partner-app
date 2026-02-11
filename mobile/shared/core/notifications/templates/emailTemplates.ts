/**
 * Email Templates
 * 
 * HTML and text templates for email notifications
 */

import { NotificationEvent } from '../notificationTypes';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

const getVariable = (variables: Record<string, any>, key: string, defaultValue: string = ''): string => {
  return variables[key]?.toString() || defaultValue;
};

export const emailTemplates: Record<NotificationEvent, (variables: Record<string, any>) => EmailTemplate> = {
  [NotificationEvent.USER_REGISTERED]: (vars) => ({
    subject: 'Welcome to Shree Om!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007AFF; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Shree Om!</h1>
          </div>
          <div class="content">
            <p>Hello ${getVariable(vars, 'name', 'User')},</p>
            <p>Thank you for registering with Shree Om. Your account has been successfully created.</p>
            <p>You can now explore our platform and connect with partners and dealers.</p>
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Shree Om. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to Shree Om!\n\nHello ${getVariable(vars, 'name', 'User')},\n\nThank you for registering with Shree Om. Your account has been successfully created.\n\nYou can now explore our platform and connect with partners and dealers.\n\nIf you have any questions, feel free to contact our support team.\n\n© ${new Date().getFullYear()} Shree Om. All rights reserved.`
  }),

  [NotificationEvent.OTP_SENT]: (vars) => ({
    subject: 'Your OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>OTP Verification Code</h2>
        <p>Hello ${getVariable(vars, 'name', 'User')},</p>
        <p>Your OTP code is: <strong style="font-size: 24px; color: #007AFF;">${getVariable(vars, 'otp', '')}</strong></p>
        <p>This code will expire in ${getVariable(vars, 'expiryMinutes', '10')} minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `,
    text: `OTP Verification Code\n\nHello ${getVariable(vars, 'name', 'User')},\n\nYour OTP code is: ${getVariable(vars, 'otp', '')}\n\nThis code will expire in ${getVariable(vars, 'expiryMinutes', '10')} minutes.\n\nIf you didn't request this code, please ignore this email.`
  }),

  [NotificationEvent.OTP_VERIFIED]: (vars) => ({
    subject: 'OTP Verified Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>OTP Verified</h2>
        <p>Hello ${getVariable(vars, 'name', 'User')},</p>
        <p>Your OTP has been verified successfully.</p>
        <p>Your account is now active and ready to use.</p>
      </div>
    `,
    text: `OTP Verified\n\nHello ${getVariable(vars, 'name', 'User')},\n\nYour OTP has been verified successfully.\n\nYour account is now active and ready to use.`
  }),

  [NotificationEvent.PASSWORD_RESET_REQUESTED]: (vars) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Hello ${getVariable(vars, 'name', 'User')},</p>
        <p>We received a request to reset your password.</p>
        <p>Your OTP code is: <strong style="font-size: 24px; color: #007AFF;">${getVariable(vars, 'otp', '')}</strong></p>
        <p>This code will expire in ${getVariable(vars, 'expiryMinutes', '10')} minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
    text: `Password Reset Request\n\nHello ${getVariable(vars, 'name', 'User')},\n\nWe received a request to reset your password.\n\nYour OTP code is: ${getVariable(vars, 'otp', '')}\n\nThis code will expire in ${getVariable(vars, 'expiryMinutes', '10')} minutes.\n\nIf you didn't request this, please ignore this email.`
  }),

  [NotificationEvent.PASSWORD_RESET_SUCCESS]: (vars) => ({
    subject: 'Password Reset Successful',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Successful</h2>
        <p>Hello ${getVariable(vars, 'name', 'User')},</p>
        <p>Your password has been reset successfully.</p>
        <p>If you didn't make this change, please contact support immediately.</p>
      </div>
    `,
    text: `Password Reset Successful\n\nHello ${getVariable(vars, 'name', 'User')},\n\nYour password has been reset successfully.\n\nIf you didn't make this change, please contact support immediately.`
  }),

  [NotificationEvent.CONTACT_US_SUBMITTED]: (vars) => ({
    subject: 'Thank you for contacting us',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Thank you for contacting us</h2>
        <p>Hello ${getVariable(vars, 'name', 'User')},</p>
        <p>We have received your message and will get back to you soon.</p>
        <p><strong>Subject:</strong> ${getVariable(vars, 'subject', '')}</p>
        <p><strong>Message:</strong> ${getVariable(vars, 'message', '')}</p>
      </div>
    `,
    text: `Thank you for contacting us\n\nHello ${getVariable(vars, 'name', 'User')},\n\nWe have received your message and will get back to you soon.\n\nSubject: ${getVariable(vars, 'subject', '')}\nMessage: ${getVariable(vars, 'message', '')}`
  }),

  [NotificationEvent.ENQUIRY_SENT]: (vars) => ({
    subject: 'Enquiry Sent Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Enquiry Sent</h2>
        <p>Hello ${getVariable(vars, 'name', 'User')},</p>
        <p>Your enquiry has been sent to ${getVariable(vars, 'recipientName', 'the recipient')}.</p>
        <p><strong>Topic:</strong> ${getVariable(vars, 'topic', '')}</p>
        <p>You will be notified when they respond.</p>
      </div>
    `,
    text: `Enquiry Sent\n\nHello ${getVariable(vars, 'name', 'User')},\n\nYour enquiry has been sent to ${getVariable(vars, 'recipientName', 'the recipient')}.\n\nTopic: ${getVariable(vars, 'topic', '')}\n\nYou will be notified when they respond.`
  }),

  [NotificationEvent.ENQUIRY_RESPONSE]: (vars) => ({
    subject: 'New Response to Your Enquiry',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Response to Your Enquiry</h2>
        <p>Hello ${getVariable(vars, 'name', 'User')},</p>
        <p>${getVariable(vars, 'responderName', 'Someone')} has responded to your enquiry.</p>
        <p><strong>Response:</strong></p>
        <p>${getVariable(vars, 'response', '')}</p>
        <p><a href="${getVariable(vars, 'link', '#')}">View Enquiry</a></p>
      </div>
    `,
    text: `New Response to Your Enquiry\n\nHello ${getVariable(vars, 'name', 'User')},\n\n${getVariable(vars, 'responderName', 'Someone')} has responded to your enquiry.\n\nResponse: ${getVariable(vars, 'response', '')}\n\nView Enquiry: ${getVariable(vars, 'link', '#')}`
  }),

  [NotificationEvent.ADMIN_MESSAGE]: (vars) => ({
    subject: getVariable(vars, 'subject', 'Message from Admin'),
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${getVariable(vars, 'title', 'Message from Admin')}</h2>
        <p>Hello ${getVariable(vars, 'name', 'User')},</p>
        <p>${getVariable(vars, 'message', '')}</p>
      </div>
    `,
    text: `${getVariable(vars, 'title', 'Message from Admin')}\n\nHello ${getVariable(vars, 'name', 'User')},\n\n${getVariable(vars, 'message', '')}`
  }),

  [NotificationEvent.PARTNER_APPROVED]: (vars) => ({
    subject: 'Partner Application Approved',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Congratulations!</h2>
        <p>Hello ${getVariable(vars, 'name', 'Partner')},</p>
        <p>Your partner application has been approved.</p>
        <p>You can now access your partner dashboard and start managing your profile.</p>
      </div>
    `,
    text: `Partner Application Approved\n\nHello ${getVariable(vars, 'name', 'Partner')},\n\nYour partner application has been approved.\n\nYou can now access your partner dashboard.`
  }),

  [NotificationEvent.PARTNER_REJECTED]: (vars) => ({
    subject: 'Partner Application Status',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Application Status Update</h2>
        <p>Hello ${getVariable(vars, 'name', 'Partner')},</p>
        <p>Unfortunately, your partner application could not be approved at this time.</p>
        ${getVariable(vars, 'reason', '') ? `<p><strong>Reason:</strong> ${getVariable(vars, 'reason', '')}</p>` : ''}
        <p>Please contact support if you have any questions.</p>
      </div>
    `,
    text: `Application Status Update\n\nHello ${getVariable(vars, 'name', 'Partner')},\n\nUnfortunately, your partner application could not be approved at this time.\n\n${getVariable(vars, 'reason', '') ? `Reason: ${getVariable(vars, 'reason', '')}\n\n` : ''}Please contact support if you have any questions.`
  }),

  [NotificationEvent.DEALER_APPROVED]: (vars) => ({
    subject: 'Dealer Application Approved',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Congratulations!</h2>
        <p>Hello ${getVariable(vars, 'name', 'Dealer')},</p>
        <p>Your dealer application has been approved.</p>
        <p>You can now access your dealer dashboard and start managing your profile.</p>
      </div>
    `,
    text: `Dealer Application Approved\n\nHello ${getVariable(vars, 'name', 'Dealer')},\n\nYour dealer application has been approved.\n\nYou can now access your dealer dashboard.`
  }),

  [NotificationEvent.DEALER_REJECTED]: (vars) => ({
    subject: 'Dealer Application Status',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Application Status Update</h2>
        <p>Hello ${getVariable(vars, 'name', 'Dealer')},</p>
        <p>Unfortunately, your dealer application could not be approved at this time.</p>
        ${getVariable(vars, 'reason', '') ? `<p><strong>Reason:</strong> ${getVariable(vars, 'reason', '')}</p>` : ''}
        <p>Please contact support if you have any questions.</p>
      </div>
    `,
    text: `Application Status Update\n\nHello ${getVariable(vars, 'name', 'Dealer')},\n\nUnfortunately, your dealer application could not be approved at this time.\n\n${getVariable(vars, 'reason', '') ? `Reason: ${getVariable(vars, 'reason', '')}\n\n` : ''}Please contact support if you have any questions.`
  }),

  [NotificationEvent.SYSTEM_UPDATE]: (vars) => ({
    subject: getVariable(vars, 'subject', 'System Update'),
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${getVariable(vars, 'title', 'System Update')}</h2>
        <p>Hello ${getVariable(vars, 'name', 'User')},</p>
        <p>${getVariable(vars, 'message', '')}</p>
      </div>
    `,
    text: `${getVariable(vars, 'title', 'System Update')}\n\nHello ${getVariable(vars, 'name', 'User')},\n\n${getVariable(vars, 'message', '')}`
  }),

  [NotificationEvent.PROMOTIONAL]: (vars) => ({
    subject: getVariable(vars, 'subject', 'Special Offer'),
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${getVariable(vars, 'title', 'Special Offer')}</h2>
        <p>Hello ${getVariable(vars, 'name', 'User')},</p>
        <p>${getVariable(vars, 'message', '')}</p>
      </div>
    `,
    text: `${getVariable(vars, 'title', 'Special Offer')}\n\nHello ${getVariable(vars, 'name', 'User')},\n\n${getVariable(vars, 'message', '')}`
  }),

  [NotificationEvent.PAYMENT_SUCCESS]: (vars) => ({
    subject: 'Payment Successful',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Payment Successful</h2>
        <p>Hello ${getVariable(vars, 'name', 'User')},</p>
        <p>Your payment of <strong>${getVariable(vars, 'amount', '')}</strong> for <strong>${getVariable(vars, 'service', '')}</strong> has been processed successfully.</p>
        <p>Payment ID: ${getVariable(vars, 'paymentId', '')}</p>
        <p>You now have access to the purchased service.</p>
        <p><a href="${getVariable(vars, 'link', '#')}">View Payment Details</a></p>
      </div>
    `,
    text: `Payment Successful\n\nHello ${getVariable(vars, 'name', 'User')},\n\nYour payment of ${getVariable(vars, 'amount', '')} for ${getVariable(vars, 'service', '')} has been processed successfully.\n\nPayment ID: ${getVariable(vars, 'paymentId', '')}\n\nYou now have access to the purchased service.`
  }),

  [NotificationEvent.PAYMENT_FAILED]: (vars) => ({
    subject: 'Payment Failed',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Payment Failed</h2>
        <p>Hello ${getVariable(vars, 'name', 'User')},</p>
        <p>Unfortunately, your payment of <strong>${getVariable(vars, 'amount', '')}</strong> for <strong>${getVariable(vars, 'service', '')}</strong> could not be processed.</p>
        <p>Reason: ${getVariable(vars, 'reason', 'Payment gateway error')}</p>
        <p>Please try again or contact support if the issue persists.</p>
        <p><a href="${getVariable(vars, 'link', '#')}">Retry Payment</a></p>
      </div>
    `,
    text: `Payment Failed\n\nHello ${getVariable(vars, 'name', 'User')},\n\nUnfortunately, your payment of ${getVariable(vars, 'amount', '')} for ${getVariable(vars, 'service', '')} could not be processed.\n\nReason: ${getVariable(vars, 'reason', 'Payment gateway error')}\n\nPlease try again or contact support.`
  }),

  [NotificationEvent.PAYMENT_PENDING]: (vars) => ({
    subject: 'Payment Pending',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Payment Pending</h2>
        <p>Hello ${getVariable(vars, 'name', 'User')},</p>
        <p>Your payment of <strong>${getVariable(vars, 'amount', '')}</strong> for <strong>${getVariable(vars, 'service', '')}</strong> is being processed.</p>
        <p>We will notify you once the payment is confirmed.</p>
      </div>
    `,
    text: `Payment Pending\n\nHello ${getVariable(vars, 'name', 'User')},\n\nYour payment of ${getVariable(vars, 'amount', '')} for ${getVariable(vars, 'service', '')} is being processed.\n\nWe will notify you once the payment is confirmed.`
  })
};

