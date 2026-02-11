/**
 * Premium Mobile Login Screen
 * 
 * Clean, focused authentication interface
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contexts/AuthContext';
import { Card } from '../../../components/core/Card';
import { PrimaryButton } from '../../../components/core/PrimaryButton';
import { theme } from '../../../theme';
import { logger } from '../../../core/logger';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Navigation handled by auth context
    } catch (err) {
      setError('Invalid email or password');
      logger.error('Login failed', err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {/* Form */}
        <Card variant="default" style={styles.formCard}>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <RNTextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.text.tertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <RNTextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.text.tertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword' as never)}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <PrimaryButton
              title={loading ? 'Signing in...' : 'Sign in'}
              onPress={handleSubmit}
              disabled={loading || !email || !password}
              size="lg"
            />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate('SignupStep1' as never)}
                >
                  Sign up
                </Text>
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: parseInt(theme.spacing[4]),
  },
  header: {
    marginBottom: parseInt(theme.spacing[8]),
    alignItems: 'center',
  },
  title: {
    fontSize: parseInt(theme.typography.fontSize['2xl']),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.tight,
    marginBottom: parseInt(theme.spacing[2]),
  },
  subtitle: {
    fontSize: parseInt(theme.typography.fontSize.sm),
    color: theme.colors.text.secondary,
  },
  formCard: {
    padding: parseInt(theme.spacing[6]),
  },
  form: {
    gap: parseInt(theme.spacing[4]),
  },
  inputContainer: {
    gap: parseInt(theme.spacing[2]),
  },
  label: {
    fontSize: parseInt(theme.typography.fontSize.sm),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  input: {
    height: parseInt(theme.components.input.height),
    paddingHorizontal: parseInt(theme.spacing[4]),
    borderRadius: parseInt(theme.components.input.radius),
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    backgroundColor: theme.colors.background.primary,
    fontSize: parseInt(theme.typography.fontSize.base),
    color: theme.colors.text.primary,
  },
  errorText: {
    fontSize: parseInt(theme.typography.fontSize.sm),
    color: theme.colors.error[500],
    marginTop: -parseInt(theme.spacing[2]),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -parseInt(theme.spacing[2]),
  },
  forgotPasswordText: {
    fontSize: parseInt(theme.typography.fontSize.sm),
    color: theme.colors.primary[700],
    fontWeight: theme.typography.fontWeight.medium,
  },
  signupContainer: {
    marginTop: parseInt(theme.spacing[4]),
    alignItems: 'center',
  },
  signupText: {
    fontSize: parseInt(theme.typography.fontSize.sm),
    color: theme.colors.text.secondary,
  },
  signupLink: {
    color: theme.colors.primary[700],
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default LoginScreen;






