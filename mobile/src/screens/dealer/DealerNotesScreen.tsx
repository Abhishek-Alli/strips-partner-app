/**
 * Dealer Notes Screen
 *
 * Simple notes/messages list with create functionality
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
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { MaterialIcons } from '@expo/vector-icons';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
}

const sampleNotes: Note[] = [
  { id: '1', title: 'Steel order follow-up', content: 'Follow up with NHAI for the TMT bar order. Need to check delivery schedule for next week.', date: 'Feb 10, 2026', color: '#FF6B35' },
  { id: '2', title: 'New supplier contact', content: 'Mr. Rajesh from ABC Steel - 9876543210. Offers competitive rates for Fe500 bars.', date: 'Feb 8, 2026', color: '#4CAF50' },
  { id: '3', title: 'Cement stock reminder', content: 'Reorder PPC cement when stock falls below 200 bags. Current stock: 350 bags.', date: 'Feb 5, 2026', color: '#2196F3' },
  { id: '4', title: 'Customer complaint', content: 'Address complaint from Mr. Amit regarding delayed delivery of electrical supplies. Promise resolution by Feb 15.', date: 'Feb 3, 2026', color: '#FF5722' },
  { id: '5', title: 'Meeting notes', content: 'Quarterly review meeting - discussed targets, new product lines, and marketing strategies for Q2.', date: 'Jan 30, 2026', color: '#9C27B0' },
];

const DealerNotesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [notes, setNotes] = useState(sampleNotes);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const handleAddNote = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }
    const colors = ['#FF6B35', '#4CAF50', '#2196F3', '#FF5722', '#9C27B0'];
    const newNote: Note = {
      id: String(notes.length + 1),
      title: newTitle,
      content: newContent,
      date: 'Just now',
      color: colors[notes.length % colors.length],
    };
    setNotes([newNote, ...notes]);
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setNotes(notes.filter(n => n.id !== noteId)) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notes</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notes.map(note => (
          <View key={note.id} style={styles.noteCard}>
            <View style={[styles.noteColorBar, { backgroundColor: note.color }]} />
            <View style={styles.noteContent}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <TouchableOpacity onPress={() => handleDeleteNote(note.id)}>
                  <MaterialIcons name="delete-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>
              <Text style={styles.noteText} numberOfLines={3}>{note.content}</Text>
              <Text style={styles.noteDate}>{note.date}</Text>
            </View>
          </View>
        ))}

        {notes.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="note" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No notes yet</Text>
          </View>
        )}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
        <MaterialIcons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Note Modal */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Note</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.titleInput}
              placeholder="Title"
              placeholderTextColor="#999"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.contentInput}
              placeholder="Write your note..."
              placeholderTextColor="#999"
              multiline
              value={newContent}
              onChangeText={setNewContent}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleAddNote}>
              <Text style={styles.saveButtonText}>Save Note</Text>
            </TouchableOpacity>
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
  noteCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 12, overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3 },
      android: { elevation: 1 },
    }),
  },
  noteColorBar: { width: 4 },
  noteContent: { flex: 1, padding: 14 },
  noteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  noteTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', flex: 1 },
  noteText: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 8 },
  noteDate: { fontSize: 12, color: '#999' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 12 },
  fab: {
    position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#FF6B35', alignItems: 'center', justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
      android: { elevation: 6 },
    }),
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  titleInput: {
    backgroundColor: '#F5F5F5', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: '#1A1A1A', marginBottom: 12,
  },
  contentInput: {
    backgroundColor: '#F5F5F5', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: '#1A1A1A', height: 120, textAlignVertical: 'top', marginBottom: 16,
  },
  saveButton: { backgroundColor: '#FF6B35', paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});

export default DealerNotesScreen;
