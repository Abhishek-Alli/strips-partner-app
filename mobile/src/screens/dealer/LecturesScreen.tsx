/**
 * Lectures Screen
 *
 * Upcoming lectures/events with zoom/meet links and detail view
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
  Modal,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { MaterialIcons } from '@expo/vector-icons';

interface Lecture {
  id: string;
  title: string;
  description: string;
  speaker: string;
  date: string;
  time: string;
  duration: string;
  platform: 'zoom' | 'meet' | 'teams';
  link: string;
  status: 'upcoming' | 'live' | 'completed';
  attendees: number;
  topic: string;
}

const sampleLectures: Lecture[] = [
  {
    id: '1',
    title: 'Understanding Steel Grades',
    description: 'A comprehensive lecture on different steel grades, their properties, and applications in construction. Learn to identify the right steel grade for different project requirements.',
    speaker: 'Dr. Rajesh Kumar',
    date: 'Feb 15, 2026',
    time: '10:00 AM',
    duration: '1.5 hours',
    platform: 'zoom',
    link: 'https://zoom.us/j/123456789',
    status: 'upcoming',
    attendees: 45,
    topic: 'Materials',
  },
  {
    id: '2',
    title: 'Modern Construction Techniques',
    description: 'Explore the latest construction methods and technologies being used in modern building projects. Topics include prefabrication, 3D printing in construction.',
    speaker: 'Ar. Priya Sharma',
    date: 'Feb 18, 2026',
    time: '2:00 PM',
    duration: '2 hours',
    platform: 'meet',
    link: 'https://meet.google.com/abc-defg-hij',
    status: 'upcoming',
    attendees: 32,
    topic: 'Construction',
  },
  {
    id: '3',
    title: 'Cement Quality Testing',
    description: 'Learn about different cement quality tests and how to ensure the cement meets IS standards. Practical demonstrations included.',
    speaker: 'Er. Amit Patel',
    date: 'Feb 10, 2026',
    time: '11:00 AM',
    duration: '1 hour',
    platform: 'zoom',
    link: '#',
    status: 'live',
    attendees: 78,
    topic: 'Quality',
  },
  {
    id: '4',
    title: 'Dealer Business Growth Strategies',
    description: 'Strategies and tips for growing your dealership business. Marketing, customer retention, and digital presence management.',
    speaker: 'Mr. Vikash Gupta',
    date: 'Feb 5, 2026',
    time: '3:00 PM',
    duration: '1.5 hours',
    platform: 'teams',
    link: '#',
    status: 'completed',
    attendees: 120,
    topic: 'Business',
  },
];

const LecturesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return '#FF5722';
      case 'upcoming': return '#4CAF50';
      default: return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'live': return 'LIVE NOW';
      case 'upcoming': return 'UPCOMING';
      default: return 'COMPLETED';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zoom': return 'videocam';
      case 'meet': return 'video-call';
      default: return 'groups';
    }
  };

  const handleJoinLecture = (lecture: Lecture) => {
    if (lecture.link && lecture.link !== '#') {
      Linking.openURL(lecture.link);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lectures</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sampleLectures.map(lecture => (
          <TouchableOpacity
            key={lecture.id}
            style={styles.lectureCard}
            onPress={() => setSelectedLecture(lecture)}
          >
            <View style={styles.lectureTop}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lecture.status) + '15' }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(lecture.status) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(lecture.status) }]}>
                  {getStatusLabel(lecture.status)}
                </Text>
              </View>
              <View style={styles.topicBadge}>
                <Text style={styles.topicText}>{lecture.topic}</Text>
              </View>
            </View>

            <Text style={styles.lectureTitle}>{lecture.title}</Text>

            <View style={styles.lectureDetail}>
              <MaterialIcons name="person" size={16} color="#666" />
              <Text style={styles.lectureDetailText}>{lecture.speaker}</Text>
            </View>

            <View style={styles.lectureDetail}>
              <MaterialIcons name="event" size={16} color="#666" />
              <Text style={styles.lectureDetailText}>{lecture.date} at {lecture.time}</Text>
            </View>

            <View style={styles.lectureDetail}>
              <MaterialIcons name="schedule" size={16} color="#666" />
              <Text style={styles.lectureDetailText}>{lecture.duration}</Text>
            </View>

            <View style={styles.lectureBottom}>
              <View style={styles.attendeesInfo}>
                <MaterialIcons name="people" size={16} color="#999" />
                <Text style={styles.attendeesText}>{lecture.attendees} attendees</Text>
              </View>
              {lecture.status !== 'completed' && (
                <TouchableOpacity
                  style={[styles.joinButton, lecture.status === 'live' && styles.joinButtonLive]}
                  onPress={() => handleJoinLecture(lecture)}
                >
                  <MaterialIcons name={getPlatformIcon(lecture.platform)} size={16} color="#FFFFFF" />
                  <Text style={styles.joinButtonText}>
                    {lecture.status === 'live' ? 'Join Now' : 'Set Reminder'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={selectedLecture !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedLecture(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedLecture?.title}</Text>
              <TouchableOpacity onPress={() => setSelectedLecture(null)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedLecture?.status || '') + '15', marginBottom: 16 }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(selectedLecture?.status || '') }]} />
                <Text style={[styles.statusText, { color: getStatusColor(selectedLecture?.status || '') }]}>
                  {getStatusLabel(selectedLecture?.status || '')}
                </Text>
              </View>

              <View style={styles.modalDetailRow}>
                <MaterialIcons name="person" size={20} color="#FF6B35" />
                <View style={styles.modalDetailInfo}>
                  <Text style={styles.modalDetailLabel}>Speaker</Text>
                  <Text style={styles.modalDetailValue}>{selectedLecture?.speaker}</Text>
                </View>
              </View>

              <View style={styles.modalDetailRow}>
                <MaterialIcons name="event" size={20} color="#FF6B35" />
                <View style={styles.modalDetailInfo}>
                  <Text style={styles.modalDetailLabel}>Date & Time</Text>
                  <Text style={styles.modalDetailValue}>{selectedLecture?.date} at {selectedLecture?.time}</Text>
                </View>
              </View>

              <View style={styles.modalDetailRow}>
                <MaterialIcons name="schedule" size={20} color="#FF6B35" />
                <View style={styles.modalDetailInfo}>
                  <Text style={styles.modalDetailLabel}>Duration</Text>
                  <Text style={styles.modalDetailValue}>{selectedLecture?.duration}</Text>
                </View>
              </View>

              <View style={styles.modalDetailRow}>
                <MaterialIcons name={getPlatformIcon(selectedLecture?.platform || 'zoom')} size={20} color="#FF6B35" />
                <View style={styles.modalDetailInfo}>
                  <Text style={styles.modalDetailLabel}>Platform</Text>
                  <Text style={styles.modalDetailValue}>{selectedLecture?.platform?.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{selectedLecture?.description}</Text>

              {selectedLecture?.status !== 'completed' && (
                <TouchableOpacity
                  style={[styles.modalJoinButton, selectedLecture?.status === 'live' && styles.joinButtonLive]}
                  onPress={() => selectedLecture && handleJoinLecture(selectedLecture)}
                >
                  <MaterialIcons name={getPlatformIcon(selectedLecture?.platform || 'zoom')} size={20} color="#FFFFFF" />
                  <Text style={styles.modalJoinText}>
                    {selectedLecture?.status === 'live' ? 'Join Now' : 'Set Reminder'}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  lectureCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  lectureTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  topicBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  topicText: { fontSize: 12, color: '#666', fontWeight: '500' },
  lectureTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 10 },
  lectureDetail: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  lectureDetailText: { fontSize: 13, color: '#666' },
  lectureBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  attendeesInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  attendeesText: { fontSize: 12, color: '#999' },
  joinButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FF6B35', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  joinButtonLive: { backgroundColor: '#FF5722' },
  joinButtonText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', flex: 1, marginRight: 12 },
  modalBody: { padding: 16 },
  modalDetailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  modalDetailInfo: { flex: 1 },
  modalDetailLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
  modalDetailValue: { fontSize: 15, color: '#1A1A1A', fontWeight: '500' },
  descriptionTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginTop: 8, marginBottom: 8 },
  descriptionText: { fontSize: 14, color: '#666', lineHeight: 22 },
  modalJoinButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FF6B35', paddingVertical: 14, borderRadius: 30, marginTop: 24, marginBottom: 16,
  },
  modalJoinText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});

export default LecturesScreen;
