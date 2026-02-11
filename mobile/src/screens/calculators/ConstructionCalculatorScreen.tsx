/**
 * Construction Calculator Screen
 * 
 * Mobile UI for construction calculations
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { useTheme } from '../../theme';
import { calculatorService } from '../../services/calculatorService';
import { formatArea, formatVolume, formatWeight } from '../../../shared/core/formatters/calculatorFormatters';
import { logger } from '../../core/logger';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';

type CalculationType = 'area' | 'material';

const ConstructionCalculatorScreen: React.FC = () => {
  const theme = useTheme();
  const [calculationType, setCalculationType] = useState<CalculationType>('area');
  
  // Area calculation inputs
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [builtUpPercentage, setBuiltUpPercentage] = useState('70');
  const [carpetPercentage, setCarpetPercentage] = useState('75');
  const [numberOfFloors, setNumberOfFloors] = useState('1');
  
  // Material calculation inputs
  const [area, setArea] = useState('');
  const [thickness, setThickness] = useState('');
  const [thicknessUnit, setThicknessUnit] = useState<'ft' | 'm'>('m');
  const [cementRatio, setCementRatio] = useState('1');
  const [sandRatio, setSandRatio] = useState('2');
  const [aggregateRatio, setAggregateRatio] = useState('4');
  
  // Results
  const [areaResults, setAreaResults] = useState<any>(null);
  const [materialResults, setMaterialResults] = useState<any>(null);

  const handleAreaCalculation = () => {
    try {
      const lengthNum = parseFloat(length);
      const widthNum = parseFloat(width);
      
      if (isNaN(lengthNum) || isNaN(widthNum)) {
        Alert.alert('Error', 'Please enter valid length and width');
        return;
      }
      
      // Calculate plot area
      const plotArea = calculatorService.calculatePlotArea({
        length: lengthNum,
        width: widthNum,
        unit
      });
      
      // Calculate built-up area
      const builtUp = calculatorService.calculateBuiltUpArea(
        plotArea,
        parseFloat(builtUpPercentage) || 70
      );
      
      // Calculate carpet area
      const carpet = calculatorService.calculateCarpetArea(
        builtUp,
        parseFloat(carpetPercentage) || 75
      );
      
      // Calculate multi-floor if applicable
      const totalArea = parseFloat(numberOfFloors) > 1
        ? calculatorService.calculateMultiFloorArea(plotArea, parseFloat(numberOfFloors))
        : plotArea;
      
      setAreaResults({
        plotArea,
        builtUp,
        carpet,
        totalArea,
        floors: parseFloat(numberOfFloors)
      });
    } catch (error) {
      logger.error('Area calculation failed', error as Error);
      Alert.alert('Error', (error as Error).message || 'Calculation failed');
    }
  };

  const handleMaterialCalculation = () => {
    try {
      const areaNum = parseFloat(area);
      const thicknessNum = parseFloat(thickness);
      
      if (isNaN(areaNum) || isNaN(thicknessNum)) {
        Alert.alert('Error', 'Please enter valid area and thickness');
        return;
      }
      
      // Convert area to square meters if needed
      // Assuming area input is in same unit as thickness unit
      let areaSqM = areaNum;
      if (thicknessUnit === 'ft') {
        // Convert sq ft to sq m
        areaSqM = areaNum / 10.7639;
      }
      
      const result = calculatorService.calculateMaterialQuantities({
        area: areaSqM,
        thickness: thicknessNum,
        unit: thicknessUnit,
        mixRatio: {
          cement: parseFloat(cementRatio) || 1,
          sand: parseFloat(sandRatio) || 2,
          aggregate: parseFloat(aggregateRatio) || 4
        }
      });
      
      setMaterialResults(result);
    } catch (error) {
      logger.error('Material calculation failed', error as Error);
      Alert.alert('Error', (error as Error).message || 'Calculation failed');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Type Selection */}
      <View style={[styles.typeSelector, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            {
              backgroundColor: calculationType === 'area' ? theme.colors.primary : theme.colors.background,
              borderColor: theme.colors.border
            }
          ]}
          onPress={() => setCalculationType('area')}
        >
          <Text style={{ color: calculationType === 'area' ? '#fff' : theme.colors.text.primary }}>
            Area Calculator
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            {
              backgroundColor: calculationType === 'material' ? theme.colors.primary : theme.colors.background,
              borderColor: theme.colors.border
            }
          ]}
          onPress={() => setCalculationType('material')}
        >
          <Text style={{ color: calculationType === 'material' ? '#fff' : theme.colors.text.primary }}>
            Material Calculator
          </Text>
        </TouchableOpacity>
      </View>

      {/* Area Calculator */}
      {calculationType === 'area' && (
        <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Area Calculator</Text>
          
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: unit === 'ft' ? theme.colors.primary : theme.colors.background }
              ]}
              onPress={() => setUnit('ft')}
            >
              <Text style={{ color: unit === 'ft' ? '#fff' : theme.colors.text.primary }}>Feet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: unit === 'm' ? theme.colors.primary : theme.colors.background }
              ]}
              onPress={() => setUnit('m')}
            >
              <Text style={{ color: unit === 'm' ? '#fff' : theme.colors.text.primary }}>Meters</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
            placeholder={`Length (${unit})`}
            placeholderTextColor={theme.colors.text.secondary}
            value={length}
            onChangeText={setLength}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
            placeholder={`Width (${unit})`}
            placeholderTextColor={theme.colors.text.secondary}
            value={width}
            onChangeText={setWidth}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
            placeholder="Built-up % (default: 70)"
            placeholderTextColor={theme.colors.text.secondary}
            value={builtUpPercentage}
            onChangeText={setBuiltUpPercentage}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
            placeholder="Carpet % (default: 75)"
            placeholderTextColor={theme.colors.text.secondary}
            value={carpetPercentage}
            onChangeText={setCarpetPercentage}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
            placeholder="Number of Floors"
            placeholderTextColor={theme.colors.text.secondary}
            value={numberOfFloors}
            onChangeText={setNumberOfFloors}
            keyboardType="numeric"
          />

          <PrimaryButton title="Calculate" onPress={handleAreaCalculation} fullWidth />

          {areaResults && (
            <View style={styles.resultsContainer}>
              <Text style={[styles.resultTitle, { color: theme.colors.text.primary }]}>Results</Text>
              <View style={[styles.resultCard, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.resultLabel, { color: theme.colors.text.secondary }]}>Plot Area:</Text>
                <Text style={[styles.resultValue, { color: theme.colors.text.primary }]}>
                  {formatArea(areaResults.plotArea.areaInSqFt, 'sqft')}
                </Text>
              </View>
              <View style={[styles.resultCard, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.resultLabel, { color: theme.colors.text.secondary }]}>Built-up Area:</Text>
                <Text style={[styles.resultValue, { color: theme.colors.text.primary }]}>
                  {formatArea(areaResults.builtUp.areaInSqFt, 'sqft')}
                </Text>
              </View>
              <View style={[styles.resultCard, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.resultLabel, { color: theme.colors.text.secondary }]}>Carpet Area:</Text>
                <Text style={[styles.resultValue, { color: theme.colors.text.primary }]}>
                  {formatArea(areaResults.carpet.areaInSqFt, 'sqft')}
                </Text>
              </View>
              {areaResults.floors > 1 && (
                <View style={[styles.resultCard, { backgroundColor: theme.colors.background }]}>
                  <Text style={[styles.resultLabel, { color: theme.colors.text.secondary }]}>Total Area ({areaResults.floors} floors):</Text>
                  <Text style={[styles.resultValue, { color: theme.colors.text.primary }]}>
                    {formatArea(areaResults.totalArea.areaInSqFt, 'sqft')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {/* Material Calculator */}
      {calculationType === 'material' && (
        <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Material Calculator</Text>
          
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: thicknessUnit === 'ft' ? theme.colors.primary : theme.colors.background }
              ]}
              onPress={() => setThicknessUnit('ft')}
            >
              <Text style={{ color: thicknessUnit === 'ft' ? '#fff' : theme.colors.text.primary }}>Feet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: thicknessUnit === 'm' ? theme.colors.primary : theme.colors.background }
              ]}
              onPress={() => setThicknessUnit('m')}
            >
              <Text style={{ color: thicknessUnit === 'm' ? '#fff' : theme.colors.text.primary }}>Meters</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
            placeholder={`Area (sq ${thicknessUnit === 'ft' ? 'ft' : 'm'})`}
            placeholderTextColor={theme.colors.text.secondary}
            value={area}
            onChangeText={setArea}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
            placeholder={`Thickness (${thicknessUnit})`}
            placeholderTextColor={theme.colors.text.secondary}
            value={thickness}
            onChangeText={setThickness}
            keyboardType="numeric"
          />
          
          <Text style={[styles.label, { color: theme.colors.text.primary }]}>Mix Ratio (Cement : Sand : Aggregate)</Text>
          <View style={styles.ratioContainer}>
            <TextInput
              style={[styles.ratioInput, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
              placeholder="1"
              value={cementRatio}
              onChangeText={setCementRatio}
              keyboardType="numeric"
            />
            <Text style={{ color: theme.colors.text.primary }}>:</Text>
            <TextInput
              style={[styles.ratioInput, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
              placeholder="2"
              value={sandRatio}
              onChangeText={setSandRatio}
              keyboardType="numeric"
            />
            <Text style={{ color: theme.colors.text.primary }}>:</Text>
            <TextInput
              style={[styles.ratioInput, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
              placeholder="4"
              value={aggregateRatio}
              onChangeText={setAggregateRatio}
              keyboardType="numeric"
            />
          </View>

          <PrimaryButton title="Calculate" onPress={handleMaterialCalculation} fullWidth />

          {materialResults && (
            <View style={styles.resultsContainer}>
              <Text style={[styles.resultTitle, { color: theme.colors.text.primary }]}>Material Requirements</Text>
              <View style={[styles.resultCard, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.resultLabel, { color: theme.colors.text.secondary }]}>Cement:</Text>
                <Text style={[styles.resultValue, { color: theme.colors.text.primary }]}>
                  {materialResults.cement.bags} bags ({formatWeight(materialResults.cement.weight)})
                </Text>
              </View>
              <View style={[styles.resultCard, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.resultLabel, { color: theme.colors.text.secondary }]}>Sand:</Text>
                <Text style={[styles.resultValue, { color: theme.colors.text.primary }]}>
                  {formatVolume(materialResults.sand.volume, 'cum')} ({formatVolume(materialResults.sand.volumeInCft, 'cft')})
                </Text>
              </View>
              <View style={[styles.resultCard, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.resultLabel, { color: theme.colors.text.secondary }]}>Aggregate:</Text>
                <Text style={[styles.resultValue, { color: theme.colors.text.primary }]}>
                  {formatVolume(materialResults.aggregate.volume, 'cum')} ({formatVolume(materialResults.aggregate.volumeInCft, 'cft')})
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Disclaimer */}
      <View style={[styles.disclaimer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.disclaimerText, { color: theme.colors.text.secondary }]}>
          ⚠️ These are approximate estimates. Actual requirements may vary based on site conditions, material quality, and construction practices.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  typeSelector: {
    flexDirection: 'row',
    margin: 16,
    padding: 4,
    borderRadius: 8,
    borderWidth: 1
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1
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
  unitSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  unitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8
  },
  ratioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  ratioInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center'
  },
  resultsContainer: {
    marginTop: 20
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },
  resultCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  resultLabel: {
    fontSize: 14,
    marginBottom: 4
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600'
  },
  disclaimer: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18
  }
});

export default ConstructionCalculatorScreen;






