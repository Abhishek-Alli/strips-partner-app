/**
 * Works Screen (Partner/Dealer Mobile)
 *
 * Manage portfolio / works - dealer UI style
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
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { mobileBusinessService } from '../../services/businessService';
import { Work } from '../../../shared/types/business.types';
import { logger } from '../../core/logger';

const WorksScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadWorks();
    } else {
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
      setWorks(Array.isArray(data) ? data : []);
    } catch (error) {
      logger.error('Failed to load works', error as Error);
      setWorks([]);
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
    if (!item) return null;

    const images = Array.isArray(item.images) ? item.images : [];
    const imageUrl = images.length > 0 ? images[0] : null;

    return (
      <TouchableOpacity
        style={styles.workCard}
        onPress={() => handleEditWork(item)}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.workImage} resizeMode="cover" />
        ) : (
          <View style={styles.workImagePlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.workContent}>
          <Text style={styles.workTitle}>{item.title || 'Untitled Work'}</Text>
          <Text style={styles.workCategory}>{item.category || 'Uncategorized'}</Text>
          {item.description && (
            <Text style={styles.workDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Works</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddWork}>
          <Text style={styles.addButtonText}>+ Add Work</Text>
        </TouchableOpacity>
      </View>

      {!works || works.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No works yet. Add your first work to showcase your portfolio.
          </Text>
        </View>
      ) : (
        <FlatList
          data={works.filter(item => item && item.id)}
          keyExtractor={(item) => item?.id || `work-${Math.random()}`}
          renderItem={renderWorkItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B35" />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  workCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
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
  workImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E0E0E0',
  },
  workImagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
  },
  workContent: {
    padding: 14,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  workCategory: {
    fontSize: 13,
    color: '#FF6B35',
    fontWeight: '500',
    marginBottom: 6,
  },
  workDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default WorksScreen;
