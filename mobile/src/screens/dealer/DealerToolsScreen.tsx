/**
 * Dealer Tools Screen (Mobile)
 *
 * Checklists, shortcuts, and read-only content
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

interface Tool {
  id: string;
  title: string;
  icon: string;
  screen: string;
}

const tools: Tool[] = [
  { id: '1', title: 'View Checklists', icon: '✓', screen: 'DealerViewChecklist' },
  { id: '2', title: 'Shortcuts & Links', icon: '🔗', screen: 'DealerShortcutsLinks' },
];

const DealerToolsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const handleToolPress = (tool: Tool) => {
    navigation.navigate(tool.screen);
  };

  const renderToolCard = (tool: Tool) => (
    <TouchableOpacity
      key={tool.id}
      style={styles.toolCard}
      onPress={() => handleToolPress(tool)}
    >
      <Text style={styles.toolIcon}>{tool.icon}</Text>
      <Text style={styles.toolTitle}>{tool.title}</Text>
      <Text style={styles.toolArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tools</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.toolsContainer}>
          {tools.map((tool) => renderToolCard(tool))}
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
  toolsContainer: {
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
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  toolIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  toolTitle: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  toolArrow: {
    fontSize: 22,
    color: '#999',
  },
  bottomPadding: {
    height: 30,
  },
});

export default DealerToolsScreen;
