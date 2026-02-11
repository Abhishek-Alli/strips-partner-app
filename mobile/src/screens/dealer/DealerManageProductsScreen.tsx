/**
 * Dealer Manage Products Screen
 *
 * Displays list of products with add/edit/delete functionality
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
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Acel Switch',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    image: 'https://picsum.photos/200/150?random=70',
    isActive: true,
  },
  {
    id: '2',
    name: 'Acel Switch',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    image: 'https://picsum.photos/200/150?random=71',
    isActive: true,
  },
  {
    id: '3',
    name: 'Acel Switch',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    image: 'https://picsum.photos/200/150?random=72',
    isActive: true,
  },
  {
    id: '4',
    name: 'Acel Switch',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    image: 'https://picsum.photos/200/150?random=73',
    isActive: false,
  },
  {
    id: '5',
    name: 'Acel Switch',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    image: 'https://picsum.photos/200/150?random=74',
    isActive: true,
  },
];

const DealerManageProductsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [selectedProduct, setSelectedProduct] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProducts(products.filter((p) => p.id !== productId));
          },
        },
      ]
    );
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('DealerProductDetails', { product });
  };

  const handleAddProduct = () => {
    setSelectedProduct('');
    setDescription('');
    setImages([]);
    setVideos([]);
    setShowAddModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setSelectedProduct(product.name);
    setDescription(product.description);
    setImages(['https://picsum.photos/100/100?random=80', 'https://picsum.photos/100/100?random=81']);
    setVideos(['https://picsum.photos/100/100?random=82', 'https://picsum.photos/100/100?random=83']);
    setShowEditModal(true);
  };

  const handleAddImage = () => {
    const newImage = `https://picsum.photos/100/100?random=${Date.now()}`;
    setImages([...images, newImage]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddVideo = () => {
    const newVideo = `https://picsum.photos/100/100?random=${Date.now() + 1}`;
    setVideos([...videos, newVideo]);
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleSubmitAdd = () => {
    setShowAddModal(false);
    // Add product logic
  };

  const handleSubmitEdit = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    // Update product logic
  };

  const renderProductItem = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productItem}
      onPress={() => handleProductPress(product)}
    >
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>
      </View>
      <View style={styles.productActions}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: product.isActive ? '#FF6B35' : '#9E9E9E' },
          ]}
        />
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteProduct(product.id)}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderAddEditModal = (isEdit: boolean) => (
    <Modal
      visible={isEdit ? showEditModal : showAddModal}
      transparent
      animationType="slide"
      onRequestClose={() => (isEdit ? setShowEditModal(false) : setShowAddModal(false))}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEdit ? 'Edit Product' : 'Add Product'}
            </Text>
            <TouchableOpacity
              onPress={() => (isEdit ? setShowEditModal(false) : setShowAddModal(false))}
            >
              <Text style={styles.modalClose}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Product Dropdown */}
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>
                {selectedProduct || 'Select Product'}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            {/* Description */}
            <TextInput
              style={styles.descriptionInput}
              placeholder="Description..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            {/* Images Section */}
            <Text style={styles.sectionLabel}>Image</Text>
            <View style={styles.mediaContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.mediaItem}>
                  <Image source={{ uri }} style={styles.mediaImage} />
                  <TouchableOpacity
                    style={styles.removeMediaButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Text style={styles.removeMediaIcon}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addMediaButton} onPress={handleAddImage}>
                <Text style={styles.addMediaIcon}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Videos Section */}
            <Text style={styles.sectionLabel}>Videos</Text>
            <View style={styles.mediaContainer}>
              {videos.map((uri, index) => (
                <View key={index} style={styles.mediaItem}>
                  <Image source={{ uri }} style={styles.mediaImage} />
                  <View style={styles.playOverlay}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeMediaButton}
                    onPress={() => handleRemoveVideo(index)}
                  >
                    <Text style={styles.removeMediaIcon}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addMediaButton} onPress={handleAddVideo}>
                <Text style={styles.addMediaIcon}>+</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={isEdit ? handleSubmitEdit : handleSubmitAdd}
          >
            <Text style={styles.submitButtonText}>
              {isEdit ? 'Update' : 'ADD'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Products</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {products.map((product) => renderProductItem(product))}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Add New Product Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>+ Add New Product</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      {renderAddEditModal(false)}
      {renderAddEditModal(true)}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  menuButton: {
    padding: 4,
  },
  menuIcon: {
    fontSize: 24,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 20,
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
    }),
  },
  addButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalClose: {
    fontSize: 28,
    color: '#666',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  descriptionInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  mediaItem: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaImage: {
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
  playIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  removeMediaButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeMediaIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: -2,
  },
  addMediaButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  addMediaIcon: {
    fontSize: 32,
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default DealerManageProductsScreen;
