/**
 * Dealer Shortcuts and Links Screen
 *
 * Displays list of engineering shortcuts and reference links
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

interface ShortcutItem {
  id: string;
  title: string;
}

const shortcutItems: ShortcutItem[] = [
  { id: '1', title: 'Civil Engineering Standards Lists' },
  { id: '2', title: 'Civil Engineering Dictionary' },
  { id: '3', title: 'Civil Engineering Symbols Library' },
  { id: '4', title: 'STAAD Pro software shortcuts' },
  { id: '5', title: 'Autocad software Shortcuts' },
];

const DealerShortcutsLinksScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const handleItemPress = (_item: ShortcutItem) => {
    // Navigate to specific shortcut details
  };

  const renderShortcutItem = (item: ShortcutItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.listItem}
      onPress={() => handleItemPress(item)}
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
        <Text style={styles.headerTitle}>Shortcuts and links</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {shortcutItems.map((item) => renderShortcutItem(item))}
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
    padding: 16,
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
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

export default DealerShortcutsLinksScreen;
