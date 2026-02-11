/**
 * Dealer Enquiries Screen
 *
 * Displays list of customer enquiries/feedback with option to reply
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  time: string;
  rating?: number;
  type: 'feedback' | 'enquiry';
}

const sampleEnquiries: Enquiry[] = [
  {
    id: '1',
    name: 'Alok Das',
    email: 'example@gmail.com',
    topic: 'Sed ut perspiciatis',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua. Ut enim ad minim nostrud exercitationLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
    time: '2 mins ago',
    rating: 4.5,
    type: 'feedback',
  },
  {
    id: '2',
    name: 'Alok Das',
    email: 'example@gmail.com',
    topic: 'Sed ut perspiciatis',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua. Ut enim ad minim nostrud exercitationLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
    time: '2 mins ago',
    rating: 4.5,
    type: 'feedback',
  },
  {
    id: '3',
    name: 'Alok Das',
    email: 'example@gmail.com',
    topic: 'Sed ut perspiciatis',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua. Ut enim ad minim nostrud exercitationLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
    time: '2 mins ago',
    rating: 4.5,
    type: 'feedback',
  },
  {
    id: '4',
    name: 'Alok Das',
    email: 'example@gmail.com',
    topic: 'Sed ut perspiciatis',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua. Ut enim ad minim nostrud exercitationLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
    time: '2 mins ago',
    rating: 4.5,
    type: 'feedback',
  },
];

const sampleEnquiriesOnly: Enquiry[] = [
  {
    id: '1',
    name: 'Alok Das',
    email: 'example@gmail.com',
    topic: 'Sed ut perspiciatis',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua. Ut enim ad minim nostrud exercitation...',
    time: '2 mins ago',
    type: 'enquiry',
  },
  {
    id: '2',
    name: 'Alok Das',
    email: 'example@gmail.com',
    topic: 'Sed ut perspiciatis',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua. Ut enim ad minim nostrud exercitation...',
    time: '2 mins ago',
    type: 'enquiry',
  },
  {
    id: '3',
    name: 'Alok Das',
    email: 'example@gmail.com',
    topic: 'Sed ut perspiciatis',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua. Ut enim ad minim nostrud exercitation...',
    time: '2 mins ago',
    type: 'enquiry',
  },
  {
    id: '4',
    name: 'Alok Das',
    email: 'example@gmail.com',
    topic: 'Sed ut perspiciatis',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua. Ut enim ad minim nostrud exercitation...',
    time: '2 mins ago',
    type: 'enquiry',
  },
];

type ViewType = 'feedback' | 'enquiries';

const DealerEnquiriesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [viewType] = useState<ViewType>('enquiries');

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const handleEnquiryPress = (enquiry: Enquiry) => {
    navigation.navigate('DealerEnquiryDetail', { enquiry });
  };

  const handleReportFeedback = (_enquiryId: string) => {
    // Report feedback to admin
  };

  const handleMessageBack = (enquiry: Enquiry) => {
    navigation.navigate('DealerEnquiryDetail', { enquiry });
  };

  const renderFeedbackItem = (enquiry: Enquiry) => (
    <View key={enquiry.id} style={styles.enquiryCard}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.userName}>{enquiry.name}</Text>
          <Text style={styles.userEmail}>📧 {enquiry.email}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.timeText}>{enquiry.time}</Text>
          {enquiry.rating && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {enquiry.rating}</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.messageText} numberOfLines={4}>
        {enquiry.message}
      </Text>
      <TouchableOpacity onPress={() => handleReportFeedback(enquiry.id)}>
        <Text style={styles.actionLink}>Report feedback to admin</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEnquiryItem = (enquiry: Enquiry) => (
    <TouchableOpacity
      key={enquiry.id}
      style={styles.enquiryCard}
      onPress={() => handleEnquiryPress(enquiry)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.userName}>{enquiry.name}</Text>
          <Text style={styles.userEmail}>📧 {enquiry.email}</Text>
        </View>
        <Text style={styles.timeText}>{enquiry.time}</Text>
      </View>
      <Text style={styles.topicText}>Topic: {enquiry.topic}</Text>
      <Text style={styles.messageText} numberOfLines={3}>
        {enquiry.message}
      </Text>
      <TouchableOpacity onPress={() => handleMessageBack(enquiry)}>
        <Text style={styles.actionLink}>Message Back</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const dataToRender = viewType === 'feedback' ? sampleEnquiries : sampleEnquiriesOnly;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enquiries</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {viewType === 'feedback'
          ? dataToRender.map((enquiry) => renderFeedbackItem(enquiry))
          : dataToRender.map((enquiry) => renderEnquiryItem(enquiry))}
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
    padding: 16,
  },
  enquiryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#666',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  ratingBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  topicText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionLink: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
    textAlign: 'right',
  },
  bottomPadding: {
    height: 30,
  },
});

export default DealerEnquiriesScreen;
