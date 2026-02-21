/**
 * Socket.IO Client Service
 *
 * Manages real-time WebSocket connection for chat.
 * Singleton — import `socketService` everywhere.
 */

import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { env } from '../core/env/config';

// Strip "/api" suffix to get the bare server URL for Socket.IO
const SOCKET_URL = env.apiUrl.replace(/\/api$/, '');

type MessageHandler = (data: {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  messageType: string;
  createdAt: string;
}) => void;

type TypingHandler = (data: { userId: string; userName: string; conversationId: string }) => void;

class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private typingHandlers: TypingHandler[] = [];
  private stopTypingHandlers: TypingHandler[] = [];

  async connect(): Promise<void> {
    if (this.socket?.connected) return;

    const token = await AsyncStorage.getItem('@auth_access_token');
    if (!token) throw new Error('No auth token — cannot connect to socket');

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
    });

    this.socket.on('new_message', (data) => {
      this.messageHandlers.forEach(h => h(data));
    });

    this.socket.on('user_typing', (data) => {
      this.typingHandlers.forEach(h => h(data));
    });

    this.socket.on('user_stop_typing', (data) => {
      this.stopTypingHandlers.forEach(h => h(data));
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinConversation(conversationId: string): void {
    this.socket?.emit('join_conversation', { conversationId });
  }

  sendMessage(conversationId: string, content: string, messageType = 'text'): void {
    this.socket?.emit('send_message', { conversationId, content, messageType });
  }

  emitTyping(conversationId: string): void {
    this.socket?.emit('typing', { conversationId });
  }

  emitStopTyping(conversationId: string): void {
    this.socket?.emit('stop_typing', { conversationId });
  }

  onNewMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onUserTyping(handler: TypingHandler): () => void {
    this.typingHandlers.push(handler);
    return () => {
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
    };
  }

  onUserStopTyping(handler: TypingHandler): () => void {
    this.stopTypingHandlers.push(handler);
    return () => {
      this.stopTypingHandlers = this.stopTypingHandlers.filter(h => h !== handler);
    };
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
