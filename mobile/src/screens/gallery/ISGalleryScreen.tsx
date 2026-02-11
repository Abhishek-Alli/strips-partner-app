/**
 * IS Gallery Screen
 *
 * Displays grid of IS (Indian Standards) images
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 3;

interface GalleryImage {
  id: string;
  title: string;
  uri: string;
}

const sampleImages: GalleryImage[] = [
  { id: '1', title: 'IS 456:2000 - Concrete', uri: 'https://picsum.photos/300/300?random=20' },
  { id: '2', title: 'IS 800:2007 - Steel', uri: 'https://picsum.photos/300/300?random=21' },
  { id: '3', title: 'IS 1893 - Seismic', uri: 'https://picsum.photos/300/300?random=22' },
  { id: '4', title: 'IS 875 - Loads', uri: 'https://picsum.photos/300/300?random=23' },
  { id: '5', title: 'IS 2502 - Bending', uri: 'https://picsum.photos/300/300?random=24' },
  { id: '6', title: 'IS 516 - Testing', uri: 'https://picsum.photos/300/300?random=25' },
  { id: '7', title: 'IS 383 - Aggregates', uri: 'https://picsum.photos/300/300?random=26' },
  { id: '8', title: 'IS 269 - Cement', uri: 'https://picsum.photos/300/300?random=27' },
  { id: '9', title: 'IS 1786 - Rebars', uri: 'https://picsum.photos/300/300?random=28' },
  { id: '10', title: 'IS 10262 - Mix Design', uri: 'https://picsum.photos/300/300?random=29' },
  { id: '11', title: 'IS 3370 - Tanks', uri: 'https://picsum.photos/300/300?random=30' },
  { id: '12', title: 'IS 4326 - Earthquake', uri: 'https://picsum.photos/300/300?random=31' },
];

const ISGalleryScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleImagePress = (image: GalleryImage, index: number) => {
    navigation.navigate('GalleryDetail', {
      images: sampleImages,
      currentIndex: index,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IS Gallery</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Indian Standards Reference</Text>
        <Text style={styles.imageCount}>{sampleImages.length} Images</Text>

        <View style={styles.imagesGrid}>
          {sampleImages.map((image, index) => (
            <TouchableOpacity
              key={image.id}
              style={styles.imageContainer}
              onPress={() => handleImagePress(image, index)}
            >
              <Image
                source={{ uri: image.uri }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  imageCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageContainer: {
    width: imageSize,
    height: imageSize,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bottomPadding: {
    height: 30,
  },
});

export default ISGalleryScreen;
