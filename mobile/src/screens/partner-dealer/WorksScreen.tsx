/**
 * Works Screen (Partner/Dealer Mobile)
 * 
 * Manage portfolio / works
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { mobileBusinessService } from '../../services/businessService';
import { Work } from '../../../shared/types/business.types';
import { logger } from '../../core/logger';

const WorksScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { user } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadWorks();
    } else {
      // If user is not loaded yet, wait a bit and try again
      // This prevents crashes when user is undefined initially
      setLoading(false);
    }
  }, [user?.id]);

  const loadWorks = async () => {
    if (!user?.id) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    
    try {
      const data = await mobileBusinessService.getWorks(user.id);
      // Ensure data is an array, even if API returns something else
      setWorks(Array.isArray(data) ? data : []);
    } catch (error) {
      logger.error('Failed to load works', error as Error);
      // Set empty array on error to prevent crashes
      setWorks([]);
      // Don't show alert for network errors - just log them
      // Alert.alert('Error', 'Failed to load works');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWorks();
  };

  const handleAddWork = () => {
    navigation.navigate('WorkEditor' as never, { mode: 'create' });
  };

  const handleEditWork = (work: Work) => {
    if (!work || !work.id) return;
    navigation.navigate('WorkEditor' as never, { mode: 'edit', workId: work.id });
  };

  const renderWorkItem = ({ item }: { item: Work }) => {
    // Safely handle potentially undefined/null values
    if (!item) return null;
    
    const images = Array.isArray(item.images) ? item.images : [];
    const imageUrl = images.length > 0 ? images[0] : null;
    
    return (
      <TouchableOpacity
        style={[styles.workCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        onPress={() => handleEditWork(item)}
      >
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.workImage} resizeMode="cover" />
        )}
        <View style={styles.workContent}>
          <Text style={[styles.workTitle, { color: theme.colors.text.primary }]}>
            {item.title || 'Untitled Work'}
          </Text>
          <Text style={[styles.workCategory, { color: theme.colors.text.secondary }]}>
            {item.category || 'Uncategorized'}
          </Text>
          {item.description && (
            <Text style={[styles.workDescription, { color: theme.colors.text.secondary }]} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Prevent crash if theme is not loaded
  if (!theme || !theme.colors) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>My Works</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddWork}
        >
          <Text style={styles.addButtonText}>+ Add Work</Text>
        </TouchableOpacity>
      </View>

      {!works || works.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No works yet. Add your first work to showcase your portfolio.
          </Text>
        </View>
      ) : (
        <FlatList
          data={works.filter(item => item && item.id)} // Filter out any invalid items
          keyExtractor={(item) => item?.id || `work-${Math.random()}`}
          renderItem={renderWorkItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  workCard: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  workImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
  },
  workContent: {
    padding: 12,
  },
  workTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  workCategory: {
    fontSize: 14,
    marginBottom: 8,
  },
  workDescription: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WorksScreen;






