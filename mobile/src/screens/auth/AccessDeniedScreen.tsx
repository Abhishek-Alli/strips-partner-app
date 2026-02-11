import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { Icon } from '../../components/core/Icon';
import { useTheme } from '../../theme';

const AccessDeniedScreen: React.FC = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const theme = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Icon name="security" size={64} color={theme.colors.error} />
      <Text style={styles.title}>Access Denied</Text>
      <Text style={styles.message}>
        This mobile app is only available for General Users.
      </Text>
      <Text style={styles.subMessage}>
        Please use the web admin panel to access your account.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8
  },
  subMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 32
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    minWidth: 200,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default AccessDeniedScreen;

