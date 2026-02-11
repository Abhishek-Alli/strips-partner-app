/**
 * Premium Primary Button Component
 * 
 * Confident, clear primary action button
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
  backgroundColor: theme.colors.primary[700],
  color: theme.colors.text.inverse,
  boxShadow: 'none',
  transition: `all ${theme.animation.duration.normal} ${theme.animation.easing.default}`,
  
  '&:hover': {
    backgroundColor: theme.colors.primary[800],
    boxShadow: theme.shadow.md,
    transform: 'translateY(-2px)',
  },
  
  '&:active': {
    transform: 'translateY(0)',
  },
  
  '&:disabled': {
    backgroundColor: theme.colors.neutral[300],
    color: theme.colors.text.disabled,
    cursor: 'not-allowed',
  },
});

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
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
      variant="contained"
      sx={sizeStyles[size]}
      {...props}
    >
      {children}
    </StyledButton>
  );
};






