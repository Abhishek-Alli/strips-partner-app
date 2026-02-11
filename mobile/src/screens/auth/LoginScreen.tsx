/**
 * Login Screen
 *
 * Matches the new UI design with:
 * - Email/Phone toggle tabs
 * - Clean form inputs
 * - Social login options
 * - OTP login option
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { logger } from '../../core/logger';
import { socialAuthService } from '../../services/socialAuthService';
import { UserRole } from '../../types/auth.types';
import { UserType } from '../../types/registration.types';

const LoginScreen: React.FC = () => {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!identifier.trim()) {
      Alert.alert('Error', `Please enter your ${loginType}`);
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier, password);
    } catch (error: any) {
      logger.error('Login failed', error);
      Alert.alert(
        'Login Failed',
        error.response?.data?.error || error.message || 'Please try again'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSocialLoading(true);
    try {
      const socialUser = await socialAuthService.signInWithGoogle();
      navigation.navigate('SignupStep2Social' as never, {
        userType: UserType.GENERAL_USER,
        role: UserRole.GENERAL_USER,
        socialData: {
          name: socialUser.name,
          email: socialUser.email,
          phone: socialUser.phone || '',
          socialId: socialUser.id,
          provider: socialUser.provider,
        },
      } as never);
    } catch (error: any) {
      logger.error('Google login failed', error);
      Alert.alert('Error', error.message || 'Google login failed. Please try again.');
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsSocialLoading(true);
    try {
      const socialUser = await socialAuthService.signInWithFacebook();
      navigation.navigate('SignupStep2Social' as never, {
        userType: UserType.GENERAL_USER,
        role: UserRole.GENERAL_USER,
        socialData: {
          name: socialUser.name,
          email: socialUser.email,
          phone: socialUser.phone || '',
          socialId: socialUser.id,
          provider: socialUser.provider,
        },
      } as never);
    } catch (error: any) {
      logger.error('Facebook login failed', error);
      Alert.alert('Error', error.message || 'Facebook login failed. Please try again.');
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword' as never);
  };

  const handleSignup = () => {
    navigation.navigate('SignupStep1' as never);
  };

  const handleOTPLogin = () => {
    navigation.navigate('OTP' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {/* Login Type Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              loginType === 'email' && styles.toggleButtonActive,
            ]}
            onPress={() => setLoginType('email')}
          >
            <Text
              style={[
                styles.toggleText,
                loginType === 'email' && styles.toggleTextActive,
              ]}
            >
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              loginType === 'phone' && styles.toggleButtonActive,
            ]}
            onPress={() => setLoginType('phone')}
          >
            <Text
              style={[
                styles.toggleText,
                loginType === 'phone' && styles.toggleTextActive,
              ]}
            >
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder={loginType === 'email' ? 'Email' : 'Phone Number'}
          placeholderTextColor="#999"
          value={identifier}
          onChangeText={setIdentifier}
          keyboardType={loginType === 'email' ? 'email-address' : 'phone-pad'}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Forgot Password */}
        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Social Login */}
        <View style={styles.socialContainer}>
          <Text style={styles.dividerText}>Or continue with</Text>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleLogin}
              disabled={isSocialLoading}
            >
              {isSocialLoading ? (
                <ActivityIndicator color="#666" size="small" />
              ) : (
                <Text style={styles.socialButtonText}>Google</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleFacebookLogin}
              disabled={isSocialLoading}
            >
              {isSocialLoading ? (
                <ActivityIndicator color="#666" size="small" />
              ) : (
                <Text style={styles.socialButtonText}>Facebook</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* OTP Login */}
        <TouchableOpacity onPress={handleOTPLogin} style={styles.otpLink}>
          <Text style={styles.otpLinkText}>Login with OTP</Text>
        </TouchableOpacity>

        {/* Signup Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  toggleButtonActive: {
    backgroundColor: '#5C6BC0',
    borderColor: '#5C6BC0',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#5C6BC0',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#5C6BC0',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  socialContainer: {
    marginVertical: 16,
  },
  dividerText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
    color: '#666666',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '500',
  },
  otpLink: {
    alignItems: 'center',
    marginVertical: 16,
  },
  otpLinkText: {
    color: '#5C6BC0',
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#666666',
    fontSize: 14,
  },
  signupLink: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
