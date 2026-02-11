/**
 * Admin Modal Component
 *
 * Simple, functional dialog for ERP/Admin actions
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  open,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction,
  size = 'md'
}) => {
  const sizeMap = {
    sm: '420px',
    md: '640px',
    lg: '840px'
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: sizeMap[size],
          borderRadius: 2
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb',
          pr: 1
        }}
      >
        {title}
        <IconButton size="small" onClick={onClose}>
          <CloseOutlinedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {children}
      </DialogContent>

      {(primaryAction || secondaryAction) && (
        <DialogActions
          sx={{
            borderTop: '1px solid #e5e7eb',
            px: 3,
            py: 2
          }}
        >
          {secondaryAction && (
            <Button
              variant="outlined"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}

          {primaryAction && (
            <Button
              variant="contained"
              onClick={primaryAction.onClick}
              disabled={primaryAction.loading}
            >
              {primaryAction.label}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};
