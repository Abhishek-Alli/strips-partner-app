/**
 * Payment Types
 * 
 * Centralized type definitions for payment system
 */

export enum PaymentStatus {
  CREATED = 'created',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export enum PaymentProvider {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe' // Future-ready
}

export enum PaymentService {
  // General User Services
  BUDGET_ESTIMATION_REPORT = 'budget_estimation_report',
  PREMIUM_CALCULATOR = 'premium_calculator',
  VISUALIZATION_SERVICE = 'visualization_service',
  
  // Partner/Dealer Services
  FEATURED_LISTING = 'featured_listing',
  SUBSCRIPTION_BASIC = 'subscription_basic',
  SUBSCRIPTION_PREMIUM = 'subscription_premium'
}

export enum PaymentType {
  ONE_TIME = 'one_time',
  SUBSCRIPTION = 'subscription'
}

export interface PaymentIntent {
  id: string;
  userId: string;
  service: PaymentService;
  amount: number; // Amount in smallest currency unit (paise for INR)
  currency: string; // ISO currency code (e.g., 'INR')
  status: PaymentStatus;
  provider: PaymentProvider;
  providerOrderId?: string;
  providerPaymentId?: string;
  type: PaymentType;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRequest {
  userId: string;
  service: PaymentService;
  amount: number;
  currency?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  paymentIntent: PaymentIntent;
  providerData: {
    orderId?: string;
    keyId?: string;
    amount: number;
    currency: string;
    receipt?: string;
    callbackUrl?: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
  };
}

export interface PaymentCallback {
  paymentIntentId: string;
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
  status: 'success' | 'failed';
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

export interface PaymentReceipt {
  paymentIntent: PaymentIntent;
  invoiceNumber: string;
  paidAt: Date;
  amount: number;
  currency: string;
  service: PaymentService;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface PaymentFilter {
  userId?: string;
  service?: PaymentService;
  status?: PaymentStatus;
  provider?: PaymentProvider;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}






