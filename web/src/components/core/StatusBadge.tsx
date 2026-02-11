/**
 * Status Badge Component
 * 
 * Clear, color-coded status display
 */

import React from 'react';
import { Chip } from '@mui/material';
import { theme } from '../../theme';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  variant?: 'subtle' | 'prominent';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'subtle',
}) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      color: theme.colors.accent[500],
      bgColor: theme.colors.accent[50],
    },
    approved: {
      label: 'Approved',
      color: theme.colors.success[700],
      bgColor: theme.colors.success[50],
    },
    rejected: {
      label: 'Rejected',
      color: theme.colors.error[700],
      bgColor: theme.colors.error[50],
    },
    active: {
      label: 'Active',
      color: theme.colors.success[700],
      bgColor: theme.colors.success[50],
    },
    inactive: {
      label: 'Inactive',
      color: theme.colors.text.tertiary,
      bgColor: theme.colors.background.secondary,
    },
  };

  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        height: variant === 'subtle' ? 20 : 24,
        fontSize: theme.typography.fontSize.xs,
        backgroundColor: config.bgColor,
        color: config.color,
        fontWeight: theme.typography.fontWeight.medium,
        border: variant === 'prominent' ? `1px solid ${config.color}` : 'none',
      }}
    />
  );
};






