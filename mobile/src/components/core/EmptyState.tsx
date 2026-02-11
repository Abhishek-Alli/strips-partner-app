/**
 * Premium Mobile Empty State Component
 * 
 * Friendly, actionable empty states optimized for mobile
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { Icon } from './Icon';
import { IconName } from '../../../shared/icons/iconMap';
import { theme } from '../../theme';

interface EmptyStateProps {
  icon?: string;
  iconName?: IconName;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  iconName,
  title,
  description,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <View style={styles.container}>
      {(icon || iconName) && (
        <View style={styles.iconContainer}>
          {iconName ? (
            <Icon name={iconName} size={40} color={theme.colors.text.tertiary} />
          ) : (
            <Text style={styles.icon}>{icon}</Text>
          )}
        </View>
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      <Text style={styles.description}>{description}</Text>
      
      {(primaryAction || secondaryAction) && (
        <View style={styles.actionsContainer}>
          {secondaryAction && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={secondaryAction.onPress}
            >
              <Text style={styles.secondaryButtonText}>
                {secondaryAction.label}
              </Text>
            </TouchableOpacity>
          )}
          {primaryAction && (
            <PrimaryButton
              title={primaryAction.label}
              onPress={primaryAction.onPress}
              size="lg"
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: parseInt(theme.spacing[8]),
    minHeight: 300,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: parseInt(theme.radius.full),
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: parseInt(theme.spacing[6]),
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: parseInt(theme.typography.fontSize.lg),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: parseInt(theme.spacing[2]),
    textAlign: 'center',
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  description: {
    fontSize: parseInt(theme.typography.fontSize.base),
    color: theme.colors.text.secondary,
    lineHeight: parseInt(theme.typography.fontSize.base) * theme.typography.lineHeight.relaxed,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: parseInt(theme.spacing[6]),
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 300,
    gap: parseInt(theme.spacing[2]),
  },
  secondaryButton: {
    paddingVertical: parseInt(theme.spacing[2]),
    paddingHorizontal: parseInt(theme.spacing[4]),
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: parseInt(theme.typography.fontSize.base),
    color: theme.colors.primary[700],
    fontWeight: theme.typography.fontWeight.medium,
  },
});

// Pre-configured empty states
export const EmptyEnquiries = ({ onSearch }: { onSearch: () => void }) => (
  <EmptyState
    iconName="enquiry"
    title="No enquiries yet"
    description="Start by searching for partners or dealers and send your first enquiry."
    primaryAction={{
      label: "Search Partners",
      onPress: onSearch,
    }}
  />
);

export const EmptyWorks = ({ onAdd }: { onAdd: () => void }) => (
  <EmptyState
    iconName="work"
    title="No works yet"
    description="Showcase your expertise by adding your best projects."
    primaryAction={{
      label: "Add Your First Work",
      onPress: onAdd,
    }}
  />
);

export const EmptyProducts = ({ onAdd }: { onAdd: () => void }) => (
  <EmptyState
    iconName="product"
    title="No products yet"
    description="Build your catalogue by adding products for customers to browse."
    primaryAction={{
      label: "Add Your First Product",
      onPress: onAdd,
    }}
  />
);

export const EmptySearchResults = ({ onClearFilters }: { onClearFilters?: () => void }) => (
  <EmptyState
    iconName="emptySearch"
    title="No results found"
    description="Try adjusting your search criteria to find what you're looking for."
    secondaryAction={onClearFilters ? {
      label: "Clear Filters",
      onPress: onClearFilters,
    } : undefined}
  />
);

