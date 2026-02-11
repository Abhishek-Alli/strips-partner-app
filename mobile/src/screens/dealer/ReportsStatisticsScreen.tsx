/**
 * Reports & Statistics Screen
 *
 * Business analytics and report summaries for dealers
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { MaterialIcons } from '@expo/vector-icons';

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

const statsCards: StatCard[] = [
  { id: '1', title: 'Total Sales', value: '₹12.5L', change: '+15%', trend: 'up', icon: 'trending-up' },
  { id: '2', title: 'Products Sold', value: '245', change: '+8%', trend: 'up', icon: 'inventory' },
  { id: '3', title: 'Enquiries', value: '89', change: '+22%', trend: 'up', icon: 'question-answer' },
  { id: '4', title: 'Customer Rating', value: '4.5', change: '+0.2', trend: 'up', icon: 'star' },
  { id: '5', title: 'Referrals', value: '12', change: '+3', trend: 'up', icon: 'people' },
  { id: '6', title: 'Loyalty Points', value: '1,250', change: '+350', trend: 'up', icon: 'workspace-premium' },
];

interface MonthlyData {
  month: string;
  sales: number;
  enquiries: number;
}

const monthlyData: MonthlyData[] = [
  { month: 'Sep', sales: 8.2, enquiries: 45 },
  { month: 'Oct', sales: 9.5, enquiries: 52 },
  { month: 'Nov', sales: 10.1, enquiries: 68 },
  { month: 'Dec', sales: 11.8, enquiries: 72 },
  { month: 'Jan', sales: 12.0, enquiries: 81 },
  { month: 'Feb', sales: 12.5, enquiries: 89 },
];

const ReportsStatisticsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const maxSales = Math.max(...monthlyData.map(d => d.sales));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports & Statistics</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Badge */}
        <View style={styles.periodBadge}>
          <MaterialIcons name="date-range" size={16} color="#FF6B35" />
          <Text style={styles.periodText}>Last 6 Months</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statsCards.map(stat => (
            <View key={stat.id} style={styles.statCard}>
              <View style={styles.statIcon}>
                <MaterialIcons name={stat.icon} size={22} color="#FF6B35" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
              <View style={styles.changeRow}>
                <MaterialIcons
                  name={stat.trend === 'up' ? 'arrow-upward' : stat.trend === 'down' ? 'arrow-downward' : 'remove'}
                  size={14}
                  color={stat.trend === 'up' ? '#4CAF50' : stat.trend === 'down' ? '#FF5722' : '#FF9800'}
                />
                <Text style={[styles.changeText, { color: stat.trend === 'up' ? '#4CAF50' : stat.trend === 'down' ? '#FF5722' : '#FF9800' }]}>
                  {stat.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Sales Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Sales (₹ Lakhs)</Text>
          <View style={styles.chartContainer}>
            {monthlyData.map((data, index) => (
              <View key={index} style={styles.barColumn}>
                <Text style={styles.barValue}>{data.sales}</Text>
                <View style={[styles.bar, { height: (data.sales / maxSales) * 120 }]} />
                <Text style={styles.barLabel}>{data.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Top Selling Products</Text>
          {[
            { name: 'TMT Steel Bars (Fe500)', units: '120 units', revenue: '₹4.8L' },
            { name: 'OPC Cement (50kg)', units: '450 bags', revenue: '₹3.2L' },
            { name: 'Rockwool Insulation', units: '85 rolls', revenue: '₹2.1L' },
            { name: 'Electrical Switches', units: '200 sets', revenue: '₹1.5L' },
          ].map((product, index) => (
            <View key={index} style={styles.productRow}>
              <View style={styles.productRank}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productUnits}>{product.units}</Text>
              </View>
              <Text style={styles.productRevenue}>{product.revenue}</Text>
            </View>
          ))}
        </View>

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
  periodBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: '#FFF5F2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 16,
  },
  periodText: { fontSize: 13, color: '#FF6B35', fontWeight: '500' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  statCard: {
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3 },
      android: { elevation: 1 },
    }),
  },
  statIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF5F2',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  statValue: { fontSize: 22, fontWeight: '700', color: '#1A1A1A' },
  statTitle: { fontSize: 12, color: '#666', marginTop: 2 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  changeText: { fontSize: 12, fontWeight: '600' },
  chartCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16,
  },
  chartTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 16 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 160 },
  barColumn: { alignItems: 'center', flex: 1 },
  barValue: { fontSize: 10, color: '#666', marginBottom: 4 },
  bar: { width: 28, backgroundColor: '#FF6B35', borderRadius: 4 },
  barLabel: { fontSize: 11, color: '#666', marginTop: 6 },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 16 },
  productRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  productRank: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF5F2',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  rankText: { fontSize: 14, fontWeight: '700', color: '#FF6B35' },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  productUnits: { fontSize: 12, color: '#666', marginTop: 2 },
  productRevenue: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
});

export default ReportsStatisticsScreen;
