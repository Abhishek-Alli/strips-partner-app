/**
 * KPI Card Component
 * 
 * ERP-style metric card for admin dashboards
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon
}) => {
  return (
    <Box
      sx={{
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        p: 2.5,
        height: '100%',
        backgroundColor: '#ffffff'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mt: 0.5, color: '#111827' }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>

          {subtitle && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}

          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {trend.isPositive ? (
                <TrendingUpIcon
                  sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }}
                />
              ) : (
                <TrendingDownIcon
                  sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }}
                />
              )}
              <Typography
                variant="caption"
                sx={{
                  color: trend.isPositive
                    ? 'success.main'
                    : 'error.main'
                }}
              >
                {Math.abs(trend.value)}%
              </Typography>
            </Box>
          )}
        </Box>

        {icon && (
          <Box sx={{ color: '#9ca3af' }}>
            {icon}
          </Box>
        )}
      </Box>
    </Box>
  );
};

