/**
 * Premium Mobile Skeleton Loader
 * 
 * Subtle loading state for mobile
 */

import React from 'react';
import { View, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { theme } from '../../theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = parseInt(theme.radius.md),
  style,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Disable useNativeDriver on web as it's not supported
    const useNativeDriver = Platform.OS !== 'web';
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: theme.colors.background.secondary,
  },
});

// Pre-configured skeletons
export const CardSkeleton = () => (
  <View style={{ padding: parseInt(theme.spacing[4]) }}>
    <SkeletonLoader height={200} borderRadius={parseInt(theme.radius.lg)} />
    <View style={{ marginTop: parseInt(theme.spacing[4]) }}>
      <SkeletonLoader width="60%" height={24} style={{ marginBottom: parseInt(theme.spacing[2]) }} />
      <SkeletonLoader width="100%" height={16} style={{ marginBottom: parseInt(theme.spacing[1]) }} />
      <SkeletonLoader width="80%" height={16} />
    </View>
  </View>
);






