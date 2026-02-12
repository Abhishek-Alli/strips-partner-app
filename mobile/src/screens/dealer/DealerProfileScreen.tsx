/**
 * Dealer Profile Screen (Mobile)
 *
 * Profile management with Profile Edit and Password Setting tabs
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { useAuth } from '../../contexts/AuthContext';

const DealerProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  // Profile Edit fields
  const [businessName, setBusinessName] = useState('Serines Deals and Traders');
  const [location, setLocation] = useState('Ganeshguri');
  const [email, setEmail] = useState('example@gmail.com');
  const [phone, setPhone] = useState('9123456780');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const handleUpdateProfile = () => {
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    Alert.alert('Success', 'Password changed successfully');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const performLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn('Logout error:', e);
      await logout().catch(() => {});
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        performLogout();
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: performLogout,
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Profile</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>LO{'\n'}GO</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ 4.5</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.businessName}>Serines Deals and{'\n'}Traders</Text>
            <Text style={styles.profileDetail}>📍 Location: Ganeshguri</Text>
            <Text style={styles.profileDetail}>📧 example@gmail.com</Text>
            <Text style={styles.profileDetail}>📞 9123456780</Text>
            <View style={styles.referralBadge}>
              <Text style={styles.referralText}>
                Referral Code: <Text style={styles.referralCode}>123456</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'profile' && styles.tabButtonActive]}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'profile' && styles.tabButtonTextActive]}>
              Profile Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'password' && styles.tabButtonActive]}
            onPress={() => setActiveTab('password')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'password' && styles.tabButtonTextActive]}>
              Password Setting
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Edit Tab */}
        {activeTab === 'profile' && (
          <View style={styles.formSection}>
            <TextInput
              style={styles.textInput}
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="Business Name"
              placeholderTextColor="#999"
            />

            <View style={styles.locationInput}>
              <TextInput
                style={[styles.textInput, styles.locationField]}
                value={location}
                onChangeText={setLocation}
                placeholder="Location"
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.searchIcon}>🔍</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>
        )}

        {/* Password Setting Tab */}
        {activeTab === 'password' && (
          <View style={styles.formSection}>
            <TextInput
              style={styles.textInput}
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Old Password"
              placeholderTextColor="#999"
              secureTextEntry
            />

            <TextInput
              style={styles.textInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              placeholderTextColor="#999"
              secureTextEntry
            />

            <TextInput
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.updateButton}
          onPress={activeTab === 'profile' ? handleUpdateProfile : handleChangePassword}
        >
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>LOG OUT</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  menuButton: {
    padding: 4,
  },
  menuIcon: {
    fontSize: 24,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 12,
  },
  logoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  logoText: {
    width: 70,
    height: 70,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#1976D2',
    lineHeight: 35,
    paddingTop: 10,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -8,
    left: 10,
    backgroundColor: '#C62828',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  profileDetail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  referralBadge: {
    marginTop: 8,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  referralText: {
    fontSize: 12,
    color: '#666',
  },
  referralCode: {
    fontWeight: '700',
    color: '#1A1A1A',
  },
  tabButtons: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    gap: 12,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
  },
  tabButtonActive: {
    backgroundColor: '#FF6B35',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 12,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationField: {
    flex: 1,
    marginBottom: 0,
    marginRight: 12,
  },
  searchButton: {
    padding: 14,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 20,
  },
  updateButton: {
    backgroundColor: '#333',
    marginHorizontal: 50,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  logoutButton: {
    alignItems: 'center',
    marginTop: 30,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  bottomPadding: {
    height: Platform.OS === 'ios' ? 40 : 30,
  },
});

export default DealerProfileScreen;
