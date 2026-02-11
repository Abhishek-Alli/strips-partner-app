/**
 * Dealer Drawer Content
 *
 * Sidebar navigation menu for dealer section
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDrawer } from '../../contexts/DrawerContext';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  screen?: string;
}

const menuItems: MenuItem[] = [
  { id: '1', title: 'Dashboard', icon: 'dashboard', screen: 'DealerDashboard' },
  { id: '2', title: 'Manage work', icon: 'work', screen: 'DealerManageProducts' },
  { id: '3', title: 'View Checklists', icon: 'checklist', screen: 'DealerViewChecklist' },
  { id: '4', title: 'Feedback', icon: 'question-answer', screen: 'DealerFeedback' },
  { id: '5', title: 'Offer & discount', icon: 'local-offer', screen: 'OffersDiscounts' },
  { id: '6', title: 'Enquiries', icon: 'email', screen: 'DealerEnquiries' },
  { id: '7', title: 'Shortcuts & links', icon: 'link', screen: 'DealerShortcutsLinks' },
  { id: '8', title: 'Convertors', icon: 'swap-horiz', screen: 'DealerConverter' },
  { id: '9', title: 'Videos', icon: 'video-library', screen: 'DealerVideos' },
  { id: '10', title: 'Apply for Dealership', icon: 'assignment', screen: 'ApplyDealership' },
  { id: '11', title: 'Gallery', icon: 'image', screen: 'DealerGallery' },
  { id: '12', title: 'Notes', icon: 'note', screen: 'DealerNotes' },
  { id: '13', title: 'Loyalty Points', icon: 'star', screen: 'LoyaltyPoints' },
  { id: '14', title: 'Steel Market Updates', icon: 'trending-up', screen: 'SteelMarketUpdates' },
  { id: '15', title: 'Lectures', icon: 'school', screen: 'Lectures' },
  { id: '16', title: 'Trading Advices', icon: 'lightbulb', screen: 'TradingAdvices' },
  { id: '17', title: 'Upcoming Projects', icon: 'construction', screen: 'UpcomingProjects' },
  { id: '18', title: 'Tenders', icon: 'description', screen: 'Tenders' },
  { id: '19', title: 'Education Posts', icon: 'library-books', screen: 'EducationPosts' },
  { id: '20', title: 'Quiz', icon: 'help', screen: 'Quiz' },
  { id: '21', title: 'Referrals', icon: 'people', screen: 'Referrals' },
  { id: '22', title: 'Reports & Statistics', icon: 'assessment', screen: 'ReportsStatistics' },
  { id: '23', title: 'Manage Profile', icon: 'person', screen: 'DealerManageProfile' },
];

const DealerDrawerContent: React.FC = () => {
  const navigation = useNavigation<any>();
  const { closeDrawer } = useDrawer();
  const [activeItem, setActiveItem] = React.useState('1');

  const handleMenuPress = (item: MenuItem) => {
    setActiveItem(item.id);
    closeDrawer();
    if (item.screen === 'DealerDashboard') {
      // Navigate to Home tab instead of pushing a new screen
      navigation.navigate('Home');
    } else if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>LO{'\n'}GO</Text>
          </View>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>Serines Deals and{'\n'}Traders</Text>
            <Text style={styles.businessDetails}>📍 Location: Ganeshguri</Text>
            <Text style={styles.businessDetails}>Contact information: 9123456780</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color="#666" />
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              activeItem === item.id && styles.menuItemActive,
            ]}
            onPress={() => handleMenuPress(item)}
          >
            <View style={styles.menuIconContainer}>
              <MaterialIcons
                name={item.icon}
                size={20}
                color={activeItem === item.id ? '#FF6B35' : '#666'}
              />
            </View>
            <Text
              style={[
                styles.menuTitle,
                activeItem === item.id && styles.menuTitleActive,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerContent: {
    flexDirection: 'row',
    flex: 1,
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1976D2',
    textAlign: 'center',
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  businessDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemActive: {
    backgroundColor: '#FFF5F2',
  },
  menuIconContainer: {
    marginRight: 14,
    width: 24,
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 15,
    color: '#1A1A1A',
  },
  menuTitleActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

export default DealerDrawerContent;
