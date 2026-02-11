/**
 * Standardized API Error Format
 * 
 * All API errors are normalized into this format for consistent handling
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  status?: number;
}

/**
 * Normalize axios errors into standard ApiError format
 */
export function normalizeError(error: any): ApiError {
  // Network error - backend not reachable
  if (!error.response) {
    // Check if it's a connection refused error (backend not running)
    // In browsers, axios network errors typically have:
    // - error.message = "Network Error" or "Failed to fetch"
    // - error.code = undefined or "ERR_NETWORK"
    // - error.request exists but no response
    const errorMessage = String(error.message || '');
    const errorCode = String(error.code || '');
    
    // If there's no response, it's always a network error (backend not reachable)
    // This happens when backend server is not running
    const networkError: ApiError = {
      code: 'NETWORK_ERROR',
      message: 'Cannot connect to server. Please ensure the backend server is running on http://localhost:3001',
      details: errorMessage || errorCode || 'No response from server'
    };
    
    // Create an Error object with the ApiError properties for better stack traces
    const err = new Error(networkError.message) as any;
    err.code = networkError.code;
    err.message = networkError.message;
    err.details = networkError.details;
    err.status = networkError.status;
    return err;
  }

  // API error response - there IS a response, so backend is reachable
  const { status, data } = error.response;

  // Prefer message field over error field for better error messages
  const errorMessage = data?.message || data?.error || getDefaultErrorMessage(status);
  const errorCode = data?.code || `HTTP_${status}`;

  // Create an Error object with the ApiError properties for better stack traces
  // This ensures status and code are accessible
  const apiError = new Error(errorMessage) as any;
  apiError.code = errorCode;
  apiError.message = errorMessage;
  apiError.details = data?.details || data;
  apiError.status = status; // CRITICAL: Set status so it's accessible
  
  return apiError;
}

/**
 * Get user-friendly error message based on HTTP status
 */
function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication required. Please log in.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'Resource not found.';
    case 409:
      return 'Conflict. This resource already exists.';
    case 422:
      return 'Validation error. Please check your input.';
    case 500:
      return 'Server error. The database connection may be unavailable. Please check backend logs or Supabase project status.';
    case 503:
      return 'Service unavailable. Database connection failed. Please check Supabase project status.';
    default:
      return 'An error occurred. Please try again.';
  }
}

/**
 * Check if error is a specific type
 */
export function isApiError(error: any, code?: string): error is ApiError {
  return error && typeof error === 'object' && 'code' in error && 'message' in error;
}



