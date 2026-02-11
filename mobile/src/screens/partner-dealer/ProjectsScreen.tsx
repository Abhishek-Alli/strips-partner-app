/**
 * Projects Screen
 * 
 * Display upcoming construction projects
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
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { mobileBusinessService } from '../../services/businessService';
import { Project } from '../../../shared/types/business.types';
import { logger } from '../../core/logger';

const ProjectsScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await mobileBusinessService.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      logger.error('Failed to load projects', error as Error);
      setProjects([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProjects();
  };

  const renderProjectItem = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={[styles.projectCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
    >
      <Text style={[styles.projectTitle, { color: theme.colors.text.primary }]}>{item.title || 'Untitled Project'}</Text>
      {item.description && (
        <Text style={[styles.projectDescription, { color: theme.colors.text.secondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      <View style={styles.projectMeta}>
        {item.status && (
          <Text style={[styles.projectStatus, { color: theme.colors.primary }]}>{item.status}</Text>
        )}
        {item.startDate && (
          <Text style={[styles.projectDate, { color: theme.colors.text.secondary }]}>
            {new Date(item.startDate).toLocaleDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {projects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No projects available
          </Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderProjectItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
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
  listContent: {
    padding: 16,
  },
  projectCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    }),
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectStatus: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  projectDate: {
    fontSize: 12,
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

export default ProjectsScreen;

