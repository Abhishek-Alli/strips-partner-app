/**
 * Signup Step 1: User Type Selection
 *
 * User selects their account type (General User / Influencer-Partner / Dealer)
 * Matches the new UI design with dark header and colorful option cards
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserRole } from '../../types/auth.types';
import { UserType } from '../../types/registration.types';

interface UserTypeCardProps {
  title: string;
  backgroundColor: string;
  arrowColor: string;
  onPress: () => void;
}

const UserTypeCard: React.FC<UserTypeCardProps> = ({
  title,
  backgroundColor,
  arrowColor,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.optionCard, { backgroundColor }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.cardIllustration}>
      {/* Placeholder for illustration */}
      <View style={styles.illustrationPlaceholder} />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={[styles.arrowButton, { backgroundColor: arrowColor }]}>
      <Text style={styles.arrowText}>›</Text>
    </View>
  </TouchableOpacity>
);

const SignupStep1_UserType: React.FC = () => {
  const navigation = useNavigation();

  const handleSelectType = (userType: UserType, role: UserRole) => {
    navigation.navigate('SignupStep2' as never, {
      userType,
      role,
    } as never);
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D3142" />

      {/* Dark Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Registration</Text>
      </View>

      {/* White Content Card */}
      <View style={styles.contentCard}>
        <Text style={styles.selectTitle}>Select type of user</Text>

        {/* General Users Option */}
        <UserTypeCard
          title="General Users"
          backgroundColor="#E3F2FD"
          arrowColor="#4CAF50"
          onPress={() => handleSelectType(UserType.GENERAL_USER, UserRole.GENERAL_USER)}
        />

        {/* Influencer / Partner Option */}
        <UserTypeCard
          title="Influencer / Partner"
          backgroundColor="#F0FFF0"
          arrowColor="#4CAF50"
          onPress={() => handleSelectType(UserType.INFLUENCER_PARTNER, UserRole.PARTNER)}
        />

        {/* Dealers Option */}
        <UserTypeCard
          title="Dealers"
          backgroundColor="#FCE4EC"
          arrowColor="#EF5350"
          onPress={() => handleSelectType(UserType.DEALER, UserRole.DEALER)}
        />

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.alreadyText}>Already have an account?</Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D3142',
  },
  header: {
    backgroundColor: '#2D3142',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  selectTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardIllustration: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  illustrationPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
  },
  alreadyText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignupStep1_UserType;
