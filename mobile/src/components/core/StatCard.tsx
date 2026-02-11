/**
 * Premium Mobile Stat Card Component
 * 
 * Clean metric display with clear hierarchy
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { theme } from '../../theme';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  trend,
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-US').format(val);
    }
    return val;
  };

  const trendColor =
    trend?.direction === 'up'
      ? theme.colors.success[500]
      : trend?.direction === 'down'
      ? theme.colors.error[500]
      : theme.colors.text.tertiary;

  return (
    <Card variant="default">
      <View style={styles.container}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <Text style={styles.value}>{formatValue(value)}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Text style={[styles.trend, { color: trendColor }]}>
              {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '—'}{' '}
              {Math.abs(trend.value)}%
            </Text>
          </View>
        )}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing[2],
  },
  label: {
    fontSize: parseInt(theme.typography.fontSize.xs),
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.secondary,
    letterSpacing: 1,
  },
  value: {
    fontSize: parseInt(theme.typography.fontSize['2xl']),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  trendContainer: {
    marginTop: theme.spacing[1],
  },
  trend: {
    fontSize: parseInt(theme.typography.fontSize.sm),
    fontWeight: theme.typography.fontWeight.medium,
  },
  subtitle: {
    fontSize: parseInt(theme.typography.fontSize.xs),
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing[1],
  },
});






