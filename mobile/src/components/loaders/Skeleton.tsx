/**
 * Skeleton Loader Component
 * 
 * Platform-aware skeleton loader with shimmer effect
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  variant?: 'rectangular' | 'circular' | 'text';
  style?: ViewStyle;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  variant = 'rectangular',
  style,
  animated = true,
}) => {
  const theme = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Disable useNativeDriver on web as it's not supported
      const useNativeDriver = Platform.OS !== 'web';
      
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver,
          }),
        ])
      );
      shimmer.start();
      return () => shimmer.stop();
    }
  }, [animated, shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const baseStyle: ViewStyle = {
    width,
    height: variant === 'circular' ? width : height,
    borderRadius: variant === 'circular' ? (typeof width === 'number' ? width / 2 : 50) : borderRadius,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  };

  if (animated) {
    return (
      <Animated.View
        style={[
          baseStyle,
          { opacity },
          style,
        ]}
      />
    );
  }

  return <View style={[baseStyle, style]} />;
};

/**
 * Skeleton Card - Pre-configured for card layouts
 */
export interface SkeletonCardProps {
  count?: number;
  style?: ViewStyle;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  count = 1,
  style,
}) => {
  const theme = useTheme();

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
            Platform.OS === 'android' && styles.androidCard,
            Platform.OS === 'ios' && styles.iosCard,
            style,
          ]}
        >
          <Skeleton width="60%" height={20} style={styles.titleSkeleton} />
          <Skeleton width="100%" height={16} style={styles.textSkeleton} />
          <Skeleton width="80%" height={16} style={styles.textSkeleton} />
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  androidCard: {
    elevation: 2,
  },
  iosCard: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    web: {
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    default: {},
  }) as ViewStyle,
  titleSkeleton: {
    marginBottom: 12,
  },
  textSkeleton: {
    marginBottom: 8,
  },
});






