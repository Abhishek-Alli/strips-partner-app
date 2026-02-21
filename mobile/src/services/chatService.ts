/**
 * Chat REST Service
 *
 * Wraps the backend /api/chat endpoints.
 * Real-time delivery is handled by socketService.
 */

import { apiClient } from './apiClient';

export interface ChatParticipant {
  userId: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface LastMessage {
  content: string;
  senderId: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: ChatParticipant[];
  lastMessage?: LastMessage;
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  createdAt: string;
  readAt?: string;
}

class ChatService {
  async getConversations(): Promise<{ conversations: Conversation[] }> {
    return apiClient.get<{ conversations: Conversation[] }>('/chat/conversations');
  }

  async createConversation(otherUserId: string): Promise<{ conversation: Conversation }> {
    return apiClient.post<{ conversation: Conversation }>('/chat/conversations', {
      otherUserId,
    });
  }

  async getMessages(
    conversationId: string,
    page = 1,
    limit = 30,
  ): Promise<{ messages: Message[]; total: number; page: number; totalPages: number }> {
    return apiClient.get(`/chat/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
  }

  async sendMessage(
    conversationId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' = 'text',
  ): Promise<{ message: Message }> {
    return apiClient.post<{ message: Message }>(
      `/chat/conversations/${conversationId}/messages`,
      { content, messageType },
    );
  }

  async markAsRead(conversationId: string): Promise<void> {
    await apiClient.put(`/chat/conversations/${conversationId}/read`, {});
  }

  async searchUsers(query: string, location?: string): Promise<{ users: ChatUser[] }> {
    return apiClient.get<{ users: ChatUser[] }>('/chat/search-users', {
      params: { query, location },
    });
  }
}

export interface ChatUser {
  id: string;
  name: string;
  role: string;
  location?: string;
  avatar?: string;
}

export const chatService = new ChatService();
