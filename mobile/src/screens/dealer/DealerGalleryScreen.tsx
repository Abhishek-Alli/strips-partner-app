/**
 * Dealer Gallery Screen (IS Gallery)
 *
 * Image grid with detail view and prev/next navigation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

const categories = ['All', 'Products', 'Projects', 'Events', 'Office'];

const sampleImages: GalleryImage[] = [
  { id: '1', title: 'Steel Products', description: 'High quality TMT bars', image: 'https://picsum.photos/400/300?random=80', category: 'Products' },
  { id: '2', title: 'Construction Site', description: 'Building project Phase 1', image: 'https://picsum.photos/400/300?random=81', category: 'Projects' },
  { id: '3', title: 'Annual Meet 2025', description: 'Dealer conference event', image: 'https://picsum.photos/400/300?random=82', category: 'Events' },
  { id: '4', title: 'Cement Products', description: 'Premium grade cement', image: 'https://picsum.photos/400/300?random=83', category: 'Products' },
  { id: '5', title: 'Office Interior', description: 'New office setup', image: 'https://picsum.photos/400/300?random=84', category: 'Office' },
  { id: '6', title: 'Rockwool Insulation', description: 'Fireproof insulation material', image: 'https://picsum.photos/400/300?random=85', category: 'Products' },
  { id: '7', title: 'Bridge Project', description: 'Highway bridge construction', image: 'https://picsum.photos/400/300?random=86', category: 'Projects' },
  { id: '8', title: 'Award Ceremony', description: 'Best dealer award 2025', image: 'https://picsum.photos/400/300?random=87', category: 'Events' },
  { id: '9', title: 'Electrical Products', description: 'Switches and panels', image: 'https://picsum.photos/400/300?random=88', category: 'Products' },
];

const DealerGalleryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const filteredImages = activeCategory === 'All'
    ? sampleImages
    : sampleImages.filter(img => img.category === activeCategory);

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
  };

  const goToPrev = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < filteredImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const selectedImage = selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null;
  const imageWidth = (screenWidth - 48) / 2;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gallery</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, activeCategory === cat && styles.tabActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Image Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filteredImages.map((img, index) => (
            <TouchableOpacity
              key={img.id}
              style={[styles.imageCard, { width: imageWidth }]}
              onPress={() => openImage(index)}
            >
              <Image source={{ uri: img.image }} style={[styles.gridImage, { width: imageWidth, height: imageWidth * 0.75 }]} />
              <View style={styles.imageInfo}>
                <Text style={styles.imageTitle} numberOfLines={1}>{img.title}</Text>
                <Text style={styles.imageDesc} numberOfLines={1}>{img.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {filteredImages.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="image" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No images in this category</Text>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Image Detail Modal */}
      <Modal
        visible={selectedImageIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={closeImage}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedImage?.title || ''}</Text>
              <TouchableOpacity onPress={closeImage}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Image */}
            <Image
              source={{ uri: selectedImage?.image || '' }}
              style={styles.fullImage}
              resizeMode="contain"
            />

            {/* Description */}
            <Text style={styles.modalDescription}>{selectedImage?.description}</Text>

            {/* Navigation */}
            <View style={styles.navButtons}>
              <TouchableOpacity
                style={[styles.navButton, selectedImageIndex === 0 && styles.navButtonDisabled]}
                onPress={goToPrev}
                disabled={selectedImageIndex === 0}
              >
                <MaterialIcons name="chevron-left" size={28} color={selectedImageIndex === 0 ? '#CCC' : '#FF6B35'} />
                <Text style={[styles.navButtonText, selectedImageIndex === 0 && styles.navButtonTextDisabled]}>Previous</Text>
              </TouchableOpacity>

              <Text style={styles.imageCounter}>
                {selectedImageIndex !== null ? selectedImageIndex + 1 : 0} / {filteredImages.length}
              </Text>

              <TouchableOpacity
                style={[styles.navButton, selectedImageIndex === filteredImages.length - 1 && styles.navButtonDisabled]}
                onPress={goToNext}
                disabled={selectedImageIndex === filteredImages.length - 1}
              >
                <Text style={[styles.navButtonText, selectedImageIndex === filteredImages.length - 1 && styles.navButtonTextDisabled]}>Next</Text>
                <MaterialIcons name="chevron-right" size={28} color={selectedImageIndex === filteredImages.length - 1 ? '#CCC' : '#FF6B35'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  menuButton: { padding: 4 },
  tabsContainer: { backgroundColor: '#FFFFFF', maxHeight: 50 },
  tabsContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5F5F5' },
  tabActive: { backgroundColor: '#FF6B35' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#666' },
  tabTextActive: { color: '#FFFFFF' },
  content: { flex: 1, padding: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
  },
  gridImage: {
    backgroundColor: '#F0F0F0',
  },
  imageInfo: {
    padding: 8,
  },
  imageTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  imageDesc: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  fullImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#F0F0F0',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    padding: 16,
    lineHeight: 20,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#CCC',
  },
  imageCounter: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default DealerGalleryScreen;
