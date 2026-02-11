/**
 * Checklists Screen
 * 
 * Displays civil engineering checklists by category
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
import { useTheme } from '../../theme';
import { utilitiesService, Checklist } from '../../services/utilitiesService';
import { logger } from '../../core/logger';
import { Skeleton } from '../../components/loaders/Skeleton';

const ChecklistsScreen: React.FC = () => {
  const theme = useTheme();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [expandedChecklist, setExpandedChecklist] = useState<string | null>(null);

  const categories = ['Foundation', 'Structure', 'Plumbing', 'Electrical', 'Finishing'];

  useEffect(() => {
    loadChecklists();
  }, [selectedCategory]);

  const loadChecklists = async () => {
    setLoading(true);
    try {
      const response = await utilitiesService.getChecklists(selectedCategory);
      setChecklists(response.checklists);
    } catch (error) {
      logger.error('Failed to load checklists', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChecklist = (checklistId: string) => {
    setExpandedChecklist(expandedChecklist === checklistId ? null : checklistId);
  };

  const toggleItem = (checklistId: string, itemId: string) => {
    setChecklists(prev =>
      prev.map(checklist => {
        if (checklist.id === checklistId) {
          return {
            ...checklist,
            items: checklist.items.map(item =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            )
          };
        }
        return checklist;
      })
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Skeleton width="100%" height={100} />
        <Skeleton width="100%" height={100} />
        <Skeleton width="100%" height={100} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            {
              backgroundColor: !selectedCategory ? theme.colors.primary : theme.colors.card,
              borderColor: theme.colors.border
            }
          ]}
          onPress={() => setSelectedCategory(undefined)}
        >
          <Text style={{ color: !selectedCategory ? '#fff' : theme.colors.text.primary }}>All</Text>
        </TouchableOpacity>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === category ? theme.colors.primary : theme.colors.card,
                borderColor: theme.colors.border
              }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={{ color: selectedCategory === category ? '#fff' : theme.colors.text.primary }}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Checklists */}
      <ScrollView style={styles.checklistsContainer}>
        {checklists.map(checklist => (
          <View
            key={checklist.id}
            style={[styles.checklistCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          >
            <TouchableOpacity
              style={styles.checklistHeader}
              onPress={() => toggleChecklist(checklist.id)}
            >
              <Text style={[styles.checklistTitle, { color: theme.colors.text.primary }]}>
                {checklist.title}
              </Text>
              <Text style={{ color: theme.colors.text.secondary }}>
                {expandedChecklist === checklist.id ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            {expandedChecklist === checklist.id && (
              <View style={styles.itemsContainer}>
                {checklist.items.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.itemRow}
                    onPress={() => toggleItem(checklist.id, item.id)}
                  >
                    <Text style={{ fontSize: 20, marginRight: 12 }}>
                      {item.checked ? '☑️' : '☐'}
                    </Text>
                    <Text style={[styles.itemText, { color: theme.colors.text.primary }]}>
                      {item.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  categoryContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  categoryContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1
  },
  checklistsContainer: {
    flex: 1,
    padding: 12
  },
  checklistCard: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    })
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1
  },
  itemsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  itemText: {
    flex: 1,
    fontSize: 14
  }
});

export default ChecklistsScreen;






