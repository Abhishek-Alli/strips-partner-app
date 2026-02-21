/**
 * Work Editor Screen
 *
 * Create or edit partner/dealer work portfolio items
 * Dealer UI style
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
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { mobileBusinessService } from '../../services/businessService';
import { Work } from '../../../shared/types/business.types';
import { logger } from '../../core/logger';

type WorkEditorRouteParams = {
  mode: 'create' | 'edit';
  workId?: string;
};

const WorkEditorScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: WorkEditorRouteParams }, 'params'>>();
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      </SafeAreaView>
    );
  }

  const categories = ['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Renovation', 'Other'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Title */}
          <View style={styles.field}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
              placeholder="Enter work title"
              placeholderTextColor="#999"
            />
          </View>

          {/* Category */}
          <View style={styles.field}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    formData.category === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setFormData((prev) => ({ ...prev, category: cat }))}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      formData.category === cat && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={formData.description}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
              placeholder="Enter work description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Location */}
          <View style={styles.field}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, location: text }))}
              placeholder="Enter location (optional)"
              placeholderTextColor="#999"
            />
          </View>

          {/* Images */}
          <View style={styles.field}>
            <Text style={styles.label}>Images</Text>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => {
                Alert.alert('Info', 'Image upload functionality will be implemented later');
              }}
            >
              <Text style={styles.imageButtonText}>
                {formData.images.length > 0 ? `${formData.images.length} images` : '+ Add Images'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : mode === 'create' ? 'Create Work' : 'Update Work'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
    minHeight: 120,
    textAlignVertical: 'top',
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
    backgroundColor: '#FFFFFF',
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  imageButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  imageButtonText: {
    fontSize: 14,
    color: '#999',
  },
  saveButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  cancelButtonText: {
    fontSize: 15,
    color: '#999',
  },
  bottomPadding: {
    height: Platform.OS === 'ios' ? 40 : 30,
  },
});

export default WorkEditorScreen;
