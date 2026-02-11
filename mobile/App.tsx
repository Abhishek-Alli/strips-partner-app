import React from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ErrorBoundary } from './src/core/errorHandler';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        {Platform.OS !== 'web' && <StatusBar style="auto" />}
        <AppNavigator />
      </AuthProvider>
    </ErrorBoundary>
  );
}



