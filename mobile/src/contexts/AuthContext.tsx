import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthState, User, UserRole } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthContextType extends AuthState {
  login: (identifier: string, password?: string) => Promise<void>;
  loginWithOTP: (phone: string, otp: string) => Promise<void>;
  loginWithSocial: (
    provider: 'google' | 'facebook',
    idToken: string,
  ) => Promise<{ newUser: true; profile: { email: string; name: string; picture?: string } } | void>;
  verifyRegistrationOTP: (email: string, phone: string, otp: string) => Promise<void>;
  sendOTP: (phone: string) => Promise<void>;
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
    let isMounted = true;
    
    const loadAuth = async () => {
      try {
        const { accessToken, refreshToken, user } = await authService.getStoredAuth();
        if (!isMounted) return;
        
        if (accessToken && user) {
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
      } catch (error) {
        // Silently fail and proceed to login screen
        if (isMounted) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };
    
    loadAuth();
    
    // Safety timeout: if loading takes more than 3 seconds, stop loading
    const timeout = setTimeout(() => {
      if (isMounted) {
        setState(prev => {
          if (prev.isLoading) {
            return { ...prev, isLoading: false };
          }
          return prev;
        });
      }
    }, 3000);
    
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const login = useCallback(async (identifier: string, password?: string) => {
    // Support both email and phone login
    const isEmail = identifier.includes('@');
    const response = await authService.login({
      [isEmail ? 'email' : 'phone']: identifier,
      password
    });
    setState({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
      isLoading: false
    });
  }, []);

  const sendOTP = useCallback(async (phone: string) => {
    await authService.sendOTP(phone);
  }, []);

  const verifyRegistrationOTP = useCallback(async (email: string, phone: string, otp: string) => {
    const response = await authService.verifyRegistrationOTP(email, phone, otp);
    setState({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
      isLoading: false
    });
  }, []);

  const loginWithOTP = useCallback(async (phone: string, otp: string) => {
    const response = await authService.verifyOTP(phone, otp);
    setState({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
      isLoading: false
    });
  }, []);

  const loginWithSocial = useCallback(async (
    provider: 'google' | 'facebook',
    idToken: string,
  ) => {
    const result = await authService.socialLogin(provider, idToken);
    if ('newUser' in result && result.newUser) {
      return result as { newUser: true; profile: { email: string; name: string; picture?: string } };
    }
    const r = result as any;
    setState({
      user: r.user,
      accessToken: r.accessToken,
      refreshToken: r.refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Storage clear failed - log but continue with state reset
      console.warn('Failed to clear stored auth:', e);
    }
    // Always clear in-memory state so navigation resets to Login
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
    // Import dynamically to avoid circular dependencies
    const { hasPermission: checkPermission } = require('../constants/permissions');
    return checkPermission(state.user.role, resource, action);
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        sendOTP,
        loginWithOTP,
        loginWithSocial,
        verifyRegistrationOTP,
        logout,
        hasRole,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};



