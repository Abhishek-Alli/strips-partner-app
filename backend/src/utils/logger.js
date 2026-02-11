/**
 * Logger Utility
 * 
 * Centralized logging for backend
 */

export const logger = {
  info: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message, ...args) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
};






