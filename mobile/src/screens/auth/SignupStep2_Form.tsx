/**
 * Signup Step 2: Registration Form
 *
 * Registration form with colored header based on user type
 * Includes partner subtype selection for Influencer/Partner
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { authService } from '../../services/authService';
import { sanitizeEmail, sanitizePhone, sanitizeString } from '../../core/security/inputSanitizer';
import { logger } from '../../core/logger';
import { UserRole } from '../../types/auth.types';
import { UserType, PartnerSubtype, SignupStep2Params } from '../../types/registration.types';
import { validateRegistrationForm } from '../../core/validators/formValidators';

interface PartnerSubtypeOption {
  type: PartnerSubtype;
  title: string;
  subtitle: string;
}

const partnerSubtypes: PartnerSubtypeOption[] = [
  { type: PartnerSubtype.ENGINEER, title: 'I am a', subtitle: 'Engineer' },
  { type: PartnerSubtype.ARCHITECT, title: 'I am a', subtitle: 'Architect' },
  { type: PartnerSubtype.VAASTU_SERVICE_PROVIDER, title: 'I am a', subtitle: 'Vaastu Service Provider' },
];

const SignupStep2_Form: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const params = (route.params as SignupStep2Params) || {};
  const userType = params.userType || UserType.GENERAL_USER;
  const role = params.role || UserRole.GENERAL_USER;

  const [selectedPartnerSubtype, setSelectedPartnerSubtype] = useState<PartnerSubtype | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Get header config based on user type
  const getHeaderConfig = () => {
    switch (userType) {
      case UserType.GENERAL_USER:
        return {
          backgroundColor: '#E3F2FD',
          title: 'General Users',
          formTitle: 'Additional Information',
        };
      case UserType.INFLUENCER_PARTNER:
        return {
          backgroundColor: '#F0FFF0',
          title: 'Influencer / Partner',
          formTitle: 'Select type of user',
        };
      case UserType.DEALER:
        return {
          backgroundColor: '#FCE4EC',
          title: 'Dealers',
          formTitle: 'Additional Information',
        };
      default:
        return {
          backgroundColor: '#E3F2FD',
          title: 'Registration',
          formTitle: 'Additional Information',
        };
    }
  };

  const headerConfig = getHeaderConfig();

  const validateForm = (): boolean => {
    const validationResult = validateRegistrationForm({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      referralCode: formData.referralCode,
    });

    const mappedErrors: Record<string, string> = {};
    if (validationResult.errors.name) mappedErrors.fullName = validationResult.errors.name;
    if (validationResult.errors.email) mappedErrors.email = validationResult.errors.email;
    if (validationResult.errors.phone) mappedErrors.phone = validationResult.errors.phone;
    if (validationResult.errors.password) mappedErrors.password = validationResult.errors.password;
    if (validationResult.errors.confirmPassword) mappedErrors.confirmPassword = validationResult.errors.confirmPassword;

    // Require partner subtype for Influencer/Partner
    if (userType === UserType.INFLUENCER_PARTNER && !selectedPartnerSubtype) {
      mappedErrors.partnerSubtype = 'Please select your profession';
    }

    setErrors(mappedErrors);
    return Object.keys(mappedErrors).length === 0;
  };

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const sanitizedData = {
        name: sanitizeString(formData.fullName),
        email: sanitizeEmail(formData.email),
        phone: sanitizePhone(formData.phone),
        password: formData.password,
        role: role,
        referralCode: formData.referralCode ? sanitizeString(formData.referralCode) : undefined,
      };

      await authService.register(sanitizedData);
      await authService.sendRegistrationOTP(sanitizedData.email, sanitizedData.phone);

      navigation.navigate('OTPVerification' as never, {
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        isRegistration: true,
        userType: userType,
      } as never);
    } catch (error: any) {
      logger.error('Registration failed', error);
      Alert.alert(
        'Registration Failed',
        error.response?.data?.error || error.message || 'Please try again'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login' as never);
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

      {/* Form Content */}
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
        {/* Partner Subtype Selection (only for Influencer/Partner) */}
        {userType === UserType.INFLUENCER_PARTNER && (
          <View style={styles.subtypeContainer}>
            {partnerSubtypes.map((subtype) => (
              <TouchableOpacity
                key={subtype.type}
                style={[
                  styles.subtypeOption,
                  selectedPartnerSubtype === subtype.type && styles.subtypeOptionSelected,
                ]}
                onPress={() => {
                  setSelectedPartnerSubtype(subtype.type);
                  if (errors.partnerSubtype) {
                    setErrors((prev) => ({ ...prev, partnerSubtype: '' }));
                  }
                }}
              >
                <View style={styles.subtypeIcon}>
                  <Text style={styles.subtypeIconText}>👤</Text>
                </View>
                <Text style={styles.subtypeTitle}>{subtype.title}</Text>
                <Text style={styles.subtypeSubtitle}>{subtype.subtitle}</Text>
                {selectedPartnerSubtype === subtype.type && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.formTitle}>{headerConfig.formTitle}</Text>

        {/* Form Fields */}
        <TextInput
          style={[styles.input, errors.fullName && styles.inputError]}
          placeholder="Name*"
          placeholderTextColor="#999"
          value={formData.fullName}
          onChangeText={handleChange('fullName')}
        />

        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email*"
          placeholderTextColor="#999"
          value={formData.email}
          onChangeText={handleChange('email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="Phone*"
          placeholderTextColor="#999"
          value={formData.phone}
          onChangeText={handleChange('phone')}
          keyboardType="phone-pad"
        />

        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Password*"
          placeholderTextColor="#999"
          value={formData.password}
          onChangeText={handleChange('password')}
          secureTextEntry
        />

        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          placeholder="Confirm Password*"
          placeholderTextColor="#999"
          value={formData.confirmPassword}
          onChangeText={handleChange('confirmPassword')}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Referral Code (optional)"
          placeholderTextColor="#999"
          value={formData.referralCode}
          onChangeText={handleChange('referralCode')}
          autoCapitalize="none"
        />

        {/* Social Login */}
        <View style={styles.socialContainer}>
          <Text style={styles.orText}>Or</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.googleIcon}>G</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Please wait...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
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
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 20,
  },
  subtypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  subtypeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  subtypeOptionSelected: {
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  subtypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  subtypeIconText: {
    fontSize: 20,
  },
  subtypeTitle: {
    fontSize: 10,
    color: '#666',
  },
  subtypeSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#1A1A1A',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#EF5350',
  },
  socialContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  orText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    fontSize: 24,
    color: '#1877F2',
    fontWeight: 'bold',
  },
  googleIcon: {
    fontSize: 20,
    color: '#EA4335',
    fontWeight: 'bold',
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
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignupStep2_Form;
