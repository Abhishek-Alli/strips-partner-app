/**
 * Payment History Screen - modern dealer UI style (#FF6B35)
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { mobilePaymentService } from '../../services/paymentService';
import { PaymentIntent, PaymentStatus, PaymentService } from '../../../shared/core/payments/paymentTypes';
import { formatAmount, getServicePricing } from '../../../shared/core/payments/paymentConstants';
import { logger } from '../../core/logger';

const ACCENT = '#FF6B35';
const BG = '#F5F5F5';
const CARD = '#FFFFFF';

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  [PaymentStatus.SUCCESS]: { color: '#4CAF50', bg: '#E8F5E9', icon: 'check-circle' },
  [PaymentStatus.FAILED]: { color: '#F44336', bg: '#FFEBEE', icon: 'cancel' },
  [PaymentStatus.PENDING]: { color: '#FF9800', bg: '#FFF3E0', icon: 'schedule' },
  [PaymentStatus.REFUNDED]: { color: '#9E9E9E', bg: '#F5F5F5', icon: 'refresh' },
};

const PaymentHistoryScreen: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentIntent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await mobilePaymentService.getPaymentHistory({ userId: user?.id, limit: 50 });
      setPayments(response.payments);
    } catch (error) {
      logger.error('Failed to load payment history', error as Error);
      Alert.alert('Error', 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPayments();
    setRefreshing(false);
  }, []);

  const handleViewReceipt = async (paymentIntent: PaymentIntent) => {
    try {
      const receipt = await mobilePaymentService.getPaymentReceipt(paymentIntent.id);
      Alert.alert(`Receipt`, `Receipt Number: ${receipt.invoiceNumber}\n\nIn production, this would download the receipt.`);
    } catch (error) {
      logger.error('Failed to get receipt', error as Error);
      Alert.alert('Error', 'Failed to load receipt');
    }
  };

  const getServiceName = (service: PaymentService): string => getServicePricing(service).name;

  const formatDate = (date: Date): string =>
    new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const getTotalAmount = () =>
    payments
      .filter(p => p.status === PaymentStatus.SUCCESS)
      .reduce((sum, p) => sum + p.amount, 0);

  const renderPayment = ({ item }: { item: PaymentIntent }) => {
    const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG[PaymentStatus.PENDING];
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => item.status === PaymentStatus.SUCCESS && handleViewReceipt(item)}
      >
        {/* Left accent bar */}
        <View style={[styles.cardAccent, { backgroundColor: cfg.color }]} />

        <View style={styles.cardInner}>
          <View style={styles.cardTop}>
            {/* Service icon */}
            <View style={[styles.serviceIcon, { backgroundColor: cfg.bg }]}>
              <MaterialIcons name={cfg.icon as any} size={22} color={cfg.color} />
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.serviceName} numberOfLines={1}>
                {getServiceName(item.service)}
              </Text>
              <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
            </View>

            <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.statusText, { color: cfg.color }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
              </Text>
            </View>
          </View>

          <View style={styles.cardBottom}>
            <Text style={styles.amount}>{formatAmount(item.amount, item.currency)}</Text>
            {item.status === PaymentStatus.SUCCESS && (
              <TouchableOpacity
                style={styles.receiptBtn}
                onPress={() => handleViewReceipt(item)}
              >
                <MaterialIcons name="receipt" size={14} color={ACCENT} />
                <Text style={styles.receiptText}>Receipt</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CARD} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment History</Text>
        {payments.length > 0 && (
          <View style={styles.totalBadge}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalAmount}>{formatAmount(getTotalAmount(), 'INR')}</Text>
          </View>
        )}
      </View>

      {loading && payments.length === 0 ? (
        <View style={styles.loadingContainer}>
          <MaterialIcons name="payment" size={48} color="#DDD" />
          <Text style={styles.loadingText}>Loading payment history...</Text>
        </View>
      ) : payments.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconCircle}>
            <MaterialIcons name="receipt-long" size={40} color={ACCENT} />
          </View>
          <Text style={styles.emptyTitle}>No payments yet</Text>
          <Text style={styles.emptySubtitle}>Your payment history will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPayment}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={ACCENT} />
          }
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
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
  totalBadge: { alignItems: 'flex-end' },
  totalLabel: { fontSize: 11, color: '#888' },
  totalAmount: { fontSize: 15, fontWeight: '700', color: ACCENT },
  listContent: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: CARD,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  cardAccent: { width: 4 },
  cardInner: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  serviceIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: { flex: 1 },
  serviceName: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 3 },
  cardDate: { fontSize: 12, color: '#999' },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  amount: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF5F2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  receiptText: { fontSize: 12, color: ACCENT, fontWeight: '600' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#999' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
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
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center' },
});

export default PaymentHistoryScreen;
