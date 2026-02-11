/**
 * Payment Service
 * 
 * Centralized payment service
 * Provider-agnostic payment processing
 */

import {
  PaymentRequest,
  PaymentResponse,
  PaymentCallback,
  PaymentIntent,
  PaymentStatus,
  PaymentProvider,
  PaymentFilter
} from './paymentTypes';
import { validateAmount, validateService, validateStatusTransition } from './validators/paymentValidators';
import { getServicePricing } from './paymentConstants';
import { createRazorpayProvider } from './providers/razorpayProvider';

export class PaymentService {
  private razorpayProvider = createRazorpayProvider();
  private paymentIntents: Map<string, PaymentIntent> = new Map();

  /**
   * Create payment intent
   */
  async createPaymentIntent(request: PaymentRequest): Promise<PaymentResponse> {
    // Validate request
    const serviceValidation = validateService(request.service);
    if (!serviceValidation.valid) {
      throw new Error(serviceValidation.error);
    }

    // Get service pricing
    const pricing = getServicePricing(request.service);
    
    // Use pricing amount if not provided
    const amount = request.amount || pricing.amount;
    
    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) {
      throw new Error(amountValidation.error);
    }

    // Create payment intent
    const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const paymentIntent: PaymentIntent = {
      id: paymentIntentId,
      userId: request.userId,
      service: request.service,
      amount,
      currency: request.currency || pricing.currency,
      status: PaymentStatus.CREATED,
      provider: PaymentProvider.RAZORPAY, // Default provider
      type: pricing.type === 'one_time' ? 'one_time' as any : 'subscription' as any,
      metadata: request.metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store payment intent
    this.paymentIntents.set(paymentIntentId, paymentIntent);

    // Create provider order
    const providerResponse = await this.razorpayProvider.createOrder({
      userId: request.userId,
      service: request.service,
      amount,
      currency: request.currency || pricing.currency,
      metadata: request.metadata
    });

    // Update payment intent with provider order ID
    paymentIntent.providerOrderId = providerResponse.providerData.orderId;
    paymentIntent.status = PaymentStatus.PENDING;
    paymentIntent.updatedAt = new Date();
    this.paymentIntents.set(paymentIntentId, paymentIntent);

    return {
      paymentIntent,
      providerData: providerResponse.providerData
    };
  }

  /**
   * Handle payment callback
   */
  async handleCallback(callback: PaymentCallback): Promise<PaymentIntent> {
    // Get payment intent
    const paymentIntent = this.paymentIntents.get(callback.paymentIntentId);
    if (!paymentIntent) {
      throw new Error('Payment intent not found');
    }

    // Verify signature
    const isValid = this.razorpayProvider.verifySignature(callback);
    if (!isValid) {
      throw new Error('Invalid payment signature');
    }

    // Validate amount matches
    if (callback.amount !== paymentIntent.amount) {
      throw new Error('Payment amount mismatch');
    }

    // Update payment intent status
    const newStatus = callback.status === 'success' 
      ? PaymentStatus.SUCCESS 
      : PaymentStatus.FAILED;

    const statusValidation = validateStatusTransition(paymentIntent.status, newStatus);
    if (!statusValidation.valid) {
      throw new Error(statusValidation.error);
    }

    paymentIntent.status = newStatus;
    paymentIntent.providerPaymentId = callback.providerPaymentId;
    paymentIntent.updatedAt = new Date();
    this.paymentIntents.set(callback.paymentIntentId, paymentIntent);

    return paymentIntent;
  }

  /**
   * Get payment intent
   */
  getPaymentIntent(paymentIntentId: string): PaymentIntent | undefined {
    return this.paymentIntents.get(paymentIntentId);
  }

  /**
   * Get payment intents by filter
   */
  getPaymentIntents(filter: PaymentFilter = {}): PaymentIntent[] {
    let results = Array.from(this.paymentIntents.values());

    // Apply filters
    if (filter.userId) {
      results = results.filter(pi => pi.userId === filter.userId);
    }

    if (filter.service) {
      results = results.filter(pi => pi.service === filter.service);
    }

    if (filter.status) {
      results = results.filter(pi => pi.status === filter.status);
    }

    if (filter.provider) {
      results = results.filter(pi => pi.provider === filter.provider);
    }

    if (filter.startDate) {
      results = results.filter(pi => pi.createdAt >= filter.startDate!);
    }

    if (filter.endDate) {
      results = results.filter(pi => pi.createdAt <= filter.endDate!);
    }

    // Sort by date (newest first)
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    if (filter.offset) {
      results = results.slice(filter.offset);
    }

    if (filter.limit) {
      results = results.slice(0, filter.limit);
    }

    return results;
  }

  /**
   * Check if user has access to paid service
   */
  hasServiceAccess(userId: string, service: PaymentService): boolean {
    const payments = this.getPaymentIntents({
      userId,
      service,
      status: PaymentStatus.SUCCESS
    });

    if (payments.length === 0) {
      return false;
    }

    // For one-time payments, check if payment exists
    // For subscriptions, check if still valid (would need expiry check)
    const latestPayment = payments[0];
    
    // TODO: Add subscription expiry check
    return latestPayment.status === PaymentStatus.SUCCESS;
  }
}

export const paymentService = new PaymentService();






