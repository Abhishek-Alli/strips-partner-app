/**
 * Videos Screen
 *
 * Displays videos with category tabs (Home Design, Materials, Tools)
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
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  views: string;
  category: string;
}

const categories = ['Home Design', 'Materials', 'Tools'];

const sampleVideos: VideoItem[] = [
  {
    id: '1',
    title: 'Modern Home Interior Design Ideas',
    duration: '12:45',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    views: '2.5K views',
    category: 'Home Design',
  },
  {
    id: '2',
    title: 'Kitchen Renovation Tips 2024',
    duration: '08:30',
    thumbnail: 'https://picsum.photos/400/225?random=2',
    views: '1.8K views',
    category: 'Home Design',
  },
  {
    id: '3',
    title: 'Best Building Materials Guide',
    duration: '15:20',
    thumbnail: 'https://picsum.photos/400/225?random=3',
    views: '3.2K views',
    category: 'Materials',
  },
  {
    id: '4',
    title: 'Cement Types and Uses',
    duration: '10:15',
    thumbnail: 'https://picsum.photos/400/225?random=4',
    views: '4.1K views',
    category: 'Materials',
  },
  {
    id: '5',
    title: 'Essential Power Tools for Construction',
    duration: '18:00',
    thumbnail: 'https://picsum.photos/400/225?random=5',
    views: '5.0K views',
    category: 'Tools',
  },
  {
    id: '6',
    title: 'How to Use a Level Properly',
    duration: '06:45',
    thumbnail: 'https://picsum.photos/400/225?random=6',
    views: '2.1K views',
    category: 'Tools',
  },
];

const VideosScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState('Home Design');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleVideoPress = (_video: VideoItem) => {
    // Navigate to video player
  };

  const filteredVideos = sampleVideos.filter(
    (video) => video.category === activeCategory
  );

  const renderVideoCard = (video: VideoItem) => (
    <TouchableOpacity
      key={video.id}
      style={styles.videoCard}
      onPress={() => handleVideoPress(video)}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
        <View style={styles.playButton}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={styles.videoViews}>{video.views}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Videos</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.tab,
                activeCategory === category && styles.tabActive,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeCategory === category && styles.tabTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Videos List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredVideos.map((video) => renderVideoCard(video))}
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    overflow: 'hidden',
    marginBottom: 16,
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
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: (width - 32) * 0.5625, // 16:9 aspect ratio
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -24,
    marginLeft: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,107,53,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    lineHeight: 22,
  },
  videoViews: {
    fontSize: 13,
    color: '#666',
  },
  bottomPadding: {
    height: 20,
  },
});

export default VideosScreen;
