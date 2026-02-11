/**
 * Project Details Screen
 *
 * Shows project details with:
 * - Project image header with dark overlay
 * - Title and location
 * - Enquiry modal with topic dropdown
 * - Give Feedback modal with star rating
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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

// Sample data
const sampleProject = {
  id: '1',
  name: 'Marine Terminal Balearia',
  location: 'Location, Ganeshguri',
  description: `This project involves the construction of a modern marine terminal facility with state-of-the-art infrastructure and amenities.

The terminal will feature advanced passenger handling systems, cargo management facilities, and sustainable design elements.`,
  images: [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ],
};

const topics = ['General Inquiry', 'Project Details', 'Pricing', 'Partnership', 'Other'];

const ProjectDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const projectId = (route.params as any)?.projectId;

  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [enquiryText, setEnquiryText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const project = sampleProject;

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSubmitEnquiry = () => {
    setShowEnquiryModal(false);
    setSelectedTopic('');
    setEnquiryText('');
  };

  const handleSubmitFeedback = () => {
    setShowFeedbackModal(false);
    setFeedbackRating(0);
    setFeedbackText('');
  };

  const isEnquiryValid = selectedTopic && enquiryText.trim();
  const isFeedbackValid = feedbackRating > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      {/* Header with Image */}
      <View style={styles.headerContainer}>
        <View style={styles.headerImage}>
          <View style={styles.headerOverlay} />

          {/* Header Bar */}
          <View style={styles.headerBar}>
            <View style={styles.headerLeft} />
            <Text style={styles.headerTitle}>Project Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Project Info */}
          <View style={styles.projectInfo}>
            <Text style={styles.projectName}>{project.name}</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>{project.location}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.description}>{project.description}</Text>
        </View>

        {/* Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          <View style={styles.mediaGrid}>
            {project.images.map((img) => (
              <TouchableOpacity key={img.id} style={styles.mediaItem}>
                <View style={styles.mediaPlaceholder} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.enquiryButton}
          onPress={() => setShowEnquiryModal(true)}
        >
          <Text style={styles.enquiryButtonText}>Enquiry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() => setShowFeedbackModal(true)}
        >
          <Text style={styles.feedbackButtonText}>Give Feedback</Text>
        </TouchableOpacity>
      </View>

      {/* Enquiry Modal */}
      <Modal
        visible={showEnquiryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEnquiryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enquiry</Text>
              <TouchableOpacity onPress={() => setShowEnquiryModal(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Topic Dropdown */}
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowTopicDropdown(!showTopicDropdown)}
            >
              <Text style={[styles.dropdownText, !selectedTopic && styles.dropdownPlaceholder]}>
                {selectedTopic || 'Topic'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            {showTopicDropdown && (
              <View style={styles.dropdownList}>
                {topics.map((topic, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedTopic(topic);
                      setShowTopicDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{topic}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TextInput
              style={styles.enquiryInput}
              placeholder="Enquiry"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={enquiryText}
              onChangeText={setEnquiryText}
            />

            <TouchableOpacity
              style={[styles.submitButton, !isEnquiryValid && styles.submitButtonDisabled]}
              onPress={handleSubmitEnquiry}
              disabled={!isEnquiryValid}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Give Feedback</Text>
              <TouchableOpacity onPress={() => setShowFeedbackModal(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.feedbackHeading}>Your review help us to{'\n'}be better</Text>

            {/* Star Rating */}
            <View style={styles.starRatingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setFeedbackRating(star)}
                  style={styles.starButton}
                >
                  <Text style={[styles.starLarge, star <= feedbackRating && styles.starLargeFilled]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.feedbackInput}
              placeholder="Message"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={feedbackText}
              onChangeText={setFeedbackText}
            />

            <TouchableOpacity
              style={[styles.submitButton, !isFeedbackValid && styles.submitButtonDisabled]}
              onPress={handleSubmitFeedback}
              disabled={!isFeedbackValid}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
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
  headerContainer: {
    height: 220,
  },
  headerImage: {
    flex: 1,
    backgroundColor: '#2D3142',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 12,
  },
  headerLeft: {
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  projectInfo: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  projectName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaItem: {
    width: '23%',
    aspectRatio: 1,
  },
  mediaPlaceholder: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
    }),
  },
  enquiryButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  enquiryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  feedbackButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  feedbackButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
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
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  dropdownPlaceholder: {
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  enquiryInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1A1A1A',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  feedbackHeading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 28,
  },
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  starLarge: {
    fontSize: 40,
    color: '#E0E0E0',
  },
  starLargeFilled: {
    color: '#FF6B35',
  },
  feedbackInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1A1A1A',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProjectDetailsScreen;
