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
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import { logger } from '../../core/logger';
import { sanitizeEmail, sanitizeString, sanitizePhone } from '../../core/security/inputSanitizer';

const AccountManagementScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    setLoading(true);
    try {
      // TODO: Implement update profile API
      Alert.alert('Success', 'Profile updated successfully');
      setEditing(false);
    } catch (error) {
      logger.error('Failed to update profile', error as Error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  };

  const handleResetPassword = () => {
    try {
      navigation.navigate('ForgotPassword' as never);
    } catch (error) {
      logger.error('Failed to navigate to ForgotPassword', error as Error);
      Alert.alert('Error', 'Could not open Reset Password screen.');
    }
  };

  const handlePaymentHistory = () => {
    try {
      navigation.navigate('PaymentHistory' as never);
    } catch (error) {
      logger.error('Failed to navigate to PaymentHistory', error as Error);
      Alert.alert('Error', 'Could not open Payment History screen.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setShowDeleteConfirm(false) },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement delete account API
              await logout();
            } catch (error) {
              logger.error('Failed to delete account', error as Error);
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Profile Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="person" size={20} color="#FF6B35" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Profile Information</Text>
            </View>
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButton}>
                <MaterialIcons name="edit" size={16} color="#FF6B35" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(t) => setFormData((p) => ({ ...p, name: sanitizeString(t) }))}
                placeholder="Enter your name"
                placeholderTextColor="#BBBBBB"
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.name || '—'}</Text>
            )}
          </View>

          <View style={styles.fieldDivider} />

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(t) => setFormData((p) => ({ ...p, email: sanitizeEmail(t) }))}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor="#BBBBBB"
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.email || '—'}</Text>
            )}
          </View>

          <View style={styles.fieldDivider} />

          <View style={[styles.field, styles.fieldLast]}>
            <Text style={styles.fieldLabel}>Phone</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(t) => setFormData((p) => ({ ...p, phone: sanitizePhone(t) }))}
                keyboardType="phone-pad"
                placeholder="Enter your phone"
                placeholderTextColor="#BBBBBB"
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.phone || '—'}</Text>
            )}
          </View>

          {editing && (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateProfile}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Referral Code */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="card-giftcard" size={20} color="#FF6B35" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Referral Code</Text>
          </View>
          <View style={styles.referralBox}>
            <Text style={styles.referralCode}>
              {user?.id?.substring(0, 8).toUpperCase() || 'N/A'}
            </Text>
            <TouchableOpacity style={styles.copyButton} activeOpacity={0.7}>
              <MaterialIcons name="content-copy" size={18} color="#FF6B35" />
            </TouchableOpacity>
          </View>
          <Text style={styles.referralHint}>Share this code with friends to earn rewards</Text>
        </View>

        {/* Payments */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="payment" size={20} color="#FF6B35" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Payments</Text>
          </View>
          <TouchableOpacity style={styles.actionRow} onPress={handlePaymentHistory} activeOpacity={0.7}>
            <View style={styles.actionRowLeft}>
              <MaterialIcons name="receipt-long" size={18} color="#666" />
              <Text style={styles.actionRowText}>Payment History</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#BBBBBB" />
          </TouchableOpacity>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="security" size={20} color="#FF6B35" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Security</Text>
          </View>
          <TouchableOpacity style={styles.actionRow} onPress={handleResetPassword} activeOpacity={0.7}>
            <View style={styles.actionRowLeft}>
              <MaterialIcons name="lock-reset" size={18} color="#666" />
              <Text style={styles.actionRowText}>Reset Password</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#BBBBBB" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, styles.dangerSection]}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="warning" size={20} color="#E53935" style={styles.sectionIcon} />
            <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.deleteButton,
              showDeleteConfirm && styles.deleteButtonConfirm,
            ]}
            onPress={handleDeleteAccount}
            activeOpacity={0.8}
          >
            <MaterialIcons name="delete-forever" size={18} color="#FFFFFF" />
            <Text style={styles.deleteButtonText}>
              {showDeleteConfirm ? 'Confirm Delete Account' : 'Delete Account'}
            </Text>
          </TouchableOpacity>
          {showDeleteConfirm && (
            <Text style={styles.deleteWarning}>
              This action is permanent and cannot be undone.
            </Text>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  android: { elevation: 3 },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    ...cardShadow,
  },
  dangerSection: {
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  dangerTitle: {
    color: '#E53935',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 13,
    color: '#FF6B35',
    fontWeight: '500',
    marginLeft: 4,
  },
  field: {
    paddingVertical: 4,
  },
  fieldLast: {
    marginBottom: 0,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 10,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1A1A1A',
    marginTop: 4,
  },
  editActions: {
    marginTop: 16,
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  referralBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF5F2',
    borderWidth: 1,
    borderColor: '#FFD5C5',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 8,
  },
  referralCode: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF6B35',
    letterSpacing: 3,
  },
  copyButton: {
    padding: 4,
  },
  referralHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  actionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionRowText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF9A9A',
    borderRadius: 12,
    paddingVertical: 13,
    gap: 8,
  },
  deleteButtonConfirm: {
    backgroundColor: '#E53935',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  deleteWarning: {
    fontSize: 12,
    color: '#E53935',
    textAlign: 'center',
    marginTop: 10,
  },
  bottomPadding: {
    height: Platform.OS === 'ios' ? 40 : 30,
  },
});

export default AccountManagementScreen;
