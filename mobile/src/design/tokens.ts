/**
 * Design Tokens
 * 
 * Premium design system tokens for consistent, enterprise-grade UI
 * Inspired by Stripe, Airbnb, Uber, Coinbase, Notion
 * 
 * Copied from shared/design/tokens.ts for webpack compatibility
 */

export const designTokens = {
  // Colors - Midnight/Steel Blue primary, Construction Amber accent
  colors: {
    // Primary - Midnight / Steel Blue
    primary: {
      50: '#F0F4F8',
      100: '#D9E2EC',
      200: '#BCCCDC',
      300: '#9FB3C8',
      400: '#829AB1',
      500: '#627D98', // Base
      600: '#486581',
      700: '#334E68',
      800: '#243B53',
      900: '#102A43', // Darkest
    },
    
    // Neutral - White to Dark Grey
    neutral: {
      0: '#FFFFFF',
      50: '#F8F9FA',
      100: '#F1F3F5',
      200: '#E9ECEF',
      300: '#DEE2E6',
      400: '#CED4DA',
      500: '#ADB5BD',
      600: '#868E96',
      700: '#495057',
      800: '#343A40',
      900: '#212529',
    },
    
    // Accent - Construction Amber (max 10% usage)
    accent: {
      50: '#FFF8E1',
      100: '#FFECB3',
      200: '#FFE082',
      300: '#FFD54F',
      400: '#FFCA28',
      500: '#FFC107', // Base
      600: '#FFB300',
      700: '#FFA000',
      800: '#FF8F00',
      900: '#FF6F00',
    },
    
    // Semantic
    success: {
      50: '#E8F5E9',
      500: '#4CAF50',
      700: '#388E3C',
    },
    
    error: {
      50: '#FFEBEE',
      500: '#F44336',
      700: '#D32F2F',
    },
    
    // Semantic aliases
    text: {
      primary: '#212529',
      secondary: '#495057',
      tertiary: '#868E96',
      inverse: '#FFFFFF',
      disabled: '#ADB5BD',
    },
    
    background: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      tertiary: '#F1F3F5',
      inverse: '#212529',
    },
    
    border: {
      light: '#E9ECEF',
      medium: '#DEE2E6',
      dark: '#CED4DA',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    },
    
    fontSize: {
      xs: '12px',    // Caption
      sm: '14px',    // Meta
      base: '16px',  // Body
      lg: '18px',    // Section title
      xl: '24px',    // Page title
      '2xl': '32px',
      '3xl': '40px',
    },
    
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
    },
  },
  
  // Spacing - Strict 8px grid
  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
  },
  
  // Border Radius
  radius: {
    sm: '6px',
    md: '10px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  // Shadows - Soft, subtle, low opacity
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Animation - 120-200ms, ease-out only
  animation: {
    duration: {
      fast: '120ms',
      normal: '150ms',
      slow: '200ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-out
    },
  },
  
  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  
  // Breakpoints (web)
  breakpoint: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export type DesignTokens = typeof designTokens;



