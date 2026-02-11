/**
 * Production Environment Configuration
 * 
 * Validates environment variables at build time
 * Fails build if required variables are missing
 */

interface ProductionConfig {
  apiBaseUrl: string;
  enableMockAPI: boolean;
  enableDebugLogs: boolean;
  recaptchaSiteKey: string;
  googleClientId?: string;
  facebookAppId?: string;
}

const getEnvVar = (name: string, required: boolean = false): string | undefined => {
  const value = import.meta.env[name];
  if (required && !value) {
    throw new Error(`❌ PRODUCTION ERROR: Missing required environment variable: ${name}`);
  }
  return value;
};

// Validate production environment
const isProduction = import.meta.env.MODE === 'production';
const isStaging = import.meta.env.MODE === 'staging';

if (isProduction) {
  // Check for test keys
  const apiUrl = getEnvVar('VITE_API_BASE_URL', true);
  if (apiUrl?.includes('localhost') || apiUrl?.includes('127.0.0.1')) {
    throw new Error('❌ PRODUCTION ERROR: API URL cannot be localhost in production!');
  }
  
  const recaptchaKey = getEnvVar('VITE_RECAPTCHA_SITE_KEY', true);
  if (recaptchaKey?.includes('test') || recaptchaKey?.includes('6LeIxAcT')) {
    throw new Error('❌ PRODUCTION ERROR: Test reCAPTCHA key detected in production!');
  }
  
  // Ensure mock API is disabled
  if (import.meta.env.VITE_ENABLE_MOCK_API === 'true') {
    throw new Error('❌ PRODUCTION ERROR: Mock API cannot be enabled in production!');
  }
  
  console.log('✅ Production environment validated');
}

export const productionConfig: ProductionConfig = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', true) || 'http://localhost:3001',
  enableMockAPI: import.meta.env.VITE_ENABLE_MOCK_API === 'true' && !isProduction,
  enableDebugLogs: import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true' && !isProduction,
  recaptchaSiteKey: getEnvVar('VITE_RECAPTCHA_SITE_KEY', true) || '',
  googleClientId: getEnvVar('VITE_GOOGLE_CLIENT_ID'),
  facebookAppId: getEnvVar('VITE_FACEBOOK_APP_ID'),
};

// Export validation status
export const isProductionBuild = isProduction;
export const isStagingBuild = isStaging;





