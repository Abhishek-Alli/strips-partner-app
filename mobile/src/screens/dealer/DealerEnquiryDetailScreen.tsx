/**
 * Dealer Enquiry Detail Screen
 *
 * Shows single enquiry detail with reply input
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  time: string;
}

type RouteParams = {
  DealerEnquiryDetail: {
    enquiry: Enquiry;
  };
};

const DealerEnquiryDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'DealerEnquiryDetail'>>();
  const { enquiry } = route.params || {};

  const [replyText, setReplyText] = useState('');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    // Send reply logic
    setReplyText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Enquiry Card */}
        <View style={styles.content}>
          <View style={styles.enquiryCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.userName}>{enquiry?.name || 'Alok Das'}</Text>
                <Text style={styles.userEmail}>📧 {enquiry?.email || 'example@gmail.com'}</Text>
              </View>
              <Text style={styles.timeText}>{enquiry?.time || '2 mins ago'}</Text>
            </View>
            <Text style={styles.topicText}>Topic: {enquiry?.topic || 'Sed ut perspiciatis'}</Text>
            <Text style={styles.messageText}>
              {enquiry?.message || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim nostrud exercitation...'}
            </Text>
          </View>
        </View>

        {/* Reply Input */}
        <View style={styles.replyContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Reply...."
            placeholderTextColor="#999"
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !replyText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendReply}
            disabled={!replyText.trim()}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  enquiryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#666',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  topicText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
    }),
  },
  replyInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  sendIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default DealerEnquiryDetailScreen;
