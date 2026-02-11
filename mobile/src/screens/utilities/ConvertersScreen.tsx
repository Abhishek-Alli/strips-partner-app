/**
 * Unit Converters Screen
 * 
 * Convert between different units (length, area, weight, etc.)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
import { useTheme } from '../../theme';
import { utilitiesService, UnitConverter } from '../../services/utilitiesService';
import { logger } from '../../core/logger';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { Skeleton } from '../../components/loaders/Skeleton';

const ConvertersScreen: React.FC = () => {
  const theme = useTheme();
  const [converters, setConverters] = useState<UnitConverter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConverter, setSelectedConverter] = useState<UnitConverter | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    loadConverters();
  }, []);

  const loadConverters = async () => {
    setLoading(true);
    try {
      const response = await utilitiesService.getUnitConverters();
      setConverters(response.converters);
      if (response.converters.length > 0) {
        setSelectedConverter(response.converters[0]);
      }
    } catch (error) {
      logger.error('Failed to load converters', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!selectedConverter || !inputValue) {
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult(null);
      return;
    }

    try {
      const response = await utilitiesService.convertUnit(value, selectedConverter.id);
      setResult(response.result);
    } catch (error) {
      logger.error('Failed to convert unit', error as Error);
      setResult(null);
    }
  };

  useEffect(() => {
    if (inputValue && selectedConverter) {
      handleConvert();
    } else {
      setResult(null);
    }
  }, [inputValue, selectedConverter]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Skeleton width="100%" height={100} />
        <Skeleton width="100%" height={100} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Converter Selection */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Select Converter</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {converters.map(converter => (
            <TouchableOpacity
              key={converter.id}
              style={[
                styles.converterChip,
                {
                  backgroundColor: selectedConverter?.id === converter.id ? theme.colors.primary : theme.colors.background,
                  borderColor: theme.colors.border
                }
              ]}
              onPress={() => {
                setSelectedConverter(converter);
                setResult(null);
              }}
            >
              <Text style={{ color: selectedConverter?.id === converter.id ? '#fff' : theme.colors.text.primary }}>
                {converter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Conversion */}
      {selectedConverter && (
        <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Convert</Text>

          <View style={styles.conversionContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.unitLabel, { color: theme.colors.text.secondary }]}>
                {selectedConverter.fromUnit}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border
                  }
                ]}
                placeholder="Enter value"
                placeholderTextColor={theme.colors.text.secondary}
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType="numeric"
              />
            </View>

            <Text style={[styles.equals, { color: theme.colors.text.secondary }]}>→</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.unitLabel, { color: theme.colors.text.secondary }]}>
                {selectedConverter.toUnit}
              </Text>
              <View
                style={[
                  styles.resultBox,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border
                  }
                ]}
              >
                <Text style={[styles.resultText, { color: theme.colors.text.primary }]}>
                  {result !== null ? result.toFixed(4) : '-'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Converter List */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Available Converters</Text>
        {converters.map(converter => (
          <View key={converter.id} style={styles.converterItem}>
            <Text style={[styles.converterName, { color: theme.colors.text.primary }]}>
              {converter.name}
            </Text>
            <Text style={[styles.converterCategory, { color: theme.colors.text.secondary }]}>
              {converter.category}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  section: {
    margin: 16,
    padding: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  converterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8
  },
  conversionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  inputGroup: {
    flex: 1
  },
  unitLabel: {
    fontSize: 12,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  equals: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  resultBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
    justifyContent: 'center'
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600'
  },
  converterItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  converterName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4
  },
  converterCategory: {
    fontSize: 12
  }
});

export default ConvertersScreen;






