/**
 * Home Screen (Partner/Dealer Mobile)
 * 
 * Dashboard with key metrics and quick actions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { mobileBusinessService } from '../../services/businessService';
import { Statistics } from '../../../shared/types/business.types';
import { logger } from '../../core/logger';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { user } = useAuth();
  const defaultStats: Statistics = {
    totalWorks: 0,
    totalEnquiries: 0,
    totalFeedbacks: 0,
    averageRating: 0,
    totalReferrals: 0,
    totalLoyaltyPoints: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    period: {
      start: new Date(),
      end: new Date(),
    },
  };

  const [statistics, setStatistics] = useState<Statistics>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadStatistics();
    } else {
      // If user is not loaded yet, show default stats and stop loading
      setStatistics(defaultStats);
      setLoading(false);
      setRefreshing(false);
    }
    
    // Safety timeout: always set loading to false after 10 seconds
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 10000);
    
    return () => clearTimeout(safetyTimeout);
  }, [user?.id]);

  const loadStatistics = async () => {
    if (!user?.id) {
      setStatistics(defaultStats);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    
    // Set loading state only for initial load, not refresh
    if (!refreshing) {
      setLoading(true);
    }
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const stats = await mobileBusinessService.getStatistics(user.id, startDate, endDate);
      // Ensure we always have valid stats
      setStatistics(stats && typeof stats === 'object' ? stats : defaultStats);
    } catch (error) {
      logger.error('Failed to load statistics', error as Error);
      // Set default statistics on error to prevent infinite loading
      setStatistics(defaultStats);
    } finally {
      // Always set loading to false, even if there's an error
      // This ensures we never get stuck in loading state
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStatistics();
  };

  // Use statistics (always has a value due to defaultStats initialization)
  const stats = statistics;

  // Show loading indicator only during initial load (not during refresh)
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Dashboard</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Welcome back, {user?.name}
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>{stats.totalWorks}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Works</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>{stats.totalEnquiries}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Enquiries</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>{stats.averageRating.toFixed(1)}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Rating</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>{stats.totalLoyaltyPoints}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Points</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Quick Actions</Text>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => {
            try {
              // Navigate to Work tab (the tab screen is named "Work", not "Works")
              navigation.navigate('Work' as never);
            } catch (error) {
              logger.error('Failed to navigate to Work', error as Error);
              Alert.alert('Error', 'Could not navigate to Works screen. Please try again.');
            }
          }}
        >
          <Text style={[styles.actionTitle, { color: theme.colors.text.primary }]}>Manage Works</Text>
          <Text style={[styles.actionSubtitle, { color: theme.colors.text.secondary }]}>View and edit your portfolio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => {
            try {
              // Navigate to Feed screen which shows enquiries and events
              navigation.navigate('Feed' as never);
            } catch (error) {
              logger.error('Failed to navigate to Feed', error as Error);
              Alert.alert('Error', 'Could not navigate to Enquiries. Please try again.');
            }
          }}
        >
          <Text style={[styles.actionTitle, { color: theme.colors.text.primary }]}>Enquiries</Text>
          <Text style={[styles.actionSubtitle, { color: theme.colors.text.secondary }]}>
            {stats.totalEnquiries} new enquiries
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => {
            try {
              // Navigate to Feed screen which shows events
              navigation.navigate('Feed' as never);
            } catch (error) {
              logger.error('Failed to navigate to Feed', error as Error);
              Alert.alert('Error', 'Could not navigate to Events. Please try again.');
            }
          }}
        >
          <Text style={[styles.actionTitle, { color: theme.colors.text.primary }]}>Events</Text>
          <Text style={[styles.actionSubtitle, { color: theme.colors.text.secondary }]}>
            {stats.upcomingEvents} upcoming
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Recent Activity</Text>
        <View style={[styles.activityCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.activityText, { color: theme.colors.text.secondary }]}>
            No recent activity
          </Text>
        </View>
      </View>
    </ScrollView>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '47%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  activityCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  activityText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HomeScreen;






