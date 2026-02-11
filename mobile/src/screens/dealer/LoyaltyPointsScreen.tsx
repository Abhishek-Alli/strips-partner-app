/**
 * Loyalty Points Screen
 *
 * Points display with earning conditions and history
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { MaterialIcons } from '@expo/vector-icons';

interface EarningCondition {
  id: string;
  title: string;
  points: number;
  description: string;
  icon: string;
}

interface PointHistory {
  id: string;
  title: string;
  points: number;
  date: string;
  type: 'earned' | 'redeemed';
}

const earningConditions: EarningCondition[] = [
  { id: '1', title: 'Add a new product', points: 10, description: 'Earn points for every product added to your catalogue', icon: 'add-shopping-cart' },
  { id: '2', title: 'Complete a referral', points: 50, description: 'Refer a new dealer and earn points when they register', icon: 'people' },
  { id: '3', title: 'Respond to enquiry', points: 5, description: 'Respond to customer enquiries within 24 hours', icon: 'question-answer' },
  { id: '4', title: 'Get a 5-star review', points: 20, description: 'Earn points when customers give you top ratings', icon: 'star' },
  { id: '5', title: 'Complete quiz', points: 15, description: 'Take and pass educational quizzes', icon: 'school' },
  { id: '6', title: 'Attend a lecture', points: 25, description: 'Attend online lectures and training sessions', icon: 'event' },
  { id: '7', title: 'Upload to gallery', points: 5, description: 'Add images of products and projects to gallery', icon: 'image' },
  { id: '8', title: 'Monthly login streak', points: 30, description: 'Login every day for 30 consecutive days', icon: 'calendar-today' },
];

const pointHistory: PointHistory[] = [
  { id: '1', title: 'Added new product', points: 10, date: '2 hours ago', type: 'earned' },
  { id: '2', title: 'Referral completed', points: 50, date: '1 day ago', type: 'earned' },
  { id: '3', title: 'Quiz completed', points: 15, date: '3 days ago', type: 'earned' },
  { id: '4', title: 'Redeemed coupon', points: -100, date: '1 week ago', type: 'redeemed' },
  { id: '5', title: 'Responded to enquiry', points: 5, date: '1 week ago', type: 'earned' },
];

const LoyaltyPointsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const totalPoints = 1250;
  const rank = 'Gold';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loyalty Points</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Points Badge */}
        <View style={styles.pointsBadge}>
          <View style={styles.pointsCircle}>
            <MaterialIcons name="star" size={32} color="#FFD700" />
            <Text style={styles.pointsValue}>{totalPoints}</Text>
            <Text style={styles.pointsLabel}>Points</Text>
          </View>
          <View style={styles.rankBadge}>
            <MaterialIcons name="workspace-premium" size={18} color="#FFD700" />
            <Text style={styles.rankText}>{rank} Member</Text>
          </View>
        </View>

        {/* Points Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>350</Text>
            <Text style={styles.statLabel}>Earned{'\n'}This Month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>100</Text>
            <Text style={styles.statLabel}>Redeemed{'\n'}This Month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Rank in{'\n'}Region</Text>
          </View>
        </View>

        {/* Earning Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Earn Points</Text>
          {earningConditions.map(condition => (
            <View key={condition.id} style={styles.conditionItem}>
              <View style={styles.conditionIcon}>
                <MaterialIcons name={condition.icon} size={22} color="#FF6B35" />
              </View>
              <View style={styles.conditionInfo}>
                <Text style={styles.conditionTitle}>{condition.title}</Text>
                <Text style={styles.conditionDesc}>{condition.description}</Text>
              </View>
              <View style={styles.conditionPoints}>
                <Text style={styles.conditionPointsText}>+{condition.points}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {pointHistory.map(item => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <MaterialIcons
                  name={item.type === 'earned' ? 'add-circle' : 'remove-circle'}
                  size={20}
                  color={item.type === 'earned' ? '#4CAF50' : '#FF5722'}
                />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
              <Text style={[styles.historyPoints, { color: item.type === 'earned' ? '#4CAF50' : '#FF5722' }]}>
                {item.type === 'earned' ? '+' : ''}{item.points}
              </Text>
            </View>
          ))}
        </View>

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
  content: { flex: 1 },
  pointsBadge: {
    backgroundColor: '#1A1A1A', margin: 16, borderRadius: 16, padding: 24,
    alignItems: 'center',
  },
  pointsCircle: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 3, borderColor: '#FFD700', alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  pointsValue: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', marginTop: 2 },
  pointsLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  rankBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
  },
  rankText: { fontSize: 14, fontWeight: '600', color: '#FFD700' },
  statsRow: {
    flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 16,
  },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center',
  },
  statValue: { fontSize: 24, fontWeight: '700', color: '#FF6B35' },
  statLabel: { fontSize: 11, color: '#666', textAlign: 'center', marginTop: 4, lineHeight: 15 },
  section: {
    backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 16, borderRadius: 12, padding: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', marginBottom: 16 },
  conditionItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  conditionIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF5F2',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  conditionInfo: { flex: 1 },
  conditionTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  conditionDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  conditionPoints: {
    backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  conditionPointsText: { fontSize: 14, fontWeight: '700', color: '#4CAF50' },
  historyItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  historyIcon: { marginRight: 12 },
  historyInfo: { flex: 1 },
  historyTitle: { fontSize: 15, fontWeight: '500', color: '#1A1A1A' },
  historyDate: { fontSize: 12, color: '#999', marginTop: 2 },
  historyPoints: { fontSize: 16, fontWeight: '700' },
});

export default LoyaltyPointsScreen;
