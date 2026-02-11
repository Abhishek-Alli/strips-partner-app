/**
 * Videos Screen
 * 
 * Educational YouTube videos categorized by topic
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Linking
} from 'react-native';
import { useTheme } from '../../theme';
import { utilitiesService, Video } from '../../services/utilitiesService';
import { logger } from '../../core/logger';
import { Skeleton } from '../../components/loaders/Skeleton';

const VideosScreen: React.FC = () => {
  const theme = useTheme();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const categories = ['Foundation', 'Structure', 'Plumbing', 'Electrical', 'Finishing'];

  useEffect(() => {
    loadVideos();
  }, [selectedCategory]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const response = await utilitiesService.getVideos(selectedCategory);
      setVideos(response.videos);
    } catch (error) {
      logger.error('Failed to load videos', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const openVideo = (youtubeId: string) => {
    const url = `https://www.youtube.com/watch?v=${youtubeId}`;
    Linking.openURL(url).catch(err => {
      logger.error('Failed to open video', err as Error);
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Skeleton width="100%" height={150} />
        <Skeleton width="100%" height={150} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            {
              backgroundColor: !selectedCategory ? theme.colors.primary : theme.colors.card,
              borderColor: theme.colors.border
            }
          ]}
          onPress={() => setSelectedCategory(undefined)}
        >
          <Text style={{ color: !selectedCategory ? '#fff' : theme.colors.text.primary }}>All</Text>
        </TouchableOpacity>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === category ? theme.colors.primary : theme.colors.card,
                borderColor: theme.colors.border
              }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={{ color: selectedCategory === category ? '#fff' : theme.colors.text.primary }}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Videos List */}
      <ScrollView style={styles.videosContainer}>
        {videos.map(video => (
          <TouchableOpacity
            key={video.id}
            style={[styles.videoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => openVideo(video.youtubeId)}
          >
            <View style={[styles.thumbnailContainer, { backgroundColor: theme.colors.background }]}>
              <Image
                source={{ uri: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Text style={[styles.videoTitle, { color: theme.colors.text.primary }]} numberOfLines={2}>
                {video.title}
              </Text>
              {video.description && (
                <Text style={[styles.videoDescription, { color: theme.colors.text.secondary }]} numberOfLines={2}>
                  {video.description}
                </Text>
              )}
              <Text style={[styles.videoCategory, { color: theme.colors.primary }]}>{video.category}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  categoryContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  categoryContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1
  },
  videosContainer: {
    flex: 1,
    padding: 12
  },
  videoCard: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    })
  },
  thumbnailContainer: {
    width: 160,
    height: 90,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnail: {
    width: '100%',
    height: '100%'
  },
  playButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  playIcon: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 4
  },
  videoInfo: {
    flex: 1,
    padding: 12
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4
  },
  videoDescription: {
    fontSize: 12,
    marginBottom: 4,
    lineHeight: 16
  },
  videoCategory: {
    fontSize: 12,
    fontWeight: '600'
  }
});

export default VideosScreen;






