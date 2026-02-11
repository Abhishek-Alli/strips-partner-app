/**
 * Manage Profile Screen
 *
 * Profile Edit and Password Setting tabs
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ManageProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  // Profile Edit fields
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@email.com');
  const [phone, setPhone] = useState('+91 9876543210');
  const [address, setAddress] = useState('123 Main Street, Mumbai');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSaveProfile = () => {
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
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    Alert.alert('Success', 'Password changed successfully');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const renderProfileEditTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Profile Picture */}
      <View style={styles.profilePictureSection}>
        <View style={styles.profilePictureContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/200/200?random=50' }}
            style={styles.profilePicture}
          />
          <TouchableOpacity style={styles.editPictureButton}>
            <Text style={styles.editPictureIcon}>✎</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={styles.changePictureText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.textInput}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Address</Text>
          <TextInput
            style={[styles.textInput, styles.textareaInput]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );

  const renderPasswordTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Old Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Enter old password"
              placeholderTextColor="#999"
              secureTextEntry={!showOldPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowOldPassword(!showOldPassword)}
            >
              <Text style={styles.eyeIcon}>{showOldPassword ? '👁' : '👁‍🗨'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>New Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor="#999"
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Text style={styles.eyeIcon}>{showNewPassword ? '👁' : '👁‍🗨'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm New Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeIcon}>
                {showConfirmPassword ? '👁' : '👁‍🗨'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.passwordHint}>
          <Text style={styles.passwordHintText}>
            Password must be at least 6 characters long
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          (!oldPassword || !newPassword || !confirmPassword) &&
            styles.saveButtonDisabled,
        ]}
        onPress={handleChangePassword}
        disabled={!oldPassword || !newPassword || !confirmPassword}
      >
        <Text style={styles.saveButtonText}>Change Password</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Profile</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
          onPress={() => setActiveTab('profile')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'profile' && styles.tabTextActive,
            ]}
          >
            Profile Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'password' && styles.tabActive]}
          onPress={() => setActiveTab('password')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'password' && styles.tabTextActive,
            ]}
          >
            Password Setting
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'profile' ? renderProfileEditTab() : renderPasswordTab()}
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
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  headerRight: {
    width: 32,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  tabTextActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
  },
  editPictureButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editPictureIcon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  changePictureText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputGroup: {
    marginVertical: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
  },
  textareaInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
  },
  eyeButton: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  eyeIcon: {
    fontSize: 18,
  },
  passwordHint: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  passwordHintText: {
    fontSize: 13,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: Platform.OS === 'ios' ? 40 : 30,
  },
});

export default ManageProfileScreen;
