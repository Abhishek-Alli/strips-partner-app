/**
 * Account Management Screen
 * 
 * View & edit profile, referral code, reset password, delete account
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../theme';
import { authService } from '../../services/auth.service';
import { logger } from '../../core/logger';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { sanitizeEmail, sanitizeString, sanitizePhone } from '../../core/security/inputSanitizer';

const AccountManagementScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement update profile API
      // await userService.updateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully');
      setEditing(false);
    } catch (error) {
      logger.error('Failed to update profile', error as Error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    try {
      if (navigation.isFocused()) {
        navigation.navigate('ForgotPassword' as never);
      } else {
        logger.warn("Attempted to navigate to 'ForgotPassword' from inactive navigator.");
        Alert.alert('Navigation Error', 'Reset password screen is not available. Please try again.');
      }
    } catch (error) {
      logger.error('Failed to navigate to ForgotPassword', error as Error);
      Alert.alert('Error', 'Could not navigate to reset password. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setShowDeleteConfirm(false) },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement delete account API
              // await userService.deleteAccount();
              Alert.alert('Success', 'Account deleted successfully');
              await logout();
            } catch (error) {
              logger.error('Failed to delete account', error as Error);
              Alert.alert('Error', 'Failed to delete account');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Profile Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Profile Information</Text>
          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={{ color: theme.colors.primary }}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Name</Text>
          {editing ? (
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
          ) : (
            <Text style={[styles.value, { color: theme.colors.text.primary }]}>{user?.name}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Email</Text>
          {editing ? (
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={[styles.value, { color: theme.colors.text.primary }]}>{user?.email}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Phone</Text>
          {editing ? (
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={[styles.value, { color: theme.colors.text.primary }]}>{user?.phone || 'Not set'}</Text>
          )}
        </View>

        {editing && (
          <View style={styles.editActions}>
            <PrimaryButton
              title={loading ? 'Saving...' : 'Save'}
              onPress={handleUpdateProfile}
              disabled={loading}
              fullWidth
              style={styles.saveButton}
            />
            <TouchableOpacity onPress={() => {
              setEditing(false);
              setFormData({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || ''
              });
            }}>
              <Text style={{ color: theme.colors.primary, textAlign: 'center', marginTop: 8 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Referral Code */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Referral Code</Text>
        <View style={[styles.referralBox, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
          <Text style={[styles.referralCode, { color: theme.colors.text.primary }]}>
            {user?.id?.substring(0, 8).toUpperCase() || 'N/A'}
          </Text>
        </View>
        <Text style={[styles.referralHint, { color: theme.colors.text.secondary }]}>
          Share this code with friends to earn rewards
        </Text>
      </View>

      {/* Payments */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Payments</Text>
        <TouchableOpacity
          style={styles.securityItem}
          onPress={() => {
            try {
              if (navigation.isFocused()) {
                navigation.navigate('PaymentHistory' as never);
              } else {
                logger.warn("Attempted to navigate to 'PaymentHistory' from inactive navigator.");
                Alert.alert('Navigation Error', 'Payment history screen is not available. Please try again.');
              }
            } catch (error) {
              logger.error('Failed to navigate to PaymentHistory', error as Error);
              Alert.alert('Error', 'Could not navigate to payment history. Please try again.');
            }
          }}
        >
          <Text style={[styles.securityLabel, { color: theme.colors.text.primary }]}>Payment History</Text>
          <Text style={{ color: theme.colors.text.secondary }}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Security */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Security</Text>
        <TouchableOpacity
          style={styles.securityItem}
          onPress={handleResetPassword}
        >
          <Text style={[styles.securityLabel, { color: theme.colors.text.primary }]}>Reset Password</Text>
          <Text style={{ color: theme.colors.text.secondary }}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: '#ff4444' }]}>
        <Text style={[styles.sectionTitle, { color: '#ff4444' }]}>Danger Zone</Text>
        <PrimaryButton
          title={showDeleteConfirm ? 'Confirm Delete Account' : 'Delete Account'}
          onPress={handleDeleteAccount}
          fullWidth
          style={[styles.deleteButton, { backgroundColor: showDeleteConfirm ? '#ff4444' : '#ff6666' }]}
        />
        {showDeleteConfirm && (
          <Text style={[styles.deleteWarning, { color: theme.colors.text.secondary }]}>
            This will permanently delete your account and all associated data.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    })
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  field: {
    marginBottom: 16
  },
  label: {
    fontSize: 12,
    marginBottom: 4
  },
  value: {
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  editActions: {
    marginTop: 8
  },
  saveButton: {
    marginBottom: 0
  },
  referralBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 8
  },
  referralCode: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2
  },
  referralHint: {
    fontSize: 12,
    textAlign: 'center'
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  securityLabel: {
    fontSize: 16
  },
  deleteButton: {
    marginTop: 8
  },
  deleteWarning: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center'
  }
});

export default AccountManagementScreen;

