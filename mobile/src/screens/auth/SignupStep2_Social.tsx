/**
 * Signup Step 2B: Social Signup
 * 
 * Pre-fills user data from social auth
 * Allows user to edit before proceeding
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { authService } from '../../services/authService';
import { sanitizeEmail, sanitizePhone, sanitizeString } from '../../core/security/inputSanitizer';
import { logger } from '../../core/logger';
import { UserRole } from '../../types/auth.types';
import { UserType, SignupStep2SocialParams, SocialRegistrationData } from '../../types/registration.types';
import { validateEmail, validatePhone, validateName } from '../../core/validators/formValidators';

const SignupStep2_Social: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const params = (route.params as SignupStep2SocialParams) || {};
  const userType = params.userType || UserType.INDIVIDUAL;
  const role = params.role || UserRole.GENERAL_USER;
  const socialData = params.socialData;

  if (!socialData) {
    // Navigate back if no social data
    navigation.goBack();
    return null;
  }

  const [formData, setFormData] = useState({
    fullName: socialData.name || '',
    email: socialData.email || '',
    phone: socialData.phone || '',
    referralCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (socialData) {
      setFormData({
        fullName: socialData.name || '',
        email: socialData.email || '',
        phone: socialData.phone || '',
        referralCode: ''
      });
    }
  }, [socialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    const nameValidation = validateName(formData.fullName);
    if (!nameValidation.isValid) {
      newErrors.fullName = nameValidation.error || 'Invalid name';
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || 'Invalid email';
    }

    // Validate phone
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error || 'Invalid phone';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeString(formData.fullName),
        email: sanitizeEmail(formData.email),
        phone: sanitizePhone(formData.phone),
        role: role,
        referralCode: formData.referralCode ? sanitizeString(formData.referralCode) : undefined,
        socialId: socialData.socialId,
        provider: socialData.provider
      };

      // Register user with social auth (creates inactive account)
      await authService.registerWithSocial(sanitizedData);

      // Send OTP for verification
      await authService.sendRegistrationOTP(sanitizedData.email, sanitizedData.phone);

      // Navigate to OTP verification
      navigation.navigate('OTPVerification' as never, {
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        isRegistration: true
      } as never);
    } catch (error: any) {
      logger.error('Social registration failed', error);
      Alert.alert(
        'Registration Failed',
        error.response?.data?.error || error.message || 'Please try again'
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
        Complete Your Profile
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        Review and update your information
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            borderColor: errors.fullName ? theme.colors.error : theme.colors.border,
            color: theme.colors.text.primary
          }
        ]}
        placeholder="Full Name"
        placeholderTextColor={theme.colors.text.secondary}
        value={formData.fullName}
        onChangeText={handleChange('fullName')}
      />
      {errors.fullName && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {errors.fullName}
        </Text>
      )}

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            borderColor: errors.email ? theme.colors.error : theme.colors.border,
            color: theme.colors.text.primary
          }
        ]}
        placeholder="Email"
        placeholderTextColor={theme.colors.text.secondary}
        value={formData.email}
        onChangeText={handleChange('email')}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {errors.email}
        </Text>
      )}

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            borderColor: errors.phone ? theme.colors.error : theme.colors.border,
            color: theme.colors.text.primary
          }
        ]}
        placeholder="Phone Number"
        placeholderTextColor={theme.colors.text.secondary}
        value={formData.phone}
        onChangeText={handleChange('phone')}
        keyboardType="phone-pad"
      />
      {errors.phone && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {errors.phone}
        </Text>
      )}

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            color: theme.colors.text.primary
          }
        ]}
        placeholder="Referral Code (Optional)"
        placeholderTextColor={theme.colors.text.secondary}
        value={formData.referralCode}
        onChangeText={handleChange('referralCode')}
        autoCapitalize="none"
      />

      <PrimaryButton
        title={isLoading ? 'Processing...' : 'Continue'}
        onPress={handleSubmit}
        disabled={isLoading}
        fullWidth
        style={styles.submitButton}
      />

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={{ color: theme.colors.primary }}>Back</Text>
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
    marginBottom: 8,
    fontSize: 16
  },
  errorText: {
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 4
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

export default SignupStep2_Social;

