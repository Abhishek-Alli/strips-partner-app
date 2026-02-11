/**
 * Premium Mobile Primary Button Component
 * 
 * Confident primary action with proper touch feedback
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  size = 'md',
  style,
}) => {
  const sizeStyles = {
    sm: {
      height: theme.components.button.height.sm,
      paddingHorizontal: parseInt(theme.spacing[4]),
      fontSize: parseInt(theme.typography.fontSize.sm),
    },
    md: {
      height: theme.components.button.height.md,
      paddingHorizontal: parseInt(theme.spacing[6]),
      fontSize: parseInt(theme.typography.fontSize.base),
    },
    lg: {
      height: theme.components.button.height.lg,
      paddingHorizontal: parseInt(theme.spacing[8]),
      fontSize: parseInt(theme.typography.fontSize.lg),
    },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.text.inverse} />
      ) : (
        <Text style={[styles.text, { fontSize: sizeStyles[size].fontSize }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary[700],
    borderRadius: parseInt(theme.components.button.radius),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  text: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.medium,
    letterSpacing: theme.typography.letterSpacing.normal,
  },
  disabled: {
    backgroundColor: theme.colors.neutral[300],
    opacity: 0.6,
  },
});






