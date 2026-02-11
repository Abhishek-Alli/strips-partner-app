/**
 * Education Posts Screen
 *
 * Educational articles and posts about construction materials and industry
 */

import React from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { MaterialIcons } from '@expo/vector-icons';

interface EducationPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
}

const samplePosts: EducationPost[] = [
  { id: '1', title: 'Understanding IS Standards for TMT Bars', excerpt: 'Learn about the various Indian Standards applicable to TMT bars used in construction. Covers IS 1786, testing requirements, and quality marks.', image: 'https://picsum.photos/400/200?random=100', category: 'Standards', readTime: '5 min read', date: 'Feb 9, 2026' },
  { id: '2', title: 'Types of Cement and Their Applications', excerpt: 'A comprehensive guide to different types of cement - OPC, PPC, PSC, and specialty cements. Know which cement to recommend for different projects.', image: 'https://picsum.photos/400/200?random=101', category: 'Materials', readTime: '8 min read', date: 'Feb 6, 2026' },
  { id: '3', title: 'Fire Safety in Construction Materials', excerpt: 'Understanding fire ratings, fire-resistant materials, and building code requirements for fire safety in construction.', image: 'https://picsum.photos/400/200?random=102', category: 'Safety', readTime: '6 min read', date: 'Feb 3, 2026' },
  { id: '4', title: 'Green Building Materials Guide', excerpt: 'Explore sustainable and eco-friendly building materials that are gaining popularity in modern construction projects.', image: 'https://picsum.photos/400/200?random=103', category: 'Sustainability', readTime: '7 min read', date: 'Jan 30, 2026' },
  { id: '5', title: 'Steel Corrosion Prevention', excerpt: 'Methods and best practices for preventing corrosion in steel structures. Galvanization, coatings, and cathodic protection explained.', image: 'https://picsum.photos/400/200?random=104', category: 'Maintenance', readTime: '4 min read', date: 'Jan 27, 2026' },
];

const EducationPostsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const { openDrawer: handleOpenDrawer } = useDrawer();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Education Posts</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {samplePosts.map(post => (
          <TouchableOpacity key={post.id} style={styles.postCard}>
            <Image source={{ uri: post.image }} style={styles.postImage} />
            <View style={styles.postInfo}>
              <View style={styles.postMeta}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{post.category}</Text>
                </View>
                <Text style={styles.readTime}>{post.readTime}</Text>
              </View>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postExcerpt} numberOfLines={2}>{post.excerpt}</Text>
              <Text style={styles.postDate}>{post.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 30 }} />
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
  postCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 16, overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  postImage: { width: '100%', height: 160 },
  postInfo: { padding: 14 },
  postMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { backgroundColor: '#FFF5F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  categoryText: { fontSize: 12, color: '#FF6B35', fontWeight: '600' },
  readTime: { fontSize: 12, color: '#999' },
  postTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 6 },
  postExcerpt: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 8 },
  postDate: { fontSize: 12, color: '#999' },
});

export default EducationPostsScreen;
