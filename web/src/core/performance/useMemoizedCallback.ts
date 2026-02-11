/**
 * Memoized Callback Hook
 * 
 * Optimized version of useCallback with automatic dependency tracking
 */

import { useCallback, useRef, useEffect } from 'react';

/**
 * Memoized callback that only changes when dependencies change
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: any[]) => callbackRef.current(...args)) as T,
    deps
  );
}






