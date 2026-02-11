/**
 * Vaastu Services Screen
 *
 * Displays grid of Vaastu Consultant cards with images
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface VaastuConsultant {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: string;
}

const sampleConsultants: VaastuConsultant[] = [
  {
    id: '1',
    name: 'Pandit Sharma',
    specialty: 'Residential Vaastu',
    image: 'https://picsum.photos/200/200?random=10',
    rating: 4.8,
    experience: '15+ years',
  },
  {
    id: '2',
    name: 'Dr. Acharya Joshi',
    specialty: 'Commercial Vaastu',
    image: 'https://picsum.photos/200/200?random=11',
    rating: 4.9,
    experience: '20+ years',
  },
  {
    id: '3',
    name: 'Guru Rajesh',
    specialty: 'Industrial Vaastu',
    image: 'https://picsum.photos/200/200?random=12',
    rating: 4.7,
    experience: '12+ years',
  },
  {
    id: '4',
    name: 'Pandit Verma',
    specialty: 'Home Vaastu',
    image: 'https://picsum.photos/200/200?random=13',
    rating: 4.6,
    experience: '10+ years',
  },
  {
    id: '5',
    name: 'Acharya Kumar',
    specialty: 'Office Vaastu',
    image: 'https://picsum.photos/200/200?random=14',
    rating: 4.8,
    experience: '18+ years',
  },
  {
    id: '6',
    name: 'Pandit Mishra',
    specialty: 'Plot Selection',
    image: 'https://picsum.photos/200/200?random=15',
    rating: 4.5,
    experience: '8+ years',
  },
];

const VaastuServicesScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConsultantPress = (_consultant: VaastuConsultant) => {
    // Navigate to consultant details
  };

  const renderConsultantCard = (consultant: VaastuConsultant) => (
    <TouchableOpacity
      key={consultant.id}
      style={styles.consultantCard}
      onPress={() => handleConsultantPress(consultant)}
    >
      <Image
        source={{ uri: consultant.image }}
        style={styles.consultantImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.consultantName} numberOfLines={1}>
          {consultant.name}
        </Text>
        <Text style={styles.consultantSpecialty} numberOfLines={1}>
          {consultant.specialty}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.ratingText}>{consultant.rating}</Text>
          </View>
          <Text style={styles.experienceText}>{consultant.experience}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vaastu Services</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Vaastu Consultants</Text>
        <Text style={styles.sectionSubtitle}>
          Expert Vaastu consultants for your home and office
        </Text>

        <View style={styles.cardsGrid}>
          {sampleConsultants.map((consultant) =>
            renderConsultantCard(consultant)
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  consultantCard: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  consultantImage: {
    width: '100%',
    height: cardWidth,
  },
  cardContent: {
    padding: 12,
  },
  consultantName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  consultantSpecialty: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  starIcon: {
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  experienceText: {
    fontSize: 12,
    color: '#999',
  },
  bottomPadding: {
    height: 30,
  },
});

export default VaastuServicesScreen;
