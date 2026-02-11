/**
 * Checklist Detail Screen
 *
 * Shows detailed checklist with sections and bullet points
 * Organized by categories like Floor Plan, Budget, etc.
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
import { useRoute, useNavigation } from '@react-navigation/native';

interface ChecklistSection {
  id: string;
  title: string;
  description?: string;
  items: string[];
}

// Sample checklist data
const civilEngineeringChecklist: ChecklistSection[] = [
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
    description: 'LCETED wants you to ready carefully next few-points that may save you from difficult situations',
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
  {
    id: '3',
    title: 'STRUCTURAL REQUIREMENTS',
    description: 'Essential structural elements to verify',
    items: [
      'Foundation type and depth',
      'Column and beam specifications',
      'Slab thickness and reinforcement',
      'Load bearing wall positions',
      'Seismic zone considerations',
    ],
  },
  {
    id: '4',
    title: 'UTILITIES',
    description: 'Utility connections and provisions',
    items: [
      'Electrical wiring layout',
      'Plumbing connections',
      'Water tank placement',
      'Septic tank or sewage connection',
      'Gas pipeline provisions',
    ],
  },
];

const ChecklistDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { checklistId, title } = (route.params as any) || {};

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || 'Civil engineering checklists'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {civilEngineeringChecklist.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.description && (
              <Text style={styles.sectionDescription}>{section.description}</Text>
            )}

            <View style={styles.itemsList}>
              {section.items.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
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
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  itemsList: {
    gap: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#1A1A1A',
    marginRight: 12,
    marginTop: 2,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 40,
  },
});

export default ChecklistDetailScreen;
