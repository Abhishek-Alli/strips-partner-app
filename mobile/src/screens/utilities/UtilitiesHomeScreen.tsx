/**
 * Utilities Home Screen
 * 
 * Main entry point for all utility features
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { logger } from '../../core/logger';

interface UtilityItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  screen: string;
}

const UtilitiesHomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const utilities: UtilityItem[] = [
    {
      id: '1',
      title: 'Checklists',
      icon: '✅',
      description: 'Civil engineering checklists',
      screen: 'Checklists'
    },
    {
      id: '2',
      title: 'Visualization',
      icon: '🎨',
      description: 'Request VR/3D visualization',
      screen: 'Visualization'
    },
    {
      id: '3',
      title: 'Shortcuts & Links',
      icon: '🔗',
      description: 'Engineering standards and software shortcuts',
      screen: 'Shortcuts'
    },
    {
      id: '4',
      title: 'Unit Converters',
      icon: '🔄',
      description: 'Convert between different units',
      screen: 'Converters'
    },
    {
      id: '5',
      title: 'Videos',
      icon: '📹',
      description: 'Educational YouTube videos',
      screen: 'Videos'
    },
    {
      id: '6',
      title: 'Vaastu Services',
      icon: '🏛️',
      description: 'Connect with Vaastu consultants',
      screen: 'Vaastu'
    },
    {
      id: '7',
      title: 'Notes & Messages',
      icon: '📝',
      description: 'View admin notes and responses',
      screen: 'NotesMessages'
    },
    {
      id: '8',
      title: 'Construction Calculator',
      icon: '🧮',
      description: 'Calculate area and material quantities',
      screen: 'ConstructionCalculator'
    },
    {
      id: '9',
      title: 'Budget Estimator',
      icon: '💰',
      description: 'Estimate construction costs',
      screen: 'BudgetEstimator'
    }
  ];

  const handlePress = (screen: string) => {
    try {
      navigation.navigate(screen as never);
    } catch (error: any) {
      // Handle navigation errors gracefully
      logger.error(`Failed to navigate to ${screen}`, error as Error);
      Alert.alert(
        'Navigation Error',
        `Unable to open ${screen}. Please try again or contact support if the issue persists.`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Utilities & Knowledge</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
          Access tools and resources for your projects
        </Text>
      </View>

      <View style={styles.grid}>
        {utilities.map(utility => (
          <TouchableOpacity
            key={utility.id}
            style={[styles.utilityCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => handlePress(utility.screen)}
          >
            <Text style={styles.utilityIcon}>{utility.icon}</Text>
            <Text style={[styles.utilityTitle, { color: theme.colors.text.primary }]}>{utility.title}</Text>
            <Text style={[styles.utilityDescription, { color: theme.colors.text.secondary }]} numberOfLines={2}>
              {utility.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12
  },
  utilityCard: {
    width: '47%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    })
  },
  utilityIcon: {
    fontSize: 40,
    marginBottom: 8
  },
  utilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center'
  },
  utilityDescription: {
    fontSize: 12,
    textAlign: 'center'
  }
});

export default UtilitiesHomeScreen;

