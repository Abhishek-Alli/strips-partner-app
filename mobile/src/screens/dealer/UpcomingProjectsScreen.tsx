/**
 * Upcoming Projects Screen
 *
 * Card list of upcoming construction projects with location and status
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

interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  status: 'planning' | 'in_progress' | 'upcoming' | 'completed';
  startDate: string;
  estimatedCompletion: string;
  budget: string;
  category: string;
  materialsNeeded: string[];
}

const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Ganeshguri Flyover Extension',
    description: 'Extension of the existing flyover by 2km connecting to the new highway interchange. Major steel and concrete requirements.',
    location: 'Ganeshguri, Guwahati',
    status: 'upcoming',
    startDate: 'Mar 2026',
    estimatedCompletion: 'Dec 2027',
    budget: '₹120 Cr',
    category: 'Infrastructure',
    materialsNeeded: ['TMT Steel', 'Cement', 'Aggregate'],
  },
  {
    id: '2',
    title: 'Residential Township Phase 2',
    description: 'Phase 2 of the residential township project with 200 apartment units and community facilities.',
    location: 'Beltola, Guwahati',
    status: 'in_progress',
    startDate: 'Jan 2026',
    estimatedCompletion: 'Jun 2027',
    budget: '₹85 Cr',
    category: 'Residential',
    materialsNeeded: ['Steel', 'Cement', 'Bricks', 'Electrical'],
  },
  {
    id: '3',
    title: 'Commercial Complex',
    description: 'New commercial complex with 50 retail shops, office spaces, and underground parking facility.',
    location: 'Zoo Road, Guwahati',
    status: 'planning',
    startDate: 'Apr 2026',
    estimatedCompletion: 'Sep 2027',
    budget: '₹65 Cr',
    category: 'Commercial',
    materialsNeeded: ['Steel', 'Glass', 'Cement', 'Electrical'],
  },
  {
    id: '4',
    title: 'School Building Renovation',
    description: 'Complete renovation of the government school building including new classrooms and laboratory setup.',
    location: 'Panbazar, Guwahati',
    status: 'upcoming',
    startDate: 'May 2026',
    estimatedCompletion: 'Nov 2026',
    budget: '₹8 Cr',
    category: 'Educational',
    materialsNeeded: ['Cement', 'Steel', 'Paint', 'Furniture'],
  },
  {
    id: '5',
    title: 'Bridge Construction',
    description: 'New bridge over the river connecting two districts. Multi-span steel bridge with concrete piers.',
    location: 'North Guwahati',
    status: 'planning',
    startDate: 'Jul 2026',
    estimatedCompletion: 'Mar 2028',
    budget: '₹200 Cr',
    category: 'Infrastructure',
    materialsNeeded: ['Heavy Steel', 'Cement', 'Aggregate'],
  },
];

const UpcomingProjectsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return '#4CAF50';
      case 'upcoming': return '#2196F3';
      case 'planning': return '#FF9800';
      default: return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'upcoming': return 'Upcoming';
      case 'planning': return 'Planning';
      default: return 'Completed';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Infrastructure': return 'engineering';
      case 'Residential': return 'home';
      case 'Commercial': return 'business';
      case 'Educational': return 'school';
      default: return 'construction';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upcoming Projects</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sampleProjects.map(project => (
          <View key={project.id} style={styles.projectCard}>
            <View style={styles.cardTop}>
              <View style={styles.categoryBadge}>
                <MaterialIcons name={getCategoryIcon(project.category)} size={16} color="#FF6B35" />
                <Text style={styles.categoryText}>{project.category}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) + '15' }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(project.status) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(project.status) }]}>
                  {getStatusLabel(project.status)}
                </Text>
              </View>
            </View>

            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectDescription} numberOfLines={2}>{project.description}</Text>

            <View style={styles.detailRow}>
              <MaterialIcons name="location-on" size={16} color="#666" />
              <Text style={styles.detailText}>{project.location}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="date-range" size={16} color="#666" />
              <Text style={styles.detailText}>{project.startDate} - {project.estimatedCompletion}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="account-balance-wallet" size={16} color="#666" />
              <Text style={styles.detailText}>Budget: {project.budget}</Text>
            </View>

            <View style={styles.materialsRow}>
              <Text style={styles.materialsLabel}>Materials:</Text>
              <View style={styles.materialTags}>
                {project.materialsNeeded.map((material, index) => (
                  <View key={index} style={styles.materialTag}>
                    <Text style={styles.materialTagText}>{material}</Text>
                  </View>
                ))}
              </View>
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
  projectCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  categoryText: { fontSize: 13, color: '#FF6B35', fontWeight: '600' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  projectTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 6 },
  projectDescription: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  detailText: { fontSize: 13, color: '#666' },
  materialsRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  materialsLabel: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 },
  materialTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  materialTag: { backgroundColor: '#F5F5F5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  materialTagText: { fontSize: 12, color: '#666' },
});

export default UpcomingProjectsScreen;
