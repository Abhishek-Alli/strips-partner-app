/**
 * General User Drawer Content
 *
 * Sidebar navigation menu for general user section
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
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useDrawer } from '../../contexts/DrawerContext';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  screen?: string;
}

const menuItems: MenuItem[] = [
  { id: '1', title: 'Home',               icon: 'home',                  screen: 'Home' },
  { id: '2', title: 'Find Partners',      icon: 'business',              screen: 'Search' },
  { id: '3', title: 'Find Dealers',       icon: 'store',                 screen: 'DealerSearchStack' },
  { id: '4', title: 'Tools & Utilities',  icon: 'calculate',             screen: 'Tools' },
  { id: '5', title: 'Messages',           icon: 'chat',                  screen: 'Messages' },
  { id: '6', title: 'Notifications',      icon: 'notifications',         screen: 'NotificationsInbox' },
  { id: '7', title: 'Payment History',    icon: 'receipt',               screen: 'PaymentHistory' },
  { id: '8', title: 'Account Settings',   icon: 'manage-accounts',       screen: 'AccountManagement' },
];

const GeneralUserDrawerContent: React.FC = () => {
  const navigation = useNavigation<any>();
  const { closeDrawer } = useDrawer();
  const { user, logout } = useAuth();
  const [activeItem, setActiveItem] = React.useState('1');

  const handleMenuPress = (item: MenuItem) => {
    setActiveItem(item.id);
    closeDrawer();
    if (!item.screen) return;

    // Tab screens navigate directly; stack screens use navigate()
    const tabScreens = ['Home', 'Search', 'Tools', 'Messages', 'Profile'];
    if (tabScreens.includes(item.screen)) {
      navigation.navigate(item.screen);
    } else if (item.screen === 'DealerSearchStack') {
      navigation.navigate('DealerSearch');
    } else {
      navigation.navigate(item.screen);
    }
  };

  const handleLogout = () => {
    closeDrawer();
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo Banner */}
      <View style={styles.logoBanner}>
        <Image
          source={require('../../logo/srj_logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'User'}
            </Text>
            <Text style={styles.userRole}>General User</Text>
            {user?.phone && (
              <Text style={styles.userDetail}>{user.phone}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
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
                name={item.icon as any}
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

        <View style={styles.divider} />

        {/* Logout */}
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuIconContainer}>
            <MaterialIcons name="logout" size={20} color="#E53935" />
          </View>
          <Text style={[styles.menuTitle, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>

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
  logoBanner: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 16,
    backgroundColor: '#FFF5F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0D5',
  },
  logoImage: {
    width: 80,
    height: 52,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerContent: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
    marginBottom: 2,
  },
  userDetail: {
    fontSize: 12,
    color: '#666',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  logoutText: {
    color: '#E53935',
  },
  bottomPadding: {
    height: 40,
  },
});

export default GeneralUserDrawerContent;
