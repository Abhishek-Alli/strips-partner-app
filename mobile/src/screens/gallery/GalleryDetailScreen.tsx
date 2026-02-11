/**
 * Gallery Detail Screen
 *
 * Full screen image viewer with title and prev/next navigation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface GalleryImage {
  id: string;
  title: string;
  uri: string;
}

type RouteParams = {
  GalleryDetail: {
    images: GalleryImage[];
    currentIndex: number;
  };
};

const GalleryDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'GalleryDetail'>>();

  const { images = [], currentIndex = 0 } = route.params || {};
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  const currentImage = images[activeIndex];

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < images.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  if (!currentImage) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Image not found</Text>
          <TouchableOpacity style={styles.backButtonAlt} onPress={handleBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleBack}>
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentImage.title}
          </Text>
          <View style={styles.headerRight}>
            <Text style={styles.imageCounter}>
              {activeIndex + 1}/{images.length}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: currentImage.uri }}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Navigation Arrows */}
        {activeIndex > 0 && (
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonLeft]}
            onPress={handlePrevious}
          >
            <View style={styles.navButtonInner}>
              <Text style={styles.navButtonIcon}>‹</Text>
            </View>
          </TouchableOpacity>
        )}

        {activeIndex < images.length - 1 && (
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonRight]}
            onPress={handleNext}
          >
            <View style={styles.navButtonInner}>
              <Text style={styles.navButtonIcon}>›</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Footer with title */}
      <SafeAreaView style={styles.footerSafe}>
        <View style={styles.footer}>
          <Text style={styles.imageTitle}>{currentImage.title}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerSafe: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    marginTop: -2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerRight: {
    minWidth: 36,
    alignItems: 'flex-end',
  },
  imageCounter: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height * 0.7,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -25,
    padding: 10,
  },
  navButtonLeft: {
    left: 10,
  },
  navButtonRight: {
    right: 10,
  },
  navButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  footerSafe: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  imageTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  backButtonAlt: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default GalleryDetailScreen;
