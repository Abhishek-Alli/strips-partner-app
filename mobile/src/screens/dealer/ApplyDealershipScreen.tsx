/**
 * Apply for Dealership Screen
 *
 * Form to apply for a dealership with company details
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
import { MaterialIcons } from '@expo/vector-icons';

const ApplyDealershipScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [experience, setExperience] = useState('');
  const [message, setMessage] = useState('');

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const handleSubmit = () => {
    if (!companyName || !ownerName || !phone || !email || !address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    Alert.alert(
      'Application Submitted',
      'Your dealership application has been submitted successfully. We will review and get back to you within 3-5 business days.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply for Dealership</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <MaterialIcons name="info" size={20} color="#2196F3" />
          <Text style={styles.infoText}>
            Fill in the details below to apply for a dealership. All fields marked with * are required.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Company Name *</Text>
          <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} placeholder="Enter company name" placeholderTextColor="#999" />

          <Text style={styles.formLabel}>Owner Name *</Text>
          <TextInput style={styles.input} value={ownerName} onChangeText={setOwnerName} placeholder="Enter owner name" placeholderTextColor="#999" />

          <Text style={styles.formLabel}>Phone Number *</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Enter phone number" placeholderTextColor="#999" keyboardType="phone-pad" />

          <Text style={styles.formLabel}>Email *</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter email" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.formLabel}>Business Address *</Text>
          <TextInput style={[styles.input, styles.multilineInput]} value={address} onChangeText={setAddress} placeholder="Enter full address" placeholderTextColor="#999" multiline />

          <Text style={styles.formLabel}>GST Number</Text>
          <TextInput style={styles.input} value={gstNumber} onChangeText={setGstNumber} placeholder="Enter GST number (optional)" placeholderTextColor="#999" autoCapitalize="characters" />

          <Text style={styles.formLabel}>Years of Experience</Text>
          <TextInput style={styles.input} value={experience} onChangeText={setExperience} placeholder="Enter years of experience" placeholderTextColor="#999" keyboardType="numeric" />

          <Text style={styles.formLabel}>Additional Message</Text>
          <TextInput style={[styles.input, styles.messageInput]} value={message} onChangeText={setMessage} placeholder="Any additional information..." placeholderTextColor="#999" multiline />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Application</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  menuButton: { padding: 4 },
  content: { flex: 1, padding: 16 },
  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#E3F2FD',
    borderRadius: 12, padding: 14, marginBottom: 16,
  },
  infoText: { flex: 1, fontSize: 13, color: '#1565C0', lineHeight: 18 },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16 },
  formLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#F5F5F5', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: '#1A1A1A',
  },
  multilineInput: { height: 80, textAlignVertical: 'top' },
  messageInput: { height: 100, textAlignVertical: 'top' },
  submitButton: {
    backgroundColor: '#FF6B35', paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginTop: 24,
  },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});

export default ApplyDealershipScreen;
