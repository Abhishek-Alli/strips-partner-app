/**
 * Vaastu Services Screen
 * 
 * List Vaastu partners and link to their profiles
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { utilitiesService } from '../../services/utilitiesService';
import { logger } from '../../core/logger';
import { Skeleton } from '../../components/loaders/Skeleton';

const VaastuScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [partners, setPartners] = useState<Array<{ id: string; name: string; category: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    try {
      const response = await utilitiesService.getVaastuPartners();
      setPartners(response.partners);
    } catch (error) {
      logger.error('Failed to load Vaastu partners', error as Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Skeleton width="100%" height={100} />
        <Skeleton width="100%" height={100} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Vaastu Partners</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
          Connect with certified Vaastu consultants
        </Text>
      </View>

      {partners.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No Vaastu partners available at the moment.
          </Text>
        </View>
      ) : (
        partners.map(partner => (
          <TouchableOpacity
            key={partner.id}
            style={[styles.partnerCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('PartnerProfile' as never, { partnerId: partner.id } as never)}
          >
            <Text style={[styles.partnerName, { color: theme.colors.text.primary }]}>{partner.name}</Text>
            <Text style={[styles.partnerCategory, { color: theme.colors.text.secondary }]}>
              {partner.category}
            </Text>
            <Text style={[styles.viewProfile, { color: theme.colors.primary }]}>View Profile →</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 14
  },
  partnerCard: {
    padding: 16,
    margin: 16,
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
  partnerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4
  },
  partnerCategory: {
    fontSize: 14,
    marginBottom: 8
  },
  viewProfile: {
    fontSize: 14,
    fontWeight: '600'
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center'
  }
});

export default VaastuScreen;






