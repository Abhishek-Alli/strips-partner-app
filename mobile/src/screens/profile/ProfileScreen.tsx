import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../theme';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.profileCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.name, { color: theme.colors.text.primary }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: theme.colors.text.secondary }]}>{user?.email}</Text>
        <Text style={[styles.role, { color: theme.colors.text.secondary }]}>{user?.role}</Text>
      </View>

      <TouchableOpacity
        style={[styles.menuItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        onPress={() => navigation.navigate('AccountManagement' as never)}
      >
        <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>Account Management</Text>
        <Text style={{ color: theme.colors.text.secondary }}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        onPress={() => navigation.navigate('UtilitiesHome' as never)}
      >
        <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>Utilities & Knowledge</Text>
        <Text style={{ color: theme.colors.text.secondary }}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: '#FF3B30' }]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  profileCard: {
    padding: 20,
    borderRadius: 8,
    margin: 16,
    borderWidth: 1
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  email: {
    fontSize: 16,
    marginBottom: 4
  },
  role: {
    fontSize: 14,
    textTransform: 'capitalize'
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1
  },
  menuText: {
    fontSize: 16
  },
  logoutButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    margin: 16
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default ProfileScreen;



