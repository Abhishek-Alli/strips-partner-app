import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthState, UserRole } from '../types/auth.types';
import { authService } from '../services/authService';
import { hasPermission as checkPermission } from '../constants/permissions';
import { tokenStorage } from '../core/security/tokenStorage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (resource: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = () => {
    const { accessToken, refreshToken, user } = authService.getStoredAuth();

    // Validate token format before setting authenticated state
    if (accessToken && user) {
      // Check if token is valid JWT format (header.payload.signature)
      const parts = accessToken.split('.');
      if (parts.length !== 3) {
        // Invalid token format - clear storage and stay logged out
        tokenStorage.clear();
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Try to decode and check expiry
      try {
        const payload = JSON.parse(atob(parts[1]));
        if (!payload.exp) {
          // No expiry in token - clear storage
          tokenStorage.clear();
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Check if token is expired
        const expiryTime = payload.exp * 1000;
        if (Date.now() >= expiryTime) {
          // Token expired - clear storage
          tokenStorage.clear();
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }
      } catch {
        // Failed to decode token - clear storage
        tokenStorage.clear();
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Token is valid - set authenticated state
      setState({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Call the real authentication service
      const response = await authService.login({ email, password });

      setState({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error: any) {
      // Re-throw error so LoginPage can handle it
      // The error is already normalized by apiClient
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false
    });
  }, []);

  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  const hasPermission = useCallback((resource: string, action: string): boolean => {
    if (!state.user) return false;
    // Use shared permissions config
    try {
      return checkPermission(state.user.role, resource, action);
    } catch (error) {
      // Fallback: Admin has all permissions, others need explicit check
      if (state.user.role === 'ADMIN') return true;
      console.warn('Permission check failed, using fallback', error);
      return false;
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        hasRole,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export hook separately for Fast Refresh compatibility
function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { useAuth };



