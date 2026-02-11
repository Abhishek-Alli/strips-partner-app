/**
 * Visualization Services Screen
 *
 * Shows previous visualization requests and allows creating new ones
 * Cards display request title, description, and time
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface VisualizationRequest {
  id: string;
  title: string;
  description: string;
  time: string;
}

// Sample data
const sampleRequests: VisualizationRequest[] = [
  {
    id: '1',
    title: 'Rohan Home',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
    time: '2 hrs ago',
  },
  {
    id: '2',
    title: 'CMC Terminal',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
    time: '2 hrs ago',
  },
  {
    id: '3',
    title: 'Building',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
    time: '2 hrs ago',
  },
  {
    id: '4',
    title: 'Parking area',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
    time: '2 hrs ago',
  },
];

const VisualizationServicesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [sqft, setSqft] = useState('');
  const [requirements, setRequirements] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRequestPress = (_request: VisualizationRequest) => {
    // Navigate to request details
  };

  const handleNewRequest = () => {
    setShowNewRequestModal(true);
  };

  const handlePickImage = () => {
    // In production, integrate with react-native-image-picker or expo-image-picker
    Alert.alert(
      'Add Attachment',
      'Select image source',
      [
        { text: 'Camera', onPress: () => addMockImage() },
        { text: 'Gallery', onPress: () => addMockImage() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const addMockImage = () => {
    // Mock image for demo - replace with actual image picker
    const mockImage = `https://picsum.photos/200/200?random=${Date.now()}`;
    setAttachments([...attachments, mockImage]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmitRequest = () => {
    // Submit new request
    setShowNewRequestModal(false);
    setProjectName('');
    setSqft('');
    setRequirements('');
    setAttachments([]);
  };

  const isFormValid = projectName.trim() && sqft.trim() && requirements.trim();

  const renderRequestCard = (request: VisualizationRequest) => (
    <TouchableOpacity
      key={request.id}
      style={styles.requestCard}
      onPress={() => handleRequestPress(request)}
    >
      <Text style={styles.cardTitle}>{request.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {request.description}
      </Text>
      <Text style={styles.cardTime}>{request.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visualization Services</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Previous Visualization Requests</Text>

        <View style={styles.cardsGrid}>
          {sampleRequests.map((request) => renderRequestCard(request))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* New Request Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.newRequestButton} onPress={handleNewRequest}>
          <Text style={styles.newRequestButtonText}>+ New Visualization Requests</Text>
        </TouchableOpacity>
      </View>

      {/* New Request Modal */}
      <Modal
        visible={showNewRequestModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNewRequestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Visualization Requests</Text>
              <TouchableOpacity onPress={() => setShowNewRequestModal(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Name of project</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter project name"
                placeholderTextColor="#999"
                value={projectName}
                onChangeText={setProjectName}
              />

              <Text style={styles.inputLabel}>Sqft</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter square footage"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={sqft}
                onChangeText={setSqft}
              />

              <Text style={styles.inputLabel}>Requirements</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextarea]}
                placeholder="Enter your requirements"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={requirements}
                onChangeText={setRequirements}
              />

              <Text style={styles.inputLabel}>Attachment</Text>
              <View style={styles.attachmentContainer}>
                {attachments.map((uri, index) => (
                  <View key={index} style={styles.attachmentItem}>
                    <Image source={{ uri }} style={styles.attachmentImage} />
                    <TouchableOpacity
                      style={styles.removeAttachment}
                      onPress={() => handleRemoveAttachment(index)}
                    >
                      <Text style={styles.removeAttachmentText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addAttachmentButton} onPress={handlePickImage}>
                  <Text style={styles.addAttachmentIcon}>+</Text>
                  <Text style={styles.addAttachmentText}>Add Image</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !isFormValid && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitRequest}
                disabled={!isFormValid}
              >
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  requestCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 12,
    color: '#FF6B35',
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
    }),
  },
  newRequestButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  newRequestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalClose: {
    fontSize: 28,
    color: '#666',
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  modalTextarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  attachmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  attachmentItem: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeAttachment: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeAttachmentText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: -2,
  },
  addAttachmentButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  addAttachmentIcon: {
    fontSize: 24,
    color: '#999',
  },
  addAttachmentText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
});

export default VisualizationServicesScreen;
