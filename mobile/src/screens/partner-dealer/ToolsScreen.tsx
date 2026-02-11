/**
 * Tools Screen (Partner/Dealer Mobile)
 * 
 * Access to utilities, calculators, quizzes, etc.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { logger } from '../../core/logger';

interface Tool {
  id: string;
  title: string;
  icon: string;
  screen: string | null;
  implemented: boolean;
}

const ToolsScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const tools: Tool[] = [
    { id: 'checklists', title: 'Checklists', icon: '✓', screen: 'Checklists', implemented: true },
    { id: 'converters', title: 'Converters', icon: '🔄', screen: 'Converters', implemented: true },
    { id: 'videos', title: 'Videos', icon: '▶️', screen: 'Videos', implemented: true },
    { id: 'shortcuts', title: 'Shortcuts & Links', icon: '🔗', screen: 'Shortcuts', implemented: true },
    { id: 'calculators', title: 'Calculators', icon: '🧮', screen: 'ConstructionCalculator', implemented: true },
    { id: 'budget', title: 'Budget Estimator', icon: '💰', screen: 'BudgetEstimator', implemented: true },
    { id: 'quizzes', title: 'Quizzes', icon: '📝', screen: null, implemented: false },
    { id: 'lectures', title: 'Lectures', icon: '🎓', screen: null, implemented: false },
    { id: 'trading', title: 'Trading Advices', icon: '📈', screen: null, implemented: false },
    { id: 'projects', title: 'Upcoming Projects', icon: '🏗️', screen: 'Projects', implemented: true },
    { id: 'tenders', title: 'Tenders', icon: '📋', screen: null, implemented: false },
    { id: 'steel', title: 'Steel Market Updates', icon: '⚙️', screen: 'Feed', implemented: true }, // FeedScreen shows steel market updates
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Tools</Text>
      </View>

      <View style={styles.toolsGrid}>
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[styles.toolCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => {
              if (!tool.implemented || !tool.screen) {
                Alert.alert('Coming Soon', `${tool.title} feature is coming soon!`);
                return;
              }

              try {
                navigation.navigate(tool.screen as never);
              } catch (error) {
                logger.error(`Failed to navigate to ${tool.screen}`, error as Error);
                Alert.alert('Navigation Error', `Could not navigate to ${tool.title}. Please try again.`);
              }
            }}
          >
            <Text style={styles.toolIcon}>{tool.icon}</Text>
            <Text style={[styles.toolTitle, { color: theme.colors.text.primary }]}>{tool.title}</Text>
            {!tool.implemented && (
              <Text style={[styles.comingSoon, { color: theme.colors.text.secondary }]}>Coming Soon</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  toolCard: {
    width: '47%',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  toolIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  comingSoon: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ToolsScreen;






