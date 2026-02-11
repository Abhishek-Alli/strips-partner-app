/**
 * Premium Mobile Card Component
 * 
 * Clean, gesture-friendly card with subtle elevation
 */

import React from 'react';
import { View, ViewStyle, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { theme } from '../../theme';
import { Platform } from 'react-native';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
  onPress,
  ...props
}) => {
  const variantStyles = {
    default: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.components.card.radius,
      padding: theme.components.card.padding,
      ...(Platform.OS === 'ios'
        ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }
        : {
            elevation: 2,
          }),
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    elevated: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.components.card.radius,
      padding: theme.components.card.padding,
      ...(Platform.OS === 'ios'
        ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          }
        : {
            elevation: 4,
          }),
    },
    outlined: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.components.card.radius,
      padding: theme.components.card.padding,
      borderWidth: 1,
      borderColor: theme.colors.border.medium,
    },
  };

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[variantStyles[variant], style]}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      {...props}
    >
      {children}
    </Component>
  );
};






