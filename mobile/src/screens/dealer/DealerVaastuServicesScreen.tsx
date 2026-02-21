/**
 * Dealer Vaastu Services Screen
 *
 * 2-column grid of Vaastu consultant cards
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';

interface VaastuConsultant {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string | null;
}

const CONSULTANTS: VaastuConsultant[] = [
  {
    id: '1',
    name: 'Vastu Consultant',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    location: 'Ganeshguri',
    image: null,
  },
  {
    id: '2',
    name: 'Vastu Consultant',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    location: 'Ganeshguri',
    image: null,
  },
  {
    id: '3',
    name: 'Vastu Consultant',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    location: 'Ganeshguri',
    image: null,
  },
  {
    id: '4',
    name: 'Vastu Consultant',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    location: 'Ganeshguri',
    image: null,
  },
  {
    id: '5',
    name: 'Vastu Consultant',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    location: 'Ganeshguri',
    image: null,
  },
  {
    id: '6',
    name: 'Vastu Consultant',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    location: 'Ganeshguri',
    image: null,
  },
];

const DealerVaastuServicesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { openDrawer: handleOpenDrawer } = useDrawer();

  const renderCard = (consultant: VaastuConsultant) => (
    <TouchableOpacity key={consultant.id} style={styles.card}>
      <View style={styles.imagePlaceholder}>
        {consultant.image ? (
          <Image source={{ uri: consultant.image }} style={styles.cardImage} />
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>IMG</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{consultant.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {consultant.description}
        </Text>
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>Location: {consultant.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Build rows of 2 cards each
  const rows: VaastuConsultant[][] = [];
  for (let i = 0; i < CONSULTANTS.length; i += 2) {
    rows.push(CONSULTANTS.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vaastu Services</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(renderCard)}
            {row.length === 1 && <View style={styles.cardSpacer} />}
          </View>
        ))}
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
  menuButton: {
    padding: 4,
  },
  menuIcon: {
    fontSize: 24,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  cardSpacer: {
    width: '48%',
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#E8E8E8',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 11,
    color: '#888',
  },
  bottomPadding: {
    height: Platform.OS === 'ios' ? 40 : 30,
  },
});

export default DealerVaastuServicesScreen;
