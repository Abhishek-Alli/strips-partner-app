/**
 * User Dashboard Screen
 *
 * Shows saved searches, favourites, and profile visits
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { logger } from '../../core/logger';

interface ProfileItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  avatar?: string;
  searchDate?: string;
  location?: string;
}

// Mock data for demonstration
const mockSavedSearches: ProfileItem[] = [
  { id: '1', name: 'Denial Jhon', category: 'Architecture', rating: 4.5, searchDate: '10/03/2022', location: 'Ganeshguri' },
  { id: '2', name: 'Denial Jhon', category: 'Architecture', rating: 4.5, searchDate: '10/03/2022', location: 'Ganeshguri' },
  { id: '3', name: 'Denial Jhon', category: 'Architecture', rating: 4.5, searchDate: '10/03/2022', location: 'Ganeshguri' },
];

const mockFavourites: ProfileItem[] = [
  { id: '1', name: 'Denial Jhon', category: 'Architecture', rating: 4.5 },
  { id: '2', name: 'Denial Jhon', category: 'Architecture', rating: 4.5 },
  { id: '3', name: 'Denial Jhon', category: 'Architecture', rating: 4.5 },
];

const mockProfileVisits: ProfileItem[] = [
  { id: '1', name: 'Denial Jhon', category: 'Architecture', rating: 4.5 },
  { id: '2', name: 'Denial Jhon', category: 'Architecture', rating: 4.5 },
  { id: '3', name: 'Denial Jhon', category: 'Architecture', rating: 4.5 },
];

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, isActive && styles.tabButtonActive]}
    onPress={onPress}
  >
    <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

interface ProfileCardProps {
  item: ProfileItem;
  showDetails?: boolean;
  onPress: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ item, showDetails, onPress }) => (
  <TouchableOpacity style={styles.profileCard} onPress={onPress}>
    <View style={styles.avatarContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
    </View>
    <View style={styles.profileInfo}>
      <Text style={styles.profileName}>{item.name}</Text>
      <Text style={styles.profileCategory}>Category : {item.category}</Text>
      {showDetails && item.searchDate && (
        <Text style={styles.profileDetails}>
          Search date : {item.searchDate}, & Location: {item.location}
        </Text>
      )}
    </View>
    <View style={styles.ratingBadge}>
      <Text style={styles.ratingStar}>★</Text>
      <Text style={styles.ratingText}>{item.rating}</Text>
    </View>
  </TouchableOpacity>
);

interface SectionProps {
  title: string;
  items: ProfileItem[];
  showDetails?: boolean;
  onItemPress: (item: ProfileItem) => void;
}

const Section: React.FC<SectionProps> = ({ title, items, showDetails, onItemPress }) => {
  const [activeTab, setActiveTab] = useState<'partner' | 'dealer'>('partner');

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.tabContainer}>
        <TabButton
          label="Partner"
          isActive={activeTab === 'partner'}
          onPress={() => setActiveTab('partner')}
        />
        <TabButton
          label="Dealer"
          isActive={activeTab === 'dealer'}
          onPress={() => setActiveTab('dealer')}
        />
      </View>
      {items.map((item) => (
        <ProfileCard
          key={item.id}
          item={item}
          showDetails={showDetails}
          onPress={() => onItemPress(item)}
        />
      ))}
    </View>
  );
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    navigation.navigate('PartnerSearch' as never);
  };

  const handleProfilePress = (item: ProfileItem) => {
    navigation.navigate('PartnerProfile' as never, { partnerId: item.id } as never);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Reload data here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleMenuPress = () => {
    // Open drawer or menu
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user?.name?.charAt(0) || 'A'}
            </Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.userName}>{user?.name || 'Alok Das'}</Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Text style={styles.menuIcon}>≡</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity style={styles.searchBar} onPress={handleSearch}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Partner/Dealer"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          editable={false}
          pointerEvents="none"
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </TouchableOpacity>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Section
          title="Latest 3 saved partner / dealer search"
          items={mockSavedSearches}
          showDetails
          onItemPress={handleProfilePress}
        />

        <Section
          title="Latest 3 Favourites"
          items={mockFavourites}
          onItemPress={handleProfilePress}
        />

        <Section
          title="Latest 3 dealer/partner profile visits"
          items={mockProfileVisits}
          onItemPress={handleProfilePress}
        />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 12,
    color: '#666',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#1A1A1A',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  searchIcon: {
    fontSize: 18,
    color: '#999',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  tabButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  tabButtonText: {
    fontSize: 12,
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  profileCategory: {
    fontSize: 12,
    color: '#666',
  },
  profileDetails: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingStar: {
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default UserDashboard;
