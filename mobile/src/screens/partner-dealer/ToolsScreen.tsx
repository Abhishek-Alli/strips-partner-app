/**
 * Tools Screen (Partner/Dealer Mobile)
 *
 * Access to utilities, calculators, quizzes, etc.
 * Dealer UI style
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
    { id: 'steel', title: 'Steel Market Updates', icon: '⚙️', screen: 'Feed', implemented: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tools</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.toolsGrid}>
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
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
              <Text style={styles.toolTitle}>{tool.title}</Text>
              {!tool.implemented && (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
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
  content: {
    flex: 1,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 10,
  },
  toolCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
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
  toolIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  toolTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  comingSoonBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#FFF5F2',
    borderRadius: 10,
  },
  comingSoonText: {
    fontSize: 10,
    color: '#FF6B35',
    fontWeight: '500',
  },
  bottomPadding: {
    height: Platform.OS === 'ios' ? 40 : 30,
  },
});

export default ToolsScreen;
