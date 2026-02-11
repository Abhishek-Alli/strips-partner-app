/**
 * Web Theme
 * 
 * Premium theme configuration for web application
 */

import { designTokens } from '@shared/design/tokens';

export const theme = {
  ...designTokens,
  
  // Web-specific overrides
  layout: {
    sidebarWidth: '240px',
    topBarHeight: '64px',
    contentMaxWidth: '1280px',
  },
  
  // Component-specific tokens
  components: {
    card: {
      padding: designTokens.spacing[6],
      radius: designTokens.radius.xl,
      shadow: designTokens.shadow.md,
      backgroundColor: designTokens.colors.background.primary,
    },
    
    button: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      padding: {
        sm: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
        md: `${designTokens.spacing[2]} ${designTokens.spacing[6]}`,
        lg: `${designTokens.spacing[4]} ${designTokens.spacing[8]}`,
      },
      radius: designTokens.radius.md,
    },
    
    input: {
      height: '40px',
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
      radius: designTokens.radius.md,
      borderColor: designTokens.colors.border.medium,
    },
    
    table: {
      headerHeight: '48px',
      rowHeight: '56px',
      cellPadding: designTokens.spacing[4],
    },
  },
};

export type Theme = typeof theme;



