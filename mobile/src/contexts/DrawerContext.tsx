/**
 * Custom Drawer Context
 *
 * Provides drawer open/close functionality without @react-navigation/drawer
 * This avoids react-native-reanimated version compatibility issues
 */

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';

interface DrawerContextType {
  openDrawer: () => void;
  closeDrawer: () => void;
  isOpen: boolean;
}

const DrawerContext = createContext<DrawerContextType>({
  openDrawer: () => {},
  closeDrawer: () => {},
  isOpen: false,
});

export const useDrawer = () => useContext(DrawerContext);

interface DrawerProviderProps {
  drawerContent: React.ReactNode;
  children: React.ReactNode;
  drawerWidth?: number;
}

export const DrawerProvider: React.FC<DrawerProviderProps> = ({
  drawerContent,
  children,
  drawerWidth: customWidth,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const drawerWidth = customWidth || screenWidth * 0.8;
  const [isOpen, setIsOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-drawerWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const openDrawer = useCallback(() => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateX, overlayOpacity]);

  const closeDrawer = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -drawerWidth,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
    });
  }, [translateX, overlayOpacity, drawerWidth]);

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer, isOpen }}>
      <View style={styles.container}>
        {/* Main content */}
        {children}

        {/* Overlay */}
        {isOpen && (
          <TouchableWithoutFeedback onPress={closeDrawer}>
            <Animated.View
              style={[
                styles.overlay,
                { opacity: overlayOpacity },
              ]}
            />
          </TouchableWithoutFeedback>
        )}

        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              width: drawerWidth,
              transform: [{ translateX }],
            },
          ]}
        >
          {drawerContent}
        </Animated.View>
      </View>
    </DrawerContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: '2px 0 10px rgba(0,0,0,0.25)',
      },
    }),
  },
});
