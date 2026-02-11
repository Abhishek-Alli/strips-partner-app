/**
 * Payment History Screen
 * 
 * Mobile screen for viewing payment history
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
  Alert
} from 'react-native';
import { useTheme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { mobilePaymentService } from '../../services/paymentService';
import { PaymentIntent, PaymentStatus, PaymentService } from '../../../shared/core/payments/paymentTypes';
import { formatAmount, getServicePricing } from '../../../shared/core/payments/paymentConstants';
import { logger } from '../../core/logger';

const PaymentHistoryScreen: React.FC = () => {
  const theme = useTheme();
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
      const response = await mobilePaymentService.getPaymentHistory({
        userId: user?.id,
        limit: 50
      });
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
      Alert.alert('Receipt', `Receipt Number: ${receipt.invoiceNumber}\n\nIn production, this would download the receipt.`);
    } catch (error) {
      logger.error('Failed to get receipt', error as Error);
      Alert.alert('Error', 'Failed to load receipt');
    }
  };

  const getStatusColor = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return '#4CAF50';
      case PaymentStatus.FAILED:
        return '#F44336';
      case PaymentStatus.PENDING:
        return '#FF9800';
      case PaymentStatus.REFUNDED:
        return '#9E9E9E';
      default:
        return theme.colors.text.secondary;
    }
  };

  const getServiceName = (service: PaymentService): string => {
    return getServicePricing(service).name;
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPayment = ({ item }: { item: PaymentIntent }) => (
    <TouchableOpacity
      style={[styles.paymentCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={() => item.status === PaymentStatus.SUCCESS && handleViewReceipt(item)}
    >
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Text style={[styles.serviceName, { color: theme.colors.text.primary }]}>
            {getServiceName(item.service)}
          </Text>
          <Text style={[styles.date, { color: theme.colors.text.secondary }]}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.paymentFooter}>
        <Text style={[styles.amount, { color: theme.colors.text.primary }]}>
          {formatAmount(item.amount, item.currency)}
        </Text>
        {item.status === PaymentStatus.SUCCESS && (
          <TouchableOpacity onPress={() => handleViewReceipt(item)}>
            <Text style={[styles.receiptLink, { color: theme.colors.primary }]}>
              View Receipt
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading && payments.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text.secondary }}>Loading payment history...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {payments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No payment history yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPayment}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listContent: {
    padding: 16
  },
  paymentCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    })
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  paymentInfo: {
    flex: 1
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  date: {
    fontSize: 12
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600'
  },
  paymentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  receiptLink: {
    fontSize: 14,
    fontWeight: '600'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyText: {
    fontSize: 16
  }
});

export default PaymentHistoryScreen;






