/**
 * Activity Timestamp Component
 * 
 * Human-friendly relative/absolute time display
 */

import React from 'react';
import { Typography } from '@mui/material';
import { theme } from '../../theme';

interface ActivityTimestampProps {
  date: Date | string;
  format?: 'relative' | 'absolute' | 'auto';
}

export const ActivityTimestamp: React.FC<ActivityTimestampProps> = ({
  date,
  format = 'auto',
}) => {
  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (format === 'absolute') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }

    if (format === 'auto' || format === 'relative') {
      // Relative for recent (< 7 days), absolute for older
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      
      // Absolute for older
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }

    return date.toLocaleDateString();
  };

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return (
    <Typography
      sx={{
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.text.tertiary,
      }}
    >
      {formatTime(dateObj)}
    </Typography>
  );
};






