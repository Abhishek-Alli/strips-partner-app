/**
 * Premium Text Input Component
 * 
 * Clean input with floating label and clear states
 */

import React from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import { theme } from '../../theme';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    height: theme.components.input.height,
    borderRadius: theme.components.input.radius,
    fontSize: theme.typography.fontSize.base,
    backgroundColor: theme.colors.background.primary,
    transition: `all ${theme.animation.duration.normal} ${theme.animation.easing.default}`,
    
    '& fieldset': {
      borderColor: theme.colors.border.medium,
      borderWidth: '1px',
    },
    
    '&:hover fieldset': {
      borderColor: theme.colors.primary[500],
    },
    
    '&.Mui-focused fieldset': {
      borderColor: theme.colors.primary[700],
      borderWidth: '2px',
    },
    
    '&.Mui-error fieldset': {
      borderColor: theme.colors.error[500],
    },
    
    '&.Mui-disabled': {
      backgroundColor: theme.colors.background.secondary,
      cursor: 'not-allowed',
    },
  },
  
  '& .MuiInputLabel-root': {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    
    '&.Mui-focused': {
      color: theme.colors.primary[700],
    },
  },
  
  '& .MuiFormHelperText-root': {
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing[1],
  },
});

interface TextInputProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  helperText?: string;
  error?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  helperText,
  error,
  startAdornment,
  endAdornment,
  ...props
}) => {
  return (
    <StyledTextField
      variant="outlined"
      label={label}
      helperText={helperText}
      error={error}
      InputProps={{
        startAdornment: startAdornment ? (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ) : undefined,
        endAdornment: endAdornment ? (
          <InputAdornment position="end">{endAdornment}</InputAdornment>
        ) : undefined,
      }}
      {...props}
    />
  );
};






