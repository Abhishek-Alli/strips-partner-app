/**
 * Trading Advices Screen
 *
 * Card list with trading tips, advice title, description, and date
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { MaterialIcons } from '@expo/vector-icons';

interface TradingAdvice {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  priority: 'high' | 'medium' | 'low';
}

const sampleAdvices: TradingAdvice[] = [
  {
    id: '1',
    title: 'Stock up on TMT bars before price hike',
    description: 'Market analysis suggests TMT bar prices are expected to rise by 5-8% in the next quarter due to increased demand in infrastructure projects. Consider increasing your inventory now.',
    category: 'Steel',
    date: 'Feb 10, 2026',
    author: 'Market Analysis Team',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Diversify your product portfolio',
    description: 'Dealers who offer a diverse range of products including steel, cement, electrical, and plumbing materials see 40% more customer retention. Consider adding complementary products.',
    category: 'Business',
    date: 'Feb 8, 2026',
    author: 'Business Advisory',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Cement prices stable - good buying window',
    description: 'Current cement prices are at a 6-month low. This is an ideal time to stock up on cement products, especially OPC and PPC grades that are in high demand.',
    category: 'Cement',
    date: 'Feb 5, 2026',
    author: 'Market Analysis Team',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Focus on digital customer engagement',
    description: 'Dealers leveraging digital platforms for customer interaction are seeing 25% more enquiries. Use social media and your dealer profile actively to engage with potential customers.',
    category: 'Marketing',
    date: 'Feb 3, 2026',
    author: 'Business Advisory',
    priority: 'low',
  },
  {
    id: '5',
    title: 'New government housing scheme announced',
    description: 'The government has announced a new affordable housing scheme that will boost demand for construction materials. Target areas near new project sites for maximum benefit.',
    category: 'Industry',
    date: 'Jan 30, 2026',
    author: 'Industry Updates',
    priority: 'high',
  },
];

const TradingAdvicesScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF5722';
      case 'medium': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Steel': return 'construction';
      case 'Business': return 'business';
      case 'Cement': return 'apartment';
      case 'Marketing': return 'campaign';
      case 'Industry': return 'factory';
      default: return 'lightbulb';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trading Advices</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sampleAdvices.map(advice => (
          <View key={advice.id} style={styles.adviceCard}>
            <View style={styles.cardHeader}>
              <View style={styles.categoryRow}>
                <View style={styles.categoryIcon}>
                  <MaterialIcons name={getCategoryIcon(advice.category)} size={20} color="#FF6B35" />
                </View>
                <Text style={styles.categoryText}>{advice.category}</Text>
              </View>
              <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(advice.priority) }]} />
            </View>

            <Text style={styles.adviceTitle}>{advice.title}</Text>
            <Text style={styles.adviceDescription}>{advice.description}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.authorText}>{advice.author}</Text>
              <Text style={styles.dateText}>{advice.date}</Text>
            </View>
          </View>
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
  adviceCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
  },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryIcon: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF5F2',
    alignItems: 'center', justifyContent: 'center',
  },
  categoryText: { fontSize: 13, color: '#FF6B35', fontWeight: '600' },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  adviceTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 },
  adviceDescription: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 12 },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
  },
  authorText: { fontSize: 12, color: '#999' },
  dateText: { fontSize: 12, color: '#999' },
});

export default TradingAdvicesScreen;
