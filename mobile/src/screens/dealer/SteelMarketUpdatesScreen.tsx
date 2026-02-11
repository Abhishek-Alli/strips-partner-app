/**
 * Steel Market Updates Screen
 *
 * Posts with images showing steel market prices and trends
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
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { MaterialIcons } from '@expo/vector-icons';

interface MarketUpdate {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  source: string;
  trend: 'up' | 'down' | 'stable';
  priceChange: string;
}

const sampleUpdates: MarketUpdate[] = [
  {
    id: '1',
    title: 'TMT Bar prices rise by 3%',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    image: 'https://picsum.photos/400/200?random=90',
    date: '2 hours ago',
    source: 'Steel Market India',
    trend: 'up',
    priceChange: '+₹1,200/ton',
  },
  {
    id: '2',
    title: 'Cement prices remain stable',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    image: 'https://picsum.photos/400/200?random=91',
    date: '5 hours ago',
    source: 'Construction Weekly',
    trend: 'stable',
    priceChange: '₹0/bag',
  },
  {
    id: '3',
    title: 'Steel rod demand increases in Q4',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    image: 'https://picsum.photos/400/200?random=92',
    date: '1 day ago',
    source: 'Metal Bulletin',
    trend: 'up',
    priceChange: '+₹800/ton',
  },
  {
    id: '4',
    title: 'Flat steel prices dip slightly',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: 'https://picsum.photos/400/200?random=93',
    date: '2 days ago',
    source: 'Steel Market India',
    trend: 'down',
    priceChange: '-₹500/ton',
  },
];

const SteelMarketUpdatesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedUpdate, setSelectedUpdate] = useState<MarketUpdate | null>(null);

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#4CAF50';
      case 'down': return '#FF5722';
      default: return '#FF9800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'trending-flat';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Steel Market Updates</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sampleUpdates.map(update => (
          <TouchableOpacity
            key={update.id}
            style={styles.updateCard}
            onPress={() => setSelectedUpdate(update)}
          >
            <Image source={{ uri: update.image }} style={styles.updateImage} />
            <View style={styles.updateInfo}>
              <View style={styles.updateHeader}>
                <Text style={styles.updateTitle} numberOfLines={2}>{update.title}</Text>
                <View style={[styles.trendBadge, { backgroundColor: getTrendColor(update.trend) + '15' }]}>
                  <MaterialIcons name={getTrendIcon(update.trend)} size={16} color={getTrendColor(update.trend)} />
                  <Text style={[styles.trendText, { color: getTrendColor(update.trend) }]}>
                    {update.priceChange}
                  </Text>
                </View>
              </View>
              <Text style={styles.updateContent} numberOfLines={2}>{update.content}</Text>
              <View style={styles.updateMeta}>
                <Text style={styles.updateSource}>{update.source}</Text>
                <Text style={styles.updateDate}>{update.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={selectedUpdate !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedUpdate(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedUpdate?.title}</Text>
                <TouchableOpacity onPress={() => setSelectedUpdate(null)}>
                  <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <Image source={{ uri: selectedUpdate?.image || '' }} style={styles.modalImage} />

              <View style={styles.modalBody}>
                <View style={[styles.trendBadgeLarge, { backgroundColor: getTrendColor(selectedUpdate?.trend || 'stable') + '15' }]}>
                  <MaterialIcons
                    name={getTrendIcon(selectedUpdate?.trend || 'stable')}
                    size={20}
                    color={getTrendColor(selectedUpdate?.trend || 'stable')}
                  />
                  <Text style={[styles.trendTextLarge, { color: getTrendColor(selectedUpdate?.trend || 'stable') }]}>
                    {selectedUpdate?.priceChange}
                  </Text>
                </View>

                <Text style={styles.modalContentText}>{selectedUpdate?.content}</Text>

                <View style={styles.modalMeta}>
                  <Text style={styles.modalSource}>Source: {selectedUpdate?.source}</Text>
                  <Text style={styles.modalDate}>{selectedUpdate?.date}</Text>
                </View>
              </View>
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
  updateCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 16, overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  updateImage: { width: '100%', height: 160 },
  updateInfo: { padding: 12 },
  updateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  updateTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', flex: 1, marginRight: 8 },
  trendBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  trendText: { fontSize: 12, fontWeight: '600' },
  updateContent: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 8 },
  updateMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  updateSource: { fontSize: 12, color: '#FF6B35', fontWeight: '500' },
  updateDate: { fontSize: 12, color: '#999' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', flex: 1, marginRight: 12 },
  modalImage: { width: '100%', height: 200 },
  modalBody: { padding: 16 },
  trendBadgeLarge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, alignSelf: 'flex-start', marginBottom: 16,
  },
  trendTextLarge: { fontSize: 16, fontWeight: '700' },
  modalContentText: { fontSize: 15, color: '#333', lineHeight: 22, marginBottom: 16 },
  modalMeta: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  modalSource: { fontSize: 13, color: '#FF6B35', fontWeight: '500' },
  modalDate: { fontSize: 13, color: '#999' },
});

export default SteelMarketUpdatesScreen;
