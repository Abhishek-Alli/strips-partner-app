/**
 * Notifications Inbox Screen - modern dealer UI style (#FF6B35)
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { mobileNotificationService, InAppNotification } from '../../services/notificationService';
import { logger } from '../../core/logger';

const ACCENT = '#FF6B35';
const BG = '#F5F5F5';
const CARD = '#FFFFFF';

const formatDistanceToNow = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const getNotificationIcon = (type?: string): { name: string; color: string; bg: string } => {
  switch (type) {
    case 'message': return { name: 'chat', color: '#2196F3', bg: '#E3F2FD' };
    case 'payment': return { name: 'payment', color: '#4CAF50', bg: '#E8F5E9' };
    case 'enquiry': return { name: 'email', color: '#FF9800', bg: '#FFF3E0' };
    case 'alert': return { name: 'warning', color: '#F44336', bg: '#FFEBEE' };
    default: return { name: 'notifications', color: ACCENT, bg: '#FFF5F2' };
  }
};

const NotificationsInboxScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await mobileNotificationService.getNotifications({ limit: 50, unreadOnly: false });
      setNotifications(response.notifications);
    } catch (error) {
      logger.error('Failed to load notifications', error as Error);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await mobileNotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      logger.error('Failed to load unread count', error as Error);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadNotifications(), loadUnreadCount()]);
    setRefreshing(false);
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await mobileNotificationService.markAsRead(notificationId);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      logger.error('Failed to mark notification as read', error as Error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await mobileNotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      logger.error('Failed to mark all as read', error as Error);
    }
  };

  const formatDate = (dateString: string): string => {
    try { return formatDistanceToNow(new Date(dateString)); }
    catch { return dateString; }
  };

  const renderNotification = ({ item }: { item: InAppNotification }) => {
    const icon = getNotificationIcon((item as any).type);
    return (
      <TouchableOpacity
        style={[styles.card, !item.read && styles.cardUnread]}
        activeOpacity={0.7}
        onPress={() => !item.read && handleMarkAsRead(item.id)}
      >
        <View style={[styles.iconCircle, { backgroundColor: icon.bg }]}>
          <MaterialIcons name={icon.name as any} size={22} color={icon.color} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, !item.read && styles.cardTitleBold]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.cardTime}>{formatDate(item.createdAt)}</Text>
          </View>
          <Text style={styles.cardMessage} numberOfLines={2}>
            {item.message}
          </Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CARD} />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSub}>{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllAsRead}>
            <MaterialIcons name="done-all" size={16} color={ACCENT} />
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <MaterialIcons name="notifications" size={48} color="#DDD" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconCircle}>
            <MaterialIcons name="notifications-none" size={40} color={ACCENT} />
          </View>
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptySubtitle}>You have no notifications right now.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={ACCENT} />
          }
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  headerSub: { fontSize: 12, color: ACCENT, fontWeight: '500', marginTop: 2 },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 4,
  },
  markAllText: { fontSize: 13, color: ACCENT, fontWeight: '600' },
  listContent: { paddingVertical: 8 },
  separator: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 72 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: CARD,
  },
  cardUnread: { backgroundColor: '#FFFBF9' },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  cardContent: { flex: 1 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: { fontSize: 14, fontWeight: '500', color: '#1A1A1A', flex: 1, marginRight: 8 },
  cardTitleBold: { fontWeight: '700' },
  cardTime: { fontSize: 11, color: '#999', flexShrink: 0 },
  cardMessage: { fontSize: 13, color: '#666', lineHeight: 18 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT,
    marginLeft: 8,
    marginTop: 6,
    flexShrink: 0,
  },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#999' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center' },
});

export default NotificationsInboxScreen;
