/**
 * OTP Verification Screen
 *
 * Verifies OTP sent via Email and SMS
 * Shows separate inputs for email and phone verification
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { logger } from '../../core/logger';
import { UserType, OTPVerificationParams } from '../../types/registration.types';

const OTPVerificationScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { verifyRegistrationOTP, loginWithOTP, sendOTP } = useAuth();
  const params = (route.params as OTPVerificationParams & { userType?: UserType }) || {};
  const { email, phone, isRegistration = false, userType = UserType.GENERAL_USER } = params;

  const [emailOtp, setEmailOtp] = useState(['', '', '', '']);
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '']);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const emailInputRefs = useRef<(TextInput | null)[]>([]);
  const phoneInputRefs = useRef<(TextInput | null)[]>([]);

  // Get header config based on user type
  const getHeaderConfig = () => {
    switch (userType) {
      case UserType.GENERAL_USER:
        return { backgroundColor: '#E3F2FD', title: 'General Users' };
      case UserType.INFLUENCER_PARTNER:
        return { backgroundColor: '#F0FFF0', title: 'Influencer / Partner' };
      case UserType.DEALER:
        return { backgroundColor: '#FCE4EC', title: 'Dealers' };
      default:
        return { backgroundColor: '#E3F2FD', title: 'General Users' };
    }
  };

  const headerConfig = getHeaderConfig();

  const handleOTPChange = (
    type: 'email' | 'phone',
    index: number,
    value: string
  ) => {
    const isEmail = type === 'email';
    const currentOtp = isEmail ? emailOtp : phoneOtp;
    const setOtp = isEmail ? setEmailOtp : setPhoneOtp;
    const refs = isEmail ? emailInputRefs : phoneInputRefs;

    if (value.length > 1) {
      // Handle paste
      const pastedOTP = value.slice(0, 4).split('');
      const newOTP = [...currentOtp];
      pastedOTP.forEach((digit, i) => {
        if (index + i < 4) {
          newOTP[index + i] = digit;
        }
      });
      setOtp(newOTP);
      return;
    }

    const newOTP = [...currentOtp];
    newOTP[index] = value;
    setOtp(newOTP);

    // Auto-focus next input
    if (value && index < 3) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    type: 'email' | 'phone',
    index: number,
    key: string
  ) => {
    const isEmail = type === 'email';
    const currentOtp = isEmail ? emailOtp : phoneOtp;
    const refs = isEmail ? emailInputRefs : phoneInputRefs;

    if (key === 'Backspace' && !currentOtp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = async (type: 'email' | 'phone') => {
    try {
      if (isRegistration) {
        await authService.sendRegistrationOTP(email, phone);
      } else {
        await sendOTP(phone);
      }
      Alert.alert('Success', `OTP has been resent to your ${type}`);
    } catch (error: any) {
      logger.error('Failed to resend OTP', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  const handleContinue = async () => {
    const emailOtpString = emailOtp.join('');
    const phoneOtpString = phoneOtp.join('');

    if (emailOtpString.length !== 4 || phoneOtpString.length !== 4) {
      Alert.alert('Error', 'Please enter complete OTP for both email and phone');
      return;
    }

    setIsLoading(true);
    try {
      // For demo, we'll simulate verification
      // In production, you'd verify both OTPs
      setEmailVerified(true);
      setPhoneVerified(true);

      if (isRegistration) {
        // Combine OTPs for verification (backend should handle this)
        const combinedOtp = emailOtpString + phoneOtpString;
        await verifyRegistrationOTP(email, phone, combinedOtp);
        setShowSuccessModal(true);
      } else {
        await loginWithOTP(phone, phoneOtpString);
      }
    } catch (error: any) {
      logger.error('OTP verification failed', error);
      Alert.alert(
        'Verification Failed',
        error.response?.data?.error || error.message || 'Invalid OTP. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.navigate('Login' as never);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login' as never);
  };

  const renderOTPInput = (
    type: 'email' | 'phone',
    otp: string[],
    verified: boolean
  ) => {
    const refs = type === 'email' ? emailInputRefs : phoneInputRefs;

    return (
      <View style={styles.otpInputContainer}>
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (refs.current[index] = ref)}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
                verified && styles.otpInputVerified,
              ]}
              value={digit}
              onChangeText={(value) => handleOTPChange(type, index, value)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(type, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!verified}
            />
          ))}
          <View style={[styles.statusIcon, verified && styles.statusIconVerified]}>
            {verified ? (
              <Text style={styles.checkIcon}>✓</Text>
            ) : (
              <Text style={styles.refreshIcon}>↻</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={headerConfig.backgroundColor} />

      {/* Colored Header */}
      <View style={[styles.header, { backgroundColor: headerConfig.backgroundColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.illustrationPlaceholder} />
          <Text style={styles.headerTitle}>{headerConfig.title}</Text>
        </View>

        <TouchableOpacity style={styles.backToLoginButton} onPress={handleBackToLogin}>
          <Text style={styles.backToLoginText}>Back Log in</Text>
        </TouchableOpacity>
      </View>

      {/* OTP Content */}
      <View style={styles.content}>
        <Text style={styles.title}>OTP Validation</Text>
        <Text style={styles.subtitle}>
          We have sent code verification to your{'\n'}Email id and Phone number
        </Text>

        {/* Email OTP */}
        <Text style={styles.otpLabel}>{email}</Text>
        {renderOTPInput('email', emailOtp, emailVerified)}
        <TouchableOpacity onPress={() => handleResendCode('email')}>
          <Text style={styles.resendText}>Resend Code</Text>
        </TouchableOpacity>

        {/* Phone OTP */}
        <Text style={[styles.otpLabel, { marginTop: 24 }]}>+91 {phone}</Text>
        {renderOTPInput('phone', phoneOtp, phoneVerified)}
        <TouchableOpacity onPress={() => handleResendCode('phone')}>
          <Text style={styles.resendText}>Resend Code</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            emailVerified && phoneVerified && styles.continueButtonActive,
          ]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Verifying...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={handleSuccessClose}>
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>Great!</Text>
            <Text style={styles.modalSubtitle}>
              Your account has been created successfully
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
    marginTop: -2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingLeft: 8,
  },
  illustrationPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  backToLoginButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 0 : 20,
    right: 16,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  backToLoginText: {
    fontSize: 12,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  otpInputContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  otpInput: {
    width: 36,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 4,
    color: '#1A1A1A',
  },
  otpInputFilled: {
    backgroundColor: '#FFFFFF',
  },
  otpInputVerified: {
    backgroundColor: '#E8F5E9',
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  statusIconVerified: {
    backgroundColor: '#4CAF50',
  },
  refreshIcon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    color: '#FF6B35',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  continueButton: {
    backgroundColor: '#9E9E9E',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#FF6B35',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  modalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  modalCloseText: {
    fontSize: 24,
    color: '#666',
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIconText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default OTPVerificationScreen;
