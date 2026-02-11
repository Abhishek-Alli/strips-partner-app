/**
 * Dealer Product Details Screen
 *
 * Displays product details with images, videos, and edit toggle
 */

import React, { useState } from 'react';
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
  Switch,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
}

type RouteParams = {
  DealerProductDetails: {
    product: Product;
  };
};

const sampleImages = [
  'https://picsum.photos/200/150?random=90',
  'https://picsum.photos/200/150?random=91',
  'https://picsum.photos/200/150?random=92',
  'https://picsum.photos/200/150?random=93',
  'https://picsum.photos/200/150?random=94',
  'https://picsum.photos/200/150?random=95',
];

const sampleVideos = [
  'https://picsum.photos/200/150?random=96',
  'https://picsum.photos/200/150?random=97',
  'https://picsum.photos/200/150?random=98',
  'https://picsum.photos/200/150?random=99',
];

const DealerProductDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'DealerProductDetails'>>();
  const { product } = route.params || {};

  const [isEditing, setIsEditing] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const renderImageItem = (uri: string, index: number) => (
    <TouchableOpacity key={index} style={styles.galleryItem}>
      <Image source={{ uri }} style={styles.galleryImage} />
    </TouchableOpacity>
  );

  const renderVideoItem = (uri: string, index: number) => (
    <TouchableOpacity key={index} style={styles.galleryItem}>
      <Image source={{ uri }} style={styles.galleryImage} />
      <View style={styles.playOverlay}>
        <View style={styles.playButton}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.mainImageContainer}>
          <Image
            source={{ uri: product?.image || 'https://picsum.photos/400/300?random=100' }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product?.name || 'Acel Switch'}</Text>
          <Text style={styles.productDescription}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum.
          </Text>
          <Text style={styles.productDescription}>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
            doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
            inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
            sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
            sit amet, consectetur, adipisci velit, sed quia non numquam eius modi
            tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
          </Text>
          <Text style={styles.productDescription}>
            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
            suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
            autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
            molestiae consequatur, vel illum dolorem eum fugiat quo voluptas nulla
            pariatur.
          </Text>
        </View>

        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          <View style={styles.galleryGrid}>
            {sampleImages.map((uri, index) => renderImageItem(uri, index))}
          </View>
        </View>

        {/* Videos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Videos</Text>
          <View style={styles.galleryGrid}>
            {sampleVideos.map((uri, index) => renderVideoItem(uri, index))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Edit Toggle */}
      <View style={styles.editBar}>
        <Text style={styles.editLabel}>Edit</Text>
        <Switch
          value={isEditing}
          onValueChange={setIsEditing}
          trackColor={{ false: '#E0E0E0', true: '#82B1FF' }}
          thumbColor={isEditing ? '#2196F3' : '#FFFFFF'}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 20,
    color: '#FF6B35',
  },
  content: {
    flex: 1,
  },
  mainImageContainer: {
    width: '100%',
    height: width * 0.6,
    backgroundColor: '#F5F5F5',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryItem: {
    position: 'relative',
    width: (width - 48) / 3,
    height: (width - 48) / 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 14,
    color: '#333',
    marginLeft: 3,
  },
  bottomPadding: {
    height: 80,
  },
  editBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
    }),
  },
  editLabel: {
    fontSize: 16,
    color: '#666',
  },
});

export default DealerProductDetailsScreen;
