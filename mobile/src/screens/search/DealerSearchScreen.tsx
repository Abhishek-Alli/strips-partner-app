/**
 * Dealer Search Screen – modern dealer UI style (#FF6B35)
 * Search by name + radius/category/rating filters
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
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { searchService, Dealer, SearchFilters } from '../../services/searchService';
import { logger } from '../../core/logger';
import { Skeleton } from '../../components/loaders/Skeleton';

const ACCENT = '#FF6B35';
const BG = '#F5F5F5';
const CARD = '#FFFFFF';

const CATEGORIES = ['Materials', 'Equipment', 'Services', 'Tools'];
const RATINGS = [3, 4, 4.5];

const DealerSearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({ radius: 10 });
  const [radiusText, setRadiusText] = useState('10');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, hasMore: true });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        setFilters(prev => ({
          ...prev,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
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
      const searchFilters: SearchFilters = { ...filters, name: searchQuery || undefined };
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
        hasMore: response.pagination.page < response.pagination.pages,
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

  const handleSearch = () => loadDealers(1, true);
  const onRefresh = useCallback(() => { setRefreshing(true); loadDealers(1, true); }, [loadDealers]);
  const loadMore = useCallback(() => {
    if (pagination.hasMore && !loading) loadDealers(pagination.page + 1, false);
  }, [pagination, loading, loadDealers]);

  const toggleCategory = (cat: string) =>
    setFilters(prev => ({ ...prev, category: prev.category === cat ? undefined : cat }));

  const toggleRating = (rating: number) =>
    setFilters(prev => ({ ...prev, rating: prev.rating === rating ? undefined : rating }));

  const applyRadius = () => {
    const num = parseFloat(radiusText) || 10;
    const clamped = Math.max(1, Math.min(100, num));
    setFilters(prev => ({ ...prev, radius: clamped }));
    setRadiusText(String(clamped));
  };

  const activeFiltersCount = [
    filters.category,
    filters.rating,
    filters.radius !== 10 ? filters.radius : null,
  ].filter(Boolean).length;

  const renderDealer = ({ item }: { item: Dealer }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('DealerProfile' as never, { dealerId: item.id } as never)}
    >
      {/* Avatar */}
      <View style={styles.dealerAvatar}>
        <Text style={styles.dealerAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.dealerInfo}>
        <Text style={styles.dealerName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.dealerCategory}>{item.category}</Text>

        <View style={styles.metaRow}>
          <View style={styles.ratingChip}>
            <MaterialIcons name="star" size={13} color="#FFC107" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
          {item.distance !== undefined && (
            <View style={styles.distanceChip}>
              <MaterialIcons name="location-on" size={13} color={ACCENT} />
              <Text style={styles.distanceText}>{item.distance.toFixed(1)} km</Text>
            </View>
          )}
        </View>

        {item.location?.address && (
          <Text style={styles.address} numberOfLines={1}>
            {item.location.address}
          </Text>
        )}
      </View>

      <MaterialIcons name="chevron-right" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CARD} />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputRow}>
          <MaterialIcons name="search" size={22} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search dealers by name..."
            placeholderTextColor="#BBB"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="cancel" size={18} color="#CCC" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterBtn, showFilters && styles.filterBtnActive]}
          onPress={() => setShowFilters(v => !v)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="tune" size={20} color={showFilters ? CARD : ACCENT} />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.searchSubmitBtn}
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <MaterialIcons name="search" size={18} color={CARD} />
        </TouchableOpacity>
      </View>

      {/* Filter Panel */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {/* Radius */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupLabel}>Radius (km)</Text>
              <View style={styles.radiusRow}>
                <TextInput
                  style={styles.radiusInput}
                  value={radiusText}
                  onChangeText={setRadiusText}
                  keyboardType="numeric"
                  onBlur={applyRadius}
                  onSubmitEditing={applyRadius}
                />
                <Text style={styles.radiusKm}>km</Text>
              </View>
            </View>

            {/* Category */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupLabel}>Category</Text>
              <View style={styles.chipsRow}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, filters.category === cat && styles.chipActive]}
                    onPress={() => toggleCategory(cat)}
                  >
                    <Text style={[styles.chipText, filters.category === cat && styles.chipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupLabel}>Min Rating</Text>
              <View style={styles.chipsRow}>
                {RATINGS.map(r => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.chip, filters.rating === r && styles.chipActive]}
                    onPress={() => toggleRating(r)}
                  >
                    <MaterialIcons name="star" size={13} color={filters.rating === r ? CARD : '#FFC107'} />
                    <Text style={[styles.chipText, filters.rating === r && styles.chipTextActive]}>
                      {r}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Results count */}
      {!loading && dealers.length > 0 && (
        <View style={styles.resultsMeta}>
          <Text style={styles.resultsCount}>
            {pagination.total} dealer{pagination.total !== 1 ? 's' : ''} found
          </Text>
          {userLocation && (
            <View style={styles.locationActive}>
              <MaterialIcons name="my-location" size={12} color={ACCENT} />
              <Text style={styles.locationActiveText}>Near you</Text>
            </View>
          )}
        </View>
      )}

      {/* List */}
      <FlatList
        data={dealers}
        renderItem={renderDealer}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ACCENT} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={
          loading && dealers.length > 0 ? (
            <ActivityIndicator size="small" color={ACCENT} style={styles.footerLoader} />
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.skeletonContainer}>
              <Skeleton width="100%" height={90} />
              <View style={{ height: 10 }} />
              <Skeleton width="100%" height={90} />
              <View style={{ height: 10 }} />
              <Skeleton width="100%" height={90} />
            </View>
          ) : !userLocation ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <MaterialIcons name="location-off" size={36} color={ACCENT} />
              </View>
              <Text style={styles.emptyTitle}>Location Required</Text>
              <Text style={styles.emptySubtitle}>
                Enable location to find dealers near you.
              </Text>
              <TouchableOpacity style={styles.enableLocationBtn} onPress={requestLocationPermission}>
                <MaterialIcons name="my-location" size={16} color={CARD} />
                <Text style={styles.enableLocationText}>Enable Location</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <MaterialIcons name="store" size={36} color={ACCENT} />
              </View>
              <Text style={styles.emptyTitle}>No dealers found</Text>
              <Text style={styles.emptySubtitle}>Try a different name, location, or expand your radius.</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 8,
  },
  searchInputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A', padding: 0 },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFE0D5',
  },
  filterBtnActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#F44336',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: { color: CARD, fontSize: 10, fontWeight: '700' },
  searchSubmitBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Filter panel
  filterPanel: {
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterScroll: { paddingHorizontal: 12, paddingVertical: 12, gap: 16 },
  filterGroup: { marginRight: 8 },
  filterGroupLabel: { fontSize: 11, fontWeight: '700', color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  chipsRow: { flexDirection: 'row', gap: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    gap: 4,
  },
  chipActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  chipText: { fontSize: 13, color: '#555', fontWeight: '500' },
  chipTextActive: { color: CARD },
  radiusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  radiusInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    color: '#1A1A1A',
    width: 60,
    textAlign: 'center',
  },
  radiusKm: { fontSize: 13, color: '#666' },

  // Results meta
  resultsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCount: { fontSize: 13, color: '#888', fontWeight: '500' },
  locationActive: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationActiveText: { fontSize: 12, color: ACCENT, fontWeight: '500' },

  // List
  listContent: { padding: 12 },
  footerLoader: { marginVertical: 20 },

  // Dealer card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  dealerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  dealerAvatarText: { color: CARD, fontWeight: '700', fontSize: 18 },
  dealerInfo: { flex: 1 },
  dealerName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  dealerCategory: { fontSize: 12, color: '#888', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#FFF8E1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#F57C00' },
  reviewCount: { fontSize: 12, color: '#AAA' },
  distanceChip: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  distanceText: { fontSize: 12, color: ACCENT, fontWeight: '600' },
  address: { fontSize: 12, color: '#AAA' },

  // Empty / loading
  skeletonContainer: { padding: 12 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },
  enableLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 22,
    marginTop: 16,
    gap: 8,
  },
  enableLocationText: { color: CARD, fontWeight: '700', fontSize: 14 },
});

export default DealerSearchScreen;
