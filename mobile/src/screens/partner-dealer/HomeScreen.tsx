/**
 * Home Screen (Partner/Dealer Mobile)
 *
 * Dashboard with profile summary, stats, and quick actions
 * Styled to match dealer UI pattern
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
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { mobileBusinessService } from '../../services/businessService';
import { Statistics } from '../../../shared/types/business.types';
import { logger } from '../../core/logger';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
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
      setStatistics(defaultStats);
      setLoading(false);
      setRefreshing(false);
    }

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

    if (!refreshing) {
      setLoading(true);
    }

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const stats = await mobileBusinessService.getStatistics(user.id, startDate, endDate);
      setStatistics(stats && typeof stats === 'object' ? stats : defaultStats);
    } catch (error) {
      logger.error('Failed to load statistics', error as Error);
      setStatistics(defaultStats);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStatistics();
  };

  const stats = statistics;

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
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B35" />}
      >
        {/* Welcome */}
        <View style={styles.welcomeCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'P'}</Text>
          </View>
          <View style={styles.welcomeInfo}>
            <Text style={styles.welcomeName}>Welcome back, {user?.name || 'Partner'}</Text>
            <Text style={styles.welcomeRole}>{user?.role?.replace('_', ' ') || 'Partner'}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalWorks}</Text>
            <Text style={styles.statLabel}>Works</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalEnquiries}</Text>
            <Text style={styles.statLabel}>Enquiries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.averageRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalLoyaltyPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              try {
                navigation.navigate('Work' as never);
              } catch (error) {
                logger.error('Failed to navigate to Work', error as Error);
                Alert.alert('Error', 'Could not navigate to Works screen. Please try again.');
              }
            }}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📋</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Manage Works</Text>
              <Text style={styles.actionSubtitle}>View and edit your portfolio</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              try {
                navigation.navigate('Feed' as never);
              } catch (error) {
                logger.error('Failed to navigate to Feed', error as Error);
                Alert.alert('Error', 'Could not navigate to Enquiries. Please try again.');
              }
            }}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📩</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Enquiries</Text>
              <Text style={styles.actionSubtitle}>{stats.totalEnquiries} new enquiries</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              try {
                navigation.navigate('Feed' as never);
              } catch (error) {
                logger.error('Failed to navigate to Feed', error as Error);
                Alert.alert('Error', 'Could not navigate to Events. Please try again.');
              }
            }}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📅</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Events</Text>
              <Text style={styles.actionSubtitle}>{stats.upcomingEvents} upcoming</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.emptyActivity}>
            <Text style={styles.emptyActivityText}>No recent activity</Text>
          </View>
        </View>

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
  content: {
    flex: 1,
  },
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
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
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  welcomeInfo: {
    flex: 1,
  },
  welcomeName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  welcomeRole: {
    fontSize: 13,
    color: '#666',
    textTransform: 'capitalize',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 8,
  },
  statCard: {
    width: '23%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
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
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  emptyActivity: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyActivityText: {
    fontSize: 14,
    color: '#999',
  },
  bottomPadding: {
    height: Platform.OS === 'ios' ? 40 : 30,
  },
});

export default HomeScreen;
