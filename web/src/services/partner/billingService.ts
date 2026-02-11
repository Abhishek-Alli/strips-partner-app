/**
 * Partner/Dealer Billing Service
 * 
 * Service for viewing own payment history
 */

import { apiClient } from '../apiClient';
import { logger } from '../../core/logger';
import { PaymentIntent, PaymentFilter } from '@shared/core/payments/paymentTypes';

class BillingService {
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
        '/billing/history',
        { params: filter }
      );
    } catch (error) {
      logger.error('Failed to get payment history', error as Error);
      throw error;
    }
  }

  /**
   * Get payment receipt
   */
  async getReceipt(paymentIntentId: string): Promise<any> {
    try {
      if (apiClient.isMockMode()) {
        throw new Error('Mock mode: Receipt not available');
      }

      return apiClient.get(`/billing/receipt/${paymentIntentId}`);
    } catch (error) {
      logger.error('Failed to get receipt', error as Error);
      throw error;
    }
  }
}

export const billingService = new BillingService();



