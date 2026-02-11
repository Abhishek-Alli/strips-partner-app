import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from './auth.service';
import { env } from '../core/env/config';
import { logger } from '../core/logger';

const API_BASE_URL = env.apiUrl;
const USE_MOCK = env.useMock;

/**
 * Centralized API Client for Mobile
 * 
 * Handles:
 * - Token attachment
 * - Automatic token refresh
 * - Error normalization
 * - Request/response interceptors
 */
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    // Enforce HTTPS in production (skip when using mock data)
    if (env.mode === 'production' && !USE_MOCK && !API_BASE_URL.startsWith('https://')) {
      logger.error('API URL must use HTTPS in production', undefined, { apiUrl: API_BASE_URL });
      throw new Error('API URL must use HTTPS in production');
    }

    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - attach token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await authService.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(this.normalizeError(error))
    );

    // Response interceptor - handle errors and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: any) => {
        const originalRequest = error.config;

        // Handle 401 - token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          return this.handleTokenRefresh(originalRequest, error);
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private async handleTokenRefresh(
    originalRequest: InternalAxiosRequestConfig,
    error: any
  ): Promise<any> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      })
        .then(async (token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return this.client(originalRequest);
        })
        .catch((err) => Promise.reject(this.normalizeError(err)));
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      const { accessToken } = await authService.refreshAccessToken();
      this.processQueue(null, accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return this.client(originalRequest);
    } catch (refreshError) {
      this.processQueue(refreshError, null);
      await authService.logout();
      return Promise.reject(this.normalizeError(refreshError));
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(error: any, token: string | null = null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private normalizeError(error: any) {
    if (!error.response) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
        details: error.message
      };
    }

    const { status, data } = error.response;
    return {
      code: data?.code || `HTTP_${status}`,
      message: data?.error || data?.message || this.getDefaultErrorMessage(status),
      details: data?.details || data,
      status
    };
  }

  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  isMockMode(): boolean {
    return USE_MOCK;
  }
}

export const apiClient = new ApiClient();

