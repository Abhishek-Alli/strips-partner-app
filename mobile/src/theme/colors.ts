/**
 * Color System
 * 
 * Platform-agnostic color tokens that adapt to light/dark mode
 */

export const colors = {
  // Primary colors
  primary: {
    light: '#007AFF', // iOS blue / Material blue
    dark: '#0A84FF',
  },
  
  // Secondary colors
  secondary: {
    light: '#5856D6',
    dark: '#5E5CE6',
  },
  
  // Semantic colors
  success: {
    light: '#34C759',
    dark: '#30D158',
  },
  warning: {
    light: '#FF9500',
    dark: '#FF9F0A',
  },
  error: {
    light: '#FF3B30',
    dark: '#FF453A',
  },
  info: {
    light: '#5AC8FA',
    dark: '#64D2FF',
  },
  
  // Background colors
  background: {
    light: '#FFFFFF',
    dark: '#000000',
  },
  surface: {
    light: '#F2F2F7',
    dark: '#1C1C1E',
  },
  card: {
    light: '#FFFFFF',
    dark: '#2C2C2E',
  },
  
  // Text colors
  text: {
    primary: {
      light: '#000000',
      dark: '#FFFFFF',
    },
    secondary: {
      light: '#8E8E93',
      dark: '#98989D',
    },
    tertiary: {
      light: '#C7C7CC',
      dark: '#636366',
    },
  },
  
  // Border colors
  border: {
    light: '#E5E5EA',
    dark: '#38383A',
  },
  
  // Overlay colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.4)',
    dark: 'rgba(0, 0, 0, 0.6)',
  },
  
  // Android Material specific
  android: {
    primary: '#6200EE',
    primaryDark: '#3700B3',
    accent: '#03DAC6',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    error: '#B00020',
  },
  
  // iOS specific
  ios: {
    systemBlue: '#007AFF',
    systemGray: '#8E8E93',
    systemGray2: '#AEAEB2',
    systemGray3: '#C7C7CC',
    systemGray4: '#D1D1D6',
    systemGray5: '#E5E5EA',
    systemGray6: '#F2F2F7',
  },
};

/**
 * Get color based on color scheme
 */
export const getColor = (
  colorKey: keyof typeof colors,
  colorScheme: 'light' | 'dark' = 'light'
): string => {
  const color = colors[colorKey];
  if (typeof color === 'object' && 'light' in color && 'dark' in color) {
    return color[colorScheme];
  }
  return color as string;
};






