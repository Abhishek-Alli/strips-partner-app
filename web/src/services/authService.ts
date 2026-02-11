import { apiClient } from './apiClient';
import { mockService } from './mock/mockService';
import { User } from '../types/auth.types';
import { tokenStorage } from '../core/security/tokenStorage';
import { logger } from '../core/logger';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls
 * Supports mock mode via environment variable
 */
class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Sanitize inputs
    const { sanitizeEmail } = await import('../core/security/inputSanitizer');
    const sanitizedEmail = sanitizeEmail(credentials.email);
    
    if (apiClient.isMockMode()) {
      return mockService.login(sanitizedEmail, credentials.password);
    }

    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email: sanitizedEmail,
      password: credentials.password
    });
    this.setAuthData(response);
    logger.info('User logged in successfully', { userId: response.user.id });
    return response;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    if (apiClient.isMockMode()) {
      // Generate proper JWT format mock tokens
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ sub: '1', exp: expiry }));
      const signature = btoa('mock_signature');
      const token = `${header}.${payload}.${signature}`;
      return {
        accessToken: token,
        refreshToken: token
      };
    }

    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken
    });

    this.setAuthData(response);
    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken
    };
  }

  /**
   * Send OTP to phone number
   */
  async sendOTP(phone: string): Promise<void> {
    // Sanitize phone number
    const { sanitizePhone } = await import('../core/security/inputSanitizer');
    const sanitizedPhone = sanitizePhone(phone);
    
    if (apiClient.isMockMode()) {
      // Mock: just simulate success
      return Promise.resolve();
    }

    await apiClient.post('/auth/otp/send', { phone: sanitizedPhone });
  }

  /**
   * Verify OTP and login
   */
  async verifyOTP(phone: string, otp: string): Promise<LoginResponse> {
    // Sanitize inputs
    const { sanitizePhone, sanitizeString } = await import('../core/security/inputSanitizer');
    const sanitizedPhone = sanitizePhone(phone);
    const sanitizedOTP = sanitizeString(otp);
    
    if (apiClient.isMockMode()) {
      // Generate proper JWT format mock tokens
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ sub: '1', exp: expiry }));
      const signature = btoa('mock_signature');
      const token = `${header}.${payload}.${signature}`;
      return {
        user: mockService.getMockUsers()[0] as User,
        accessToken: token,
        refreshToken: token
      };
    }

    const response = await apiClient.post<LoginResponse>('/auth/otp/verify', {
      phone: sanitizedPhone,
      otp: sanitizedOTP
    });

    this.setAuthData(response);
    return response;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    if (apiClient.isMockMode()) {
      const response = await mockService.getCurrentUser();
      return response.user;
    }

    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.user;
  }

  /**
   * Logout - clear stored auth data
   */
  async logout(): Promise<void> {
    this.clearAuthData();
  }

  // Storage helpers
  getStoredAuth(): { accessToken: string | null; refreshToken: string | null; user: User | null } {
    return {
      accessToken: tokenStorage.getAccessToken(),
      refreshToken: tokenStorage.getRefreshToken(),
      user: tokenStorage.getUser()
    };
  }

  getAccessToken(): string | null {
    return tokenStorage.getAccessToken();
  }

  getRefreshToken(): string | null {
    return tokenStorage.getRefreshToken();
  }

  private setAuthData(data: LoginResponse | RefreshTokenResponse): void {
    // Use secure token storage
    tokenStorage.setAccessToken(data.accessToken);
    tokenStorage.setRefreshToken(data.refreshToken);
    tokenStorage.setUser(data.user);
  }

  private clearAuthData(): void {
    tokenStorage.clear();
  }
}

export const authService = new AuthService();

