/**
 * Environment Configuration
 * 
 * Centralized environment variable management with validation
 */

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

// Note: VITE_API_URL is optional - defaults to http://localhost:3001/api

function validateEnv(): void {
  // Validate API URL is HTTPS in production
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  if (import.meta.env.MODE === 'production' && apiUrl && !apiUrl.startsWith('https://')) {
    console.warn(
      '⚠️  WARNING: API URL is not using HTTPS in production. This is a security risk!'
    );
  }
}

function getEnvConfig(): EnvConfig {
  const mode = (import.meta.env.MODE || 'development') as EnvConfig['mode'];
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  // Default to mock mode in development if not explicitly set
  const useMock = import.meta.env.VITE_USE_MOCK === 'true' ||
    (mode === 'development' && import.meta.env.VITE_USE_MOCK !== 'false');
  const enableDebug = import.meta.env.VITE_ENABLE_DEBUG === 'true';

  return {
    mode,
    apiUrl,
    useMock,
    enableDebug: enableDebug && mode !== 'production',
    logLevel: mode === 'production' ? 'warn' : 'debug',
    featureFlags: {
      enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      enableErrorTracking: import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true',
      enablePerformanceMonitoring:
        import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
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
  const value = import.meta.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value || defaultValue || '';
};



