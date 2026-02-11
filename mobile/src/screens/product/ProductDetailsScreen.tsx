/**
 * Product Details Screen
 *
 * Shows detailed product information with:
 * - Product image header
 * - Title and description
 * - Images gallery
 * - Videos gallery
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
  Modal,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

// Sample data
const sampleProduct = {
  id: '1',
  name: 'MBC Steel',
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
  images: [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ],
  videos: [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ],
};

const ProductDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const productId = (route.params as any)?.productId;

  const product = sampleProduct;

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.productImageContainer}>
          <View style={styles.productImage} />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>

        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          <View style={styles.mediaGrid}>
            {product.images.map((img) => (
              <TouchableOpacity key={img.id} style={styles.mediaItem}>
                <View style={styles.mediaPlaceholder} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Videos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Videos</Text>
          <View style={styles.mediaGrid}>
            {product.videos.map((video) => (
              <TouchableOpacity key={video.id} style={styles.mediaItem}>
                <View style={styles.videoPlaceholder}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 28,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  productImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
  },
  productImage: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaItem: {
    width: '31%',
    aspectRatio: 1,
  },
  mediaPlaceholder: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: '#666',
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProductDetailsScreen;
