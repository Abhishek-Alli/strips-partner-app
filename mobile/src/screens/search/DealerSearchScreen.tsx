/**
 * Dealer Search Screen
 * 
 * Advanced search with location, radius, and map view
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Alert
} from 'react-native';
// Slider is not available in react-native-web, use web-compatible version
let Slider: any;
if (Platform.OS === 'web') {
  Slider = require('../../components/Slider.web').Slider;
} else {
  // For native, use a simple View with TextInput as fallback until @react-native-community/slider is installed
  Slider = ({ value, onValueChange, minimumValue = 1, maximumValue = 50, style, minimumTrackTintColor, maximumTrackTintColor }: any) => (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      <TextInput
        style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 4 }}
        value={value.toString()}
        onChangeText={(text) => {
          const num = parseFloat(text) || minimumValue;
          const clamped = Math.max(minimumValue, Math.min(maximumValue, num));
          onValueChange(clamped);
        }}
        keyboardType="numeric"
      />
      <Text style={{ marginLeft: 8 }}>km</Text>
    </View>
  );
}
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useTheme } from '../../theme';
import { searchService, Dealer, SearchFilters } from '../../services/searchService';
import { logger } from '../../core/logger';
import { Skeleton } from '../../components/loaders/Skeleton';

const DealerSearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    radius: 10 // Default 10km
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        setFilters(prev => ({
          ...prev,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }));
      }
    } catch (error) {
      logger.error('Failed to get location', error as Error);
      Alert.alert('Location Error', 'Unable to get your location. Please enable location services.');
    }
  };

  const loadDealers = useCallback(async (page: number = 1, reset: boolean = false) => {
    if (loading && !reset) return;

    setLoading(true);
    try {
      const searchFilters: SearchFilters = {
        ...filters,
        name: searchQuery || undefined
      };

      const response = await searchService.searchDealers(searchFilters, page, pagination.limit);
      
      if (reset) {
        setDealers(response.items);
      } else {
        setDealers(prev => [...prev, ...response.items]);
      }

      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        hasMore: response.pagination.page < response.pagination.pages
      });
    } catch (error) {
      logger.error('Failed to load dealers', error as Error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, filters, pagination.limit, loading]);

  useEffect(() => {
    if (filters.latitude && filters.longitude) {
      loadDealers(1, true);
    }
  }, [filters]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDealers(1, true);
  }, [loadDealers]);

  const loadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      loadDealers(pagination.page + 1, false);
    }
  }, [pagination, loading, loadDealers]);

  const handleSearch = useCallback(() => {
    loadDealers(1, true);
  }, [loadDealers]);

  const renderDealerItem = ({ item }: { item: Dealer }) => (
    <TouchableOpacity
      style={[styles.dealerCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={() => navigation.navigate('DealerProfile' as never, { dealerId: item.id } as never)}
    >
      {item.profileImage && (
        <View style={styles.imageContainer}>
          <Skeleton width={60} height={60} />
        </View>
      )}
      <View style={styles.dealerInfo}>
        <Text style={[styles.dealerName, { color: theme.colors.text.primary }]}>{item.name}</Text>
        <Text style={[styles.dealerCategory, { color: theme.colors.text.secondary }]}>{item.category}</Text>
        <View style={styles.ratingContainer}>
          <Text style={[styles.rating, { color: theme.colors.primary }]}>
            ⭐ {item.rating.toFixed(1)}
          </Text>
          <Text style={[styles.reviewCount, { color: theme.colors.text.secondary }]}>
            ({item.reviewCount} reviews)
          </Text>
        </View>
        {item.distance !== undefined && (
          <Text style={[styles.distance, { color: theme.colors.text.secondary }]}>
            📍 {item.distance.toFixed(1)} km away
          </Text>
        )}
        {item.location && (
          <Text style={[styles.address, { color: theme.colors.text.secondary }]} numberOfLines={1}>
            {item.location.address}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text.primary }]}
          placeholder="Search dealers..."
          placeholderTextColor={theme.colors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewToggle, { backgroundColor: viewMode === 'map' ? theme.colors.primary : theme.colors.background }]}
          onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
        >
          <Text style={{ color: viewMode === 'map' ? '#fff' : theme.colors.text.primary }}>
            {viewMode === 'list' ? '🗺️' : '📋'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={[styles.filtersContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.filterLabel, { color: theme.colors.text.primary }]}>
            Search Radius: {filters.radius} km
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={50}
            value={filters.radius || 10}
            onValueChange={(value) => setFilters(prev => ({ ...prev, radius: value }))}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
          />
          <Text style={[styles.filterLabel, { color: theme.colors.text.primary }]}>Category:</Text>
          <View style={styles.filterOptions}>
            {['Materials', 'Equipment', 'Services', 'Tools'].map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: filters.category === category ? theme.colors.primary : theme.colors.background,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={() => setFilters(prev => ({ ...prev, category: prev.category === category ? undefined : category }))}
              >
                <Text style={{ color: filters.category === category ? '#fff' : theme.colors.text.primary }}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.filterLabel, { color: theme.colors.text.primary }]}>Min Rating:</Text>
          <View style={styles.filterOptions}>
            {[3, 4, 4.5].map(rating => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: filters.rating === rating ? theme.colors.primary : theme.colors.background,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={() => setFilters(prev => ({ ...prev, rating: prev.rating === rating ? undefined : rating }))}
              >
                <Text style={{ color: filters.rating === rating ? '#fff' : theme.colors.text.primary }}>
                  {rating}+ ⭐
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {!userLocation && (
            <TouchableOpacity
              style={[styles.locationButton, { backgroundColor: theme.colors.primary }]}
              onPress={requestLocationPermission}
            >
              <Text style={styles.locationButtonText}>📍 Use My Location</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Map View Placeholder */}
      {viewMode === 'map' && (
        <View style={[styles.mapContainer, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.mapPlaceholder, { color: theme.colors.text.secondary }]}>
            Map View (Integrate react-native-maps)
          </Text>
          <Text style={[styles.mapPlaceholder, { color: theme.colors.text.secondary }]}>
            {dealers.length} dealers found
          </Text>
        </View>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <FlatList
          data={dealers}
          renderItem={renderDealerItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              {...(Platform.OS === 'ios' && { tintColor: theme.colors.primary })}
              {...(Platform.OS === 'android' && { colors: [theme.colors.primary] })}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && dealers.length > 0 ? (
              <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loader} />
            ) : null
          }
          ListEmptyComponent={
            loading ? (
              <View style={styles.emptyContainer}>
                <Skeleton width="100%" height={100} />
                <Skeleton width="100%" height={100} />
                <Skeleton width="100%" height={100} />
              </View>
            ) : !userLocation ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
                  Enable location to search nearby dealers
                </Text>
                <TouchableOpacity
                  style={[styles.locationButton, { backgroundColor: theme.colors.primary, marginTop: 16 }]}
                  onPress={requestLocationPermission}
                >
                  <Text style={styles.locationButtonText}>📍 Enable Location</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
                  No dealers found
                </Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    gap: 8,
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center'
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12
  },
  viewToggle: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40
  },
  filtersContainer: {
    padding: 12,
    borderBottomWidth: 1
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8
  },
  slider: {
    width: '100%',
    height: 40
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1
  },
  locationButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapPlaceholder: {
    fontSize: 16,
    marginBottom: 8
  },
  listContent: {
    padding: 12
  },
  dealerCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    })
  },
  imageContainer: {
    marginRight: 12
  },
  dealerInfo: {
    flex: 1
  },
  dealerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  dealerCategory: {
    fontSize: 14,
    marginBottom: 4
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4
  },
  reviewCount: {
    fontSize: 12
  },
  distance: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600'
  },
  address: {
    fontSize: 12,
    marginTop: 4
  },
  loader: {
    marginVertical: 20
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16
  }
});

export default DealerSearchScreen;






