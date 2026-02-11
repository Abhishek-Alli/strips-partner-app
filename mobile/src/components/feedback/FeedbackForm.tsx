/**
 * Feedback Form Component
 * 
 * Reusable component for submitting feedback/ratings
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { useTheme } from '../../theme';
import { favoritesService, FeedbackData } from '../../services/favoritesService';
import { logger } from '../../core/logger';
import { PrimaryButton } from '../buttons/PrimaryButton';

interface FeedbackFormProps {
  profileId: string;
  profileType: 'partner' | 'dealer';
  onSubmitted?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ profileId, profileType, onSubmitted }) => {
  const theme = useTheme();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState<FeedbackData | null>(null);

  useEffect(() => {
    loadExistingFeedback();
  }, [profileId, profileType]);

  const loadExistingFeedback = async () => {
    try {
      const response = await favoritesService.getUserFeedback(profileId, profileType);
      if (response.feedback) {
        setExistingFeedback(response.feedback);
        setRating(response.feedback.rating);
        setComment(response.feedback.comment);
      }
    } catch (error) {
      logger.error('Failed to load existing feedback', error as Error);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    setLoading(true);
    try {
      await favoritesService.submitFeedback({
        profileId,
        profileType,
        rating,
        comment: comment.trim()
      });
      Alert.alert('Success', existingFeedback ? 'Feedback updated successfully' : 'Feedback submitted successfully');
      setExistingFeedback({ profileId, profileType, rating, comment: comment.trim() });
      if (onSubmitted) {
        onSubmitted();
      }
    } catch (error: any) {
      logger.error('Failed to submit feedback', error as Error);
      Alert.alert('Error', error.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {existingFeedback ? 'Update Your Review' : 'Write a Review'}
      </Text>

      {/* Star Rating */}
      <View style={styles.ratingContainer}>
        <Text style={[styles.ratingLabel, { color: theme.colors.text.secondary }]}>Rating:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Text style={[styles.star, { color: star <= rating ? theme.colors.primary : theme.colors.border }]}>
                ⭐
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && (
          <Text style={[styles.ratingText, { color: theme.colors.text.secondary }]}>
            {rating} out of 5
          </Text>
        )}
      </View>

      {/* Comment */}
      <TextInput
        style={[
          styles.commentInput,
          {
            backgroundColor: theme.colors.background,
            color: theme.colors.text.primary,
            borderColor: theme.colors.border
          }
        ]}
        placeholder="Write your review..."
        placeholderTextColor={theme.colors.text.secondary}
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <PrimaryButton
        title={loading ? 'Submitting...' : existingFeedback ? 'Update Review' : 'Submit Review'}
        onPress={handleSubmit}
        disabled={loading || rating === 0 || !comment.trim()}
        fullWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    margin: 16,
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    })
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  ratingContainer: {
    marginBottom: 16
  },
  ratingLabel: {
    fontSize: 14,
    marginBottom: 8
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  starButton: {
    padding: 4
  },
  star: {
    fontSize: 32
  },
  ratingText: {
    fontSize: 12
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    minHeight: 100
  }
});

export default FeedbackForm;






