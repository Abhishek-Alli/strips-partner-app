import { apiClient } from './apiClient';
import { mockService } from './mock/mockService';
import { User } from '../types/auth.types';
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeSearchQuery } from '../core/security/inputSanitizer';

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateUserData {
  email: string;
  name: string;
  password?: string;
  role: string;
  phone?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  is_active?: boolean;
  password?: string;
}

/**
 * User Service
 * 
 * Handles all user-related API calls
 * Supports mock mode via environment variable
 */
class UserService {
  /**
   * Get paginated list of users with search
   */
  async getAllUsers(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<UsersResponse> {
    // Sanitize search query
    const sanitizedSearch = sanitizeSearchQuery(search);
    
    if (apiClient.isMockMode()) {
      return mockService.getUsers(page, limit, sanitizedSearch);
    }

    return apiClient.get<UsersResponse>('/users', {
      params: { page, limit, search: sanitizedSearch }
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<{ user: User }> {
    if (apiClient.isMockMode()) {
      return mockService.getUserById(id);
    }

    return apiClient.get<{ user: User }>(`/users/${id}`);
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserData): Promise<{ user: User }> {
    // Sanitize user input
    const sanitizedData: CreateUserData = {
      ...data,
      email: data.email ? sanitizeEmail(data.email) : data.email,
      name: data.name ? sanitizeString(data.name) : data.name,
      phone: data.phone ? sanitizePhone(data.phone) : data.phone,
    };
    
    if (apiClient.isMockMode()) {
      return mockService.createUser(sanitizedData);
    }

    return apiClient.post<{ user: User }>('/users', sanitizedData);
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserData): Promise<{ user: User }> {
    // Sanitize user input
    const sanitizedData: UpdateUserData = {
      ...data,
      email: data.email ? sanitizeEmail(data.email) : data.email,
      name: data.name ? sanitizeString(data.name) : data.name,
      phone: data.phone ? sanitizePhone(data.phone) : data.phone,
    };
    
    if (apiClient.isMockMode()) {
      return mockService.updateUser(id, sanitizedData);
    }

    return apiClient.put<{ user: User }>(`/users/${id}`, sanitizedData);
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    if (apiClient.isMockMode()) {
      return mockService.deleteUser(id);
    }

    return apiClient.delete<{ message: string }>(`/users/${id}`);
  }
}

export const userService = new UserService();

