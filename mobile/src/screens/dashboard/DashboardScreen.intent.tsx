/**
 * Intent-Driven Mobile Dashboard
 * 
 * Focuses on General User's primary job: Find partners/dealers
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contexts/AuthContext';
import { Card } from '../../../components/core/Card';
import { StatCard } from '../../../components/core/StatCard';
import { PrimaryButton } from '../../../components/core/PrimaryButton';
import { EmptyState } from '../../../components/core/EmptyState';
import { theme } from '../../../theme';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [hasActivity] = useState(false); // Would come from API

  // Primary job: Search for partners/dealers
  // Show search prompt prominently if no recent activity

  if (!hasActivity) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.emptyContent}
      >
        <EmptyState
          icon="🔍"
          title="Find trusted partners"
          description="Search for construction partners and dealers near you. Get started by searching for what you need."
          primaryAction={{
            label: "Search Partners",
            onPress: () => navigation.navigate('PartnerSearch' as never),
          }}
          secondaryAction={{
            label: "Search Dealers",
            onPress: () => navigation.navigate('DealerSearch' as never),
          }}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back</Text>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
      </View>

      {/* PRIMARY CARD: Search Prompt (60% visual weight) */}
      <Card
        variant="elevated"
        onPress={() => navigation.navigate('PartnerSearch' as never)}
        style={styles.primaryCard}
      >
        <View style={styles.primaryCardContent}>
          <Text style={styles.primaryCardTitle}>Search Partners</Text>
          <Text style={styles.primaryCardSubtitle}>
            Find trusted construction partners near you
          </Text>
          <PrimaryButton
            title="Start Searching"
            onPress={() => navigation.navigate('PartnerSearch' as never)}
            size="lg"
            style={styles.primaryButton}
          />
        </View>
      </Card>

      {/* SUPPORTING CARDS: Recent Activity (30% visual weight) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        
        <Card
          variant="default"
          onPress={() => navigation.navigate('DealerSearch' as never)}
          style={styles.supportingCard}
        >
          <View style={styles.supportingCardContent}>
            <Text style={styles.supportingCardTitle}>Search Dealers</Text>
            <Text style={styles.supportingCardSubtitle}>
              Browse product dealers and suppliers
            </Text>
          </View>
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
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
  primaryCard: {
    marginBottom: parseInt(theme.spacing[6]),
    backgroundColor: theme.colors.primary[50],
    borderWidth: 2,
    borderColor: theme.colors.primary[200],
  },
  primaryCardContent: {
    gap: parseInt(theme.spacing[4]),
  },
  primaryCardTitle: {
    fontSize: parseInt(theme.typography.fontSize.lg),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  primaryCardSubtitle: {
    fontSize: parseInt(theme.typography.fontSize.sm),
    color: theme.colors.text.secondary,
    lineHeight: parseInt(theme.typography.fontSize.sm) * theme.typography.lineHeight.normal,
  },
  primaryButton: {
    marginTop: parseInt(theme.spacing[2]),
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
  supportingCard: {
    marginBottom: parseInt(theme.spacing[4]),
  },
  supportingCardContent: {
    gap: parseInt(theme.spacing[2]),
  },
  supportingCardTitle: {
    fontSize: parseInt(theme.typography.fontSize.base),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  supportingCardSubtitle: {
    fontSize: parseInt(theme.typography.fontSize.sm),
    color: theme.colors.text.secondary,
    lineHeight: parseInt(theme.typography.fontSize.sm) * theme.typography.lineHeight.normal,
  },
});

export default DashboardScreen;






