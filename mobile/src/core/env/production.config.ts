/**
 * Production Environment Configuration (Mobile)
 * 
 * Validates environment variables at build time
 */

interface ProductionConfig {
  apiBaseUrl: string;
  enableMockAPI: boolean;
  enableDebugLogs: boolean;
  googleClientId?: string;
  facebookAppId?: string;
}

const getEnvVar = (name: string, required: boolean = false): string | undefined => {
  // Expo uses EXPO_PUBLIC_ prefix
  const value = process.env[`EXPO_PUBLIC_${name}`];
  if (required && !value) {
    throw new Error(`❌ PRODUCTION ERROR: Missing required environment variable: EXPO_PUBLIC_${name}`);
  }
  return value;
};

// Validate production environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.EXPO_PUBLIC_ENV === 'production';

if (isProduction) {
  const apiUrl = getEnvVar('API_BASE_URL', true);
  if (apiUrl?.includes('localhost') || apiUrl?.includes('127.0.0.1')) {
    throw new Error('❌ PRODUCTION ERROR: API URL cannot be localhost in production!');
  }
  
  // Ensure mock API is disabled
  if (process.env.EXPO_PUBLIC_ENABLE_MOCK_API === 'true') {
    throw new Error('❌ PRODUCTION ERROR: Mock API cannot be enabled in production!');
  }
  
  console.log('✅ Production environment validated');
}

export const productionConfig: ProductionConfig = {
  apiBaseUrl: getEnvVar('API_BASE_URL', true) || 'http://localhost:3000',
  enableMockAPI: process.env.EXPO_PUBLIC_ENABLE_MOCK_API === 'true' && !isProduction,
  enableDebugLogs: process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === 'true' && !isProduction,
  googleClientId: getEnvVar('GOOGLE_CLIENT_ID'),
  facebookAppId: getEnvVar('FACEBOOK_APP_ID'),
};

export const isProductionBuild = isProduction;






