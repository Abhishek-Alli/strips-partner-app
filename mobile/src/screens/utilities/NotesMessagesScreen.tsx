/**
 * Notes & Messages Screen
 * 
 * View admin notes and enquiry responses
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
import { useAuth } from '../../contexts/AuthContext';
import { logger } from '../../core/logger';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { Skeleton } from '../../components/loaders/Skeleton';
import { apiClient } from '../../services/apiClient';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  from: string;
  createdAt: string;
  isRead: boolean;
  replyTo?: string;
}

const NotesMessagesScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'notes' | 'messages'>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'notes') {
        await loadNotes();
      } else {
        await loadMessages();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    try {
      if (apiClient.isMockMode()) {
        setNotes([
          {
            id: '1',
            title: 'Welcome Note',
            content: 'Welcome to SRJ! We are here to help you with your construction needs.',
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            isRead: false
          },
          {
            id: '2',
            title: 'Important Update',
            content: 'New features have been added to help you find the best partners and dealers.',
            createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
            isRead: true
          }
        ]);
        return;
      }

      const response = await apiClient.get<{ notes: Note[] }>('/user/notes');
      setNotes(response.notes);
    } catch (error) {
      logger.error('Failed to load notes', error as Error);
    }
  };

  const loadMessages = async () => {
    try {
      if (apiClient.isMockMode()) {
        setMessages([
          {
            id: '1',
            subject: 'Response to your enquiry',
            content: 'Thank you for your enquiry. We have forwarded it to the relevant partner.',
            from: 'Admin',
            createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
            isRead: false
          }
        ]);
        return;
      }

      const response = await apiClient.get<{ messages: Message[] }>('/user/messages');
      setMessages(response.messages);
    } catch (error) {
      logger.error('Failed to load messages', error as Error);
    }
  };

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }

    try {
      if (apiClient.isMockMode()) {
        logger.info('Reply sent', { messageId, replyText });
        Alert.alert('Success', 'Reply sent successfully');
        setReplyingTo(null);
        setReplyText('');
        return;
      }

      await apiClient.post(`/user/messages/${messageId}/reply`, { content: replyText });
      Alert.alert('Success', 'Reply sent successfully');
      setReplyingTo(null);
      setReplyText('');
      loadMessages();
    } catch (error) {
      logger.error('Failed to send reply', error as Error);
      Alert.alert('Error', 'Failed to send reply');
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'notes' && { borderBottomWidth: 2, borderBottomColor: theme.colors.primary }
          ]}
          onPress={() => setActiveTab('notes')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'notes' ? theme.colors.primary : theme.colors.text.secondary }]}>
            Notes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'messages' && { borderBottomWidth: 2, borderBottomColor: theme.colors.primary }
          ]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'messages' ? theme.colors.primary : theme.colors.text.secondary }]}>
            Messages
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'notes' ? (
          notes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>No notes available</Text>
            </View>
          ) : (
            notes.map(note => (
              <View
                key={note.id}
                style={[styles.noteCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              >
                {!note.isRead && <View style={[styles.unreadIndicator, { backgroundColor: theme.colors.primary }]} />}
                <Text style={[styles.noteTitle, { color: theme.colors.text.primary }]}>{note.title}</Text>
                <Text style={[styles.noteContent, { color: theme.colors.text.secondary }]}>{note.content}</Text>
                <Text style={[styles.noteDate, { color: theme.colors.text.secondary }]}>
                  {new Date(note.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))
          )
        ) : (
          messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>No messages available</Text>
            </View>
          ) : (
            messages.map(message => (
              <View
                key={message.id}
                style={[styles.messageCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              >
                {!message.isRead && <View style={[styles.unreadIndicator, { backgroundColor: theme.colors.primary }]} />}
                <Text style={[styles.messageSubject, { color: theme.colors.text.primary }]}>{message.subject}</Text>
                <Text style={[styles.messageFrom, { color: theme.colors.text.secondary }]}>From: {message.from}</Text>
                <Text style={[styles.messageContent, { color: theme.colors.text.secondary }]}>{message.content}</Text>
                <Text style={[styles.messageDate, { color: theme.colors.text.secondary }]}>
                  {new Date(message.createdAt).toLocaleDateString()}
                </Text>

                {replyingTo === message.id ? (
                  <View style={styles.replyContainer}>
                    <TextInput
                      style={[
                        styles.replyInput,
                        {
                          backgroundColor: theme.colors.background,
                          color: theme.colors.text.primary,
                          borderColor: theme.colors.border
                        }
                      ]}
                      placeholder="Type your reply..."
                      placeholderTextColor={theme.colors.text.secondary}
                      value={replyText}
                      onChangeText={setReplyText}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                    <View style={styles.replyActions}>
                      <PrimaryButton
                        title="Send"
                        onPress={() => handleReply(message.id)}
                        style={styles.replyButton}
                      />
                      <TouchableOpacity onPress={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}>
                        <Text style={{ color: theme.colors.primary }}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.replyButtonContainer}
                    onPress={() => setReplyingTo(message.id)}
                  >
                    <Text style={{ color: theme.colors.primary }}>Reply</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center'
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: 16
  },
  noteCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    position: 'relative',
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    })
  },
  messageCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    position: 'relative',
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    })
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8
  },
  noteDate: {
    fontSize: 12
  },
  messageSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  messageFrom: {
    fontSize: 12,
    marginBottom: 8
  },
  messageContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8
  },
  messageDate: {
    fontSize: 12,
    marginBottom: 8
  },
  replyButtonContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  replyContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  replyInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top'
  },
  replyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  replyButton: {
    flex: 1
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 14
  }
});

export default NotesMessagesScreen;






