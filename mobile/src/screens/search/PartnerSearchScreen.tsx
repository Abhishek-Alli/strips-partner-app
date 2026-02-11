/**
 * Partner/Dealer Search Screen
 *
 * Search and filter partners/dealers with:
 * - Partner/Dealer toggle tabs
 * - Search by keyword
 * - Location filter
 * - Category and Rating filters
 * - Save search functionality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

type SearchType = 'partner' | 'dealer';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  rating: number;
  avatar?: string;
}

// Sample data
const samplePartners: SearchResult[] = [
  { id: '1', name: 'XYZ Name', category: 'Architect', rating: 4.5 },
  { id: '2', name: 'ABC Partner', category: 'Engineer', rating: 4.8 },
  { id: '3', name: 'Design Studio', category: 'Vaastu Expert', rating: 4.2 },
  { id: '4', name: 'Build Pro', category: 'Architect', rating: 4.6 },
  { id: '5', name: 'Steel Works', category: 'Engineer', rating: 4.3 },
];

const sampleDealers: SearchResult[] = [
  { id: '1', name: 'Steel Mart', category: 'Steel Dealer', rating: 4.7 },
  { id: '2', name: 'Metal Hub', category: 'Metal Supplier', rating: 4.4 },
  { id: '3', name: 'Iron Works', category: 'Steel Dealer', rating: 4.1 },
  { id: '4', name: 'Quality Steel', category: 'Steel Dealer', rating: 4.9 },
];

const categories = ['All', 'Architect', 'Engineer', 'Vaastu Expert', 'Contractor'];
const ratings = ['All', '4.5+', '4.0+', '3.5+', '3.0+'];

const PartnerSearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchType, setSearchType] = useState<SearchType>('partner');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');

  const results = searchType === 'partner' ? samplePartners : sampleDealers;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLocationSelect = () => {
    setShowLocationModal(true);
  };

  const handleResultPress = (item: SearchResult) => {
    if (searchType === 'partner') {
      navigation.navigate('PartnerProfile' as never, { partnerId: item.id } as never);
    } else {
      navigation.navigate('DealerProfile' as never, { dealerId: item.id } as never);
    }
  };

  const handleSaveSearch = () => {
    // Save search logic
  };

  const renderResultItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity style={styles.resultCard} onPress={() => handleResultPress(item)}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultCategory}>{item.category}</Text>
      </View>
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>{item.rating}</Text>
        <Text style={styles.starIcon}>★</Text>
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
        <Text style={styles.headerTitle}>Search</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Toggle Tabs */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleTab, searchType === 'partner' && styles.toggleTabActive]}
          onPress={() => setSearchType('partner')}
        >
          <Text style={[styles.toggleText, searchType === 'partner' && styles.toggleTextActive]}>
            Search Partner
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleTab, searchType === 'dealer' && styles.toggleTabActive]}
          onPress={() => setSearchType('dealer')}
        >
          <Text style={[styles.toggleText, searchType === 'dealer' && styles.toggleTextActive]}>
            Search Dealer
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Type keyword to search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Location Row */}
        <View style={styles.locationRow}>
          <TouchableOpacity style={styles.locationButton} onPress={handleLocationSelect}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{location || 'Select Location'}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.keywordsButton}>
            <Text style={styles.keywordsText}>Recommended keywords</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Results List */}
      <FlatList
        data={results}
        renderItem={renderResultItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No results found</Text>
          </View>
        }
      />

      {/* Bottom Filter Bar */}
      <View style={styles.bottomBar}>
        {/* Category Dropdown */}
        <TouchableOpacity
          style={styles.filterDropdown}
          onPress={() => setShowCategoryDropdown(true)}
        >
          <Text style={styles.filterLabel}>Category</Text>
          <Text style={styles.filterValue}>{selectedCategory}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Rating Dropdown */}
        <TouchableOpacity
          style={styles.filterDropdown}
          onPress={() => setShowRatingDropdown(true)}
        >
          <Text style={styles.filterLabel}>Ratings</Text>
          <Text style={styles.filterValue}>{selectedRating}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Save Search Button */}
        <TouchableOpacity style={styles.saveSearchButton} onPress={handleSaveSearch}>
          <Text style={styles.saveSearchText}>Save search</Text>
        </TouchableOpacity>
      </View>

      {/* Location Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.locationOption}
              onPress={() => {
                setLocation('Current Location');
                setShowLocationModal(false);
              }}
            >
              <Text style={styles.locationOptionIcon}>📍</Text>
              <Text style={styles.locationOptionText}>Use current location</Text>
            </TouchableOpacity>

            <Text style={styles.recentTitle}>Recent Locations</Text>
            {['Mumbai, Maharashtra', 'Delhi, NCR', 'Bangalore, Karnataka'].map((loc, index) => (
              <TouchableOpacity
                key={index}
                style={styles.locationOption}
                onPress={() => {
                  setLocation(loc);
                  setShowLocationModal(false);
                }}
              >
                <Text style={styles.locationOptionIcon}>🕐</Text>
                <Text style={styles.locationOptionText}>{loc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Category Dropdown Modal */}
      <Modal
        visible={showCategoryDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryDropdown(false)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryDropdown(false)}
        >
          <View style={[styles.dropdownModal, { bottom: 80, left: 20 }]}>
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownOption,
                  selectedCategory === cat && styles.dropdownOptionSelected,
                ]}
                onPress={() => {
                  setSelectedCategory(cat);
                  setShowCategoryDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    selectedCategory === cat && styles.dropdownOptionTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Rating Dropdown Modal */}
      <Modal
        visible={showRatingDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRatingDropdown(false)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowRatingDropdown(false)}
        >
          <View style={[styles.dropdownModal, { bottom: 80, left: 140 }]}>
            {ratings.map((rating, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownOption,
                  selectedRating === rating && styles.dropdownOptionSelected,
                ]}
                onPress={() => {
                  setSelectedRating(rating);
                  setShowRatingDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    selectedRating === rating && styles.dropdownOptionTextSelected,
                  ]}
                >
                  {rating}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  toggleContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 4,
  },
  toggleTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 22,
  },
  toggleTabActive: {
    backgroundColor: '#FF6B35',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: '#1A1A1A',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  dropdownIcon: {
    fontSize: 10,
    color: '#666',
  },
  keywordsButton: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  keywordsText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 14,
    color: '#666',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 2,
  },
  starIcon: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
    }),
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  filterValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
    marginRight: 4,
  },
  dropdownArrow: {
    fontSize: 8,
    color: '#666',
  },
  saveSearchButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveSearchText: {
    fontSize: 14,
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
    maxHeight: '70%',
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
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  locationOptionIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  locationOptionText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdownModal: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    minWidth: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropdownOptionSelected: {
    backgroundColor: '#FFF3E0',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  dropdownOptionTextSelected: {
    color: '#FF6B35',
    fontWeight: '500',
  },
});

export default PartnerSearchScreen;
