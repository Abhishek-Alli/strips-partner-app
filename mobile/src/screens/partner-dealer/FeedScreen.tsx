/**
 * Feed Screen (Partner/Dealer Mobile)
 *
 * News feed with events, offers, market updates, education posts
 * Dealer UI style
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mobileBusinessService } from '../../services/businessService';
import { Event, Offer, SteelMarketUpdate, EducationPost } from '../../../shared/types/business.types';
import { logger } from '../../core/logger';

type FeedItem = {
  id: string;
  type: 'event' | 'offer' | 'market_update' | 'education_post';
  title: string;
  description: string;
  date: Date;
  data: Event | Offer | SteelMarketUpdate | EducationPost;
};

const FeedScreen: React.FC = () => {
  const navigation = useNavigation();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const results = await Promise.allSettled([
        mobileBusinessService.getEvents().catch(err => {
          logger.error('Failed to fetch events', err as Error);
          return [] as Event[];
        }),
        mobileBusinessService.getOffers({ applicableTo: 'all' }).catch(err => {
          logger.error('Failed to fetch offers', err as Error);
          return [] as Offer[];
        }),
        mobileBusinessService.getSteelMarketUpdates().catch(err => {
          logger.error('Failed to fetch steel market updates', err as Error);
          return [] as SteelMarketUpdate[];
        }),
        mobileBusinessService.getEducationPosts().catch(err => {
          logger.error('Failed to fetch education posts', err as Error);
          return [] as EducationPost[];
        }),
      ]);

      const events = results[0].status === 'fulfilled' ? results[0].value : [];
      const offers = results[1].status === 'fulfilled' ? results[1].value : [];
      const marketUpdates = results[2].status === 'fulfilled' ? results[2].value : [];
      const educationPosts = results[3].status === 'fulfilled' ? results[3].value : [];

      const parseDate = (date: Date | string | undefined): Date => {
        if (!date) return new Date();
        if (date instanceof Date) return date;
        return new Date(date);
      };

      const items: FeedItem[] = [
        ...(events || []).map(e => ({
          id: `event_${e.id}`,
          type: 'event' as const,
          title: e.title,
          description: e.description,
          date: parseDate(e.startDate),
          data: e,
        })),
        ...(offers || []).map(o => ({
          id: `offer_${o.id}`,
          type: 'offer' as const,
          title: o.title,
          description: o.description,
          date: parseDate(o.createdAt),
          data: o,
        })),
        ...(marketUpdates || []).map(m => ({
          id: `market_${m.id}`,
          type: 'market_update' as const,
          title: m.title,
          description: m.content,
          date: parseDate(m.publishedAt),
          data: m,
        })),
        ...(educationPosts || []).map(p => ({
          id: `post_${p.id}`,
          type: 'education_post' as const,
          title: p.title,
          description: (p.content || '').substring(0, 150) + '...',
          date: parseDate(p.createdAt),
          data: p,
        })),
      ];

      items.sort((a, b) => b.date.getTime() - a.date.getTime());
      setFeedItems(items);
    } catch (error) {
      logger.error('Failed to load feed', error as Error);
      setFeedItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFeed();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event': return 'Event';
      case 'offer': return 'Offer';
      case 'market_update': return 'Market Update';
      case 'education_post': return 'Education';
      default: return '';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return '#FF6B35';
      case 'offer': return '#4CAF50';
      case 'market_update': return '#1976D2';
      case 'education_post': return '#9C27B0';
      default: return '#666';
    }
  };

  const renderFeedItem = ({ item }: { item: FeedItem }) => (
    <TouchableOpacity
      style={styles.feedCard}
      onPress={() => {
        if (item.type === 'event') {
          navigation.navigate('EventDetail' as never, { eventId: item.data.id });
        } else if (item.type === 'offer') {
          navigation.navigate('OfferDetail' as never, { offerId: item.data.id });
        }
      }}
    >
      <View style={styles.feedHeader}>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) + '15' }]}>
          <Text style={[styles.feedType, { color: getTypeColor(item.type) }]}>{getTypeLabel(item.type)}</Text>
        </View>
        <Text style={styles.feedDate}>{item.date.toLocaleDateString()}</Text>
      </View>
      <Text style={styles.feedTitle}>{item.title}</Text>
      <Text style={styles.feedDescription} numberOfLines={3}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
      </View>

      {feedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No feed items available</Text>
        </View>
      ) : (
        <FlatList
          data={feedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderFeedItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B35" />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  listContent: {
    padding: 16,
  },
  feedCard: {
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
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  feedType: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  feedDate: {
    fontSize: 12,
    color: '#999',
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  feedDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
  },
});

export default FeedScreen;
