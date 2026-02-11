/**
 * Web-specific App entry point
 * StatusBar is not needed on web as browsers handle it automatically
 */
import React, { useEffect } from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { ErrorBoundary } from './src/core/errorHandler';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    // Suppress useNativeDriver warnings on web - they're informational
    // React Navigation already handles fallback to JS-based animations correctly
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      // Suppress specific React Native Animated warnings on web
      if (
        typeof message === 'string' &&
        (message.includes('useNativeDriver') ||
          message.includes('native animated module is missing') ||
          message.includes('Falling back to JS-based animation') ||
          message.includes('tintColor') ||
          message.includes('props.tintColor'))
      ) {
        // Silently suppress - React Navigation handles fallback correctly
        // tintColor warning is expected on web as RefreshControl.tintColor is iOS-only
        return;
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ErrorBoundary>
  );
}



