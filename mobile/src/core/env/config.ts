/**
 * Environment Configuration (Mobile)
 * 
 * Centralized environment variable management with validation
 */

import Constants from 'expo-constants';

interface EnvConfig {
  mode: 'development' | 'staging' | 'production';
  apiUrl: string;
  useMock: boolean;
  enableDebug: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  featureFlags: {
    enableAnalytics: boolean;
    enableErrorTracking: boolean;
    enablePerformanceMonitoring: boolean;
  };
}

// Note: EXPO_PUBLIC_API_URL is optional - defaults to http://localhost:3000/api
const requiredEnvVars: string[] = [];

function validateEnv(): void {
  // Validate API URL is HTTPS in production
  const apiUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 
                 process.env.EXPO_PUBLIC_API_URL || 
                 'http://localhost:3000/api';
  if (__DEV__ === false && apiUrl && !apiUrl.startsWith('https://')) {
    console.warn(
      '⚠️  WARNING: API URL is not using HTTPS in production. This is a security risk!'
    );
  }
}

function getEnvConfig(): EnvConfig {
  const isDev = __DEV__ || process.env.NODE_ENV !== 'production';
  const mode = isDev ? 'development' : 'production';
  
  const apiUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 
                 process.env.EXPO_PUBLIC_API_URL || 
                 'http://localhost:3001/api';
  
  const useMock = Constants.expoConfig?.extra?.EXPO_PUBLIC_USE_MOCK === 'true' ||
                  process.env.EXPO_PUBLIC_USE_MOCK === 'true';
  
  const enableDebug = Constants.expoConfig?.extra?.EXPO_PUBLIC_ENABLE_DEBUG === 'true' ||
                      process.env.EXPO_PUBLIC_ENABLE_DEBUG === 'true';

  return {
    mode,
    apiUrl,
    useMock,
    enableDebug: enableDebug && mode !== 'production',
    logLevel: mode === 'production' ? 'warn' : 'debug',
    featureFlags: {
      enableAnalytics: Constants.expoConfig?.extra?.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
      enableErrorTracking: Constants.expoConfig?.extra?.EXPO_PUBLIC_ENABLE_ERROR_TRACKING === 'true',
      enablePerformanceMonitoring:
        Constants.expoConfig?.extra?.EXPO_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true',
    },
  };
}

// Validate on import
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error);
  throw error;
}

export const env = getEnvConfig();

// Type-safe environment variable access
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = Constants.expoConfig?.extra?.[key] || process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value || defaultValue || '';
};



