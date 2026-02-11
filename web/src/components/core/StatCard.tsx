/**
 * Premium Stat Card Component
 * 
 * KPI/metric display card with clean typography hierarchy
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MarketingCard as Card } from './Card';
import { theme } from '../../theme';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';

const StatContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[2],
});

const StatValue = styled(Typography)({
  fontSize: theme.typography.fontSize['2xl'],
  fontWeight: theme.typography.fontWeight.bold,
  lineHeight: theme.typography.lineHeight.tight,
  color: theme.colors.text.primary,
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: theme.typography.letterSpacing.tight,
});

const StatLabel = styled(Typography)({
  fontSize: theme.typography.fontSize.sm,
  fontWeight: theme.typography.fontWeight.regular,
  color: theme.colors.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: theme.typography.letterSpacing.wide,
});

const TrendIndicator = styled(Box)<{ trend: 'up' | 'down' | 'neutral' }>(({ trend }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  fontSize: theme.typography.fontSize.sm,
  fontWeight: theme.typography.fontWeight.medium,
  color: trend === 'up' 
    ? theme.colors.success[500]
    : trend === 'down'
    ? theme.colors.error[500]
    : theme.colors.text.tertiary,
}));

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  subtitle,
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-US').format(val);
    }
    return val;
  };

  return (
    <Card>
      <StatContent>
        <StatLabel>{label}</StatLabel>
        <StatValue>{formatValue(value)}</StatValue>
        {trend && (
          <TrendIndicator trend={trend.direction}>
            {trend.direction === 'up' && <TrendingUpOutlinedIcon sx={{ fontSize: 16 }} />}
            {trend.direction === 'down' && <TrendingDownOutlinedIcon sx={{ fontSize: 16 }} />}
            <span>{Math.abs(trend.value)}%</span>
          </TrendIndicator>
        )}
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              marginTop: theme.spacing[1],
            }}
          >
            {subtitle}
          </Typography>
        )}
      </StatContent>
    </Card>
  );
};

