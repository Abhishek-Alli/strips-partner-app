/**
 * Dealer Converter Screen
 *
 * Unit converter with category selection, from/to units, and formula display
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { MaterialIcons } from '@expo/vector-icons';

interface ConversionCategory {
  id: string;
  name: string;
  icon: string;
}

interface ConversionUnit {
  id: string;
  name: string;
  symbol: string;
}

const categories: ConversionCategory[] = [
  { id: 'length', name: 'Length', icon: 'straighten' },
  { id: 'weight', name: 'Weight', icon: 'fitness-center' },
  { id: 'area', name: 'Area', icon: 'crop-square' },
  { id: 'volume', name: 'Volume', icon: 'water-drop' },
  { id: 'temperature', name: 'Temperature', icon: 'thermostat' },
];

const unitsByCategory: Record<string, ConversionUnit[]> = {
  length: [
    { id: 'mm', name: 'Millimeter', symbol: 'mm' },
    { id: 'cm', name: 'Centimeter', symbol: 'cm' },
    { id: 'm', name: 'Meter', symbol: 'm' },
    { id: 'km', name: 'Kilometer', symbol: 'km' },
    { id: 'in', name: 'Inch', symbol: 'in' },
    { id: 'ft', name: 'Foot', symbol: 'ft' },
    { id: 'yd', name: 'Yard', symbol: 'yd' },
  ],
  weight: [
    { id: 'mg', name: 'Milligram', symbol: 'mg' },
    { id: 'g', name: 'Gram', symbol: 'g' },
    { id: 'kg', name: 'Kilogram', symbol: 'kg' },
    { id: 'ton', name: 'Ton', symbol: 't' },
    { id: 'lb', name: 'Pound', symbol: 'lb' },
    { id: 'oz', name: 'Ounce', symbol: 'oz' },
  ],
  area: [
    { id: 'sqmm', name: 'Sq Millimeter', symbol: 'mm²' },
    { id: 'sqcm', name: 'Sq Centimeter', symbol: 'cm²' },
    { id: 'sqm', name: 'Sq Meter', symbol: 'm²' },
    { id: 'sqft', name: 'Sq Foot', symbol: 'ft²' },
    { id: 'sqyd', name: 'Sq Yard', symbol: 'yd²' },
    { id: 'acre', name: 'Acre', symbol: 'ac' },
  ],
  volume: [
    { id: 'ml', name: 'Milliliter', symbol: 'mL' },
    { id: 'l', name: 'Liter', symbol: 'L' },
    { id: 'cuft', name: 'Cubic Foot', symbol: 'ft³' },
    { id: 'cum', name: 'Cubic Meter', symbol: 'm³' },
    { id: 'gal', name: 'Gallon', symbol: 'gal' },
  ],
  temperature: [
    { id: 'c', name: 'Celsius', symbol: '°C' },
    { id: 'f', name: 'Fahrenheit', symbol: '°F' },
    { id: 'k', name: 'Kelvin', symbol: 'K' },
  ],
};

const conversionFactors: Record<string, Record<string, number>> = {
  length: { mm: 1, cm: 10, m: 1000, km: 1000000, in: 25.4, ft: 304.8, yd: 914.4 },
  weight: { mg: 1, g: 1000, kg: 1000000, ton: 1000000000, lb: 453592.37, oz: 28349.52 },
  area: { sqmm: 1, sqcm: 100, sqm: 1000000, sqft: 92903.04, sqyd: 836127.36, acre: 4046856422.4 },
  volume: { ml: 1, l: 1000, cuft: 28316.85, cum: 1000000, gal: 3785.41 },
};

const DealerConverterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [inputValue, setInputValue] = useState('1');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const convert = (): string => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '0';

    if (selectedCategory === 'temperature') {
      return convertTemperature(val).toFixed(4);
    }

    const factors = conversionFactors[selectedCategory];
    if (!factors) return '0';
    const fromFactor = factors[fromUnit] || 1;
    const toFactor = factors[toUnit] || 1;
    return ((val * fromFactor) / toFactor).toFixed(4);
  };

  const convertTemperature = (val: number): number => {
    if (fromUnit === toUnit) return val;
    let celsius = val;
    if (fromUnit === 'f') celsius = (val - 32) * 5 / 9;
    else if (fromUnit === 'k') celsius = val - 273.15;

    if (toUnit === 'c') return celsius;
    if (toUnit === 'f') return celsius * 9 / 5 + 32;
    return celsius + 273.15;
  };

  const getFormula = (): string => {
    const units = unitsByCategory[selectedCategory] || [];
    const from = units.find(u => u.id === fromUnit);
    const to = units.find(u => u.id === toUnit);
    if (!from || !to) return '';
    return `1 ${from.symbol} = ${selectedCategory === 'temperature'
      ? convertTemperature(1).toFixed(4)
      : ((conversionFactors[selectedCategory]?.[fromUnit] || 1) / (conversionFactors[selectedCategory]?.[toUnit] || 1)).toFixed(4)
    } ${to.symbol}`;
  };

  const units = unitsByCategory[selectedCategory] || [];
  const fromUnitObj = units.find(u => u.id === fromUnit);
  const toUnitObj = units.find(u => u.id === toUnit);
  const currentCategory = categories.find(c => c.id === selectedCategory);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const newUnits = unitsByCategory[catId] || [];
    if (newUnits.length >= 2) {
      setFromUnit(newUnits[0].id);
      setToUnit(newUnits[1].id);
    }
    setShowCategoryDropdown(false);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Converter</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Selector */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <View style={styles.dropdownContent}>
              <MaterialIcons name={currentCategory?.icon || 'straighten'} size={20} color="#FF6B35" />
              <Text style={styles.dropdownText}>{currentCategory?.name || 'Select'}</Text>
            </View>
            <MaterialIcons name={showCategoryDropdown ? 'expand-less' : 'expand-more'} size={24} color="#666" />
          </TouchableOpacity>
          {showCategoryDropdown && (
            <View style={styles.dropdownList}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.dropdownItem, selectedCategory === cat.id && styles.dropdownItemActive]}
                  onPress={() => handleCategoryChange(cat.id)}
                >
                  <MaterialIcons name={cat.icon} size={18} color={selectedCategory === cat.id ? '#FF6B35' : '#666'} />
                  <Text style={[styles.dropdownItemText, selectedCategory === cat.id && styles.dropdownItemTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Input Value */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Value</Text>
          <TextInput
            style={styles.valueInput}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="numeric"
            placeholder="Enter value"
            placeholderTextColor="#999"
          />
        </View>

        {/* From Unit */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>From</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => { setShowFromDropdown(!showFromDropdown); setShowToDropdown(false); }}
          >
            <Text style={styles.dropdownText}>{fromUnitObj?.name || 'Select'} ({fromUnitObj?.symbol})</Text>
            <MaterialIcons name={showFromDropdown ? 'expand-less' : 'expand-more'} size={24} color="#666" />
          </TouchableOpacity>
          {showFromDropdown && (
            <View style={styles.dropdownList}>
              {units.map(unit => (
                <TouchableOpacity
                  key={unit.id}
                  style={[styles.dropdownItem, fromUnit === unit.id && styles.dropdownItemActive]}
                  onPress={() => { setFromUnit(unit.id); setShowFromDropdown(false); }}
                >
                  <Text style={[styles.dropdownItemText, fromUnit === unit.id && styles.dropdownItemTextActive]}>
                    {unit.name} ({unit.symbol})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Swap Button */}
        <TouchableOpacity style={styles.swapButton} onPress={swapUnits}>
          <MaterialIcons name="swap-vert" size={28} color="#FF6B35" />
        </TouchableOpacity>

        {/* To Unit */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>To</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => { setShowToDropdown(!showToDropdown); setShowFromDropdown(false); }}
          >
            <Text style={styles.dropdownText}>{toUnitObj?.name || 'Select'} ({toUnitObj?.symbol})</Text>
            <MaterialIcons name={showToDropdown ? 'expand-less' : 'expand-more'} size={24} color="#666" />
          </TouchableOpacity>
          {showToDropdown && (
            <View style={styles.dropdownList}>
              {units.map(unit => (
                <TouchableOpacity
                  key={unit.id}
                  style={[styles.dropdownItem, toUnit === unit.id && styles.dropdownItemActive]}
                  onPress={() => { setToUnit(unit.id); setShowToDropdown(false); }}
                >
                  <Text style={[styles.dropdownItemText, toUnit === unit.id && styles.dropdownItemTextActive]}>
                    {unit.name} ({unit.symbol})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Result */}
        <View style={[styles.sectionCard, styles.resultCard]}>
          <Text style={styles.resultLabel}>Result</Text>
          <Text style={styles.resultValue}>
            {inputValue || '0'} {fromUnitObj?.symbol} = {convert()} {toUnitObj?.symbol}
          </Text>
        </View>

        {/* Formula */}
        <View style={[styles.sectionCard, styles.formulaCard]}>
          <Text style={styles.formulaLabel}>Formula</Text>
          <Text style={styles.formulaText}>{getFormula()}</Text>
        </View>

        <View style={{ height: 40 }} />
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
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  menuButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  valueInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  dropdownList: {
    marginTop: 8,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  dropdownItemActive: {
    backgroundColor: '#FFF5F2',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#1A1A1A',
  },
  dropdownItemTextActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  resultCard: {
    backgroundColor: '#FF6B35',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  formulaCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formulaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  formulaText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
});

export default DealerConverterScreen;
