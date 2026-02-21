/**
 * Budget Estimator Screen
 *
 * 3-step wizard: area → location & quality → results.
 * Shows materialCost + laborCost separately.
 * Dealer UI style — no useTheme(), no PrimaryButton.
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
  Platform,
  SafeAreaView,
  StatusBar,
  Modal,
  FlatList,
} from 'react-native';
import { budgetService } from '../../services/budgetService';
import { calculatorService } from '../../services/calculatorService';
import {
  formatCurrency,
  formatLargeNumber,
} from '../../../../shared/core/formatters/calculatorFormatters';
import { QualityGrade, CITY_LIST } from '../../../../shared/core/algorithms/budget/costConstants';
import { logger } from '../../core/logger';

const QUALITY_OPTIONS: { grade: QualityGrade; label: string; color: string; desc: string }[] = [
  { grade: 'basic',    label: 'Basic',    color: '#4CAF50', desc: '₹800–₹1,200 / sq ft' },
  { grade: 'standard', label: 'Standard', color: '#2196F3', desc: '₹1,200–₹1,800 / sq ft' },
  { grade: 'premium',  label: 'Premium',  color: '#FF9800', desc: '₹1,800–₹2,500 / sq ft' },
];

const BudgetEstimatorScreen: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Area
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [floors, setFloors] = useState('1');

  // Step 2: Location & Quality
  const [city, setCity] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [quality, setQuality] = useState<QualityGrade>('standard');

  // Results
  const [areaResult, setAreaResult] = useState<any>(null);
  const [budgetResult, setBudgetResult] = useState<any>(null);

  const filteredCities = CITY_LIST.filter(c =>
    c.toLowerCase().includes(citySearch.toLowerCase()),
  );

  const handleStep1 = () => {
    try {
      const l = parseFloat(length), w = parseFloat(width);
      if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) {
        Alert.alert('Error', 'Enter valid length and width');
        return;
      }
      const plot = calculatorService.calculatePlotArea({ length: l, width: w, unit });
      const numFloors = parseFloat(floors) || 1;
      const total = numFloors > 1
        ? calculatorService.calculateMultiFloorArea(plot, numFloors)
        : plot;
      setAreaResult(total);
      setStep(2);
    } catch (e) {
      logger.error('Area calc', e as Error);
      Alert.alert('Error', (e as Error).message);
    }
  };

  const handleStep2 = () => {
    if (!city.trim()) { Alert.alert('Error', 'Please select a city'); return; }
    try {
      if (!areaResult?.areaInSqFt || areaResult.areaInSqFt <= 0) {
        Alert.alert('Error', 'Invalid area — go back to Step 1');
        return;
      }
      const result = budgetService.estimateBudget(areaResult, city, quality);
      setBudgetResult(result);
      setStep(3);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      logger.error('Budget estimate', { error: msg, city, quality });
      Alert.alert('Error', msg || 'Estimation failed');
    }
  };

  const reset = () => {
    setStep(1);
    setLength(''); setWidth(''); setFloors('1'); setUnit('ft');
    setCity(''); setCitySearch('');
    setAreaResult(null); setBudgetResult(null);
  };

  // ── Step indicator ───────────────────────────────────────────
  const StepDot = ({ n }: { n: number }) => (
    <View style={[styles.stepDot, step >= n && styles.stepDotActive]}>
      <Text style={[styles.stepDotText, step >= n && styles.stepDotTextActive]}>{n}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Step Indicator */}
        <View style={styles.stepRow}>
          <StepDot n={1} />
          <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
          <StepDot n={2} />
          <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
          <StepDot n={3} />
        </View>
        <View style={styles.stepLabels}>
          <Text style={styles.stepLabelText}>Area</Text>
          <Text style={styles.stepLabelText}>Details</Text>
          <Text style={styles.stepLabelText}>Result</Text>
        </View>

        {/* ── STEP 1: Area ─────────────────── */}
        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Step 1: Enter Area</Text>

            {/* Unit toggle */}
            <View style={styles.toggleRow}>
              {([{ label: 'Feet', value: 'ft' }, { label: 'Meters', value: 'm' }] as const).map(o => (
                <TouchableOpacity
                  key={o.value}
                  style={[styles.toggle, unit === o.value && styles.toggleActive]}
                  onPress={() => setUnit(o.value)}
                >
                  <Text style={[styles.toggleText, unit === o.value && styles.toggleTextActive]}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Length ({unit})</Text>
            <TextInput style={styles.input} value={length} onChangeText={setLength} keyboardType="numeric" placeholder={`Length in ${unit}`} placeholderTextColor="#999" />

            <Text style={styles.fieldLabel}>Width ({unit})</Text>
            <TextInput style={styles.input} value={width} onChangeText={setWidth} keyboardType="numeric" placeholder={`Width in ${unit}`} placeholderTextColor="#999" />

            <Text style={styles.fieldLabel}>Number of Floors</Text>
            <TextInput style={styles.input} value={floors} onChangeText={setFloors} keyboardType="numeric" placeholder="1" placeholderTextColor="#999" />

            <TouchableOpacity style={styles.btn} onPress={handleStep1}>
              <Text style={styles.btnText}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 2: Location & Quality ────── */}
        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Step 2: Location & Quality</Text>

            <Text style={styles.fieldLabel}>City / Location</Text>
            <TouchableOpacity style={styles.cityPicker} onPress={() => setShowCityPicker(true)}>
              <Text style={city ? styles.cityPickerText : styles.cityPickerPlaceholder}>
                {city ? city.charAt(0).toUpperCase() + city.slice(1) : 'Select a city...'}
              </Text>
              <Text style={styles.cityPickerArrow}>▼</Text>
            </TouchableOpacity>

            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Quality Grade</Text>
            {QUALITY_OPTIONS.map(q => (
              <TouchableOpacity
                key={q.grade}
                style={[styles.qualityCard, quality === q.grade && { borderColor: q.color, borderWidth: 2 }]}
                onPress={() => setQuality(q.grade)}
              >
                <View style={[styles.qualityDot, { backgroundColor: q.color }]} />
                <View style={styles.qualityInfo}>
                  <Text style={styles.qualityLabel}>{q.label}</Text>
                  <Text style={styles.qualityDesc}>{q.desc}</Text>
                </View>
                {quality === q.grade && (
                  <Text style={[styles.qualityCheck, { color: q.color }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => setStep(1)}>
                <Text style={styles.btnSecondaryText}>← Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={handleStep2}>
                <Text style={styles.btnText}>Estimate →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── STEP 3: Results ──────────────── */}
        {step === 3 && budgetResult && (
          <View>
            {/* Total cost hero card */}
            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>Total Estimated Cost</Text>
              <Text style={styles.heroValue}>{formatLargeNumber(budgetResult.totalCost)}</Text>
              <Text style={styles.heroSub}>
                {formatCurrency(budgetResult.costPerSqFt)} / sq ft
                {budgetResult.locationMultiplier && ` · Location factor: ${budgetResult.locationMultiplier}×`}
              </Text>
            </View>

            {/* Material vs Labour split */}
            {(budgetResult.materialCost || budgetResult.laborCost) && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Cost Split</Text>
                <View style={styles.splitRow}>
                  <View style={[styles.splitCard, { borderColor: '#4CAF50' }]}>
                    <Text style={styles.splitIcon}>🧱</Text>
                    <Text style={styles.splitLabel}>Material</Text>
                    <Text style={styles.splitValue}>{formatLargeNumber(budgetResult.materialCost)}</Text>
                  </View>
                  <View style={[styles.splitCard, { borderColor: '#2196F3' }]}>
                    <Text style={styles.splitIcon}>👷</Text>
                    <Text style={styles.splitLabel}>Labour</Text>
                    <Text style={styles.splitValue}>{formatLargeNumber(budgetResult.laborCost)}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Breakdown */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Cost Breakdown</Text>
              {Object.entries(budgetResult.breakdown).map(([key, val]) => (
                <View key={key} style={styles.breakRow}>
                  <Text style={styles.breakLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <Text style={styles.breakValue}>{formatLargeNumber(val as number)}</Text>
                </View>
              ))}
            </View>

            {/* Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Summary</Text>
              <View style={styles.infoRow}><Text style={styles.infoKey}>Area</Text><Text style={styles.infoVal}>{budgetResult.area?.sqFt?.toLocaleString()} sq ft</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoKey}>Quality</Text><Text style={styles.infoVal}>{budgetResult.qualityGrade}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoKey}>Location</Text><Text style={styles.infoVal}>{budgetResult.location}</Text></View>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => setStep(2)}>
                <Text style={styles.btnSecondaryText}>← Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={reset}>
                <Text style={styles.btnText}>Start Over</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ These are approximate estimates. Actual costs may vary based on material prices, labour costs, and market conditions. Consult professionals for accurate estimates.
          </Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* City Picker Modal */}
      <Modal
        visible={showCityPicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCityPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.searchInput}
              value={citySearch}
              onChangeText={setCitySearch}
              placeholder="Search city..."
              placeholderTextColor="#999"
              autoFocus
            />
            <FlatList
              data={filteredCities}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.cityItem, city === item && styles.cityItemActive]}
                  onPress={() => {
                    setCity(item);
                    setCitySearch('');
                    setShowCityPicker(false);
                  }}
                >
                  <Text style={[styles.cityItemText, city === item && styles.cityItemTextActive]}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                  {city === item && <Text style={styles.cityCheck}>✓</Text>}
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
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  // Step indicator
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 20, paddingHorizontal: 40 },
  stepDot: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: '#FF6B35' },
  stepDotText: { color: '#999', fontWeight: '700' },
  stepDotTextActive: { color: '#FFFFFF' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#E0E0E0' },
  stepLineActive: { backgroundColor: '#FF6B35' },
  stepLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 6, marginBottom: 6 },
  stepLabelText: { fontSize: 11, color: '#888', flex: 1, textAlign: 'center' },

  card: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 14 },

  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  toggle: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F5F5F5', alignItems: 'center' },
  toggleActive: { backgroundColor: '#FF6B35' },
  toggleText: { fontSize: 14, color: '#666', fontWeight: '600' },
  toggleTextActive: { color: '#FFFFFF' },

  fieldLabel: { fontSize: 13, color: '#555', fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 15, color: '#1A1A1A', backgroundColor: '#FAFAFA', marginBottom: 14,
  },

  cityPicker: {
    borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 14, backgroundColor: '#FAFAFA',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  cityPickerText: { fontSize: 15, color: '#1A1A1A', textTransform: 'capitalize' },
  cityPickerPlaceholder: { fontSize: 15, color: '#999' },
  cityPickerArrow: { fontSize: 12, color: '#999' },

  qualityCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FAFAFA', borderRadius: 10, padding: 12,
    marginBottom: 8, borderWidth: 1, borderColor: '#E8E8E8',
  },
  qualityDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  qualityInfo: { flex: 1 },
  qualityLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  qualityDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  qualityCheck: { fontSize: 16, fontWeight: '700' },

  btn: {
    backgroundColor: '#FF6B35', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginTop: 8,
  },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 10, marginHorizontal: 12, marginTop: 0 },
  btnSecondary: { backgroundColor: '#F5F5F5', flex: 0.5 },
  btnSecondaryText: { color: '#1A1A1A', fontSize: 16, fontWeight: '600' },

  // Hero card
  heroCard: {
    backgroundColor: '#FF6B35', margin: 12, borderRadius: 12, padding: 24, alignItems: 'center',
  },
  heroLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 6 },
  heroValue: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginBottom: 4 },
  heroSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },

  // Split
  splitRow: { flexDirection: 'row', gap: 10 },
  splitCard: {
    flex: 1, backgroundColor: '#FAFAFA', borderRadius: 10, padding: 14,
    alignItems: 'center', borderWidth: 1,
  },
  splitIcon: { fontSize: 24, marginBottom: 6 },
  splitLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  splitValue: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },

  // Breakdown
  breakRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  breakLabel: { fontSize: 14, color: '#555' },
  breakValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },

  // Info
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  infoKey: { fontSize: 13, color: '#666' },
  infoVal: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', textTransform: 'capitalize' },

  disclaimer: { margin: 12, padding: 12, backgroundColor: '#FFF8F6', borderRadius: 8 },
  disclaimerText: { fontSize: 12, color: '#888', lineHeight: 18 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  modalClose: { fontSize: 18, color: '#666', padding: 4 },
  searchInput: {
    margin: 12, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: '#1A1A1A',
  },
  cityItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 13, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  cityItemActive: { backgroundColor: '#FFF5F2' },
  cityItemText: { fontSize: 15, color: '#1A1A1A', textTransform: 'capitalize' },
  cityItemTextActive: { color: '#FF6B35', fontWeight: '600' },
  cityCheck: { color: '#FF6B35', fontWeight: '700', fontSize: 16 },
});

export default BudgetEstimatorScreen;
