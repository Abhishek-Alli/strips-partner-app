/**
 * Dealer Checklist Detail Screen
 *
 * Shows checklist sections with bullet point items
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
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

interface ChecklistItem {
  id: string;
  title: string;
}

interface ChecklistSection {
  id: string;
  title: string;
  description: string;
  items: string[];
}

type RouteParams = {
  DealerChecklistDetail: {
    checklist: ChecklistItem;
  };
};

const sampleSections: ChecklistSection[] = [
  {
    id: '1',
    title: 'FLOOR PLAN & DESIGN OF THE HOUSE',
    description: 'Inputs you need to collect from the customer for designing the floor plan of the house',
    items: [
      'Number of bedrooms required, Sizes of Bedroom, Kitchen, Living room & Special Function Rooms',
      'Windows and doors to improve ventilation',
      'Water Drainage',
      'Facing direction of the house',
      'Setback they need',
      'Car-parking area they need',
      'Vastu (if it\'s necessary)',
    ],
  },
  {
    id: '2',
    title: 'BUDGET',
    description: 'LCETED wants to you ready carefully next few-points that may save you from difficult situations',
    items: [
      'Explain properly about materials that come under your quote)',
      'Granite or tile they needed to put on the staircase',
      'Depth of the bore-well, they need to provide',
      'Bathroom fitting that you can provide on your budget',
      'Door framework',
      'Any other interior work they need to be done on their home',
      'Which type of the Window framework',
    ],
  },
];

const DealerChecklistDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'DealerChecklistDetail'>>();
  const { checklist } = route.params || {};

  const handleBack = () => {
    navigation.goBack();
  };

  const renderSection = (section: ChecklistSection) => (
    <View key={section.id} style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionDescription}>{section.description}</Text>
      <View style={styles.bulletList}>
        {section.items.map((item, index) => (
          <View key={index} style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {checklist?.title || 'Civil engineering checklists'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sampleSections.map((section) => renderSection(section))}
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
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
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
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 16,
  },
  bulletList: {
    gap: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: '#1A1A1A',
    marginRight: 10,
    marginTop: -2,
  },
  bulletText: {
    fontSize: 14,
    color: '#1A1A1A',
    flex: 1,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 30,
  },
});

export default DealerChecklistDetailScreen;
