import { apiClient } from './apiClient';
import { mockService } from './mock/mockService';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  customer: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  amount: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Dealer Service
 * 
 * Handles dealer-specific API calls
 * Supports mock mode via environment variable
 */
class DealerService {
  /**
   * Get assigned customers with pagination
   */
  async getCustomers(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Customer>> {
    if (apiClient.isMockMode()) {
      return mockService.getDealerCustomers(page, limit);
    }

    return apiClient.get<PaginatedResponse<Customer>>('/dealer/customers', {
      params: { page, limit }
    });
  }

  /**
   * Get orders with pagination
   */
  async getOrders(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Order>> {
    if (apiClient.isMockMode()) {
      return mockService.getDealerOrders(page, limit);
    }

    return apiClient.get<PaginatedResponse<Order>>('/dealer/orders', {
      params: { page, limit }
    });
  }

  /**
   * Create new order
   */
  async createOrder(data: Partial<Order>): Promise<{ order: Order }> {
    if (apiClient.isMockMode()) {
      // Mock implementation
      const newOrder: Order = {
        id: String(Date.now()),
        customer: data.customer || 'Customer',
        status: 'pending',
        amount: data.amount || '₹0',
        createdAt: new Date().toISOString()
      };
      return { order: newOrder };
    }

    return apiClient.post<{ order: Order }>('/dealer/orders', data);
  }

  /**
   * Update order status
   */
  async updateOrder(id: string, status: Order['status']): Promise<{ order: Order }> {
    if (apiClient.isMockMode()) {
      // Mock implementation
      const order: Order = {
        id,
        customer: 'Customer',
        status,
        amount: '₹0',
        createdAt: new Date().toISOString()
      };
      return { order };
    }

    return apiClient.patch<{ order: Order }>(`/dealer/orders/${id}`, { status });
  }
}

export const dealerService = new DealerService();






