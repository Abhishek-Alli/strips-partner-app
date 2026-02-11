/**
 * Message List Screen
 *
 * Displays list of message conversations with Partners/Dealers
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
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface MessageThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  type: 'Partner' | 'Dealer';
}

const sampleMessages: MessageThread[] = [
  {
    id: '1',
    name: 'ABC Constructions',
    avatar: 'https://picsum.photos/100/100?random=40',
    lastMessage: 'Thank you for your enquiry. We will get back to you soon.',
    time: '2 min ago',
    unreadCount: 2,
    type: 'Partner',
  },
  {
    id: '2',
    name: 'Steel Suppliers Ltd',
    avatar: 'https://picsum.photos/100/100?random=41',
    lastMessage: 'The materials have been dispatched.',
    time: '1 hr ago',
    unreadCount: 0,
    type: 'Dealer',
  },
  {
    id: '3',
    name: 'Modern Architects',
    avatar: 'https://picsum.photos/100/100?random=42',
    lastMessage: 'Please review the updated design plans.',
    time: '3 hrs ago',
    unreadCount: 5,
    type: 'Partner',
  },
  {
    id: '4',
    name: 'Cement World',
    avatar: 'https://picsum.photos/100/100?random=43',
    lastMessage: 'Your order has been confirmed.',
    time: 'Yesterday',
    unreadCount: 0,
    type: 'Dealer',
  },
  {
    id: '5',
    name: 'Home Designers Co',
    avatar: 'https://picsum.photos/100/100?random=44',
    lastMessage: 'Can we schedule a meeting for tomorrow?',
    time: 'Yesterday',
    unreadCount: 1,
    type: 'Partner',
  },
];

const tabs = ['All', 'Partner', 'Dealer'];

const MessageListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('All');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleMessagePress = (thread: MessageThread) => {
    navigation.navigate('MessageDetail', { thread });
  };

  const filteredMessages =
    activeTab === 'All'
      ? sampleMessages
      : sampleMessages.filter((msg) => msg.type === activeTab);

  const renderMessageItem = (thread: MessageThread) => (
    <TouchableOpacity
      key={thread.id}
      style={styles.messageItem}
      onPress={() => handleMessagePress(thread)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: thread.avatar }} style={styles.avatar} />
        {thread.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {thread.unreadCount > 9 ? '9+' : thread.unreadCount}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageName} numberOfLines={1}>
            {thread.name}
          </Text>
          <Text style={styles.messageTime}>{thread.time}</Text>
        </View>
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.messagePreview,
              thread.unreadCount > 0 && styles.messagePreviewUnread,
            ]}
            numberOfLines={1}
          >
            {thread.lastMessage}
          </Text>
          <View
            style={[
              styles.typeBadge,
              thread.type === 'Partner'
                ? styles.partnerBadge
                : styles.dealerBadge,
            ]}
          >
            <Text
              style={[
                styles.typeBadgeText,
                thread.type === 'Partner'
                  ? styles.partnerBadgeText
                  : styles.dealerBadgeText,
              ]}
            >
              {thread.type}
            </Text>
          </View>
        </View>
      </View>
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
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Messages List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredMessages.length > 0 ? (
          filteredMessages.map((thread) => renderMessageItem(thread))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages found</Text>
          </View>
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
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
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  headerRight: {
    width: 32,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  tabActive: {
    backgroundColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  messageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messagePreview: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  messagePreviewUnread: {
    fontWeight: '500',
    color: '#1A1A1A',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  partnerBadge: {
    backgroundColor: '#E3F2FD',
  },
  dealerBadge: {
    backgroundColor: '#FFF3E0',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  partnerBadgeText: {
    color: '#1976D2',
  },
  dealerBadgeText: {
    color: '#F57C00',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  bottomPadding: {
    height: 30,
  },
});

export default MessageListScreen;
