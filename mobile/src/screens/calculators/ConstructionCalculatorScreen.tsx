/**
 * Construction Calculator Screen
 *
 * Area, Material, Paint, Tiles, Electrical & Plumbing calculators.
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
} from 'react-native';
import { calculatorService } from '../../services/calculatorService';
import {
  calculatePaint,
  calculateTiles,
  calculateElectricalWiring,
  calculatePlumbingPipes,
} from '../../../../shared/core/algorithms/construction/materialCalculator';
import {
  formatArea,
  formatVolume,
  formatWeight,
  formatCurrency,
} from '../../../../shared/core/formatters/calculatorFormatters';
import { logger } from '../../core/logger';

type CalcTab = 'area' | 'material' | 'paint' | 'tiles' | 'electrical' | 'plumbing';

const TABS: { id: CalcTab; label: string; icon: string }[] = [
  { id: 'area',       label: 'Area',       icon: '📐' },
  { id: 'material',   label: 'Material',   icon: '🧱' },
  { id: 'paint',      label: 'Paint',      icon: '🖌️' },
  { id: 'tiles',      label: 'Tiles',      icon: '⬜' },
  { id: 'electrical', label: 'Electrical', icon: '⚡' },
  { id: 'plumbing',   label: 'Plumbing',   icon: '🚿' },
];

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      keyboardType="numeric"
      placeholder={placeholder ?? label}
      placeholderTextColor="#999"
    />
  </View>
);

const ResultRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.resultRow}>
    <Text style={styles.resultLabel}>{label}</Text>
    <Text style={styles.resultValue}>{value}</Text>
  </View>
);

const CalcBtn = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.btn} onPress={onPress}>
    <Text style={styles.btnText}>Calculate</Text>
  </TouchableOpacity>
);

const ConstructionCalculatorScreen: React.FC = () => {
  const [tab, setTab] = useState<CalcTab>('area');

  // ── Area ─────────────────────────────────────────────────────
  const [aLen, setALen] = useState('');
  const [aWid, setAWid] = useState('');
  const [aUnit, setAUnit] = useState<'ft' | 'm'>('ft');
  const [aBup, setABup] = useState('70');
  const [aCarp, setACarp] = useState('75');
  const [aFloors, setAFloors] = useState('1');
  const [aRes, setARes] = useState<any>(null);

  // ── Material ─────────────────────────────────────────────────
  const [mArea, setMArea] = useState('');
  const [mThick, setMThick] = useState('');
  const [mUnit, setMUnit] = useState<'ft' | 'm'>('m');
  const [mC, setMC] = useState('1');
  const [mS, setMS] = useState('2');
  const [mAgg, setMAgg] = useState('4');
  const [mRes, setMRes] = useState<any>(null);

  // ── Paint ────────────────────────────────────────────────────
  const [pWall, setPWall] = useState('');
  const [pCoats, setPCoats] = useState('2');
  const [pCover, setPCover] = useState('12');
  const [pRes, setPRes] = useState<any>(null);

  // ── Tiles ────────────────────────────────────────────────────
  const [tFloor, setTFloor] = useState('');
  const [tSize, setTSize] = useState('600');
  const [tWaste, setTWaste] = useState('10');
  const [tBox, setTBox] = useState('4');
  const [tRes, setTRes] = useState<any>(null);

  // ── Electrical ───────────────────────────────────────────────
  const [eArea, setEArea] = useState('');
  const [eFloors, setEFloors] = useState('1');
  const [eRes, setERes] = useState<any>(null);

  // ── Plumbing ─────────────────────────────────────────────────
  const [plBath, setPlBath] = useState('2');
  const [plKit, setPlKit] = useState('1');
  const [plFloors, setPlFloors] = useState('1');
  const [plRes, setPlRes] = useState<any>(null);

  // ── Handlers ─────────────────────────────────────────────────
  const calcArea = () => {
    try {
      const l = parseFloat(aLen), w = parseFloat(aWid);
      if (isNaN(l) || isNaN(w)) { Alert.alert('Error', 'Enter valid length & width'); return; }
      const plot = calculatorService.calculatePlotArea({ length: l, width: w, unit: aUnit });
      const builtUp = calculatorService.calculateBuiltUpArea(plot, parseFloat(aBup) || 70);
      const carpet = calculatorService.calculateCarpetArea(builtUp, parseFloat(aCarp) || 75);
      const floors = parseFloat(aFloors) || 1;
      const total = floors > 1 ? calculatorService.calculateMultiFloorArea(plot, floors) : plot;
      setARes({ plot, builtUp, carpet, total, floors });
    } catch (e) { logger.error('Area calc', e as Error); Alert.alert('Error', (e as Error).message); }
  };

  const calcMaterial = () => {
    try {
      let aNum = parseFloat(mArea), thick = parseFloat(mThick);
      if (isNaN(aNum) || isNaN(thick)) { Alert.alert('Error', 'Enter valid area & thickness'); return; }
      if (mUnit === 'ft') aNum = aNum / 10.7639;
      const res = calculatorService.calculateMaterialQuantities({
        area: aNum, thickness: thick, unit: mUnit,
        mixRatio: { cement: parseFloat(mC) || 1, sand: parseFloat(mS) || 2, aggregate: parseFloat(mAgg) || 4 },
      });
      setMRes(res);
    } catch (e) { logger.error('Material calc', e as Error); Alert.alert('Error', (e as Error).message); }
  };

  const calcPaint = () => {
    try {
      const wall = parseFloat(pWall);
      if (isNaN(wall)) { Alert.alert('Error', 'Enter valid wall area'); return; }
      setPRes(calculatePaint(wall, parseFloat(pCoats) || 2, parseFloat(pCover) || 12));
    } catch (e) { Alert.alert('Error', (e as Error).message); }
  };

  const calcTiles = () => {
    try {
      const floor = parseFloat(tFloor);
      if (isNaN(floor)) { Alert.alert('Error', 'Enter valid floor area'); return; }
      setTRes(calculateTiles(floor, parseFloat(tSize) || 600, parseFloat(tWaste) || 10, parseInt(tBox) || 4));
    } catch (e) { Alert.alert('Error', (e as Error).message); }
  };

  const calcElectrical = () => {
    try {
      const area = parseFloat(eArea);
      if (isNaN(area)) { Alert.alert('Error', 'Enter valid area'); return; }
      setERes(calculateElectricalWiring(area, parseInt(eFloors) || 1));
    } catch (e) { Alert.alert('Error', (e as Error).message); }
  };

  const calcPlumbing = () => {
    try {
      setPlRes(calculatePlumbingPipes(parseInt(plBath) || 2, parseInt(plKit) || 1, parseInt(plFloors) || 1));
    } catch (e) { Alert.alert('Error', (e as Error).message); }
  };

  // ── Toggle helper ─────────────────────────────────────────────
  const Toggle = ({
    options,
    value,
    onChange,
  }: {
    options: { label: string; value: string }[];
    value: string;
    onChange: (v: any) => void;
  }) => (
    <View style={styles.toggleRow}>
      {options.map(o => (
        <TouchableOpacity
          key={o.value}
          style={[styles.toggle, value === o.value && styles.toggleActive]}
          onPress={() => onChange(o.value)}
        >
          <Text style={[styles.toggleText, value === o.value && styles.toggleTextActive]}>
            {o.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Tab Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabBarContent}
      >
        {TABS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tab, tab === t.id && styles.tabActive]}
            onPress={() => setTab(t.id)}
          >
            <Text style={styles.tabIcon}>{t.icon}</Text>
            <Text style={[styles.tabLabel, tab === t.id && styles.tabLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* ── AREA ─────────────────── */}
        {tab === 'area' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Area Calculator</Text>
            <Toggle
              options={[{ label: 'Feet', value: 'ft' }, { label: 'Meters', value: 'm' }]}
              value={aUnit}
              onChange={setAUnit}
            />
            <InputField label={`Length (${aUnit})`} value={aLen} onChange={setALen} />
            <InputField label={`Width (${aUnit})`} value={aWid} onChange={setAWid} />
            <InputField label="Built-up %" value={aBup} onChange={setABup} placeholder="70" />
            <InputField label="Carpet %" value={aCarp} onChange={setACarp} placeholder="75" />
            <InputField label="Number of Floors" value={aFloors} onChange={setAFloors} placeholder="1" />
            <CalcBtn onPress={calcArea} />
            {aRes && (
              <View style={styles.results}>
                <Text style={styles.resultsTitle}>Results</Text>
                <ResultRow label="Plot Area" value={formatArea(aRes.plot.areaInSqFt, 'sqft')} />
                <ResultRow label="Built-up Area" value={formatArea(aRes.builtUp.areaInSqFt, 'sqft')} />
                <ResultRow label="Carpet Area" value={formatArea(aRes.carpet.areaInSqFt, 'sqft')} />
                {aRes.floors > 1 && (
                  <ResultRow label={`Total (${aRes.floors} floors)`} value={formatArea(aRes.total.areaInSqFt, 'sqft')} />
                )}
              </View>
            )}
          </View>
        )}

        {/* ── MATERIAL ─────────────── */}
        {tab === 'material' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Material Calculator</Text>
            <Toggle
              options={[{ label: 'Meters', value: 'm' }, { label: 'Feet', value: 'ft' }]}
              value={mUnit}
              onChange={setMUnit}
            />
            <InputField label={`Area (sq ${mUnit})`} value={mArea} onChange={setMArea} />
            <InputField label={`Thickness (${mUnit})`} value={mThick} onChange={setMThick} />
            <Text style={styles.fieldLabel}>Mix Ratio (Cement : Sand : Aggregate)</Text>
            <View style={styles.ratioRow}>
              <TextInput style={[styles.input, styles.ratioInput]} value={mC} onChangeText={setMC} keyboardType="numeric" placeholder="1" placeholderTextColor="#999" />
              <Text style={styles.colon}>:</Text>
              <TextInput style={[styles.input, styles.ratioInput]} value={mS} onChangeText={setMS} keyboardType="numeric" placeholder="2" placeholderTextColor="#999" />
              <Text style={styles.colon}>:</Text>
              <TextInput style={[styles.input, styles.ratioInput]} value={mAgg} onChangeText={setMAgg} keyboardType="numeric" placeholder="4" placeholderTextColor="#999" />
            </View>
            <CalcBtn onPress={calcMaterial} />
            {mRes && (
              <View style={styles.results}>
                <Text style={styles.resultsTitle}>Material Requirements</Text>
                <ResultRow label="Cement" value={`${mRes.cement.bags} bags (${formatWeight(mRes.cement.weight)})`} />
                <ResultRow label="Sand" value={`${formatVolume(mRes.sand.volume, 'cum')} | ${formatVolume(mRes.sand.volumeInCft, 'cft')}`} />
                <ResultRow label="Aggregate" value={`${formatVolume(mRes.aggregate.volume, 'cum')} | ${formatVolume(mRes.aggregate.volumeInCft, 'cft')}`} />
              </View>
            )}
          </View>
        )}

        {/* ── PAINT ────────────────── */}
        {tab === 'paint' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Paint Calculator</Text>
            <InputField label="Wall Area (sq m)" value={pWall} onChange={setPWall} />
            <InputField label="Number of Coats" value={pCoats} onChange={setPCoats} placeholder="2" />
            <InputField label="Coverage per Litre (sq m)" value={pCover} onChange={setPCover} placeholder="12" />
            <CalcBtn onPress={calcPaint} />
            {pRes && (
              <View style={styles.results}>
                <Text style={styles.resultsTitle}>Paint Requirements</Text>
                <ResultRow label="Total Litres Needed" value={`${pRes.totalLitres} L`} />
                <ResultRow label="20 L Drums" value={`${pRes.drums20L}`} />
                <ResultRow label="4 L Cans" value={`${pRes.cans4L}`} />
              </View>
            )}
          </View>
        )}

        {/* ── TILES ────────────────── */}
        {tab === 'tiles' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tiles Calculator</Text>
            <InputField label="Floor Area (sq m)" value={tFloor} onChange={setTFloor} />
            <InputField label="Tile Size (mm, e.g. 600 for 600×600)" value={tSize} onChange={setTSize} placeholder="600" />
            <InputField label="Wastage %" value={tWaste} onChange={setTWaste} placeholder="10" />
            <InputField label="Tiles per Box" value={tBox} onChange={setTBox} placeholder="4" />
            <CalcBtn onPress={calcTiles} />
            {tRes && (
              <View style={styles.results}>
                <Text style={styles.resultsTitle}>Tiles Required</Text>
                <ResultRow label="Net Tiles" value={`${tRes.tilesNeeded}`} />
                <ResultRow label="With Wastage" value={`${tRes.tilesWithWastage}`} />
                <ResultRow label="Boxes Needed" value={`${tRes.boxesNeeded}`} />
                <ResultRow label="Tile Size" value={`${tRes.tileSizeMm} × ${tRes.tileSizeMm} mm`} />
              </View>
            )}
          </View>
        )}

        {/* ── ELECTRICAL ───────────── */}
        {tab === 'electrical' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Electrical Wiring</Text>
            <InputField label="Built-up Area (sq ft)" value={eArea} onChange={setEArea} />
            <InputField label="Number of Floors" value={eFloors} onChange={setEFloors} placeholder="1" />
            <CalcBtn onPress={calcElectrical} />
            {eRes && (
              <View style={styles.results}>
                <Text style={styles.resultsTitle}>Electrical Estimate</Text>
                <ResultRow label="Light Points" value={`${eRes.lightPoints}`} />
                <ResultRow label="Fan Points" value={`${eRes.fanPoints}`} />
                <ResultRow label="Socket Points" value={`${eRes.socketPoints}`} />
                <ResultRow label="Total Points" value={`${eRes.totalPoints}`} />
                <ResultRow label="Estimated Cost" value={formatCurrency(eRes.estimatedCost)} />
              </View>
            )}
          </View>
        )}

        {/* ── PLUMBING ─────────────── */}
        {tab === 'plumbing' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Plumbing Pipes</Text>
            <InputField label="Bathrooms" value={plBath} onChange={setPlBath} placeholder="2" />
            <InputField label="Kitchens" value={plKit} onChange={setPlKit} placeholder="1" />
            <InputField label="Number of Floors" value={plFloors} onChange={setPlFloors} placeholder="1" />
            <CalcBtn onPress={calcPlumbing} />
            {plRes && (
              <View style={styles.results}>
                <Text style={styles.resultsTitle}>Plumbing Estimate</Text>
                <ResultRow label="CPVC Pipe" value={`${plRes.cpvcPipeMeters} m`} />
                <ResultRow label="PVC Pipe" value={`${plRes.pvcPipeMeters} m`} />
                <ResultRow label="Total Fixtures" value={`${plRes.totalFixtures}`} />
                <ResultRow label="Estimated Cost" value={formatCurrency(plRes.estimatedCost)} />
              </View>
            )}
          </View>
        )}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ Approximate estimates only. Actual requirements vary based on site conditions and material quality.
          </Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    maxHeight: 72,
  },
  tabBarContent: { paddingHorizontal: 8, paddingVertical: 8, gap: 6 },
  tab: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    minWidth: 72,
  },
  tabActive: { backgroundColor: '#FF6B35' },
  tabIcon: { fontSize: 18, marginBottom: 2 },
  tabLabel: { fontSize: 11, color: '#666', fontWeight: '500' },
  tabLabelActive: { color: '#FFFFFF', fontWeight: '700' },
  body: { flex: 1 },
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
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, color: '#555', fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 15,
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
  },
  ratioRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  ratioInput: { flex: 1, textAlign: 'center' },
  colon: { fontSize: 18, color: '#555', fontWeight: '700' },
  btn: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  results: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 14 },
  resultsTitle: { fontSize: 14, fontWeight: '700', color: '#FF6B35', marginBottom: 10 },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  resultLabel: { fontSize: 14, color: '#555' },
  resultValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  disclaimer: { margin: 12, padding: 12, backgroundColor: '#FFF8F6', borderRadius: 8 },
  disclaimerText: { fontSize: 12, color: '#888', lineHeight: 18 },
});

export default ConstructionCalculatorScreen;
