import React from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 100,
  style
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
          useNativeDriver
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver
        })
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7]
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, opacity },
        style
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8
  }
});






