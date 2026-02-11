/**
 * Work Editor Screen
 * 
 * Create or edit partner/dealer work portfolio items
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { mobileBusinessService } from '../../services/businessService';
import { Work } from '../../../shared/types/business.types';
import { logger } from '../../core/logger';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';

type WorkEditorRouteParams = {
  mode: 'create' | 'edit';
  workId?: string;
};

const WorkEditorScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: WorkEditorRouteParams }, 'params'>>();
  const theme = useTheme();
  const { user } = useAuth();
  
  const { mode, workId } = (route.params || { mode: 'create' }) as WorkEditorRouteParams;
  
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    images: [] as string[],
    videos: [] as string[],
  });

  useEffect(() => {
    if (mode === 'edit' && workId) {
      loadWork();
    }
  }, [mode, workId]);

  const loadWork = async () => {
    if (!workId || !user?.id) return;
    
    setLoading(true);
    try {
      const works = await mobileBusinessService.getWorks(user.id);
      const work = works.find(w => w.id === workId);
      
      if (work) {
        setFormData({
          title: work.title || '',
          description: work.description || '',
          category: work.category || '',
          location: work.location || '',
          images: Array.isArray(work.images) ? work.images : [],
          videos: Array.isArray(work.videos) ? work.videos : [],
        });
      } else {
        Alert.alert('Error', 'Work not found');
        navigation.goBack();
      }
    } catch (error) {
      logger.error('Failed to load work', error as Error);
      Alert.alert('Error', 'Failed to load work');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    if (!formData.category.trim()) {
      Alert.alert('Error', 'Category is required');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setSaving(true);
    try {
      if (mode === 'create') {
        await mobileBusinessService.createWork({
          userId: user.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category.trim(),
          images: formData.images,
          videos: formData.videos,
          location: formData.location.trim() || undefined,
        });
        Alert.alert('Success', 'Work created successfully');
      } else if (workId) {
        await mobileBusinessService.updateWork(workId, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category.trim(),
          images: formData.images,
          videos: formData.videos,
          location: formData.location.trim() || undefined,
        });
        Alert.alert('Success', 'Work updated successfully');
      }
      
      navigation.goBack();
    } catch (error) {
      logger.error(`Failed to ${mode} work`, error as Error);
      Alert.alert('Error', `Failed to ${mode} work`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const categories = ['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Renovation', 'Other'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.form}>
        {/* Title */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Title *</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text.primary,
                borderColor: theme.colors.border,
              },
            ]}
            value={formData.title}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
            placeholder="Enter work title"
            placeholderTextColor={theme.colors.text.secondary}
          />
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Category *</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor:
                      formData.category === cat ? theme.colors.primary : theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setFormData((prev) => ({ ...prev, category: cat }))}
              >
                <Text
                  style={{
                    color: formData.category === cat ? '#FFFFFF' : theme.colors.text.primary,
                    fontSize: 14,
                    fontWeight: '500',
                  }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Description</Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text.primary,
                borderColor: theme.colors.border,
              },
            ]}
            value={formData.description}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
            placeholder="Enter work description"
            placeholderTextColor={theme.colors.text.secondary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Location */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Location</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text.primary,
                borderColor: theme.colors.border,
              },
            ]}
            value={formData.location}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, location: text }))}
            placeholder="Enter location (optional)"
            placeholderTextColor={theme.colors.text.secondary}
          />
        </View>

        {/* Images - Placeholder for now */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Images</Text>
          <TouchableOpacity
            style={[
              styles.imageButton,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => {
              Alert.alert('Info', 'Image upload functionality will be implemented later');
            }}
          >
            <Text style={{ color: theme.colors.text.secondary }}>
              {formData.images.length > 0 ? `${formData.images.length} images` : '+ Add Images'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <View style={styles.actions}>
          <PrimaryButton
            title={saving ? 'Saving...' : mode === 'create' ? 'Create Work' : 'Update Work'}
            onPress={handleSave}
            disabled={saving}
            fullWidth
          />
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <Text style={{ color: theme.colors.text.secondary, textAlign: 'center', marginTop: 12 }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    ...(Platform.OS === 'android' && { elevation: 0 }),
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    ...(Platform.OS === 'android' && { elevation: 0 }),
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    ...(Platform.OS === 'android' && { elevation: 0 }),
  },
  imageButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    ...(Platform.OS === 'android' && { elevation: 0 }),
  },
  actions: {
    marginTop: 24,
    marginBottom: 32,
  },
  cancelButton: {
    marginTop: 8,
  },
});

export default WorkEditorScreen;

