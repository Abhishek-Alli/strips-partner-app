/**
 * Offers and Discounts Screen
 *
 * Shows list of offers with Like/Unlike functionality
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';

interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  isLiked: boolean;
}

const sampleOffers: Offer[] = [
  {
    id: '1',
    title: 'Discount 20%',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua.',
    code: 'SOM20',
    isLiked: false,
  },
  {
    id: '2',
    title: 'Special offer for partner',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua.',
    code: 'SOM20',
    isLiked: false,
  },
  {
    id: '3',
    title: 'New sale 20%',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua.',
    code: 'SOM20',
    isLiked: false,
  },
  {
    id: '4',
    title: 'Discount 15%',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua.',
    code: 'SOM20',
    isLiked: false,
  },
  {
    id: '5',
    title: 'Discount 15%',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua.',
    code: 'SOM20',
    isLiked: false,
  },
];

type TabType = 'all' | 'liked';

const OffersDiscountsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [offers, setOffers] = useState<Offer[]>(sampleOffers);

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const handleToggleLike = (offerId: string) => {
    setOffers(
      offers.map((offer) =>
        offer.id === offerId ? { ...offer, isLiked: !offer.isLiked } : offer
      )
    );
  };

  const filteredOffers =
    activeTab === 'all' ? offers : offers.filter((offer) => offer.isLiked);

  const renderOfferCard = (offer: Offer) => (
    <View key={offer.id} style={styles.offerCard}>
      <Text style={styles.offerTitle}>{offer.title}</Text>
      <Text style={styles.offerDescription}>{offer.description}</Text>
      <View style={styles.offerFooter}>
        <Text style={styles.offerCode}>CODE: {offer.code}</Text>
        <TouchableOpacity onPress={() => handleToggleLike(offer.id)}>
          <Text style={styles.likeButton}>
            {offer.isLiked ? 'Unlike' : 'Like'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Offers and discounts</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All offers and discounts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'liked' && styles.tabActive]}
          onPress={() => setActiveTab('liked')}
        >
          <Text style={[styles.tabText, activeTab === 'liked' && styles.tabTextActive]}>
            Like offers and discounts
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => renderOfferCard(offer))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No liked offers yet</Text>
          </View>
        )}
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  tabActive: {
    backgroundColor: '#FF6B35',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  offerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  offerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  likeButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  bottomPadding: {
    height: 30,
  },
});

export default OffersDiscountsScreen;
