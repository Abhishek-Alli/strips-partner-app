/**
 * Conversation List Screen
 *
 * Modern chat UI with new conversation search (name + location filter).
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Platform,
  TextInput,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { chatService, Conversation, ChatUser } from '../../services/chatService';
import { socketService } from '../../services/socketService';

const ACCENT = '#FF6B35';
const BG = '#F5F5F5';
const CARD = '#FFFFFF';

const ConversationListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // New chat modal state
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [starting, setStarting] = useState(false);

  const load = useCallback(async () => {
    try {
      const { conversations: data } = await chatService.getConversations();
      setConversations(data);
    } catch {
      // silently keep old data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    socketService.connect().catch(() => {});
    const unsub = socketService.onNewMessage(() => load());
    return unsub;
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  // Search users for new chat
  useEffect(() => {
    if (!showNewChat) return;
    if (!searchQuery.trim() && !locationQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const { users } = await chatService.searchUsers(searchQuery, locationQuery || undefined);
        setSearchResults(users);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery, locationQuery, showNewChat]);

  const handleStartChat = async (user: ChatUser) => {
    if (starting) return;
    setStarting(true);
    try {
      const { conversation } = await chatService.createConversation(user.id);
      setShowNewChat(false);
      setSearchQuery('');
      setLocationQuery('');
      setSearchResults([]);
      navigation.navigate('Chat', {
        conversationId: conversation.id,
        otherUserName: user.name,
      });
      load();
    } catch {
      // silent
    } finally {
      setStarting(false);
    }
  };

  const closeModal = () => {
    setShowNewChat(false);
    setSearchQuery('');
    setLocationQuery('');
    setSearchResults([]);
  };

  const getOtherParticipant = (conv: Conversation) =>
    conv.participants?.[0] ?? { name: 'Unknown', role: '' };

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const getRoleColor = (role: string) => {
    if (role?.toLowerCase() === 'dealer') return '#4CAF50';
    if (role?.toLowerCase() === 'partner') return '#2196F3';
    return ACCENT;
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const other = getOtherParticipant(item);
    const hasUnread = item.unreadCount > 0;
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('Chat', {
            conversationId: item.id,
            otherUserName: other.name,
          })
        }
      >
        <View style={[styles.avatar, { backgroundColor: getRoleColor(other.role) }]}>
          <Text style={styles.avatarText}>{getInitials(other.name)}</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.name, hasUnread && styles.nameBold]} numberOfLines={1}>
              {other.name}
            </Text>
            <Text style={[styles.time, hasUnread && styles.timeAccent]}>
              {formatTime(item.updatedAt)}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <Text
              style={[styles.preview, hasUnread && styles.previewBold]}
              numberOfLines={1}
            >
              {item.lastMessage?.content ?? 'No messages yet'}
            </Text>
            {hasUnread && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
          {other.role ? (
            <Text style={[styles.roleTag, { color: getRoleColor(other.role) }]}>
              {other.role.charAt(0).toUpperCase() + other.role.slice(1).toLowerCase()}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderUserResult = ({ item }: { item: ChatUser }) => (
    <TouchableOpacity
      style={styles.userCard}
      activeOpacity={0.7}
      onPress={() => handleStartChat(item)}
    >
      <View style={[styles.userAvatar, { backgroundColor: getRoleColor(item.role) }]}>
        <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={[styles.userRole, { color: getRoleColor(item.role) }]}>
          {item.role?.charAt(0).toUpperCase() + item.role?.slice(1).toLowerCase()}
        </Text>
        {item.location ? (
          <View style={styles.userLocation}>
            <MaterialIcons name="location-on" size={12} color="#999" />
            <Text style={styles.userLocationText}>{item.location}</Text>
          </View>
        ) : null}
      </View>
      <MaterialIcons name="chat-bubble-outline" size={20} color={ACCENT} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CARD} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.newChatBtn}
          onPress={() => setShowNewChat(true)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="edit" size={20} color={CARD} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={ACCENT} size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={conversations.length === 0 && styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ACCENT} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyIconCircle}>
                <MaterialIcons name="chat" size={40} color={ACCENT} />
              </View>
              <Text style={styles.emptyTitle}>No Conversations Yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the edit icon above to start a chat with a dealer or partner.
              </Text>
              <TouchableOpacity
                style={styles.startChatBtn}
                onPress={() => setShowNewChat(true)}
              >
                <MaterialIcons name="add" size={18} color={CARD} />
                <Text style={styles.startChatBtnText}>Start New Chat</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* New Chat Modal */}
      <Modal
        visible={showNewChat}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor={CARD} />

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.modalClose}>
              <MaterialIcons name="close" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Message</Text>
            <View style={{ width: 40 }} />
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Search Inputs */}
            <View style={styles.searchSection}>
              <View style={styles.searchRow}>
                <MaterialIcons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name (dealer, partner)..."
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                  autoCapitalize="none"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <MaterialIcons name="cancel" size={18} color="#bbb" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.searchRow}>
                <MaterialIcons name="location-on" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Filter by location (optional)..."
                  placeholderTextColor="#999"
                  value={locationQuery}
                  onChangeText={setLocationQuery}
                  autoCapitalize="none"
                />
                {locationQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setLocationQuery('')}>
                    <MaterialIcons name="cancel" size={18} color="#bbb" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Results */}
            {searching ? (
              <ActivityIndicator color={ACCENT} size="small" style={styles.loader} />
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={item => item.id}
                renderItem={renderUserResult}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
              />
            ) : (searchQuery.trim().length > 0 || locationQuery.trim().length > 0) ? (
              <View style={styles.noResults}>
                <MaterialIcons name="search-off" size={48} color="#DDD" />
                <Text style={styles.noResultsText}>No users found</Text>
                <Text style={styles.noResultsSub}>Try a different name or location</Text>
              </View>
            ) : (
              <View style={styles.searchHint}>
                <MaterialIcons name="person-search" size={48} color="#DDD" />
                <Text style={styles.searchHintTitle}>Find someone to chat with</Text>
                <Text style={styles.searchHintSub}>
                  Search dealers and partners by name.{'\n'}You can also filter by city or location.
                </Text>
              </View>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  newChatBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: { marginTop: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: CARD,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  cardContent: { flex: 1 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: { fontSize: 15, fontWeight: '500', color: '#1A1A1A', flex: 1 },
  nameBold: { fontWeight: '700' },
  time: { fontSize: 12, color: '#999', marginLeft: 8 },
  timeAccent: { color: ACCENT },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  preview: { fontSize: 13, color: '#888', flex: 1 },
  previewBold: { color: '#444', fontWeight: '600' },
  badge: {
    backgroundColor: ACCENT,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginLeft: 8,
  },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  roleTag: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  emptyContainer: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 32 },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  startChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  startChatBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

  // Modal
  modalContainer: { flex: 1, backgroundColor: CARD },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalClose: { width: 40, alignItems: 'flex-start' },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  searchSection: {
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    gap: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    padding: 0,
  },
  // User result cards
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: CARD,
  },
  userAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  userRole: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
  userLocation: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  userLocationText: { fontSize: 12, color: '#999' },
  // Empty / hint states
  noResults: { flex: 1, alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  noResultsText: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginTop: 12 },
  noResultsSub: { fontSize: 14, color: '#888', marginTop: 4, textAlign: 'center' },
  searchHint: { flex: 1, alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  searchHintTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginTop: 12 },
  searchHintSub: { fontSize: 14, color: '#888', marginTop: 6, textAlign: 'center', lineHeight: 20 },
});

export default ConversationListScreen;
