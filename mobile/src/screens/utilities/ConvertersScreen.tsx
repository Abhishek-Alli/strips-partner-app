/**
 * Unit Converters Screen
 *
 * Full category-based converter: length, area, weight, volume, temperature
 * Dealer UI style — hardcoded colors, SafeAreaView, white cards
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { utilitiesService, ConverterCategory, ConverterUnit } from '../../services/utilitiesService';
import { logger } from '../../core/logger';

const ConvertersScreen: React.FC = () => {
  const [categories, setCategories] = useState<ConverterCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategoryId, setActiveCategoryId] = useState('length');
  const [fromUnit, setFromUnit] = useState<ConverterUnit | null>(null);
  const [toUnit, setToUnit]   = useState<ConverterUnit | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult]   = useState<string>('');
  const [formula, setFormula] = useState<string>('');
  const [converting, setConverting] = useState(false);

  // Modal state for unit picker
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget]   = useState<'from' | 'to'>('from');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await utilitiesService.getConverterCategories();
      setCategories(res.categories);
      const first = res.categories[0];
      if (first) {
        setActiveCategoryId(first.id);
        setFromUnit(first.units[0] || null);
        setToUnit(first.units[1] || null);
      }
    } catch (error) {
      logger.error('Failed to load converter categories', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const activeCategory = categories.find(c => c.id === activeCategoryId);

  const handleCategoryChange = (cat: ConverterCategory) => {
    setActiveCategoryId(cat.id);
    setFromUnit(cat.units[0] || null);
    setToUnit(cat.units[1] || null);
    setInputValue('');
    setResult('');
    setFormula('');
  };

  const handleSwap = () => {
    const tmp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tmp);
    setInputValue(result || '');
    setResult('');
  };

  const handleConvert = useCallback(async () => {
    if (!fromUnit || !toUnit || !inputValue.trim()) {
      setResult('');
      return;
    }
    const num = parseFloat(inputValue);
    if (isNaN(num)) { setResult('Invalid'); return; }
    if (fromUnit.id === toUnit.id) { setResult(inputValue); setFormula(`1 ${fromUnit.symbol} = 1 ${toUnit.symbol}`); return; }

    setConverting(true);
    try {
      const res = await utilitiesService.convertValue(activeCategoryId, fromUnit.id, toUnit.id, num);
      setResult(String(res.result));
      setFormula(res.formula || '');
    } catch (err) {
      logger.error('Conversion failed', err as Error);
      setResult('Error');
    } finally {
      setConverting(false);
    }
  }, [activeCategoryId, fromUnit, toUnit, inputValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleConvert();
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, fromUnit, toUnit, activeCategoryId]);

  const openPicker = (target: 'from' | 'to') => {
    setPickerTarget(target);
    setPickerVisible(true);
  };

  const selectUnit = (unit: ConverterUnit) => {
    if (pickerTarget === 'from') setFromUnit(unit);
    else setToUnit(unit);
    setPickerVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Category Tabs */}
      <View style={styles.categoryBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryTab, activeCategoryId === cat.id && styles.categoryTabActive]}
              onPress={() => handleCategoryChange(cat)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={[styles.categoryLabel, activeCategoryId === cat.id && styles.categoryLabelActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Converter Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{activeCategory?.icon} {activeCategory?.name} Converter</Text>

          {/* From */}
          <View style={styles.fieldRow}>
            <TouchableOpacity style={styles.unitPicker} onPress={() => openPicker('from')}>
              <Text style={styles.unitPickerText}>{fromUnit?.name || 'Select'}</Text>
              <Text style={styles.unitPickerSymbol}>{fromUnit?.symbol}</Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.valueInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Enter value"
              placeholderTextColor="#999"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>

          {/* Swap button */}
          <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
            <Text style={styles.swapIcon}>⇅</Text>
          </TouchableOpacity>

          {/* To */}
          <View style={styles.fieldRow}>
            <TouchableOpacity style={styles.unitPicker} onPress={() => openPicker('to')}>
              <Text style={styles.unitPickerText}>{toUnit?.name || 'Select'}</Text>
              <Text style={styles.unitPickerSymbol}>{toUnit?.symbol}</Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
            <View style={styles.resultBox}>
              {converting ? (
                <ActivityIndicator size="small" color="#FF6B35" />
              ) : (
                <Text style={styles.resultText} numberOfLines={1}>{result || '—'}</Text>
              )}
            </View>
          </View>

          {/* Formula */}
          {formula ? (
            <View style={styles.formulaBox}>
              <Text style={styles.formulaText}>{formula}</Text>
            </View>
          ) : null}
        </View>

        {/* Quick Reference */}
        {activeCategory && activeCategory.units.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Available Units</Text>
            <View style={styles.unitGrid}>
              {activeCategory.units.map(u => (
                <View key={u.id} style={styles.unitChip}>
                  <Text style={styles.unitChipSymbol}>{u.symbol}</Text>
                  <Text style={styles.unitChipName}>{u.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Unit Picker Modal */}
      <Modal visible={pickerVisible} transparent animationType="slide" onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {pickerTarget === 'from' ? 'From' : 'To'} Unit
              </Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={activeCategory?.units || []}
              keyExtractor={u => u.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => selectUnit(item)}>
                  <Text style={styles.modalItemSymbol}>{item.symbol}</Text>
                  <Text style={styles.modalItemName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryScroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    gap: 6,
  },
  categoryTabActive: {
    backgroundColor: '#FF6B35',
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    marginBottom: 8,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  unitPicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  unitPickerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  unitPickerSymbol: {
    fontSize: 13,
    color: '#FF6B35',
    fontWeight: '600',
    marginRight: 6,
  },
  chevron: {
    fontSize: 10,
    color: '#999',
  },
  valueInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
    textAlign: 'right',
  },
  swapButton: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  swapIcon: {
    fontSize: 20,
    color: '#FF6B35',
    fontWeight: '700',
  },
  resultBox: {
    flex: 1,
    backgroundColor: '#FFF5F2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    minHeight: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
  },
  formulaBox: {
    marginTop: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  formulaText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  unitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  unitChipSymbol: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B35',
  },
  unitChipName: {
    fontSize: 12,
    color: '#666',
  },
  bottomPadding: {
    height: Platform.OS === 'ios' ? 40 : 30,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalClose: {
    fontSize: 18,
    color: '#666',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
  },
  modalItemSymbol: {
    width: 50,
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
  },
  modalItemName: {
    fontSize: 15,
    color: '#1A1A1A',
  },
});

export default ConvertersScreen;
