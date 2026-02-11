/**
 * Visualization Services Screen
 * 
 * Request VR/3D visualization and view submitted requests
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import { useTheme } from '../../theme';
import { utilitiesService, VisualizationRequest } from '../../services/utilitiesService';
import { logger } from '../../core/logger';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { Skeleton } from '../../components/loaders/Skeleton';

const VisualizationScreen: React.FC = () => {
  const theme = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [requestType, setRequestType] = useState<'VR' | '3D'>('3D');
  const [description, setDescription] = useState('');
  const [requests, setRequests] = useState<VisualizationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const response = await utilitiesService.getVisualizationRequests();
      setRequests(response.requests);
    } catch (error) {
      logger.error('Failed to load visualization requests', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    setSubmitting(true);
    try {
      await utilitiesService.submitVisualizationRequest(requestType, description);
      Alert.alert('Success', 'Visualization request submitted successfully');
      setDescription('');
      setShowForm(false);
      loadRequests();
    } catch (error) {
      logger.error('Failed to submit visualization request', error as Error);
      Alert.alert('Error', 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'in_progress':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Skeleton width="100%" height={100} />
        <Skeleton width="100%" height={100} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Request Form */}
      {showForm && (
        <View style={[styles.formCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.formTitle, { color: theme.colors.text.primary }]}>New Request</Text>

          {/* Type Selection */}
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                {
                  backgroundColor: requestType === '3D' ? theme.colors.primary : theme.colors.background,
                  borderColor: theme.colors.border
                }
              ]}
              onPress={() => setRequestType('3D')}
            >
              <Text style={{ color: requestType === '3D' ? '#fff' : theme.colors.text.primary }}>3D Visualization</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                {
                  backgroundColor: requestType === 'VR' ? theme.colors.primary : theme.colors.background,
                  borderColor: theme.colors.border
                }
              ]}
              onPress={() => setRequestType('VR')}
            >
              <Text style={{ color: requestType === 'VR' ? '#fff' : theme.colors.text.primary }}>VR Walkthrough</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[
              styles.descriptionInput,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text.primary,
                borderColor: theme.colors.border
              }
            ]}
            placeholder="Describe your visualization requirements..."
            placeholderTextColor={theme.colors.text.secondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <PrimaryButton
            title={submitting ? 'Submitting...' : 'Submit Request'}
            onPress={handleSubmit}
            disabled={submitting || !description.trim()}
            fullWidth
          />

          <TouchableOpacity onPress={() => setShowForm(false)}>
            <Text style={{ color: theme.colors.primary, textAlign: 'center', marginTop: 8 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Request Button */}
      {!showForm && (
        <View style={styles.actionContainer}>
          <PrimaryButton
            title="Request Visualization"
            onPress={() => setShowForm(true)}
            fullWidth
          />
        </View>
      )}

      {/* Requests List */}
      <View style={styles.requestsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Your Requests ({requests.length})
        </Text>

        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
              No requests yet. Submit a new request to get started.
            </Text>
          </View>
        ) : (
          requests.map(request => (
            <View
              key={request.id}
              style={[styles.requestCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            >
              <View style={styles.requestHeader}>
                <Text style={[styles.requestType, { color: theme.colors.text.primary }]}>
                  {request.type} Visualization
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(request.status) }
                  ]}
                >
                  <Text style={styles.statusText}>{request.status}</Text>
                </View>
              </View>
              <Text style={[styles.requestDescription, { color: theme.colors.text.secondary }]}>
                {request.description}
              </Text>
              <Text style={[styles.requestDate, { color: theme.colors.text.secondary }]}>
                Submitted: {new Date(request.createdAt).toLocaleDateString()}
              </Text>
              {request.completedAt && (
                <Text style={[styles.requestDate, { color: theme.colors.text.secondary }]}>
                  Completed: {new Date(request.completedAt).toLocaleDateString()}
                </Text>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  formCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    })
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center'
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top'
  },
  actionContainer: {
    padding: 16
  },
  requestsContainer: {
    padding: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  requestType: {
    fontSize: 16,
    fontWeight: '600'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  requestDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20
  },
  requestDate: {
    fontSize: 12,
    marginTop: 4
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center'
  }
});

export default VisualizationScreen;






