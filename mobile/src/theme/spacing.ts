/**
 * Spacing System
 * 
 * Consistent spacing tokens for both platforms
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Common spacing patterns
  screenPadding: 16,
  cardPadding: 16,
  cardMargin: 16,
  sectionSpacing: 24,
  
  // Platform-specific adjustments
  android: {
    cardElevation: 2,
    cardPadding: 16,
    screenPadding: 16,
  },
  ios: {
    cardPadding: 16,
    screenPadding: 20,
    safeAreaTop: 44, // Status bar + navigation
    safeAreaBottom: 34, // Home indicator
  },
};






