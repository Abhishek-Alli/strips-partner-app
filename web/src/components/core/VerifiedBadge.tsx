/**
 * Verified Badge Component
 * 
 * Subtle trust signal for verified partners/dealers
 */

import React from 'react';
import { Box, Chip } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { theme } from '../../theme';

interface VerifiedBadgeProps {
  verified: boolean;
  pending?: boolean;
  size?: 'sm' | 'md';
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  verified,
  pending = false,
  size = 'sm',
}) => {
  if (pending) {
    return (
      <Chip
        icon={<AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />}
        label="Pending"
        size={size}
        sx={{
          height: size === 'sm' ? 20 : 24,
          fontSize: theme.typography.fontSize.xs,
          backgroundColor: theme.colors.neutral[200],
          color: theme.colors.text.secondary,
          '& .MuiChip-icon': {
            color: theme.colors.text.secondary,
          },
        }}
      />
    );
  }

  if (!verified) {
    return null; // Don't show negative status
  }

  return (
    <Chip
      icon={<CheckCircleOutlinedIcon sx={{ fontSize: 14 }} />}
      label="Verified"
      size={size}
      sx={{
        height: size === 'sm' ? 20 : 24,
        fontSize: theme.typography.fontSize.xs,
        backgroundColor: theme.colors.success[50],
        color: theme.colors.success[700],
        fontWeight: theme.typography.fontWeight.medium,
        '& .MuiChip-icon': {
          color: theme.colors.success[700],
        },
      }}
    />
  );
};

