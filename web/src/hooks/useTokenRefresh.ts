import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { logger } from '../core/logger';

/**
 * Hook to automatically refresh access token before expiry
 * Checks token expiry every minute and refreshes if needed
 */
export const useTokenRefresh = () => {
  const { isAuthenticated, refreshToken, logout } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize the logout handler to avoid unnecessary re-renders
  const handleInvalidToken = useCallback(async (reason: string) => {
    logger.warn(reason);
    await logout();
  }, [logout]);

  useEffect(() => {
    if (!isAuthenticated || !refreshToken) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    const checkAndRefreshToken = async () => {
      try {
        // Decode token to check expiry (simple check without verification)
        const token = authService.getAccessToken();
        if (!token) return;

        // Validate token format (must have 3 parts separated by dots)
        const parts = token.split('.');
        if (parts.length !== 3) {
          await handleInvalidToken('Invalid token format, logging out');
          return;
        }

        // Try to decode the payload
        let payload;
        try {
          payload = JSON.parse(atob(parts[1]));
        } catch {
          await handleInvalidToken('Failed to decode token payload, logging out');
          return;
        }

        if (!payload.exp) {
          await handleInvalidToken('Token missing expiry, logging out');
          return;
        }

        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        const timeUntilExpiry = expiryTime - now;

        // Refresh if token expires in less than 5 minutes
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
          await authService.refreshAccessToken();
        }
      } catch (error) {
        logger.error('Token refresh error', error as Error);
      }
    };

    // Check immediately
    checkAndRefreshToken();

    // Check every minute
    intervalRef.current = setInterval(checkAndRefreshToken, 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, refreshToken, handleInvalidToken]);
};

