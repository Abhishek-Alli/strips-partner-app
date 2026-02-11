/**
 * Lazy Loading Utilities
 * 
 * Provides lazy loading with loading states and error boundaries
 */

import React, { ComponentType, lazy } from 'react';

/**
 * Create a lazy-loaded component with error boundary and loading state
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
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


