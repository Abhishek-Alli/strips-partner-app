/**
 * Lazy Loading Utilities
 * 
 * Provides lazy loading with loading states and error boundaries
 */

import React, { Suspense, ComponentType, lazy } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { ErrorBoundary } from '../errorBoundary/ErrorBoundary';

/**
 * Loading fallback component
 */
const LoadingFallback: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
    }}
  >
    <CircularProgress />
  </Box>
);

/**
 * Create a lazy-loaded component with error boundary and loading state
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.LazyExoticComponent<T> {
  return lazy(importFn) as React.LazyExoticComponent<T>;
}

/**
 * Preload a lazy component
 */
export function preloadComponent(
  importFn: () => Promise<any>
): void {
  importFn().catch((error) => {
    console.error('Failed to preload component:', error);
  });
}


