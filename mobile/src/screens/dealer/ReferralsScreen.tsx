/**
 * Referrals Screen
 *
 * Search bar with user list and "Refer to dealer" action
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { MaterialIcons } from '@expo/vector-icons';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  type: string;
  referred: boolean;
}

const sampleUsers: User[] = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@gmail.com', phone: '9876543210', location: 'Guwahati', type: 'Builder', referred: false },
  { id: '2', name: 'Priya Dutta', email: 'priya@gmail.com', phone: '9876543211', location: 'Beltola', type: 'Contractor', referred: true },
  { id: '3', name: 'Amit Singh', email: 'amit@gmail.com', phone: '9876543212', location: 'Zoo Road', type: 'Architect', referred: false },
  { id: '4', name: 'Neha Bora', email: 'neha@gmail.com', phone: '9876543213', location: 'Ganeshguri', type: 'Builder', referred: false },
  { id: '5', name: 'Vikash Gupta', email: 'vikash@gmail.com', phone: '9876543214', location: 'Panbazar', type: 'Engineer', referred: true },
  { id: '6', name: 'Sanjay Das', email: 'sanjay@gmail.com', phone: '9876543215', location: 'Khanapara', type: 'Contractor', referred: false },
  { id: '7', name: 'Meera Kalita', email: 'meera@gmail.com', phone: '9876543216', location: 'Chandmari', type: 'Architect', referred: false },
  { id: '8', name: 'Rajesh Baruah', email: 'rajesh@gmail.com', phone: '9876543217', location: 'Dispur', type: 'Builder', referred: true },
];

const ReferralsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(sampleUsers);

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefer = (userId: string) => {
    Alert.alert(
      'Confirm Referral',
      'Are you sure you want to refer this user as a dealer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Refer',
          onPress: () => {
            setUsers(prev => prev.map(u =>
              u.id === userId ? { ...u, referred: true } : u
            ));
            Alert.alert('Success', 'Referral sent successfully! You will earn points once they register.');
          },
        },
      ]
    );
  };

  const referredCount = users.filter(u => u.referred).length;
  const pendingCount = users.filter(u => u.referred).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referrals</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{referredCount}</Text>
          <Text style={styles.statLabel}>Total Referred</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#4CAF50' }]}>150</Text>
          <Text style={styles.statLabel}>Points Earned</Text>
        </View>
      </View>

      {/* Referral Code */}
      <View style={styles.referralCodeCard}>
        <View style={styles.referralCodeContent}>
          <Text style={styles.referralCodeLabel}>Your Referral Code</Text>
          <Text style={styles.referralCodeValue}>123456</Text>
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <MaterialIcons name="share" size={20} color="#FFFFFF" />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, phone..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* User List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredUsers.map(user => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userDetail}>{user.type} • {user.location}</Text>
              <View style={styles.contactRow}>
                <Text style={styles.userContact}>📧 {user.email}</Text>
                <Text style={styles.userContact}>📞 {user.phone}</Text>
              </View>
            </View>
            {user.referred ? (
              <View style={styles.referredBadge}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.referredText}>Referred</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.referButton}
                onPress={() => handleRefer(user.id)}
              >
                <Text style={styles.referButtonText}>Refer to{'\n'}dealer</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  menuButton: { padding: 4 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 12 },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center',
  },
  statNumber: { fontSize: 22, fontWeight: '700', color: '#FF6B35' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 4, textAlign: 'center' },
  referralCodeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1A1A1A', marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 12,
  },
  referralCodeContent: {},
  referralCodeLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  referralCodeValue: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', letterSpacing: 2 },
  shareButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FF6B35', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
  },
  shareButtonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    marginHorizontal: 16, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    marginBottom: 12, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A', padding: 0 },
  content: { flex: 1, paddingHorizontal: 16 },
  userCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 12, padding: 14, marginBottom: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3 },
      android: { elevation: 1 },
    }),
  },
  userAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF6B35',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  userDetail: { fontSize: 12, color: '#666', marginTop: 2 },
  contactRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  userContact: { fontSize: 11, color: '#999' },
  referredBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12,
  },
  referredText: { fontSize: 12, color: '#4CAF50', fontWeight: '600' },
  referButton: {
    backgroundColor: '#FF6B35', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
  },
  referButtonText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 12 },
});

export default ReferralsScreen;
