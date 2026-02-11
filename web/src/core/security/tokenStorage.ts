/**
 * Secure Token Storage
 * 
 * Provides secure token storage with validation and automatic cleanup
 */

import { logger } from '../logger';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
} as const;

class TokenStorage {
  /**
   * Store access token securely
   */
  setAccessToken(token: string): void {
    if (!token || token.trim() === '') {
      logger.warn('Attempted to store empty access token');
      return;
    }

    try {
      localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
    } catch (error) {
      logger.error('Failed to store access token', error as Error);
      throw new Error('Failed to store access token');
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    } catch (error) {
      logger.error('Failed to retrieve access token', error as Error);
      return null;
    }
  }

  /**
   * Store refresh token securely
   */
  setRefreshToken(token: string): void {
    if (!token || token.trim() === '') {
      logger.warn('Attempted to store empty refresh token');
      return;
    }

    try {
      localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      logger.error('Failed to store refresh token', error as Error);
      throw new Error('Failed to store refresh token');
    }
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    } catch (error) {
      logger.error('Failed to retrieve refresh token', error as Error);
      return null;
    }
  }

  /**
   * Store user data (sanitized)
   */
  setUser(user: any): void {
    try {
      // Remove sensitive fields before storing
      const sanitized = { ...user };
      delete (sanitized as any).password;
      delete (sanitized as any).passwordHash;
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(sanitized));
    } catch (error) {
      logger.error('Failed to store user data', error as Error);
      throw new Error('Failed to store user data');
    }
  }

  /**
   * Get user data
   */
  getUser(): any | null {
    try {
      const userStr = localStorage.getItem(TOKEN_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      logger.error('Failed to retrieve user data', error as Error);
      return null;
    }
  }

  /**
   * Clear all auth data
   */
  clear(): void {
    try {
      Object.values(TOKEN_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      logger.info('Auth data cleared');
    } catch (error) {
      logger.error('Failed to clear auth data', error as Error);
    }
  }

  /**
   * Check if tokens exist
   */
  hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }
}

export const tokenStorage = new TokenStorage();






