/**
 * Dealer Feedback Screen
 *
 * List of customer feedbacks with ratings and responses
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

interface Feedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  reply: string | null;
  product: string;
}

const sampleFeedbacks: Feedback[] = [
  { id: '1', customerName: 'Alok Das', rating: 5, comment: 'Excellent quality TMT bars. Delivery was on time and the product quality exceeded expectations.', date: 'Feb 8, 2026', reply: 'Thank you for your kind words! We strive to deliver the best quality products.', product: 'TMT Steel Bars' },
  { id: '2', customerName: 'Rahul Sharma', rating: 4, comment: 'Good cement quality but delivery took an extra day. Overall satisfied with the purchase.', date: 'Feb 5, 2026', reply: null, product: 'OPC Cement' },
  { id: '3', customerName: 'Priya Dutta', rating: 3, comment: 'Average experience. Product was fine but packaging could be improved.', date: 'Feb 2, 2026', reply: null, product: 'Rockwool Insulation' },
  { id: '4', customerName: 'Amit Singh', rating: 5, comment: 'Best dealer in the area! Quick response and great after-sales support.', date: 'Jan 28, 2026', reply: 'We appreciate your trust in us!', product: 'Electrical Switches' },
  { id: '5', customerName: 'Neha Bora', rating: 2, comment: 'Product was delivered late and one package was damaged. Need improvement.', date: 'Jan 25, 2026', reply: null, product: 'PPC Cement' },
];

const DealerFeedbackScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const handleSubmitReply = (feedbackId: string) => {
    if (!replyText.trim()) {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }
    Alert.alert('Success', 'Reply sent successfully');
    setReplyingTo(null);
    setReplyText('');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <MaterialIcons
        key={i}
        name={i < rating ? 'star' : 'star-border'}
        size={18}
        color={i < rating ? '#FFD700' : '#CCC'}
      />
    ));
  };

  const avgRating = (sampleFeedbacks.reduce((sum, f) => sum + f.rating, 0) / sampleFeedbacks.length).toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.avgRating}>{avgRating}</Text>
          <View style={styles.starsRow}>{renderStars(Math.round(parseFloat(avgRating)))}</View>
          <Text style={styles.totalReviews}>{sampleFeedbacks.length} reviews</Text>
        </View>
        <View style={styles.summaryRight}>
          {[5, 4, 3, 2, 1].map(star => {
            const count = sampleFeedbacks.filter(f => f.rating === star).length;
            const pct = (count / sampleFeedbacks.length) * 100;
            return (
              <View key={star} style={styles.barRow}>
                <Text style={styles.barLabel}>{star}</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.barCount}>{count}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sampleFeedbacks.map(feedback => (
          <View key={feedback.id} style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <View style={styles.feedbackUser}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{feedback.customerName.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.customerName}>{feedback.customerName}</Text>
                  <Text style={styles.productName}>{feedback.product}</Text>
                </View>
              </View>
              <Text style={styles.feedbackDate}>{feedback.date}</Text>
            </View>

            <View style={styles.starsRow}>{renderStars(feedback.rating)}</View>
            <Text style={styles.feedbackComment}>{feedback.comment}</Text>

            {feedback.reply && (
              <View style={styles.replyBox}>
                <Text style={styles.replyLabel}>Your Reply:</Text>
                <Text style={styles.replyText}>{feedback.reply}</Text>
              </View>
            )}

            {!feedback.reply && replyingTo !== feedback.id && (
              <TouchableOpacity
                style={styles.replyButton}
                onPress={() => setReplyingTo(feedback.id)}
              >
                <MaterialIcons name="reply" size={16} color="#FF6B35" />
                <Text style={styles.replyButtonText}>Reply</Text>
              </TouchableOpacity>
            )}

            {replyingTo === feedback.id && (
              <View style={styles.replyInputContainer}>
                <TextInput
                  style={styles.replyInput}
                  placeholder="Type your reply..."
                  placeholderTextColor="#999"
                  multiline
                  value={replyText}
                  onChangeText={setReplyText}
                />
                <View style={styles.replyActions}>
                  <TouchableOpacity onPress={() => { setReplyingTo(null); setReplyText(''); }}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sendReplyButton}
                    onPress={() => handleSubmitReply(feedback.id)}
                  >
                    <Text style={styles.sendReplyText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
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
  summaryCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', margin: 16, borderRadius: 12, padding: 16,
  },
  summaryLeft: { alignItems: 'center', marginRight: 20 },
  avgRating: { fontSize: 36, fontWeight: '700', color: '#1A1A1A' },
  totalReviews: { fontSize: 12, color: '#666', marginTop: 4 },
  starsRow: { flexDirection: 'row', gap: 2, marginVertical: 4 },
  summaryRight: { flex: 1, justifyContent: 'center', gap: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barLabel: { fontSize: 12, color: '#666', width: 12 },
  barBg: { flex: 1, height: 6, backgroundColor: '#F0F0F0', borderRadius: 3 },
  barFill: { height: 6, backgroundColor: '#FFD700', borderRadius: 3 },
  barCount: { fontSize: 12, color: '#666', width: 16, textAlign: 'right' },
  content: { flex: 1, paddingHorizontal: 16 },
  feedbackCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3 },
      android: { elevation: 1 },
    }),
  },
  feedbackHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  feedbackUser: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FF6B35', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  customerName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  productName: { fontSize: 12, color: '#666' },
  feedbackDate: { fontSize: 12, color: '#999' },
  feedbackComment: { fontSize: 14, color: '#333', lineHeight: 20, marginTop: 8 },
  replyBox: { backgroundColor: '#F5F5F5', borderRadius: 8, padding: 12, marginTop: 12 },
  replyLabel: { fontSize: 12, color: '#666', fontWeight: '600', marginBottom: 4 },
  replyText: { fontSize: 13, color: '#333', lineHeight: 18 },
  replyButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
  replyButtonText: { fontSize: 14, color: '#FF6B35', fontWeight: '500' },
  replyInputContainer: { marginTop: 12 },
  replyInput: {
    backgroundColor: '#F5F5F5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: '#1A1A1A', minHeight: 60, textAlignVertical: 'top',
  },
  replyActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  cancelText: { fontSize: 14, color: '#666' },
  sendReplyButton: { backgroundColor: '#FF6B35', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  sendReplyText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
});

export default DealerFeedbackScreen;
