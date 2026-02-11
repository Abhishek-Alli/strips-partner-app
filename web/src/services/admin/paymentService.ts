/**
 * Admin Payment Service
 * 
 * Service for managing payments in admin panel
 */

import { apiClient } from '../apiClient';
import { logger } from '../../core/logger';
import { PaymentIntent, PaymentFilter, PaymentService } from '@shared/core/payments/paymentTypes';

class AdminPaymentService {
  /**
   * Get all payments
   */
  async getPayments(filter?: PaymentFilter): Promise<{ payments: PaymentIntent[]; total: number }> {
    try {
      if (apiClient.isMockMode()) {
        return {
          payments: [],
          total: 0
        };
      }

      return apiClient.get<{ payments: PaymentIntent[]; total: number }>(
        '/admin/payments',
        { params: filter }
      );
    } catch (error) {
      logger.error('Failed to get payments', error as Error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   */
  async getPayment(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      if (apiClient.isMockMode()) {
        throw new Error('Mock mode: Payment not available');
      }

      return apiClient.get<PaymentIntent>(`/admin/payments/${paymentIntentId}`);
    } catch (error) {
      logger.error('Failed to get payment', error as Error);
      throw error;
    }
  }

  /**
   * Manually grant service access (admin override)
   */
  async grantAccess(userId: string, service: PaymentService): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Access granted (mock)', { userId, service });
        return;
      }

      await apiClient.post('/admin/payments/grant-access', { userId, service });
    } catch (error) {
      logger.error('Failed to grant access', error as Error);
      throw error;
    }
  }
}

export const adminPaymentService = new AdminPaymentService();



