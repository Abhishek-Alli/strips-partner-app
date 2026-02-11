/**
 * Payment Constants
 * 
 * Configurable pricing and payment settings
 */

import { PaymentService } from './paymentTypes';

export interface ServicePricing {
  service: PaymentService;
  amount: number; // Amount in paise (smallest INR unit)
  currency: string;
  name: string;
  description: string;
  type: 'one_time' | 'subscription';
  durationDays?: number; // For subscriptions
}

/**
 * Default service pricing (can be overridden by admin)
 */
export const DEFAULT_SERVICE_PRICING: Record<PaymentService, ServicePricing> = {
  [PaymentService.BUDGET_ESTIMATION_REPORT]: {
    service: PaymentService.BUDGET_ESTIMATION_REPORT,
    amount: 50000, // ₹500.00
    currency: 'INR',
    name: 'Budget Estimation Report',
    description: 'Detailed budget estimation report with cost breakdown',
    type: 'one_time'
  },
  [PaymentService.PREMIUM_CALCULATOR]: {
    service: PaymentService.PREMIUM_CALCULATOR,
    amount: 100000, // ₹1,000.00
    currency: 'INR',
    name: 'Premium Calculator Access',
    description: 'Unlimited access to premium construction calculators',
    type: 'one_time'
  },
  [PaymentService.VISUALIZATION_SERVICE]: {
    service: PaymentService.VISUALIZATION_SERVICE,
    amount: 250000, // ₹2,500.00
    currency: 'INR',
    name: 'VR/3D Visualization Service',
    description: 'Professional VR/3D visualization of your construction project',
    type: 'one_time'
  },
  [PaymentService.FEATURED_LISTING]: {
    service: PaymentService.FEATURED_LISTING,
    amount: 500000, // ₹5,000.00
    currency: 'INR',
    name: 'Featured Listing',
    description: 'Feature your profile prominently for 30 days',
    type: 'one_time',
    durationDays: 30
  },
  [PaymentService.SUBSCRIPTION_BASIC]: {
    service: PaymentService.SUBSCRIPTION_BASIC,
    amount: 1000000, // ₹10,000.00
    currency: 'INR',
    name: 'Basic Subscription',
    description: 'Basic subscription plan with essential features',
    type: 'subscription',
    durationDays: 30
  },
  [PaymentService.SUBSCRIPTION_PREMIUM]: {
    service: PaymentService.SUBSCRIPTION_PREMIUM,
    amount: 2000000, // ₹20,000.00
    currency: 'INR',
    name: 'Premium Subscription',
    description: 'Premium subscription plan with all features',
    type: 'subscription',
    durationDays: 30
  }
};

/**
 * Get service pricing
 */
export function getServicePricing(service: PaymentService): ServicePricing {
  return DEFAULT_SERVICE_PRICING[service];
}

/**
 * Format amount for display
 */
export function formatAmount(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    const rupees = amount / 100;
    return `₹${rupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${(amount / 100).toFixed(2)} ${currency}`;
}






