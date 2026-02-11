/**
 * Feed Screen (Partner/Dealer Mobile)
 * 
 * News feed with events, offers, market updates, education posts
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
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
  const theme = useTheme();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      // Use allSettled to handle individual failures gracefully
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

      // Extract results (all will be fulfilled due to catch handlers)
      const events = results[0].status === 'fulfilled' ? results[0].value : [];
      const offers = results[1].status === 'fulfilled' ? results[1].value : [];
      const marketUpdates = results[2].status === 'fulfilled' ? results[2].value : [];
      const educationPosts = results[3].status === 'fulfilled' ? results[3].value : [];

      // Helper function to parse dates safely
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
      // Set empty array on error so UI doesn't break
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

  const renderFeedItem = ({ item }: { item: FeedItem }) => {
    const getTypeLabel = () => {
      switch (item.type) {
        case 'event': return 'Event';
        case 'offer': return 'Offer';
        case 'market_update': return 'Market Update';
        case 'education_post': return 'Education';
        default: return '';
      }
    };

    return (
      <TouchableOpacity
        style={[styles.feedCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        onPress={() => {
          // Navigate to detail screen based on type
          if (item.type === 'event') {
            navigation.navigate('EventDetail' as never, { eventId: item.data.id });
          } else if (item.type === 'offer') {
            navigation.navigate('OfferDetail' as never, { offerId: item.data.id });
          }
        }}
      >
        <View style={styles.feedHeader}>
          <Text style={[styles.feedType, { color: theme.colors.primary }]}>{getTypeLabel()}</Text>
          <Text style={[styles.feedDate, { color: theme.colors.text.secondary }]}>
            {item.date.toLocaleDateString()}
          </Text>
        </View>
        <Text style={[styles.feedTitle, { color: theme.colors.text.primary }]}>{item.title}</Text>
        <Text style={[styles.feedDescription, { color: theme.colors.text.secondary }]} numberOfLines={3}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Feed</Text>
      </View>

      {feedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No feed items available
          </Text>
        </View>
      ) : (
        <FlatList
          data={feedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderFeedItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  feedCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  feedDate: {
    fontSize: 12,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  feedDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FeedScreen;






