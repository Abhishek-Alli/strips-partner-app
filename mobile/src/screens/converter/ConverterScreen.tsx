/**
 * Converter Screen
 *
 * Unit conversion tool with length converter and formula display
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface UnitOption {
  id: string;
  name: string;
  symbol: string;
  toMeter: number; // Conversion factor to meters
}

const lengthUnits: UnitOption[] = [
  { id: 'mm', name: 'Millimeter', symbol: 'mm', toMeter: 0.001 },
  { id: 'cm', name: 'Centimeter', symbol: 'cm', toMeter: 0.01 },
  { id: 'm', name: 'Meter', symbol: 'm', toMeter: 1 },
  { id: 'km', name: 'Kilometer', symbol: 'km', toMeter: 1000 },
  { id: 'in', name: 'Inch', symbol: 'in', toMeter: 0.0254 },
  { id: 'ft', name: 'Feet', symbol: 'ft', toMeter: 0.3048 },
  { id: 'yd', name: 'Yard', symbol: 'yd', toMeter: 0.9144 },
  { id: 'mi', name: 'Mile', symbol: 'mi', toMeter: 1609.344 },
];

const ConverterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<UnitOption>(lengthUnits[2]); // Meter
  const [toUnit, setToUnit] = useState<UnitOption>(lengthUnits[5]); // Feet
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const convertValue = (): string => {
    const input = parseFloat(inputValue) || 0;
    const inMeters = input * fromUnit.toMeter;
    const result = inMeters / toUnit.toMeter;
    return result.toFixed(6).replace(/\.?0+$/, '');
  };

  const getFormula = (): string => {
    const ratio = (fromUnit.toMeter / toUnit.toMeter).toFixed(6).replace(/\.?0+$/, '');
    return `1 ${fromUnit.symbol} = ${ratio} ${toUnit.symbol}`;
  };

  const renderUnitPicker = (
    visible: boolean,
    onClose: () => void,
    onSelect: (unit: UnitOption) => void,
    selectedUnit: UnitOption
  ) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Unit</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {lengthUnits.map((unit) => (
              <TouchableOpacity
                key={unit.id}
                style={[
                  styles.unitOption,
                  selectedUnit.id === unit.id && styles.unitOptionSelected,
                ]}
                onPress={() => {
                  onSelect(unit);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.unitOptionText,
                    selectedUnit.id === unit.id && styles.unitOptionTextSelected,
                  ]}
                >
                  {unit.name} ({unit.symbol})
                </Text>
                {selectedUnit.id === unit.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Converter</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Converter Type */}
        <View style={styles.converterTypeContainer}>
          <Text style={styles.converterTypeLabel}>Length</Text>
        </View>

        {/* From Section */}
        <View style={styles.converterSection}>
          <Text style={styles.sectionLabel}>From</Text>
          <TouchableOpacity
            style={styles.unitSelector}
            onPress={() => setShowFromPicker(true)}
          >
            <Text style={styles.unitSelectorText}>
              {fromUnit.name} ({fromUnit.symbol})
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.valueInput}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="decimal-pad"
            placeholder="Enter value"
            placeholderTextColor="#999"
          />
        </View>

        {/* Swap Button */}
        <View style={styles.swapContainer}>
          <TouchableOpacity
            style={styles.swapButton}
            onPress={() => {
              const temp = fromUnit;
              setFromUnit(toUnit);
              setToUnit(temp);
            }}
          >
            <Text style={styles.swapIcon}>⇅</Text>
          </TouchableOpacity>
        </View>

        {/* To Section */}
        <View style={styles.converterSection}>
          <Text style={styles.sectionLabel}>To</Text>
          <TouchableOpacity
            style={styles.unitSelector}
            onPress={() => setShowToPicker(true)}
          >
            <Text style={styles.unitSelectorText}>
              {toUnit.name} ({toUnit.symbol})
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          <View style={styles.resultContainer}>
            <Text style={styles.resultValue}>{convertValue()}</Text>
            <Text style={styles.resultUnit}>{toUnit.symbol}</Text>
          </View>
        </View>

        {/* Formula */}
        <View style={styles.formulaContainer}>
          <Text style={styles.formulaLabel}>Formula</Text>
          <View style={styles.formulaBox}>
            <Text style={styles.formulaText}>{getFormula()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Unit Pickers */}
      {renderUnitPicker(
        showFromPicker,
        () => setShowFromPicker(false),
        setFromUnit,
        fromUnit
      )}
      {renderUnitPicker(
        showToPicker,
        () => setShowToPicker(false),
        setToUnit,
        toUnit
      )}
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
  converterTypeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  converterTypeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B35',
    textAlign: 'center',
  },
  converterSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  sectionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  unitSelectorText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  valueInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 14,
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  swapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#FFF5F2',
    borderRadius: 8,
    padding: 14,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FF6B35',
    flex: 1,
  },
  resultUnit: {
    fontSize: 16,
    color: '#FF6B35',
    marginLeft: 8,
  },
  formulaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
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
  formulaLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  formulaBox: {
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  formulaText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalClose: {
    fontSize: 28,
    color: '#666',
  },
  unitOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  unitOptionSelected: {
    backgroundColor: '#FFF5F2',
  },
  unitOptionText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  unitOptionTextSelected: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#FF6B35',
    fontWeight: '600',
  },
});

export default ConverterScreen;
