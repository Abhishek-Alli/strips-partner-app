/**
 * Mobile Theme
 * 
 * Premium theme configuration for mobile application
 */

import { designTokens } from '../design/tokens';
import { Platform } from 'react-native';

import React, { useContext, createContext } from 'react';
import { useColorScheme } from 'react-native';

export const theme = {
  ...designTokens,
  
  // Mobile-specific overrides
  layout: {
    tabBarHeight: Platform.OS === 'ios' ? 88 : 64,
    headerHeight: 56,
    safeAreaTop: Platform.OS === 'ios' ? 44 : 0,
    safeAreaBottom: Platform.OS === 'ios' ? 34 : 0,
  },
  
  // Component-specific tokens
  components: {
    card: {
      padding: designTokens.spacing[4],
      radius: designTokens.radius.lg,
      shadow: Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        default: {},
      }),
      backgroundColor: designTokens.colors.background.primary,
    },
    
    button: {
      height: {
        sm: 36,
        md: 44,
        lg: 52,
      },
      padding: {
        sm: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
        md: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
        lg: `${designTokens.spacing[4]} ${designTokens.spacing[8]}`,
      },
      radius: designTokens.radius.md,
    },
    
    input: {
      height: 48,
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
      radius: designTokens.radius.md,
      borderColor: designTokens.colors.border.medium,
    },
  },
  
  // Platform-specific fonts
  typography: {
    ...designTokens.typography,
    fontFamily: {
      primary: Platform.select({
        ios: 'SF Pro Text',
        android: 'Roboto',
        default: 'System',
      }),
      mono: Platform.select({
        ios: 'SF Mono',
        android: 'Roboto Mono',
        default: 'monospace',
      }),
    },
    // React Native compatible typography styles
    styles: {
      h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 38,
      },
      h2: {
        fontSize: 24,
        fontWeight: '700' as const,
        lineHeight: 30,
      },
      h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 26,
      },
      h4: {
        fontSize: 18,
        fontWeight: '600' as const,
        lineHeight: 24,
      },
      body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
      },
      caption: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
      },
      meta: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
      },
    },
  },
  
  // Spacing shortcuts (React Native compatible - numbers not strings)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  
  // Colors aliases for React Native
  colors: {
    ...designTokens.colors,
    card: designTokens.colors.background.primary,
    border: designTokens.colors.border.medium,
    primary: designTokens.colors.primary[500],
    success: designTokens.colors.success[500],
    error: designTokens.colors.error[500],
  },
};

export type Theme = typeof theme;

// Theme Context for useTheme hook
const ThemeContext = createContext<Theme>(theme);

// useTheme hook
export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  // For now, always return the light theme
  // Can be extended to support dark mode later
  return theme;
};

// Export typography and spacing for direct access
export const typography = theme.typography;
export const spacing = theme.spacing;
