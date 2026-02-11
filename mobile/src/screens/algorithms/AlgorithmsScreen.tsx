/**
 * Algorithms Screen (Placeholder)
 * 
 * Future algorithms: Construction calculator, Budget estimation
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

const AlgorithmsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const algorithms = [
    {
      id: '1',
      title: 'Construction Calculator',
      description: 'Calculate area and material quantities',
      status: 'Available',
      screen: 'ConstructionCalculator'
    },
    {
      id: '2',
      title: 'Budget Estimator',
      description: 'Estimate project budgets and costs',
      status: 'Available',
      screen: 'BudgetEstimator'
    }
  ];

  const handlePress = (algorithm: typeof algorithms[0]) => {
    if (algorithm.screen && algorithm.status === 'Available') {
      navigation.navigate(algorithm.screen as never);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Future Algorithms</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
          Advanced calculation tools coming soon
        </Text>
      </View>

      {algorithms.map(algorithm => (
        <TouchableOpacity
          key={algorithm.id}
          style={[styles.algorithmCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => handlePress(algorithm)}
          disabled={algorithm.status !== 'Available'}
        >
          <Text style={[styles.algorithmTitle, { color: theme.colors.text.primary }]}>
            {algorithm.title}
          </Text>
          <Text style={[styles.algorithmDescription, { color: theme.colors.text.secondary }]}>
            {algorithm.description}
          </Text>
          <View style={[
            styles.statusBadge,
            {
              backgroundColor: algorithm.status === 'Available' ? theme.colors.primary : theme.colors.background
            }
          ]}>
            <Text style={[
              styles.statusText,
              { color: algorithm.status === 'Available' ? '#fff' : theme.colors.text.secondary }
            ]}>
              {algorithm.status}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 14
  },
  algorithmCard: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    ...(Platform.OS === 'android' && { elevation: 2 }),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    })
  },
  algorithmTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8
  },
  algorithmDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600'
  }
});

export default AlgorithmsScreen;

