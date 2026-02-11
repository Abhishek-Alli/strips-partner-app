/**
 * Tenders Screen
 *
 * Card list with tender details and detail modal with sections
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
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { MaterialIcons } from '@expo/vector-icons';

interface Tender {
  id: string;
  title: string;
  organization: string;
  tenderNumber: string;
  description: string;
  location: string;
  publishDate: string;
  closingDate: string;
  estimatedValue: string;
  emd: string;
  status: 'open' | 'closing_soon' | 'closed';
  category: string;
  details: {
    tenderNotice: string;
    keyValues: { label: string; value: string }[];
    attachments: { name: string; size: string }[];
  };
}

const sampleTenders: Tender[] = [
  {
    id: '1',
    title: 'Supply of TMT Steel Bars for Highway Project',
    organization: 'National Highway Authority of India',
    tenderNumber: 'NHAI/2026/ST-145',
    description: 'Supply and delivery of TMT steel bars of various grades for the ongoing highway construction project.',
    location: 'Assam Region',
    publishDate: 'Feb 1, 2026',
    closingDate: 'Feb 28, 2026',
    estimatedValue: '₹5.2 Cr',
    emd: '₹5,20,000',
    status: 'open',
    category: 'Steel Supply',
    details: {
      tenderNotice: 'The National Highway Authority of India invites sealed tenders from registered and experienced suppliers for the supply of TMT steel bars. The tenderer should have minimum 5 years experience in steel supply and should be registered with the relevant authorities.',
      keyValues: [
        { label: 'Tender ID', value: 'NHAI/2026/ST-145' },
        { label: 'EMD Amount', value: '₹5,20,000' },
        { label: 'Tender Fee', value: '₹10,000' },
        { label: 'Estimated Value', value: '₹5.2 Cr' },
        { label: 'Bid Validity', value: '90 days' },
        { label: 'Delivery Period', value: '6 months' },
      ],
      attachments: [
        { name: 'Tender_Document.pdf', size: '2.5 MB' },
        { name: 'BOQ_Steel_Supply.xlsx', size: '450 KB' },
        { name: 'Terms_Conditions.pdf', size: '1.2 MB' },
      ],
    },
  },
  {
    id: '2',
    title: 'Cement Supply for Government School Renovation',
    organization: 'Public Works Department, Assam',
    tenderNumber: 'PWD/ASM/2026/C-089',
    description: 'Supply of OPC and PPC grade cement for the renovation of government school buildings across Kamrup district.',
    location: 'Kamrup District',
    publishDate: 'Jan 25, 2026',
    closingDate: 'Feb 15, 2026',
    estimatedValue: '₹1.8 Cr',
    emd: '₹1,80,000',
    status: 'closing_soon',
    category: 'Cement Supply',
    details: {
      tenderNotice: 'The Public Works Department of Assam invites tenders from authorized cement dealers for the supply of cement for school renovation projects.',
      keyValues: [
        { label: 'Tender ID', value: 'PWD/ASM/2026/C-089' },
        { label: 'EMD Amount', value: '₹1,80,000' },
        { label: 'Tender Fee', value: '₹5,000' },
        { label: 'Estimated Value', value: '₹1.8 Cr' },
        { label: 'Bid Validity', value: '60 days' },
        { label: 'Delivery Period', value: '3 months' },
      ],
      attachments: [
        { name: 'Tender_Notice.pdf', size: '1.8 MB' },
        { name: 'Quantity_Schedule.xlsx', size: '320 KB' },
      ],
    },
  },
  {
    id: '3',
    title: 'Electrical Materials for Residential Complex',
    organization: 'Guwahati Metropolitan Development Authority',
    tenderNumber: 'GMDA/2026/EL-034',
    description: 'Supply of electrical materials including switches, wiring, and panels for the new residential complex.',
    location: 'Guwahati',
    publishDate: 'Jan 15, 2026',
    closingDate: 'Jan 31, 2026',
    estimatedValue: '₹95 Lakh',
    emd: '₹95,000',
    status: 'closed',
    category: 'Electrical',
    details: {
      tenderNotice: 'Supply of ISI-marked electrical materials for residential construction. Tenderer must be an authorized dealer of reputed brands.',
      keyValues: [
        { label: 'Tender ID', value: 'GMDA/2026/EL-034' },
        { label: 'EMD Amount', value: '₹95,000' },
        { label: 'Tender Fee', value: '₹3,000' },
        { label: 'Estimated Value', value: '₹95 Lakh' },
        { label: 'Bid Validity', value: '45 days' },
        { label: 'Delivery Period', value: '2 months' },
      ],
      attachments: [
        { name: 'Tender_Document.pdf', size: '2.1 MB' },
      ],
    },
  },
];

const TendersScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'notice' | 'details' | 'values' | 'attachments'>('notice');

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#4CAF50';
      case 'closing_soon': return '#FF9800';
      default: return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'closing_soon': return 'Closing Soon';
      default: return 'Closed';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tenders</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sampleTenders.map(tender => (
          <TouchableOpacity
            key={tender.id}
            style={styles.tenderCard}
            onPress={() => { setSelectedTender(tender); setActiveDetailTab('notice'); }}
          >
            <View style={styles.cardTop}>
              <Text style={styles.tenderNumber}>{tender.tenderNumber}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tender.status) + '15' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(tender.status) }]}>
                  {getStatusLabel(tender.status)}
                </Text>
              </View>
            </View>

            <Text style={styles.tenderTitle}>{tender.title}</Text>
            <Text style={styles.orgText}>{tender.organization}</Text>

            <View style={styles.tenderDetails}>
              <View style={styles.tenderDetailItem}>
                <MaterialIcons name="location-on" size={14} color="#666" />
                <Text style={styles.tenderDetailText}>{tender.location}</Text>
              </View>
              <View style={styles.tenderDetailItem}>
                <MaterialIcons name="event" size={14} color="#666" />
                <Text style={styles.tenderDetailText}>Closes: {tender.closingDate}</Text>
              </View>
            </View>

            <View style={styles.valueRow}>
              <View>
                <Text style={styles.valueLabel}>Est. Value</Text>
                <Text style={styles.valueAmount}>{tender.estimatedValue}</Text>
              </View>
              <View>
                <Text style={styles.valueLabel}>EMD</Text>
                <Text style={styles.valueAmount}>{tender.emd}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#CCC" />
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={selectedTender !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTender(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={2}>{selectedTender?.title}</Text>
              <TouchableOpacity onPress={() => setSelectedTender(null)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Detail Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.detailTabs} contentContainerStyle={styles.detailTabsContent}>
              {[
                { key: 'notice', label: 'Tender Notice' },
                { key: 'details', label: 'Details' },
                { key: 'values', label: 'Key Values' },
                { key: 'attachments', label: 'Attachments' },
              ].map(tab => (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.detailTab, activeDetailTab === tab.key && styles.detailTabActive]}
                  onPress={() => setActiveDetailTab(tab.key as any)}
                >
                  <Text style={[styles.detailTabText, activeDetailTab === tab.key && styles.detailTabTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {activeDetailTab === 'notice' && (
                <View>
                  <Text style={styles.noticeText}>{selectedTender?.details.tenderNotice}</Text>
                </View>
              )}

              {activeDetailTab === 'details' && (
                <View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Organization</Text>
                    <Text style={styles.detailValue}>{selectedTender?.organization}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>{selectedTender?.location}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Category</Text>
                    <Text style={styles.detailValue}>{selectedTender?.category}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Published Date</Text>
                    <Text style={styles.detailValue}>{selectedTender?.publishDate}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Closing Date</Text>
                    <Text style={styles.detailValue}>{selectedTender?.closingDate}</Text>
                  </View>
                </View>
              )}

              {activeDetailTab === 'values' && (
                <View>
                  {selectedTender?.details.keyValues.map((kv, index) => (
                    <View key={index} style={styles.kvItem}>
                      <Text style={styles.kvLabel}>{kv.label}</Text>
                      <Text style={styles.kvValue}>{kv.value}</Text>
                    </View>
                  ))}
                </View>
              )}

              {activeDetailTab === 'attachments' && (
                <View>
                  {selectedTender?.details.attachments.map((att, index) => (
                    <TouchableOpacity key={index} style={styles.attachmentItem}>
                      <MaterialIcons name="attach-file" size={20} color="#FF6B35" />
                      <View style={styles.attachmentInfo}>
                        <Text style={styles.attachmentName}>{att.name}</Text>
                        <Text style={styles.attachmentSize}>{att.size}</Text>
                      </View>
                      <MaterialIcons name="download" size={20} color="#666" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  tenderCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tenderNumber: { fontSize: 12, color: '#999', fontWeight: '500' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '700' },
  tenderTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  orgText: { fontSize: 13, color: '#666', marginBottom: 10 },
  tenderDetails: { gap: 4, marginBottom: 12 },
  tenderDetailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tenderDetailText: { fontSize: 13, color: '#666' },
  valueRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0',
  },
  valueLabel: { fontSize: 11, color: '#999' },
  valueAmount: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', flex: 1, marginRight: 12 },
  detailTabs: { maxHeight: 45, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  detailTabsContent: { paddingHorizontal: 12, gap: 4 },
  detailTab: { paddingHorizontal: 14, paddingVertical: 10 },
  detailTabActive: { borderBottomWidth: 2, borderBottomColor: '#FF6B35' },
  detailTabText: { fontSize: 14, color: '#666', fontWeight: '500' },
  detailTabTextActive: { color: '#FF6B35', fontWeight: '600' },
  modalBody: { padding: 16 },
  noticeText: { fontSize: 14, color: '#333', lineHeight: 22 },
  detailItem: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  detailLabel: { fontSize: 14, color: '#666' },
  detailValue: { fontSize: 14, color: '#1A1A1A', fontWeight: '500', textAlign: 'right', flex: 1, marginLeft: 16 },
  kvItem: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  kvLabel: { fontSize: 14, color: '#666' },
  kvValue: { fontSize: 14, color: '#1A1A1A', fontWeight: '600' },
  attachmentItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  attachmentInfo: { flex: 1 },
  attachmentName: { fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  attachmentSize: { fontSize: 12, color: '#999', marginTop: 2 },
});

export default TendersScreen;
