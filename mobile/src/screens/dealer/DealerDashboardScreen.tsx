/**
 * Dealer Dashboard Screen
 *
 * Main dashboard for dealers showing customers contacted, enquiries, and product catalogue
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  time: string;
}

interface Product {
  id: string;
  name: string;
  image: string;
}

const sampleCustomers: Customer[] = [
  { id: '1', name: 'Alok Das', email: 'example@gmail.com', phone: '9123456780' },
  { id: '2', name: 'Alok Das', email: 'example@gmail.com', phone: '9123456780' },
  { id: '3', name: 'Alok Das', email: 'example@gmail.com', phone: '9123456780' },
  { id: '4', name: 'Alok Das', email: 'example@gmail.com', phone: '9123456780' },
  { id: '5', name: 'Alok Das', email: 'example@gmail.com', phone: '9123456780' },
];

const sampleEnquiries: Enquiry[] = [
  {
    id: '1',
    name: 'Alok Das',
    email: 'example@gmail.com',
    phone: '9123456780',
    topic: 'Sed ut perspiciatis',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim nostrud exercitation...',
    time: '2 mins ago',
  },
  {
    id: '2',
    name: 'Alok Das',
    email: 'example@gmail.com',
    phone: '9123456780',
    topic: 'Sed ut perspiciatis',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim nostrud exercitation...',
    time: '2 mins ago',
  },
];

const sampleProducts: Product[] = [
  { id: '1', name: 'WBC Stand', image: 'https://picsum.photos/150/100?random=60' },
  { id: '2', name: 'Cements', image: 'https://picsum.photos/150/100?random=61' },
  { id: '3', name: 'Rockwool Brick', image: 'https://picsum.photos/150/100?random=62' },
  { id: '4', name: 'Acel Switch', image: 'https://picsum.photos/150/100?random=63' },
];

const DealerDashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryTopic, setEnquiryTopic] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const handleRemoveCustomer = (_customerId: string) => {
    // Remove customer logic
  };

  const handleSubmitEnquiry = () => {
    setShowEnquiryModal(false);
    setEnquiryTopic('');
    setEnquiryMessage('');
  };

  const renderCustomerItem = (customer: Customer) => (
    <View key={customer.id} style={styles.customerItem}>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{customer.name}</Text>
        <View style={styles.customerContact}>
          <Text style={styles.customerEmail}>📧 {customer.email}</Text>
          <Text style={styles.customerPhone}>📞 {customer.phone}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleRemoveCustomer(customer.id)}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEnquiryItem = (enquiry: Enquiry) => (
    <View key={enquiry.id} style={styles.enquiryItem}>
      <View style={styles.enquiryHeader}>
        <View>
          <Text style={styles.enquiryName}>{enquiry.name}</Text>
          <Text style={styles.enquiryEmail}>📧 {enquiry.email}</Text>
          <Text style={styles.enquiryPhone}>📞 {enquiry.phone}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.enquiryTopic}>Topic: {enquiry.topic}</Text>
      <Text style={styles.enquiryMessage} numberOfLines={3}>
        {enquiry.message}
      </Text>
    </View>
  );

  const renderProductItem = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => navigation.navigate('DealerProductDetails', { product })}
    >
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dealer Dashboard</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dealer Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>LO{'\n'}GO</Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ 4.5</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.businessName}>Serines Deals and Traders</Text>
              <Text style={styles.businessLocation}>📍 Location: Ganeshguri</Text>
              <Text style={styles.businessContact}>Contact information: 9123456780</Text>
              <Text style={styles.businessDistance}>5 km away</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>30</Text>
              <Text style={styles.statLabel}>Customers{'\n'}Contacted</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowEnquiryModal(true)}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Customers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Customers Contacted</Text>
          </View>
          {sampleCustomers.slice(0, 5).map((customer) => renderCustomerItem(customer))}
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Enquiries Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>30</Text>
                <Text style={styles.statLabel}>Customers{'\n'}Enquiries</Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowEnquiryModal(true)}
              >
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          </View>
          {sampleEnquiries.map((enquiry) => renderEnquiryItem(enquiry))}
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Product Catalogue */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>List of product catalogue</Text>
          <View style={styles.productsGrid}>
            {sampleProducts.map((product) => renderProductItem(product))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Enquiry Modal */}
      <Modal
        visible={showEnquiryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEnquiryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enquiry</Text>
              <TouchableOpacity onPress={() => setShowEnquiryModal(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownText}>
                {enquiryTopic || 'Topic'}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </View>

            <TextInput
              style={styles.enquiryInput}
              placeholder="Enquiry"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={enquiryMessage}
              onChangeText={setEnquiryMessage}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitEnquiry}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  logoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  logoText: {
    width: 60,
    height: 60,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    lineHeight: 30,
    paddingTop: 8,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -8,
    left: 10,
    backgroundColor: '#C62828',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  businessLocation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  businessContact: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  businessDistance: {
    fontSize: 13,
    color: '#999',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  customerContact: {
    flexDirection: 'row',
    gap: 16,
  },
  customerEmail: {
    fontSize: 13,
    color: '#666',
  },
  customerPhone: {
    fontSize: 13,
    color: '#666',
  },
  removeText: {
    fontSize: 13,
    color: '#FF6B35',
    fontWeight: '500',
  },
  enquiryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  enquiryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  enquiryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  enquiryEmail: {
    fontSize: 12,
    color: '#666',
  },
  enquiryPhone: {
    fontSize: 12,
    color: '#666',
  },
  enquiryTopic: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  enquiryMessage: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  seeAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '47%',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 80,
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    padding: 8,
  },
  bottomPadding: {
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
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
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#666',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  enquiryInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#9E9E9E',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default DealerDashboardScreen;
