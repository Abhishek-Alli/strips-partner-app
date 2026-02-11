/**
 * Premium Toast Component
 * 
 * Subtle notification with slide-up animation
 */

import React, { useEffect } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { theme } from '../../theme';

interface ToastProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  open,
  message,
  severity = 'info',
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          borderRadius: theme.radius.md,
          boxShadow: theme.shadow.lg,
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          borderRadius: theme.radius.md,
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};






