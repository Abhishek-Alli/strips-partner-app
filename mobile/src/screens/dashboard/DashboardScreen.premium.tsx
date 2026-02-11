/**
 * Premium Mobile Dashboard Screen
 * 
 * Clean, card-based dashboard with clear hierarchy
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contexts/AuthContext';
import { Card } from '../../../components/core/Card';
import { StatCard } from '../../../components/core/StatCard';
import { PrimaryButton } from '../../../components/core/PrimaryButton';
import { theme } from '../../../theme';
import { logger } from '../../../core/logger';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalSearches: 0,
    totalEnquiries: 0,
    totalFavorites: 0,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data fetch
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back</Text>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <StatCard
            label="Searches"
            value={stats.totalSearches}
            subtitle="This month"
          />
        </View>
        <View style={styles.statItem}>
          <StatCard
            label="Enquiries"
            value={stats.totalEnquiries}
            subtitle="Pending"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Card
          variant="default"
          onPress={() => navigation.navigate('PartnerSearch' as never)}
          style={styles.actionCard}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Search Partners</Text>
            <Text style={styles.actionSubtitle}>
              Find construction partners near you
            </Text>
          </View>
        </Card>

        <Card
          variant="default"
          onPress={() => navigation.navigate('DealerSearch' as never)}
          style={styles.actionCard}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Search Dealers</Text>
            <Text style={styles.actionSubtitle}>
              Browse product dealers and suppliers
            </Text>
          </View>
        </Card>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card variant="outlined" style={styles.activityCard}>
          <Text style={styles.emptyText}>No recent activity</Text>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    padding: parseInt(theme.spacing[4]),
    paddingBottom: parseInt(theme.spacing[12]),
  },
  header: {
    marginBottom: parseInt(theme.spacing[6]),
  },
  greeting: {
    fontSize: parseInt(theme.typography.fontSize.base),
    color: theme.colors.text.secondary,
    marginBottom: parseInt(theme.spacing[1]),
  },
  name: {
    fontSize: parseInt(theme.typography.fontSize.xl),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: parseInt(theme.spacing[4]),
    marginBottom: parseInt(theme.spacing[6]),
  },
  statItem: {
    flex: 1,
  },
  section: {
    marginBottom: parseInt(theme.spacing[6]),
  },
  sectionTitle: {
    fontSize: parseInt(theme.typography.fontSize.lg),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: parseInt(theme.spacing[4]),
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  actionCard: {
    marginBottom: parseInt(theme.spacing[4]),
  },
  actionContent: {
    gap: parseInt(theme.spacing[2]),
  },
  actionTitle: {
    fontSize: parseInt(theme.typography.fontSize.base),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  actionSubtitle: {
    fontSize: parseInt(theme.typography.fontSize.sm),
    color: theme.colors.text.secondary,
    lineHeight: parseInt(theme.typography.fontSize.sm) * theme.typography.lineHeight.normal,
  },
  activityCard: {
    padding: parseInt(theme.spacing[6]),
  },
  emptyText: {
    fontSize: parseInt(theme.typography.fontSize.sm),
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});

export default DashboardScreen;






