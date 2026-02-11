/**
 * Primary Button Component
 * 
 * Platform-aware button following Material Design (Android) and HIG (iOS)
 */

import React from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  // Android: Use TouchableNativeFeedback for ripple effect
  if (Platform.OS === 'android' && variant === 'primary') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        disabled={isDisabled}
        background={TouchableNativeFeedback.Ripple(
          theme.colors.overlay,
          false
        )}
      >
        <View
          style={[
            styles.container,
            styles.android,
            styles[size],
            fullWidth && styles.fullWidth,
            variant === 'primary' && {
              backgroundColor: isDisabled
                ? theme.colors.text.tertiary
                : theme.colors.primary,
            },
            variant === 'secondary' && {
              backgroundColor: isDisabled
                ? theme.colors.text.tertiary
                : theme.colors.secondary,
            },
            variant === 'outline' && {
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: isDisabled
                ? theme.colors.text.tertiary
                : theme.colors.primary,
            },
            isDisabled && styles.disabled,
            style,
          ]}
        >
          {loading ? (
            <ActivityIndicator
              color={variant === 'outline' ? theme.colors.primary : '#FFFFFF'}
              size="small"
            />
          ) : (
            <Text
              style={[
                styles.text,
                styles[`${size}Text`],
                variant === 'outline'
                  ? { color: isDisabled ? theme.colors.text.tertiary : theme.colors.primary }
                  : { color: '#FFFFFF' },
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
        </View>
      </TouchableNativeFeedback>
    );
  }

  // iOS: Use TouchableOpacity with subtle feedback
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        styles.ios,
        styles[size],
        fullWidth && styles.fullWidth,
        variant === 'primary' && {
          backgroundColor: isDisabled
            ? theme.colors.text.tertiary
            : theme.colors.primary,
        },
        variant === 'secondary' && {
          backgroundColor: isDisabled
            ? theme.colors.text.tertiary
            : theme.colors.secondary,
        },
        variant === 'outline' && {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: isDisabled
            ? theme.colors.text.tertiary
            : theme.colors.primary,
        },
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? theme.colors.primary : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`${size}Text`],
            variant === 'outline'
              ? { color: isDisabled ? theme.colors.text.tertiary : theme.colors.primary }
              : { color: '#FFFFFF' },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  android: {
    elevation: 2,
  },
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});






