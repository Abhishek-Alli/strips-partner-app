/**
 * Shortcuts & Links Screen
 * 
 * Engineering standards, dictionary, symbols, software shortcuts
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform
} from 'react-native';
import { useTheme } from '../../theme';
import { logger } from '../../core/logger';

interface ShortcutItem {
  id: string;
  title: string;
  category: string;
  description: string;
  url?: string;
  action?: () => void;
}

const ShortcutsScreen: React.FC = () => {
  const theme = useTheme();

  const shortcuts: ShortcutItem[] = [
    {
      id: '1',
      title: 'Engineering Standards',
      category: 'Standards',
      description: 'Access engineering standards and codes',
      url: 'https://www.is.org.in'
    },
    {
      id: '2',
      title: 'Engineering Dictionary',
      category: 'Reference',
      description: 'Comprehensive engineering terminology',
      action: () => {
        // Navigate to dictionary screen
        logger.info('Open dictionary');
      }
    },
    {
      id: '3',
      title: 'Symbols Library',
      category: 'Reference',
      description: 'Engineering symbols and notations',
      action: () => {
        // Navigate to symbols screen
        logger.info('Open symbols library');
      }
    },
    {
      id: '4',
      title: 'STAAD Pro Shortcuts',
      category: 'Software',
      description: 'Keyboard shortcuts for STAAD Pro',
      action: () => {
        // Show shortcuts modal
        logger.info('Show STAAD shortcuts');
      }
    },
    {
      id: '5',
      title: 'AutoCAD Shortcuts',
      category: 'Software',
      description: 'Keyboard shortcuts for AutoCAD',
      action: () => {
        // Show shortcuts modal
        logger.info('Show AutoCAD shortcuts');
      }
    },
    {
      id: '6',
      title: 'PDMS Shortcuts',
      category: 'Software',
      description: 'Keyboard shortcuts for PDMS',
      action: () => {
        // Show shortcuts modal
        logger.info('Show PDMS shortcuts');
      }
    }
  ];

  const handlePress = async (item: ShortcutItem) => {
    if (item.url) {
      try {
        await Linking.openURL(item.url);
      } catch (error) {
        logger.error('Failed to open URL', error as Error);
      }
    } else if (item.action) {
      item.action();
    }
  };

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {categories.map(category => (
        <View key={category} style={styles.categorySection}>
          <Text style={[styles.categoryTitle, { color: theme.colors.text.primary }]}>{category}</Text>
          {shortcuts
            .filter(s => s.category === category)
            .map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.shortcutCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                onPress={() => handlePress(item)}
              >
                <Text style={[styles.shortcutTitle, { color: theme.colors.text.primary }]}>{item.title}</Text>
                <Text style={[styles.shortcutDescription, { color: theme.colors.text.secondary }]}>
                  {item.description}
                </Text>
                {item.url && (
                  <Text style={[styles.shortcutUrl, { color: theme.colors.primary }]} numberOfLines={1}>
                    {item.url}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  categorySection: {
    padding: 16
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  shortcutCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    })
  },
  shortcutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  shortcutDescription: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20
  },
  shortcutUrl: {
    fontSize: 12,
    marginTop: 4
  }
});

export default ShortcutsScreen;






