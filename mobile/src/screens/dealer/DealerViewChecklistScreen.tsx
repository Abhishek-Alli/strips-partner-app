/**
 * Dealer View Checklist Screen
 *
 * Displays list of checklists with navigation arrows
 */

import React from 'react';
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

interface ChecklistItem {
  id: string;
  title: string;
}

const checklistItems: ChecklistItem[] = [
  { id: '1', title: 'Civil engineering checklists' },
  { id: '2', title: 'RCC formwork checklist' },
  { id: '3', title: 'RCC Reinforcement Checklist' },
  { id: '4', title: 'Pre Concreting Checklist' },
  { id: '5', title: 'Grading plan checklist' },
  { id: '6', title: 'Paving plan checklist' },
  { id: '7', title: 'Drainage area map checklist.' },
  { id: '8', title: 'Plastering checklist.' },
  { id: '9', title: 'Tiling checklist.' },
  { id: '10', title: 'Wall painting checklist.' },
  { id: '11', title: 'Granite / Marble laying checklist.' },
  { id: '12', title: 'Side walk plan checklist.' },
  { id: '13', title: 'Street light and street sign plan checklist' },
  { id: '14', title: 'Sanitary sewer plan checklist' },
];

const DealerViewChecklistScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const handleChecklistPress = (item: ChecklistItem) => {
    navigation.navigate('DealerChecklistDetail', { checklist: item });
  };

  const renderChecklistItem = (item: ChecklistItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.listItem}
      onPress={() => handleChecklistPress(item)}
    >
      <Text style={styles.listItemText}>{item.title}</Text>
      <Text style={styles.listItemArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>View Checklist</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {checklistItems.map((item) => renderChecklistItem(item))}
        </View>
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
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listItemText: {
    fontSize: 15,
    color: '#1A1A1A',
    flex: 1,
    paddingRight: 16,
  },
  listItemArrow: {
    fontSize: 22,
    color: '#999',
  },
  bottomPadding: {
    height: 30,
  },
});

export default DealerViewChecklistScreen;
