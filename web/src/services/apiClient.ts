import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
import { normalizeError } from '../utils/apiError';
import { authService } from './authService';
import { env } from '../core/env/config';
import { logger } from '../core/logger';

// Use centralized env config
const API_BASE_URL = env.apiUrl;
const USE_MOCK = env.useMock;

/**
 * Centralized API Client
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
    // Warn about non-HTTPS in production (allow localhost for local testing)
    if (env.mode === 'production' && !API_BASE_URL.startsWith('https://')) {
      const isLocalhost = API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');
      if (isLocalhost) {
        console.warn('API URL is using HTTP on localhost in production build. Set VITE_API_URL to your HTTPS endpoint for deployment.');
      } else {
        console.warn('API URL is not using HTTPS in production. This is a security risk!');
      }
    }

    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000, // 30 seconds
    });

    // Log API URL in development for debugging
    if (env.mode === 'development') {
      logger.info('API Client initialized', { apiUrl: API_BASE_URL, useMock: USE_MOCK });
    }

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - attach token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = authService.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(normalizeError(error))
    );

    // Response interceptor - handle errors and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: any) => {
        const originalRequest = error.config;

        // Handle 401 - token expired or not authenticated
        if (error.response?.status === 401 && !(originalRequest as RetryableRequestConfig)._retry) {
          // Skip refresh attempt for auth endpoints (login, refresh, etc.)
          const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                                originalRequest.url?.includes('/auth/refresh') ||
                                originalRequest.url?.includes('/auth/otp');
          
          if (isAuthEndpoint) {
            // Don't try to refresh on auth endpoints - just reject
            return Promise.reject(normalizeError(error));
          }

          return this.handleTokenRefresh(originalRequest, error);
        }

        // Normalize all other errors
        return Promise.reject(normalizeError(error));
      }
    );
  }

  private async handleTokenRefresh(
    originalRequest: InternalAxiosRequestConfig,
    error: any
  ): Promise<any> {
    // Check if we have a refresh token - if not, redirect immediately
    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) {
      // No refresh token - user needs to log in
      await authService.logout();
      if (typeof window !== 'undefined') {
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      // Reject without logging to console (already handled by redirect)
      return Promise.reject(normalizeError(error));
    }

    if (this.isRefreshing) {
      // Queue request while refreshing
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return this.client(originalRequest);
        })
        .catch((err) => Promise.reject(normalizeError(err)));
    }

    (originalRequest as RetryableRequestConfig)._retry = true;
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
      // Logout on refresh failure
      await authService.logout();
      if (typeof window !== 'undefined') {
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(normalizeError(refreshError));
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

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    // Error is already normalized by response interceptor
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    // Error is already normalized by response interceptor
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    // Error is already normalized by response interceptor
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    // Error is already normalized by response interceptor
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    // Error is already normalized by response interceptor
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * POST request with FormData (for file uploads)
   */
  async postFormData<T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig & { onUploadProgress?: (progressEvent: any) => void }
  ): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Check if mock mode is enabled
   */
  isMockMode(): boolean {
    return USE_MOCK;
  }
}

export const apiClient = new ApiClient();

