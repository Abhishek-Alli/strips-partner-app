/**
 * Icon Button Component
 * 
 * Platform-aware icon button with proper touch feedback
 */

import React from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
  View,
  Platform,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'contained' | 'outlined';
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  disabled = false,
  size = 'medium',
  variant = 'default',
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();

  const sizeStyles = {
    small: 32,
    medium: 40,
    large: 48,
  };

  const buttonSize = sizeStyles[size];

  // Android: Use ripple effect
  if (Platform.OS === 'android' && variant === 'contained') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        disabled={disabled}
        background={TouchableNativeFeedback.Ripple(
          theme.colors.overlay,
          true
        )}
        accessibilityLabel={accessibilityLabel}
      >
        <View
          style={[
            styles.container,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
            },
            variant === 'contained' && {
              backgroundColor: theme.colors.primary,
            },
            variant === 'outlined' && {
              borderWidth: 1,
              borderColor: theme.colors.border,
            },
            disabled && styles.disabled,
            style,
          ]}
        >
          {icon}
        </View>
      </TouchableNativeFeedback>
    );
  }

  // iOS: Use opacity feedback
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.container,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
        },
        variant === 'contained' && {
          backgroundColor: theme.colors.primary,
        },
        variant === 'outlined' && {
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
});






