/**
 * Login Screen
 *
 * Clean branded login with email/phone toggle,
 * social login, OTP option - dealer UI style
 */

import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const { login, loginWithSocial } = useAuth();
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

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsSocialLoading(true);
    try {
      const socialUser =
        provider === 'google'
          ? await socialAuthService.signInWithGoogle()
          : await socialAuthService.signInWithFacebook();

      if (socialUser.idToken) {
        try {
          const result = await loginWithSocial(provider, socialUser.idToken);
          if (result && result.newUser) {
            navigation.navigate('SignupStep2Social' as never, {
              userType: UserType.GENERAL_USER,
              role: UserRole.GENERAL_USER,
              socialData: {
                name: result.profile.name,
                email: result.profile.email,
                phone: '',
                socialId: socialUser.id,
                provider,
              },
            } as never);
          }
          return;
        } catch (backendErr) {
          logger.warn('Backend social verify failed, falling through to signup', backendErr as Error);
        }
      }

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
      logger.error(`${provider} login failed`, error);
      Alert.alert('Error', error.message || `${provider} login failed. Please try again.`);
    } finally {
      setIsSocialLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoCircle}>
            <Image
              source={require("../../logo/srj_logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
         {/*<Text style={styles.appName}>SRJ</Text>*/}
          <Text style={styles.tagline}>Making India Stroger</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>

          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSubtitle}>Sign in to your account</Text>

          {/* Email / Phone Toggle */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, loginType === 'email' && styles.toggleBtnActive]}
              onPress={() => setLoginType('email')}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="email"
                size={16}
                color={loginType === 'email' ? '#FFFFFF' : '#888'}
                style={styles.toggleIcon}
              />
              <Text style={[styles.toggleText, loginType === 'email' && styles.toggleTextActive]}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, loginType === 'phone' && styles.toggleBtnActive]}
              onPress={() => setLoginType('phone')}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="phone"
                size={16}
                color={loginType === 'phone' ? '#FFFFFF' : '#888'}
                style={styles.toggleIcon}
              />
              <Text style={[styles.toggleText, loginType === 'phone' && styles.toggleTextActive]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Identifier Input */}
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name={loginType === 'email' ? 'alternate-email' : 'phone'}
              size={20}
              color="#BBBBBB"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder={loginType === 'email' ? 'Enter your email' : 'Enter your phone number'}
              placeholderTextColor="#BBBBBB"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType={loginType === 'email' ? 'email-address' : 'phone-pad'}
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <MaterialIcons name="lock-outline" size={20} color="#BBBBBB" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#BBBBBB"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((p) => !p)} style={styles.eyeButton}>
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#BBBBBB"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword' as never)}
            style={styles.forgotRow}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* OTP Login */}
          <TouchableOpacity
            style={styles.otpBtn}
            onPress={() => navigation.navigate('OTP' as never)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="sms" size={17} color="#FF6B35" style={{ marginRight: 6 }} />
            <Text style={styles.otpBtnText}>Login with OTP</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => handleSocialLogin('google')}
              disabled={isSocialLoading}
              activeOpacity={0.8}
            >
              {isSocialLoading ? (
                <ActivityIndicator color="#888" size="small" />
              ) : (
                <>
                  <Text style={styles.googleG}>G</Text>
                  <Text style={styles.socialBtnText}>Google</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => handleSocialLogin('facebook')}
              disabled={isSocialLoading}
              activeOpacity={0.8}
            >
              {isSocialLoading ? (
                <ActivityIndicator color="#888" size="small" />
              ) : (
                <>
                  <Text style={styles.facebookF}>f</Text>
                  <Text style={styles.socialBtnText}>Facebook</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignupStep1' as never)}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Brand
  brandContainer: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 36 : 40,
    paddingBottom: 28,
  },
  logoCircle: {
    width: 126,
    height: 126,
    borderRadius: 63,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },

  logoImage: {
  width: 100,
  height: 100,
  tintColor: '#FFFFFF', 
},

  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#3e0505',
    letterSpacing: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: '#999',
    fontWeight: '400',
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 4 },
    }),
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 22,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#FF6B35',
  },
  toggleIcon: {
    marginRight: 5,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Inputs
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    paddingVertical: Platform.OS === 'ios' ? 14 : 11,
  },
  eyeButton: {
    padding: 4,
  },

  // Forgot
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: 2,
  },
  forgotText: {
    fontSize: 13,
    color: '#FF6B35',
    fontWeight: '500',
  },

  // Login Button
  loginBtn: {
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // OTP Button
  otpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    borderRadius: 14,
    paddingVertical: 13,
    marginBottom: 22,
  },
  otpBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  dividerLabel: {
    fontSize: 12,
    color: '#BBBBBB',
    marginHorizontal: 12,
    fontWeight: '500',
  },

  // Social
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
    gap: 8,
  },
  googleG: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4285F4',
  },
  facebookF: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1877F2',
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },

  // Sign Up
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    color: '#888',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
  },
});

export default LoginScreen;
