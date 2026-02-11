import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { useTheme } from '../../theme';
import { mobileNotificationService } from '../../services/notificationService';
import { useState } from 'react';

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await mobileNotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      // Silent fail
    }
  };

  return (
    <PermissionGuard resource="notifications" action="view">
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[styles.inboxButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('NotificationsInbox' as never)}
        >
          <Text style={[styles.inboxTitle, { color: theme.colors.text.primary }]}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={[styles.hint, { color: theme.colors.text.secondary }]}>
          Tap to view all notifications
        </Text>
      </View>
    </PermissionGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  inboxButton: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 200,
    position: 'relative'
  },
  inboxTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  hint: {
    marginTop: 16,
    fontSize: 14
  }
});

export default NotificationsScreen;



