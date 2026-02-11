/**
 * Profile Screen (Partner/Dealer Mobile)
 * 
 * Profile management and settings
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { logger } from '../../core/logger';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      logger.error('Failed to logout', error as Error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  // Menu items - only include screens that exist in navigation
  // TODO: Add missing screens: ProfileEditor, Enquiries, Feedbacks, Gallery, Notes, Referrals, LoyaltyPoints, Reports, Chat, Settings
  const menuItems = [
    // { id: 'profile', title: 'Edit Profile', screen: 'ProfileEditor' },
    // { id: 'enquiries', title: 'Enquiries', screen: 'Enquiries' },
    // { id: 'feedbacks', title: 'Feedbacks', screen: 'Feedbacks' },
    // { id: 'gallery', title: 'Gallery', screen: 'Gallery' },
    // { id: 'notes', title: 'Notes', screen: 'Notes' },
    // { id: 'referrals', title: 'Referrals', screen: 'Referrals' },
    // { id: 'loyalty', title: 'Loyalty Points', screen: 'LoyaltyPoints' },
    // { id: 'reports', title: 'Reports & Statistics', screen: 'Reports' },
    // { id: 'chat', title: 'Chat', screen: 'Chat' },
    // { id: 'settings', title: 'Settings', screen: 'Settings' },
    // Temporary: Navigate to existing screens or placeholder
    { id: 'account', title: 'Account Management', screen: 'AccountManagement' },
    { id: 'utilities', title: 'Utilities & Knowledge', screen: 'UtilitiesHome' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
        </View>
        <Text style={[styles.name, { color: theme.colors.text.primary }]}>{user?.name}</Text>
        <Text style={[styles.role, { color: theme.colors.text.secondary }]}>
          {user?.role?.replace('_', ' ')}
        </Text>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => {
              try {
                // Check if screen exists before navigating
                navigation.navigate(item.screen as never);
              } catch (error: any) {
                // Handle navigation errors gracefully
                logger.error(`Failed to navigate to ${item.screen}`, error as Error);
                Alert.alert(
                  'Coming Soon',
                  `${item.title} screen is not available yet. It will be added in a future update.`,
                  [{ text: 'OK' }]
                );
              }
            }}
          >
            <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>{item.title}</Text>
            <Text style={{ color: theme.colors.text.secondary }}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: '#FF3B30' }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
  },
  menuSection: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    margin: 16,
    marginTop: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;






