/**
 * Mobile Payment Service
 * 
 * Client-side payment service for mobile app
 */

import { apiClient } from './apiClient';
import { logger } from '../core/logger';
import { PaymentService, PaymentRequest, PaymentResponse, PaymentIntent, PaymentFilter } from '../../shared/core/payments/paymentTypes';

class MobilePaymentService {
  /**
   * Create payment intent
   */
  async createPaymentIntent(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Payment intent created (mock)', { service: request.service, amount: request.amount });
        return {
          paymentIntent: {
            id: `pi_mock_${Date.now()}`,
            userId: request.userId,
            service: request.service,
            amount: request.amount,
            currency: request.currency || 'INR',
            status: 'pending' as any,
            provider: 'razorpay' as any,
            providerOrderId: `order_mock_${Date.now()}`,
            type: 'one_time' as any,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          providerData: {
            orderId: `order_mock_${Date.now()}`,
            keyId: 'rzp_test_key',
            amount: request.amount,
            currency: request.currency || 'INR',
            receipt: `receipt_${Date.now()}`
          }
        };
      }

      return apiClient.post<PaymentResponse>('/payments/create-intent', request);
    } catch (error) {
      logger.error('Failed to create payment intent', error as Error);
      throw error;
    }
  }

  /**
   * Get payment intent status
   */
  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      if (apiClient.isMockMode()) {
        throw new Error('Mock mode: Payment intent not available');
      }

      return apiClient.get<PaymentIntent>(`/payments/intent/${paymentIntentId}`);
    } catch (error) {
      logger.error('Failed to get payment intent', error as Error);
      throw error;
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(filter?: PaymentFilter): Promise<{ payments: PaymentIntent[]; total: number }> {
    try {
      if (apiClient.isMockMode()) {
        return {
          payments: [],
          total: 0
        };
      }

      return apiClient.get<{ payments: PaymentIntent[]; total: number }>(
        '/payments/history',
        { params: filter }
      );
    } catch (error) {
      logger.error('Failed to get payment history', error as Error);
      throw error;
    }
  }

  /**
   * Check service access
   */
  async checkServiceAccess(service: PaymentService): Promise<boolean> {
    try {
      if (apiClient.isMockMode()) {
        return false; // Mock mode: no access by default
      }

      const response = await apiClient.get<{ hasAccess: boolean }>(`/payments/access/${service}`);
      return response.hasAccess;
    } catch (error) {
      logger.error('Failed to check service access', error as Error);
      return false;
    }
  }

  /**
   * Get payment receipt
   */
  async getPaymentReceipt(paymentIntentId: string): Promise<any> {
    try {
      if (apiClient.isMockMode()) {
        throw new Error('Mock mode: Receipt not available');
      }

      return apiClient.get(`/payments/receipt/${paymentIntentId}`);
    } catch (error) {
      logger.error('Failed to get payment receipt', error as Error);
      throw error;
    }
  }
}

export const mobilePaymentService = new MobilePaymentService();






