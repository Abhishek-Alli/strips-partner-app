/**
 * Forgot Password / Reset Password Screen
 * Modern dealer UI style matching LoginScreen
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
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { sanitizeEmail } from '../../core/security/inputSanitizer';
import { logger } from '../../core/logger';

const ACCENT = '#FF6B35';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigation = useNavigation();

  const handleRequestReset = async () => {
    if (!email.trim()) { Alert.alert('Error', 'Please enter your email'); return; }
    setIsLoading(true);
    try {
      const sanitizedEmail = sanitizeEmail(email);
      await authService.requestPasswordReset(sanitizedEmail);
      setOtpSent(true);
      Alert.alert('Success', 'OTP has been sent to your email');
    } catch (error: any) {
      logger.error('Password reset request failed', error);
      Alert.alert('Error', error.response?.data?.error || error.message || 'Failed to send reset OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim()) { Alert.alert('Error', 'Please enter the OTP'); return; }
    if (!newPassword.trim()) { Alert.alert('Error', 'Please enter new password'); return; }
    if (newPassword.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { Alert.alert('Error', 'Passwords do not match'); return; }
    setIsLoading(true);
    try {
      const sanitizedEmail = sanitizeEmail(email);
      await authService.resetPassword(sanitizedEmail, otp, newPassword);
      Alert.alert('Success', 'Password reset successfully. Please login with your new password.');
      navigation.goBack();
    } catch (error: any) {
      logger.error('Password reset failed', error);
      Alert.alert('Error', error.response?.data?.error || error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({
    placeholder, value, onChangeText, keyboardType, secureTextEntry, showToggle,
    onToggle, editable = true, icon,
  }: any) => (
    <View style={[styles.inputWrapper, !editable && styles.inputDisabled]}>
      <MaterialIcons name={icon} size={18} color='#999' style={styles.inputIcon} />
      <TextInput
        style={styles.inputText}
        placeholder={placeholder}
        placeholderTextColor='#BBB'
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize='none'
        editable={editable}
      />
      {showToggle && (
        <TouchableOpacity onPress={onToggle}>
          <MaterialIcons name={secureTextEntry ? 'visibility-off' : 'visibility'} size={18} color='#AAA' />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <Image
            source={require('../../logo/srj_logo.png')}
            style={styles.logo}
            resizeMode='contain'
          />
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Step indicator */}
          <View style={styles.stepRow}>
            <View style={[styles.stepDot, styles.stepDotActive]} />
            <View style={[styles.stepLine, otpSent && styles.stepLineActive]} />
            <View style={[styles.stepDot, otpSent && styles.stepDotActive]} />
          </View>

          <Text style={styles.title}>
            {otpSent ? 'Set New Password' : 'Reset Password'}
          </Text>
          <Text style={styles.subtitle}>
            {otpSent
              ? 'Enter the OTP from your email and set a new password.'
              : 'Enter your registered email to receive a reset code.'}
          </Text>

          <InputField
            placeholder='Email address'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            editable={!otpSent}
            icon='email'
          />

          {otpSent && (
            <>
              <InputField
                placeholder='Enter OTP'
                value={otp}
                onChangeText={setOtp}
                keyboardType='number-pad'
                icon='lock-clock'
              />
              <InputField
                placeholder='New Password'
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNew}
                showToggle
                onToggle={() => setShowNew(v => !v)}
                icon='lock'
              />
              <InputField
                placeholder='Confirm New Password'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                showToggle
                onToggle={() => setShowConfirm(v => !v)}
                icon='lock-outline'
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={otpSent ? handleResetPassword : handleRequestReset}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>
                {otpSent ? 'Reset Password' : 'Send Reset Code'}
              </Text>
            )}
          </TouchableOpacity>

          {otpSent && (
            <TouchableOpacity
              style={styles.resendBtn}
              onPress={() => setOtpSent(false)}
            >
              <Text style={styles.resendText}>Wrong email? Go back</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <MaterialIcons name='arrow-back' size={16} color={ACCENT} />
          <Text style={styles.backLinkText}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  logoArea: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 120, height: 80 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 4 },
    }),
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DDD',
  },
  stepDotActive: { backgroundColor: ACCENT },
  stepLine: { flex: 0, width: 40, height: 2, backgroundColor: '#DDD', marginHorizontal: 6 },
  stepLineActive: { backgroundColor: ACCENT },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A1A', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    marginBottom: 14,
  },
  inputDisabled: { opacity: 0.6 },
  inputIcon: { marginRight: 10 },
  inputText: { flex: 1, fontSize: 15, color: '#1A1A1A' },
  submitBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  resendBtn: { alignItems: 'center', paddingVertical: 12 },
  resendText: { color: '#888', fontSize: 14 },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  backLinkText: { color: ACCENT, fontSize: 14, fontWeight: '600' },
});

export default ForgotPasswordScreen;
