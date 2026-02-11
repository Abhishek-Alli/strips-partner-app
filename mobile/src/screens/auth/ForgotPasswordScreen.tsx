/**
 * Forgot Password Screen
 * 
 * Request password reset via OTP
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { authService } from '../../services/authService';
import { sanitizeEmail } from '../../core/security/inputSanitizer';
import { logger } from '../../core/logger';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const theme = useTheme();

  const handleRequestReset = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const sanitizedEmail = sanitizeEmail(email);
      await authService.requestPasswordReset(sanitizedEmail);
      setOtpSent(true);
      Alert.alert('Success', 'OTP has been sent to your email');
    } catch (error: any) {
      logger.error('Password reset request failed', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || error.message || 'Failed to send reset OTP'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter new password');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const sanitizedEmail = sanitizeEmail(email);
      await authService.resetPassword(sanitizedEmail, otp, newPassword);
      Alert.alert('Success', 'Password reset successfully. Please login with your new password.');
      navigation.goBack();
    } catch (error: any) {
      logger.error('Password reset failed', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || error.message || 'Failed to reset password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Reset Password
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        {otpSent
          ? 'Enter the OTP sent to your email and your new password'
          : 'Enter your email to receive a reset code'}
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            color: theme.colors.text.primary
          }
        ]}
        placeholder="Email"
        placeholderTextColor={theme.colors.text.secondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!otpSent}
      />

      {otpSent && (
        <>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text.primary
              }
            ]}
            placeholder="OTP"
            placeholderTextColor={theme.colors.text.secondary}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text.primary
              }
            ]}
            placeholder="New Password"
            placeholderTextColor={theme.colors.text.secondary}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text.primary
              }
            ]}
            placeholder="Confirm New Password"
            placeholderTextColor={theme.colors.text.secondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </>
      )}

      <PrimaryButton
        title={
          isLoading
            ? 'Processing...'
            : otpSent
            ? 'Reset Password'
            : 'Send Reset Code'
        }
        onPress={otpSent ? handleResetPassword : handleRequestReset}
        disabled={isLoading}
        fullWidth
        style={styles.submitButton}
      />

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={{ color: theme.colors.primary }}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 16 : 12,
    marginBottom: 16,
    fontSize: 16
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 16
  },
  backButton: {
    alignItems: 'center',
    padding: 16
  }
});

export default ForgotPasswordScreen;






