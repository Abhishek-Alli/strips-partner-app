/**
 * Mock Service Layer
 * 
 * Provides mock implementations that match real API structure
 * Toggle via VITE_USE_MOCK environment variable
 */

import { delay, paginate, searchItems, mockUsers, mockDashboardStats } from './mockData';
import { User } from '../../types/auth.types';

export interface MockServiceConfig {
  delay?: number;
  shouldFail?: boolean;
  failRate?: number; // 0-1, probability of failure
}

class MockService {
  private config: MockServiceConfig;

  constructor(config: MockServiceConfig = {}) {
    this.config = {
      delay: 500,
      shouldFail: false,
      failRate: 0,
      ...config
    };
  }

  private async simulateRequest<T>(data: T): Promise<T> {
    await delay(this.config.delay);

    // Simulate random failures
    if (this.config.failRate && Math.random() < this.config.failRate) {
      throw {
        code: 'MOCK_ERROR',
        message: 'Simulated error for testing',
        status: 500
      };
    }

    if (this.config.shouldFail) {
      throw {
        code: 'MOCK_ERROR',
        message: 'Mock service configured to fail',
        status: 500
      };
    }

    return data;
  }

  // Helper to generate mock JWT tokens
  private generateMockToken(userId: string, email: string): string {
    const expiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: userId, email, exp: expiry }));
    const signature = btoa('mock_signature');
    return `${header}.${payload}.${signature}`;
  }

  // Auth mocks
  async login(email: string, password: string) {
    const user = mockUsers.find((u) => u.email === email);
    if (!user || password !== 'password123') {
      throw {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        status: 401
      };
    }

    const token = this.generateMockToken(user.id, user.email);
    return this.simulateRequest({
      user,
      accessToken: token,
      refreshToken: token
    });
  }

  async getCurrentUser() {
    return this.simulateRequest({
      user: mockUsers[0]
    });
  }

  // Synchronous getter for mock users (for OTP verification etc.)
  getMockUsers(): User[] {
    return mockUsers;
  }

  // User mocks
  async getUsers(page: number = 1, limit: number = 10, search: string = '') {
    let filtered = searchItems(mockUsers, search, ['name', 'email']);
    const result = paginate(filtered, page, limit);

    return this.simulateRequest({
      users: result.items as User[],
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages
      }
    }) as Promise<{ users: User[]; pagination: { page: number; limit: number; total: number; pages: number } }>;
  }

  async getUserById(id: string) {
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw {
        code: 'NOT_FOUND',
        message: 'User not found',
        status: 404
      };
    }

    return this.simulateRequest({ user });
  }

  async createUser(data: any) {
    const newUser: User = {
      id: String(mockUsers.length + 1),
      ...data,
      is_active: true
    };
    mockUsers.push(newUser);

    return this.simulateRequest({ user: newUser });
  }

  async updateUser(id: string, data: any) {
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      throw {
        code: 'NOT_FOUND',
        message: 'User not found',
        status: 404
      };
    }

    mockUsers[index] = { ...mockUsers[index], ...data };
    return this.simulateRequest({ user: mockUsers[index] });
  }

  async deleteUser(id: string) {
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      throw {
        code: 'NOT_FOUND',
        message: 'User not found',
        status: 404
      };
    }

    mockUsers.splice(index, 1);
    return this.simulateRequest({ message: 'User deleted successfully' });
  }

  // Dashboard mocks
  async getAdminDashboardStats() {
    return this.simulateRequest(mockDashboardStats.admin);
  }

  async getPartnerDashboardStats() {
    return this.simulateRequest(mockDashboardStats.partner);
  }

  async getDealerDashboardStats() {
    return this.simulateRequest(mockDashboardStats.dealer);
  }

  // Dealer mocks
  async getDealerCustomers(page: number = 1, limit: number = 10) {
    const customers = Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phone: `+1234567${String(i).padStart(4, '0')}`
    }));

    const result = paginate(customers, page, limit);
    return this.simulateRequest({
      items: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages
      }
    });
  }

  async getDealerOrders(page: number = 1, limit: number = 10) {
    const orders = Array.from({ length: 30 }, (_, i) => ({
      id: String(i + 1),
      customer: `Customer ${i + 1}`,
      status: ['pending', 'processing', 'completed'][i % 3],
      amount: `₹${(Math.random() * 50000).toFixed(2)}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString()
    }));

    const result = paginate(orders, page, limit);
    return this.simulateRequest({
      items: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages
      }
    });
  }

  // Partner mocks
  async getPartnerDealers(page: number = 1, limit: number = 10) {
    const dealers = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      name: `Dealer ${i + 1}`,
      performance: `${90 + (i % 10)}%`,
      revenue: `₹${(Math.random() * 500000).toFixed(2)}`
    }));

    const result = paginate(dealers, page, limit);
    return this.simulateRequest({
      dealers: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages
      }
    });
  }

  // Contact enquiries mocks
  private contactEnquiries: any[] = [];

  async submitContactEnquiry(data: any) {
    const enquiry = {
      id: String(this.contactEnquiries.length + 1),
      ...data,
      created_at: new Date().toISOString()
    };
    this.contactEnquiries.push(enquiry);
    return this.simulateRequest({
      enquiry,
      message: 'Enquiry submitted successfully'
    });
  }

  async getContactEnquiries(page: number = 1, limit: number = 10, search: string = '') {
    let filtered = searchItems(this.contactEnquiries, search, ['name', 'email', 'subject']);
    const result = paginate(filtered, page, limit);
    return this.simulateRequest({
      enquiries: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages
      }
    });
  }

  async getContactEnquiryById(id: string) {
    const enquiry = this.contactEnquiries.find(e => e.id === id);
    if (!enquiry) {
      throw {
        code: 'NOT_FOUND',
        message: 'Enquiry not found',
        status: 404
      };
    }
    return this.simulateRequest({ enquiry });
  }
}

export const mockService = new MockService();

