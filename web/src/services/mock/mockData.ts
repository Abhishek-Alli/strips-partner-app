/**
 * Mock Data for Development
 * 
 * Used when VITE_USE_MOCK=true
 * Provides realistic mock responses for all services
 */

import { User, UserRole } from '../../types/auth.types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@shreeom.com',
    name: 'Admin User',
    role: UserRole.ADMIN,
    phone: '+1234567890',
    is_active: true
  },
  {
    id: '2',
    email: 'dealer@shreeom.com',
    name: 'Dealer User',
    role: UserRole.DEALER,
    phone: '+1234567891',
    is_active: true
  },
  {
    id: '3',
    email: 'partner@shreeom.com',
    name: 'Partner User',
    role: UserRole.PARTNER,
    phone: '+1234567892',
    is_active: true
  },
  {
    id: '4',
    email: 'user@shreeom.com',
    name: 'General User',
    role: UserRole.GENERAL_USER,
    phone: '+1234567893',
    is_active: true
  }
];

// Mock Dashboard Stats
export const mockDashboardStats = {
  admin: {
    totalUsers: 1247,
    activeUsers: 892,
    pendingActions: 12,
    systemHealth: '98.5%',
    usersByRole: {
      generalUsers: 856,
      partners: 234,
      dealers: 127,
      admins: 30
    }
  },
  partner: {
    assignedDealers: 15,
    totalRevenue: '₹12,45,678',
    monthlyGrowth: '+12.5%',
    activeProjects: 8,
    monthlyMetrics: {
      revenue: '₹3,45,678',
      transactions: 234,
      newDealers: 3,
      completedProjects: 5
    }
  },
  dealer: {
    assignedCustomers: 156,
    activeOrders: 23,
    completedToday: 8,
    pendingTasks: 5,
    dailyActivity: {
      ordersReceived: 12,
      ordersProcessed: 8,
      customersServed: 45,
      revenue: '₹45,678'
    },
    weeklyActivity: {
      totalOrders: 78,
      completedOrders: 65,
      pendingOrders: 13,
      revenue: '₹2,34,567'
    }
  }
};

// Simulate network delay
export const delay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Simulate pagination
export function paginate<T>(items: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    items: items.slice(start, end),
    total: items.length,
    page,
    limit,
    pages: Math.ceil(items.length / limit)
  };
}

// Simulate search
export function searchItems<T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchTerm) return items;

  const term = searchTerm.toLowerCase();
  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      return value && String(value).toLowerCase().includes(term);
    })
  );
}






