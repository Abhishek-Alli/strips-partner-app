/**
 * View Checklist Screen
 *
 * Shows list of available checklists organized by category
 * Each item navigates to detailed checklist view
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

interface ChecklistItem {
  id: string;
  title: string;
}

// Sample checklist items
const checklists: ChecklistItem[] = [
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

const ViewChecklistScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleChecklistPress = (item: ChecklistItem) => {
    navigation.navigate('ChecklistDetail' as never, {
      checklistId: item.id,
      title: item.title,
    } as never);
  };

  const handleMenuPress = () => {
    // Open drawer or menu
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>View Checklist</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Text style={styles.menuIcon}>≡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {checklists.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.checklistItem}
            onPress={() => handleChecklistPress(item)}
          >
            <Text style={styles.checklistTitle}>{item.title}</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  menuButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checklistTitle: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  arrowIcon: {
    fontSize: 24,
    color: '#CCC',
  },
  bottomPadding: {
    height: 40,
  },
});

export default ViewChecklistScreen;
