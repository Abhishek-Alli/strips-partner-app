/**
 * Registration Success Screen
 * 
 * Displayed after successful registration and OTP verification
 * Shows success message and navigates to dashboard
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { Icon } from '../../components/core/Icon';
import { designTokens } from '../../design/tokens';

const RegistrationSuccessScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    // Auto-navigate to dashboard after 3 seconds
    const timer = setTimeout(() => {
      // Navigation will be handled by AppNavigator based on auth state
      // Just go back/pop if needed, or let the authenticated stack handle it
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleContinue = () => {
    // User is already authenticated by AuthContext
    // Navigation stack has switched to authenticated
    // Just go back/pop if possible, or navigation will handle it automatically
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: designTokens.colors.success[50] }]}>
          <Icon
            name="CheckCircleOutlined"
            size={80}
            color={theme.colors.success}
          />
        </View>
      </View>

      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Registration Successful!
      </Text>

      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        Your account has been created and verified successfully.
      </Text>

      <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
        You can now access all features of the app. Welcome to SRJ!
      </Text>

      <PrimaryButton
        title="Continue to Dashboard"
        onPress={handleContinue}
        fullWidth
        style={styles.continueButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%'
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: 'center'
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  description: {
    fontSize: 16,
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 24
  },
  continueButton: {
    marginTop: 24,
    width: '100%'
  }
});

export default RegistrationSuccessScreen;
