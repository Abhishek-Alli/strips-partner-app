/**
 * Chat Screen
 *
 * Full-screen chat view with message bubbles, real-time updates via Socket.IO,
 * typing indicator, and bottom input bar.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { chatService, Message } from '../../services/chatService';
import { socketService } from '../../services/socketService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RouteParams {
  conversationId: string;
  otherUserName: string;
}

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { conversationId, otherUserName } = route.params as RouteParams;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [myUserId, setMyUserId] = useState<string | null>(null);

  const listRef = useRef<FlatList>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load own userId from storage
  useEffect(() => {
    AsyncStorage.getItem('@auth_user').then(raw => {
      if (raw) {
        try {
          const u = JSON.parse(raw);
          setMyUserId(u.id ?? u.userId ?? null);
        } catch {}
      }
    });
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      const { messages: data } = await chatService.getMessages(conversationId, 1, 50);
      setMessages(data);
      await chatService.markAsRead(conversationId);
    } catch {
      // keep old data
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    loadMessages();

    // Join socket room
    socketService.connect().catch(() => {});
    socketService.joinConversation(conversationId);

    // Listen for new messages
    const unsubMsg = socketService.onNewMessage(msg => {
      if (msg.conversationId === conversationId) {
        setMessages(prev => [...prev, msg as any]);
        chatService.markAsRead(conversationId).catch(() => {});
      }
    });

    // Typing indicators
    const unsubTyping = socketService.onUserTyping(data => {
      if (data.conversationId === conversationId) setIsTyping(true);
    });
    const unsubStop = socketService.onUserStopTyping(data => {
      if (data.conversationId === conversationId) setIsTyping(false);
    });

    return () => {
      unsubMsg();
      unsubTyping();
      unsubStop();
    };
  }, [conversationId, loadMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const handleChangeText = (val: string) => {
    setText(val);
    socketService.emitTyping(conversationId);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socketService.emitStopTyping(conversationId);
    }, 1500);
  };

  const handleSend = async () => {
    const content = text.trim();
    if (!content || sending) return;
    setSending(true);
    setText('');
    socketService.emitStopTyping(conversationId);
    try {
      // Send via REST — socket will broadcast to others; optimistic update on REST response
      const { message } = await chatService.sendMessage(conversationId, content);
      setMessages(prev => [...prev, message]);
    } catch {
      setText(content); // restore on failure
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMe = item.senderId === myUserId;
    const prevMsg = messages[index - 1];
    const showSender =
      !isMe && (!prevMsg || prevMsg.senderId !== item.senderId);

    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowRight : styles.msgRowLeft]}>
        {showSender && !isMe && (
          <Text style={styles.senderName}>{item.senderName}</Text>
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={isMe ? styles.bubbleTextMe : styles.bubbleTextThem}>
            {item.content}
          </Text>
          <Text style={styles.bubbleTime}>{formatTime(item.createdAt)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{otherUserName}</Text>
          {isTyping && <Text style={styles.typingText}>typing...</Text>}
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {loading ? (
          <ActivityIndicator color="#FF6B35" size="large" style={styles.loader} />
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatText}>
                  No messages yet. Say hello!
                </Text>
              </View>
            }
          />
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={handleChangeText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.sendIcon}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: { padding: 4, marginRight: 8 },
  backIcon: { fontSize: 22, color: '#1A1A1A' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  typingText: { fontSize: 12, color: '#FF6B35', marginTop: 1 },
  loader: { marginTop: 40 },
  messageList: { padding: 12, paddingBottom: 8 },
  msgRow: { marginBottom: 6 },
  msgRowRight: { alignItems: 'flex-end' },
  msgRowLeft: { alignItems: 'flex-start' },
  senderName: { fontSize: 12, color: '#666', marginBottom: 2, marginLeft: 4 },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  bubbleMe: {
    backgroundColor: '#FF6B35',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2 },
      android: { elevation: 1 },
    }),
  },
  bubbleTextMe: { color: '#FFFFFF', fontSize: 15 },
  bubbleTextThem: { color: '#1A1A1A', fontSize: 15 },
  bubbleTime: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 3, alignSelf: 'flex-end' },
  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyChatText: { color: '#999', fontSize: 14 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 15,
    color: '#1A1A1A',
    maxHeight: 120,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#FFCAB8' },
  sendIcon: { color: '#FFFFFF', fontSize: 18 },
});

export default ChatScreen;
