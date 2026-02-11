/**
 * Shortcuts and Links Screen
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

interface ShortcutItem {
  id: string;
  title: string;
  icon: string;
}

const shortcutItems: ShortcutItem[] = [
  { id: '1', title: 'Civil Engineering Standards Lists', icon: '📋' },
  { id: '2', title: 'Dictionary', icon: '📖' },
  { id: '3', title: 'Symbols Library', icon: '🔣' },
  { id: '4', title: 'STAAD Pro shortcuts', icon: '⌨️' },
  { id: '5', title: 'Autocad shortcuts', icon: '🖥️' },
];

const ShortcutsLinksScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleItemPress = (_item: ShortcutItem) => {
    // Navigate to specific shortcut details
  };

  const renderShortcutItem = (item: ShortcutItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.listItem}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.listItemContent}>
        <Text style={styles.listItemIcon}>{item.icon}</Text>
        <Text style={styles.listItemTitle}>{item.title}</Text>
      </View>
      <Text style={styles.listItemArrow}>›</Text>
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
        <Text style={styles.headerTitle}>Shortcuts and Links</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {shortcutItems.map((item) => renderShortcutItem(item))}
        </View>
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
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  listItemTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    flex: 1,
  },
  listItemArrow: {
    fontSize: 24,
    color: '#999',
  },
});

export default ShortcutsLinksScreen;
