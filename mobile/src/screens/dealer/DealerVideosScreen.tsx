/**
 * Dealer Videos Screen
 *
 * Video library with category tabs and video list
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
  Image,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { MaterialIcons } from '@expo/vector-icons';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  url: string;
  date: string;
}

const categories = ['All', 'Home Design', 'Materials', 'Tools', 'Construction', 'Tips'];

const sampleVideos: Video[] = [
  {
    id: '1',
    title: 'How to choose the right cement',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    thumbnail: 'https://picsum.photos/320/180?random=70',
    duration: '12:30',
    category: 'Materials',
    url: '#',
    date: '2 days ago',
  },
  {
    id: '2',
    title: 'Modern home design trends 2025',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    thumbnail: 'https://picsum.photos/320/180?random=71',
    duration: '8:45',
    category: 'Home Design',
    url: '#',
    date: '5 days ago',
  },
  {
    id: '3',
    title: 'Essential tools for construction',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    thumbnail: 'https://picsum.photos/320/180?random=72',
    duration: '15:20',
    category: 'Tools',
    url: '#',
    date: '1 week ago',
  },
  {
    id: '4',
    title: 'Steel quality inspection guide',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    thumbnail: 'https://picsum.photos/320/180?random=73',
    duration: '10:15',
    category: 'Materials',
    url: '#',
    date: '1 week ago',
  },
  {
    id: '5',
    title: 'Building foundation basics',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    thumbnail: 'https://picsum.photos/320/180?random=74',
    duration: '20:00',
    category: 'Construction',
    url: '#',
    date: '2 weeks ago',
  },
];

const DealerVideosScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState('All');

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const filteredVideos = activeCategory === 'All'
    ? sampleVideos
    : sampleVideos.filter(v => v.category === activeCategory);

  const handlePlayVideo = (video: Video) => {
    if (video.url && video.url !== '#') {
      Linking.openURL(video.url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Videos</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, activeCategory === cat && styles.tabActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Videos List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredVideos.map(video => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => handlePlayVideo(video)}
          >
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
              <View style={styles.playOverlay}>
                <MaterialIcons name="play-circle-filled" size={48} color="rgba(255,255,255,0.9)" />
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{video.duration}</Text>
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
              <Text style={styles.videoDescription} numberOfLines={2}>{video.description}</Text>
              <View style={styles.videoMeta}>
                <Text style={styles.videoCategory}>{video.category}</Text>
                <Text style={styles.videoDate}>{video.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredVideos.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="video-library" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No videos in this category</Text>
          </View>
        )}

        <View style={{ height: 30 }} />
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  menuButton: {
    padding: 4,
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    maxHeight: 50,
  },
  tabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  tabActive: {
    backgroundColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 180,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoCategory: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  videoDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});

export default DealerVideosScreen;
