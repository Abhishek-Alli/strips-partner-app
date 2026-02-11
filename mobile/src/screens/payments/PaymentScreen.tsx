/**
 * Payment Screen
 * 
 * Mobile screen for processing payments
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { mobilePaymentService } from '../../services/paymentService';
import { PaymentService, PaymentStatus } from '../../../shared/core/payments/paymentTypes';   
import { getServicePricing, formatAmount } from '../../../shared/core/payments/paymentConstants';
import { logger } from '../../core/logger';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';

interface PaymentScreenParams {
  service: PaymentService;
}

const PaymentScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { service } = (route.params as PaymentScreenParams) || { service: PaymentService.PREMIUM_CALCULATOR };
  const pricing = getServicePricing(service);

  useEffect(() => {
    // Check if already has access
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const hasAccess = await mobilePaymentService.checkServiceAccess(service);
      if (hasAccess) {
        Alert.alert('Already Purchased', 'You already have access to this service.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      // Silent fail - continue with payment
    }
  };

  const handlePayment = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login to continue');
      return;
    }

    setLoading(true);
    try {
      // Create payment intent
      const response = await mobilePaymentService.createPaymentIntent({
        userId: user.id,
        service,
        amount: pricing.amount,
        currency: pricing.currency
      });

      setLoading(false);
      setProcessing(true);

      // In test mode, simulate payment success
      if (process.env.EXPO_PUBLIC_API_MOCK === 'true') {
        setTimeout(() => {
          handlePaymentSuccess(response.paymentIntent.id);
        }, 2000);
        return;
      }

      // Open Razorpay checkout (would use Razorpay SDK in production)
      // For now, show instructions
      Alert.alert(
        'Payment Gateway',
        `Order ID: ${response.providerData.orderId}\n\nIn production, this would open Razorpay checkout.`,
        [
          {
            text: 'Simulate Success',
            onPress: () => handlePaymentSuccess(response.paymentIntent.id)
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setProcessing(false)
          }
        ]
      );
    } catch (error) {
      setLoading(false);
      setProcessing(false);
      logger.error('Payment failed', error as Error);
      Alert.alert('Error', (error as Error).message || 'Payment initiation failed');
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Verify payment status
      const paymentIntent = await mobilePaymentService.getPaymentIntent(paymentIntentId);
      
      if (paymentIntent.status === PaymentStatus.SUCCESS) {
        Alert.alert(
          'Payment Successful',
          'Your payment has been processed successfully. You now have access to this service.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Payment Pending', 'Your payment is being processed. Please wait.');
      }
    } catch (error) {
      logger.error('Payment verification failed', error as Error);
      Alert.alert('Error', 'Failed to verify payment status');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.content, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          {pricing.name}
        </Text>
        <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
          {pricing.description}
        </Text>

        <View style={[styles.priceContainer, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.priceLabel, { color: theme.colors.text.secondary }]}>
            Amount
          </Text>
          <Text style={[styles.price, { color: theme.colors.primary }]}>
            {formatAmount(pricing.amount, pricing.currency)}
          </Text>
        </View>

        {processing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.processingText, { color: theme.colors.text.secondary }]}>
              Processing payment...
            </Text>
          </View>
        ) : (
          <PrimaryButton
            title={`Pay ${formatAmount(pricing.amount, pricing.currency)}`}
            onPress={handlePayment}
            disabled={loading}
            fullWidth
            style={styles.payButton}
          />
        )}

        <View style={[styles.infoBox, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            🔒 Secure payment powered by Razorpay
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.text.secondary, marginTop: 8 }]}>
            Your payment information is encrypted and secure
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    ...(Platform.OS === 'android' && { elevation: 4 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4
    })
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22
  },
  priceContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center'
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 4
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  payButton: {
    marginBottom: 16
  },
  processingContainer: {
    alignItems: 'center',
    padding: 20
  },
  processingText: {
    marginTop: 12,
    fontSize: 14
  },
  infoBox: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18
  }
});

export default PaymentScreen;






