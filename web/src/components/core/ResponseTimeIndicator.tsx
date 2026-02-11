/**
 * Response Time Indicator Component
 * 
 * Factual response time display (not promotional)
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { theme } from '../../theme';

interface ResponseTimeIndicatorProps {
  averageHours: number;
  format?: 'human' | 'exact';
}

export const ResponseTimeIndicator: React.FC<ResponseTimeIndicatorProps> = ({
  averageHours,
  format = 'human',
}) => {
  const formatTime = (hours: number): string => {
    if (format === 'exact') {
      return `${hours} hours`;
    }

    // Human-friendly format
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return minutes === 1 ? '1 minute' : `${minutes} minutes`;
    }
    if (hours < 24) {
      return hours === 1 ? '1 hour' : `${Math.round(hours)} hours`;
    }
    const days = Math.round(hours / 24);
    return days === 1 ? '1 day' : `${days} days`;
  };

  return (
    <Typography
      sx={{
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[1],
      }}
    >
      <span>Typically responds within {formatTime(averageHours)}</span>
    </Typography>
  );
};






