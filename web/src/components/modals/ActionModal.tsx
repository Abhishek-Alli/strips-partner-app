import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface ActionModalAction {
  label: string;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success';
  variant?: 'text' | 'outlined' | 'contained';
  disabled?: boolean;
}

export interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  children?: React.ReactNode;
  actions: ActionModalAction[];
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  type?: 'confirm' | 'delete' | 'approve' | 'reject' | 'custom';
}

export const ActionModal: React.FC<ActionModalProps> = ({
  open,
  onClose,
  title,
  message,
  children,
  actions,
  maxWidth = 'sm',
  icon,
  type = 'custom'
}) => {
  const getDefaultColor = () => {
    switch (type) {
      case 'delete':
        return 'error';
      case 'approve':
        return 'success';
      case 'reject':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            <Typography variant="h6" component="span">
              {title}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {message && (
          <Typography variant="body1" sx={{ mb: children ? 2 : 0 }}>
            {message}
          </Typography>
        )}
        {children}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            color={action.color || getDefaultColor()}
            variant={action.variant || 'contained'}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};






