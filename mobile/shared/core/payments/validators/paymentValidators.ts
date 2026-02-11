/**
 * Payment Validators
 * 
 * Input validation for payment operations
 */

import { PaymentService, PaymentStatus } from '../paymentTypes';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate payment amount
 */
export function validateAmount(amount: number): ValidationResult {
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  
  if (amount < 100) {
    return { valid: false, error: 'Minimum payment amount is ₹1.00' };
  }
  
  if (amount > 100000000) { // ₹10,00,000.00
    return { valid: false, error: 'Amount exceeds maximum allowed' };
  }
  
  return { valid: true };
}

/**
 * Validate payment service
 */
export function validateService(service: PaymentService): ValidationResult {
  const validServices = Object.values(PaymentService);
  if (!validServices.includes(service)) {
    return { valid: false, error: 'Invalid payment service' };
  }
  
  return { valid: true };
}

/**
 * Validate payment status transition
 */
export function validateStatusTransition(
  currentStatus: PaymentStatus,
  newStatus: PaymentStatus
): ValidationResult {
  const validTransitions: Record<PaymentStatus, PaymentStatus[]> = {
    [PaymentStatus.CREATED]: [PaymentStatus.PENDING, PaymentStatus.CANCELLED],
    [PaymentStatus.PENDING]: [PaymentStatus.SUCCESS, PaymentStatus.FAILED, PaymentStatus.CANCELLED],
    [PaymentStatus.SUCCESS]: [PaymentStatus.REFUNDED],
    [PaymentStatus.FAILED]: [PaymentStatus.CREATED], // Allow retry
    [PaymentStatus.REFUNDED]: [], // Terminal state
    [PaymentStatus.CANCELLED]: [] // Terminal state
  };
  
  const allowedStatuses = validTransitions[currentStatus] || [];
  if (!allowedStatuses.includes(newStatus)) {
    return {
      valid: false,
      error: `Cannot transition from ${currentStatus} to ${newStatus}`
    };
  }
  
  return { valid: true };
}

/**
 * Validate currency code
 */
export function validateCurrency(currency: string): ValidationResult {
  const validCurrencies = ['INR', 'USD', 'EUR'];
  if (!validCurrencies.includes(currency.toUpperCase())) {
    return { valid: false, error: 'Unsupported currency' };
  }
  
  return { valid: true };
}

/**
 * Validate payment callback signature
 */
export function validateCallbackData(callback: {
  paymentIntentId: string;
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
  amount: number;
}): ValidationResult {
  if (!callback.paymentIntentId) {
    return { valid: false, error: 'Payment intent ID is required' };
  }
  
  if (!callback.providerOrderId) {
    return { valid: false, error: 'Provider order ID is required' };
  }
  
  if (!callback.providerPaymentId) {
    return { valid: false, error: 'Provider payment ID is required' };
  }
  
  if (!callback.signature) {
    return { valid: false, error: 'Signature is required' };
  }
  
  if (!callback.amount || callback.amount <= 0) {
    return { valid: false, error: 'Valid amount is required' };
  }
  
  return { valid: true };
}






