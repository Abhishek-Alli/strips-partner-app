/**
 * Typography System
 * 
 * Platform-specific typography following Material Design and HIG
 */

import { Platform } from 'react-native';

export const typography = {
  // Font families
  fontFamily: {
    regular: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto Bold',
      default: 'System',
    }),
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 34,
  },
  
  // Line heights
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 40,
    '4xl': 44,
  },
  
  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Text styles (platform-specific)
  styles: {
    h1: {
      fontSize: 34,
      lineHeight: 44,
      fontWeight: Platform.select({
        ios: '700',
        android: '400',
      }),
      fontFamily: Platform.select({
        ios: 'SF Pro Display',
        android: 'Roboto',
      }),
    },
    h2: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: Platform.select({
        ios: '700',
        android: '400',
      }),
      fontFamily: Platform.select({
        ios: 'SF Pro Display',
        android: 'Roboto',
      }),
    },
    h3: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: Platform.select({
        ios: '600',
        android: '500',
      }),
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    },
    bodyBold: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    },
    captionBold: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
    },
  },
};






