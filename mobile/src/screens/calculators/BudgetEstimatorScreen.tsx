/**
 * Budget Estimator Screen
 * 
 * Mobile UI for budget estimation
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
import { budgetService } from '../../services/budgetService';
import { calculatorService } from '../../services/calculatorService';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../../../shared/core/formatters/calculatorFormatters';
import { logger } from '../../core/logger';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { QualityGrade } from '../../../shared/core/algorithms/budget/costConstants';

const BudgetEstimatorScreen: React.FC = () => {
  const theme = useTheme();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Step 1: Area inputs
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [numberOfFloors, setNumberOfFloors] = useState('1');
  
  // Step 2: Location and quality
  const [location, setLocation] = useState('');
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('standard');
  
  // Results
  const [budgetResult, setBudgetResult] = useState<any>(null);
  const [areaResult, setAreaResult] = useState<any>(null);

  const handleStep1Next = () => {
    try {
      const lengthNum = parseFloat(length);
      const widthNum = parseFloat(width);
      
      if (isNaN(lengthNum) || isNaN(widthNum)) {
        Alert.alert('Error', 'Please enter valid length and width');
        return;
      }
      
      const plotArea = calculatorService.calculatePlotArea({
        length: lengthNum,
        width: widthNum,
        unit
      });
      
      const totalArea = parseFloat(numberOfFloors) > 1
        ? calculatorService.calculateMultiFloorArea(plotArea, parseFloat(numberOfFloors))
        : plotArea;
      
      setAreaResult(totalArea);
      setStep(2);
    } catch (error) {
      logger.error('Area calculation failed', error as Error);
      Alert.alert('Error', (error as Error).message || 'Calculation failed');
    }
  };

  const handleStep2Next = () => {
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter location');
      return;
    }
    
    setStep(3);
    calculateBudget();
  };

  const calculateBudget = () => {
    try {
      if (!areaResult) {
        Alert.alert('Error', 'Please complete step 1');
        return;
      }
      
      // Validate areaResult structure
      if (!areaResult.areaInSqFt || isNaN(areaResult.areaInSqFt) || areaResult.areaInSqFt <= 0) {
        Alert.alert('Error', 'Invalid area calculation. Please re-enter dimensions in step 1.');
        return;
      }
      
      if (!location || location.trim().length === 0) {
        Alert.alert('Error', 'Please enter a location');
        return;
      }
      
      const result = budgetService.estimateBudget(
        areaResult,
        location,
        qualityGrade
      );
      
      setBudgetResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Budget estimation failed', { error: errorMessage, areaResult, location, qualityGrade });
      Alert.alert('Error', errorMessage || 'Estimation failed. Please check your inputs and try again.');
    }
  };

  const getQualityColor = (grade: QualityGrade): string => {
    switch (grade) {
      case 'basic':
        return '#4CAF50';
      case 'standard':
        return '#2196F3';
      case 'premium':
        return '#FF9800';
      default:
        return theme.colors.primary;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <View style={[styles.step, step >= 1 && { backgroundColor: theme.colors.primary }]}>
          <Text style={{ color: step >= 1 ? '#fff' : theme.colors.text.secondary }}>1</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: step >= 2 ? theme.colors.primary : theme.colors.border }]} />
        <View style={[styles.step, step >= 2 && { backgroundColor: theme.colors.primary }]}>
          <Text style={{ color: step >= 2 ? '#fff' : theme.colors.text.secondary }}>2</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: step >= 3 ? theme.colors.primary : theme.colors.border }]} />
        <View style={[styles.step, step >= 3 && { backgroundColor: theme.colors.primary }]}>
          <Text style={{ color: step >= 3 ? '#fff' : theme.colors.text.secondary }}>3</Text>
        </View>
      </View>

      {/* Step 1: Area */}
      {step === 1 && (
        <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Step 1: Enter Area</Text>
          
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
            placeholder="Number of Floors"
            placeholderTextColor={theme.colors.text.secondary}
            value={numberOfFloors}
            onChangeText={setNumberOfFloors}
            keyboardType="numeric"
          />

          <PrimaryButton title="Next" onPress={handleStep1Next} fullWidth />
        </View>
      )}

      {/* Step 2: Location & Quality */}
      {step === 2 && (
        <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Step 2: Location & Quality</Text>
          
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text.primary, borderColor: theme.colors.border }]}
            placeholder="City/Location (e.g., Mumbai, Delhi)"
            placeholderTextColor={theme.colors.text.secondary}
            value={location}
            onChangeText={setLocation}
          />

          <Text style={[styles.label, { color: theme.colors.text.primary }]}>Quality Grade</Text>
          <View style={styles.qualitySelector}>
            {(['basic', 'standard', 'premium'] as QualityGrade[]).map((grade) => (
              <TouchableOpacity
                key={grade}
                style={[
                  styles.qualityButton,
                  {
                    backgroundColor: qualityGrade === grade ? getQualityColor(grade) : theme.colors.background,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={() => setQualityGrade(grade)}
              >
                <Text style={{ color: qualityGrade === grade ? '#fff' : theme.colors.text.primary, textTransform: 'capitalize' }}>
                  {grade}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <PrimaryButton title="Back" onPress={() => setStep(1)} style={styles.backButton} />
            <PrimaryButton title="Estimate" onPress={handleStep2Next} style={styles.nextButton} />
          </View>
        </View>
      )}

      {/* Step 3: Results */}
      {step === 3 && budgetResult && (
        <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Budget Estimate</Text>
          
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.summaryLabel, { color: theme.colors.text.secondary }]}>Total Estimated Cost</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
              {formatLargeNumber(budgetResult.totalCost)}
            </Text>
            <Text style={[styles.summarySubtext, { color: theme.colors.text.secondary }]}>
              {formatCurrency(budgetResult.costPerSqFt)} per sq ft
            </Text>
          </View>

          <Text style={[styles.breakdownTitle, { color: theme.colors.text.primary }]}>Cost Breakdown</Text>
          
          <View style={[styles.breakdownCard, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.breakdownItem, { color: theme.colors.text.primary }]}>
              Foundation: {formatLargeNumber(budgetResult.breakdown.foundation)}
            </Text>
            <Text style={[styles.breakdownItem, { color: theme.colors.text.primary }]}>
              Structure: {formatLargeNumber(budgetResult.breakdown.structure)}
            </Text>
            <Text style={[styles.breakdownItem, { color: theme.colors.text.primary }]}>
              Finishing: {formatLargeNumber(budgetResult.breakdown.finishing)}
            </Text>
            <Text style={[styles.breakdownItem, { color: theme.colors.text.primary }]}>
              Electrical: {formatLargeNumber(budgetResult.breakdown.electrical)}
            </Text>
            <Text style={[styles.breakdownItem, { color: theme.colors.text.primary }]}>
              Plumbing: {formatLargeNumber(budgetResult.breakdown.plumbing)}
            </Text>
            <Text style={[styles.breakdownItem, { color: theme.colors.text.primary }]}>
              Miscellaneous: {formatLargeNumber(budgetResult.breakdown.miscellaneous)}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>Area:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
              {budgetResult.area.sqFt.toLocaleString()} sq ft ({budgetResult.area.sqM.toLocaleString()} sq m)
            </Text>
            <Text style={[styles.infoLabel, { color: theme.colors.text.secondary, marginTop: 8 }]}>Quality:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text.primary, textTransform: 'capitalize' }]}>
              {budgetResult.qualityGrade}
            </Text>
            <Text style={[styles.infoLabel, { color: theme.colors.text.secondary, marginTop: 8 }]}>Location:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
              {budgetResult.location}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <PrimaryButton title="Start Over" onPress={() => {
              setStep(1);
              setBudgetResult(null);
              setAreaResult(null);
              setLength('');
              setWidth('');
              setLocation('');
            }} style={styles.backButton} />
            <PrimaryButton title="Recalculate" onPress={() => setStep(1)} style={styles.nextButton} />
          </View>
        </View>
      )}

      {/* Disclaimer */}
      <View style={[styles.disclaimer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.disclaimerText, { color: theme.colors.text.secondary }]}>
          ⚠️ These are approximate estimates. Actual costs may vary based on material prices, labor costs, site conditions, and market fluctuations. Consult with professionals for accurate estimates.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepLine: {
    width: 40,
    height: 2
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
  qualitySelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  qualityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8
  },
  backButton: {
    flex: 1
  },
  nextButton: {
    flex: 1
  },
  summaryCard: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 8
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4
  },
  summarySubtext: {
    fontSize: 14
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },
  breakdownCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16
  },
  breakdownItem: {
    fontSize: 14,
    marginBottom: 8
  },
  infoCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 16
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4
  },
  infoValue: {
    fontSize: 14,
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

export default BudgetEstimatorScreen;






