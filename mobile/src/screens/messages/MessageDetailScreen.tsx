/**
 * Message Detail Screen
 *
 * Conversation thread view with reply input
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface MessageThread {
  id: string;
  name: string;
  avatar: string;
  type: 'Partner' | 'Dealer';
}

type RouteParams = {
  MessageDetail: {
    thread: MessageThread;
  };
};

const sampleConversation: Message[] = [
  {
    id: '1',
    text: 'Hello, I am interested in your services for my new home construction project.',
    time: '10:30 AM',
    isMe: true,
  },
  {
    id: '2',
    text: 'Thank you for reaching out! We would be happy to help you with your project. Could you please share more details about your requirements?',
    time: '10:32 AM',
    isMe: false,
  },
  {
    id: '3',
    text: 'I need help with interior design for a 3BHK apartment, approximately 1500 sqft.',
    time: '10:35 AM',
    isMe: true,
  },
  {
    id: '4',
    text: 'That sounds great! We have extensive experience with residential projects. Would you like to schedule a consultation?',
    time: '10:38 AM',
    isMe: false,
  },
  {
    id: '5',
    text: 'Yes, I would like that. When are you available?',
    time: '10:40 AM',
    isMe: true,
  },
  {
    id: '6',
    text: 'We can schedule a meeting tomorrow at 11 AM or 3 PM. Which time works best for you?',
    time: '10:42 AM',
    isMe: false,
  },
];

const MessageDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'MessageDetail'>>();
  const scrollViewRef = useRef<ScrollView>(null);

  const { thread } = route.params || {};
  const [messages, setMessages] = useState<Message[]>(sampleConversation);
  const [inputText, setInputText] = useState('');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: String(Date.now()),
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageBubbleContainer,
        message.isMe
          ? styles.myMessageContainer
          : styles.theirMessageContainer,
      ]}
    >
      {!message.isMe && (
        <Image source={{ uri: thread?.avatar }} style={styles.messageAvatar} />
      )}
      <View
        style={[
          styles.messageBubble,
          message.isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isMe ? styles.myMessageText : styles.theirMessageText,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            message.isMe ? styles.myMessageTime : styles.theirMessageTime,
          ]}
        >
          {message.time}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerProfile}>
          <Image
            source={{ uri: thread?.avatar }}
            style={styles.headerAvatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName} numberOfLines={1}>
              {thread?.name || 'Chat'}
            </Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: false })
          }
        >
          {messages.map((message) => renderMessage(message))}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Text style={styles.attachIcon}>+</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
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
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  headerInfo: {
    marginLeft: 10,
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  onlineText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  menuButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: '#666',
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '85%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginTop: 4,
    backgroundColor: '#E0E0E0',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  myMessage: {
    backgroundColor: '#FF6B35',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#1A1A1A',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  theirMessageTime: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    ...Platform.select({
      ios: {
        paddingBottom: 20,
      },
    }),
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  attachIcon: {
    fontSize: 24,
    color: '#666',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    fontSize: 15,
    color: '#1A1A1A',
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  sendIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 2,
  },
});

export default MessageDetailScreen;
