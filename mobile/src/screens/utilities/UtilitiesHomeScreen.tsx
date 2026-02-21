/**
 * Utilities & Knowledge Home Screen
 *
 * Main entry point for all utility features - dealer UI style
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { logger } from '../../core/logger';

interface UtilityItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  screen: string;
}

interface Section {
  title: string;
  items: UtilityItem[];
}

const sections: Section[] = [
  {
    title: 'Calculators & Tools',
    items: [
      {
        id: '1',
        title: 'Construction Calculator',
        icon: 'calculate',
        description: 'Area, material & quantity estimates',
        screen: 'ConstructionCalculator',
      },
      {
        id: '2',
        title: 'Budget Estimator',
        icon: 'attach-money',
        description: 'Estimate total construction costs',
        screen: 'BudgetEstimator',
      },
      {
        id: '3',
        title: 'Unit Converters',
        icon: 'swap-horiz',
        description: 'Convert between engineering units',
        screen: 'Converters',
      },
    ],
  },
  {
    title: 'Knowledge & Resources',
    items: [
      {
        id: '4',
        title: 'Checklists',
        icon: 'checklist',
        description: 'Civil engineering checklists',
        screen: 'Checklists',
      },
      {
        id: '5',
        title: 'Videos',
        icon: 'video-library',
        description: 'Educational construction videos',
        screen: 'Videos',
      },
      {
        id: '6',
        title: 'Vaastu Services',
        icon: 'home-work',
        description: 'Connect with Vaastu consultants',
        screen: 'Vaastu',
      },
      {
        id: '7',
        title: 'Shortcuts & Links',
        icon: 'link',
        description: 'Engineering standards & software',
        screen: 'Shortcuts',
      },
    ],
  },
  {
    title: 'Other',
    items: [
      {
        id: '8',
        title: 'Visualization',
        icon: 'view-in-ar',
        description: 'Request VR / 3D visualization',
        screen: 'Visualization',
      },
      {
        id: '9',
        title: 'Notes & Messages',
        icon: 'edit-note',
        description: 'Admin notes and responses',
        screen: 'NotesMessages',
      },
    ],
  },
];

const UtilitiesHomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handlePress = (item: UtilityItem) => {
    try {
      navigation.navigate(item.screen as never);
    } catch (error) {
      logger.error(`Failed to navigate to ${item.screen}`, error as Error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Utilities & Knowledge</Text>
        <Text style={styles.headerSubtitle}>Tools and resources for your projects</Text>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.row,
                    index < section.items.length - 1 && styles.rowBorder,
                  ]}
                  onPress={() => handlePress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconContainer}>
                    <MaterialIcons name={item.icon as any} size={22} color="#FF6B35" />
                  </View>
                  <View style={styles.rowContent}>
                    <Text style={styles.rowTitle}>{item.title}</Text>
                    <Text style={styles.rowDescription} numberOfLines={1}>
                      {item.description}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={22} color="#BBBBBB" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  android: { elevation: 3 },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...cardShadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  rowDescription: {
    fontSize: 12,
    color: '#999',
  },
  bottomPadding: {
    height: Platform.OS === 'ios' ? 40 : 24,
  },
});

export default UtilitiesHomeScreen;
