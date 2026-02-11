/**
 * Notifications Inbox Screen
 * 
 * Mobile screen for viewing in-app notifications
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
  Alert
} from 'react-native';
import { useTheme } from '../../theme';
import { mobileNotificationService, InAppNotification } from '../../services/notificationService';
import { logger } from '../../core/logger';
// Simple date formatting helper (date-fns not installed)
const formatDistanceToNow = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

const NotificationsInboxScreen: React.FC = () => {
  const theme = useTheme();
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
      const response = await mobileNotificationService.getNotifications({
        limit: 50,
        unreadOnly: false
      });
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
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
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
    try {
      return formatDistanceToNow(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const renderNotification = ({ item }: { item: InAppNotification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        {
          backgroundColor: item.read ? theme.colors.card : theme.colors.primary + '10',
          borderColor: theme.colors.border
        }
      ]}
      onPress={() => !item.read && handleMarkAsRead(item.id)}
    >
      {!item.read && (
        <View style={[styles.unreadIndicator, { backgroundColor: theme.colors.primary }]} />
      )}
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: theme.colors.text.primary }]}>
          {item.title}
        </Text>
        <Text style={[styles.notificationMessage, { color: theme.colors.text.secondary }]}>
          {item.message}
        </Text>
        <Text style={[styles.notificationTime, { color: theme.colors.text.secondary }]}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && notifications.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text.secondary }}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {unreadCount > 0 && (
        <View style={[styles.header, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.unreadText, { color: theme.colors.text.primary }]}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={[styles.markAllText, { color: theme.colors.primary }]}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No notifications yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1
  },
  unreadText: {
    fontSize: 14,
    fontWeight: '600'
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600'
  },
  listContent: {
    padding: 16
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    })
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 4
  },
  notificationContent: {
    flex: 1
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20
  },
  notificationTime: {
    fontSize: 12
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyText: {
    fontSize: 16
  }
});

export default NotificationsInboxScreen;

