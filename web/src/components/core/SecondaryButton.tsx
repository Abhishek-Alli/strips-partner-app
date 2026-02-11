/**
 * Premium Secondary Button Component
 * 
 * Subtle secondary action button
 */

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { theme } from '../../theme';

const StyledButton = styled(Button)({
  height: theme.components.button.height.md,
  padding: theme.components.button.padding.md,
  borderRadius: theme.components.button.radius,
  fontSize: theme.typography.fontSize.base,
  fontWeight: theme.typography.fontWeight.medium,
  textTransform: 'none',
  letterSpacing: theme.typography.letterSpacing.normal,
  backgroundColor: 'transparent',
  color: theme.colors.primary[700],
  border: `1px solid ${theme.colors.border.medium}`,
  transition: `all ${theme.animation.duration.normal} ${theme.animation.easing.default}`,
  
  '&:hover': {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.primary[600],
    transform: 'translateY(-1px)',
  },
  
  '&:active': {
    transform: 'translateY(0)',
  },
  
  '&:disabled': {
    color: theme.colors.text.disabled,
    borderColor: theme.colors.border.light,
    cursor: 'not-allowed',
  },
});

interface SecondaryButtonProps extends Omit<ButtonProps, 'variant'> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  size = 'md',
  ...props
}) => {
  const sizeStyles = {
    sm: {
      height: theme.components.button.height.sm,
      padding: theme.components.button.padding.sm,
      fontSize: theme.typography.fontSize.sm,
    },
    md: {
      height: theme.components.button.height.md,
      padding: theme.components.button.padding.md,
      fontSize: theme.typography.fontSize.base,
    },
    lg: {
      height: theme.components.button.height.lg,
      padding: theme.components.button.padding.lg,
      fontSize: theme.typography.fontSize.lg,
    },
  };

  return (
    <StyledButton
      variant="outlined"
      sx={sizeStyles[size]}
      {...props}
    >
      {children}
    </StyledButton>
  );
};






