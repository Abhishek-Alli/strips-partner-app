import { apiClient } from './apiClient';
import { mockService } from './mock/mockService';

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingActions: number;
  systemHealth: string;
  usersByRole: {
    generalUsers: number;
    partners: number;
    dealers: number;
    admins: number;
  };
}

export interface PartnerDashboardStats {
  assignedDealers: number;
  totalRevenue: string;
  monthlyGrowth: string;
  activeProjects: number;
  monthlyMetrics: {
    revenue: string;
    transactions: number;
    newDealers: number;
    completedProjects: number;
  };
}

export interface DealerDashboardStats {
  assignedCustomers: number;
  activeOrders: number;
  completedToday: number;
  pendingTasks: number;
  dailyActivity: {
    ordersReceived: number;
    ordersProcessed: number;
    customersServed: number;
    revenue: string;
  };
  weeklyActivity: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    revenue: string;
  };
}

/**
 * Dashboard Service
 * 
 * Handles dashboard data fetching for all roles
 * Supports mock mode via environment variable
 */
class DashboardService {
  /**
   * Get admin dashboard statistics
   */
  async getAdminStats(): Promise<AdminDashboardStats> {
    if (apiClient.isMockMode()) {
      return mockService.getAdminDashboardStats();
    }

    return apiClient.get<AdminDashboardStats>('/admin/dashboard');
  }

  /**
   * Get partner dashboard statistics
   */
  async getPartnerStats(): Promise<PartnerDashboardStats> {
    if (apiClient.isMockMode()) {
      return mockService.getPartnerDashboardStats();
    }

    return apiClient.get<PartnerDashboardStats>('/partner/dashboard');
  }

  /**
   * Get dealer dashboard statistics
   */
  async getDealerStats(): Promise<DealerDashboardStats> {
    if (apiClient.isMockMode()) {
      return mockService.getDealerDashboardStats();
    }

    return apiClient.get<DealerDashboardStats>('/dealer/stats');
  }
}

export const dashboardService = new DashboardService();


