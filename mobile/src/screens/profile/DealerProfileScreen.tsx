/**
 * Dealer Profile Screen
 *
 * Displays dealer profile with:
 * - Profile header with avatar, name, category, rating
 * - Map location section
 * - Products section
 * - Images gallery
 * - Videos section
 * - Links section
 * - Feedbacks section
 * - Contact Dealer modal
 * - Give Feedback modal
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

interface Product {
  id: string;
  name: string;
  price?: string;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
}

interface Link {
  id: string;
  title: string;
  url: string;
}

interface Feedback {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Sample data
const sampleDealer = {
  id: '1',
  name: 'Steel Mart',
  category: 'Steel Dealer',
  rating: 4.7,
  reviewCount: 45,
  location: {
    address: '123 Industrial Area, Mumbai, Maharashtra',
    latitude: 19.076,
    longitude: 72.8777,
  },
  distance: 2.5,
  contactInfo: {
    phone: '+91 98765 43210',
    email: 'contact@steelmart.com',
  },
  description: 'Leading steel supplier with quality products and competitive prices.',
  products: [
    { id: '1', name: 'TMT Bars', price: '₹55,000/ton' },
    { id: '2', name: 'Steel Sheets', price: '₹48,000/ton' },
    { id: '3', name: 'Steel Pipes', price: '₹52,000/ton' },
    { id: '4', name: 'Angles', price: '₹50,000/ton' },
  ],
  images: [
    { id: '1', type: 'image' as const },
    { id: '2', type: 'image' as const },
    { id: '3', type: 'image' as const },
    { id: '4', type: 'image' as const },
  ],
  videos: [
    { id: '1', type: 'video' as const },
    { id: '2', type: 'video' as const },
  ],
  links: [
    { id: '1', title: 'Company Website', url: 'https://steelmart.com' },
    { id: '2', title: 'Product Catalog', url: 'https://steelmart.com/catalog' },
    { id: '3', title: 'Price List', url: 'https://steelmart.com/prices' },
  ],
  userFeedback: {
    rating: 4.5,
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua. Ut enim ad minim nostrud exercitation',
    date: '1 day ago',
  },
  feedbacks: [
    { id: '1', userName: 'Alok Das', rating: 4.5, comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolorealiqua. Ut enim ad minim veniam, quis nostrud exercitation laboris nisi ut aliquip exea commodo consequat.', date: '1 day ago' },
    { id: '2', userName: 'Alok Das', rating: 4.5, comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolorealiqua. Ut enim ad minim veniam, quis nostrud exercitation laboris nisi ut aliquip exea commodo consequat.', date: '1 day ago' },
    { id: '3', userName: 'Alok Das', rating: 4.5, comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolorealiqua. Ut enim ad minim veniam, quis nostrud exercitation laboris nisi ut aliquip exea commodo consequat.', date: '1 day ago' },
  ],
};

const DealerProfileScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dealerId = (route.params as any)?.dealerId;

  const [showContactModal, setShowContactModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [contactForm, setContactForm] = useState({ subject: '', email: '', message: '' });
  const [enquiryForm, setEnquiryForm] = useState({ topic: '', enquiry: '' });

  const dealer = sampleDealer;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleSubmitFeedback = () => {
    setShowFeedbackModal(false);
    setFeedbackRating(0);
    setFeedbackText('');
  };

  const handleSubmitContact = () => {
    setShowContactModal(false);
    setContactForm({ subject: '', email: '', message: '' });
  };

  const handleSubmitEnquiry = () => {
    setShowEnquiryModal(false);
    setEnquiryForm({ topic: '', enquiry: '' });
  };

  const renderStarRating = (rating: number, interactive: boolean = false) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            disabled={!interactive}
            onPress={() => interactive && setFeedbackRating(star)}
          >
            <Text style={[styles.star, star <= rating && styles.starFilled]}>
              {star <= rating ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dealer Profile</Text>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteToggle}>
          <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{dealer.name.charAt(0)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{dealer.name}</Text>
            <Text style={styles.profileCategory}>{dealer.category}</Text>
            <View style={styles.ratingRow}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{dealer.rating}</Text>
                <Text style={styles.ratingStar}>★</Text>
              </View>
              <Text style={styles.reviewCount}>({dealer.reviewCount} reviews)</Text>
            </View>
            {dealer.distance && (
              <Text style={styles.distanceText}>📍 {dealer.distance} km away</Text>
            )}
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>Get Directions</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapIcon}>📍</Text>
            <Text style={styles.mapText}>Map View</Text>
          </View>
          <Text style={styles.addressText}>{dealer.location.address}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>📞 {dealer.contactInfo.phone}</Text>
            <Text style={styles.contactItem}>✉️ {dealer.contactInfo.email}</Text>
          </View>
        </View>

        {/* Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Products</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dealer.products.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productImage} />
                <Text style={styles.productName}>{product.name}</Text>
                {product.price && <Text style={styles.productPrice}>{product.price}</Text>}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Images */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Images</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mediaGrid}>
            {dealer.images.map((img) => (
              <View key={img.id} style={styles.mediaItem}>
                <View style={styles.mediaPlaceholder} />
              </View>
            ))}
          </View>
        </View>

        {/* Videos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Videos</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dealer.videos.map((video) => (
              <View key={video.id} style={styles.videoCard}>
                <View style={styles.videoPlaceholder}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Links</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {dealer.links.map((link) => (
            <TouchableOpacity key={link.id} style={styles.linkItem}>
              <Text style={styles.linkIcon}>🔗</Text>
              <Text style={styles.linkText}>{link.title}</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Your Feedback */}
        {dealer.userFeedback && (
          <View style={styles.section}>
            <View style={styles.userFeedbackHeader}>
              <Text style={styles.userFeedbackTitle}>Your Feedback</Text>
              <Text style={styles.feedbackDate}>{dealer.userFeedback.date}</Text>
            </View>
            <View style={styles.userFeedbackRating}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.userRatingText}>{dealer.userFeedback.rating}</Text>
            </View>
            <Text style={styles.userFeedbackComment}>{dealer.userFeedback.comment}</Text>
          </View>
        )}

        {/* Feedbacks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          {dealer.feedbacks.map((feedback) => (
            <View key={feedback.id} style={styles.feedbackItem}>
              <View style={styles.feedbackItemHeader}>
                <Text style={styles.feedbackName}>{feedback.userName}</Text>
                <Text style={styles.feedbackDate}>{feedback.date}</Text>
              </View>
              <View style={styles.feedbackRatingRow}>
                <Text style={styles.starIconSmall}>★</Text>
                <Text style={styles.feedbackRatingText}>{feedback.rating}</Text>
              </View>
              <Text style={styles.feedbackComment}>{feedback.comment}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.contactPartnerButton} onPress={() => setShowContactModal(true)}>
          <Text style={styles.contactPartnerText}>Contact partner</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.enquiryBottomButton} onPress={() => setShowEnquiryModal(true)}>
          <Text style={styles.enquiryBottomText}>Enquiry</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Feedback Button */}
      <TouchableOpacity style={styles.floatingFeedbackButton} onPress={() => setShowFeedbackModal(true)}>
        <Text style={styles.floatingFeedbackIcon}>✏️</Text>
      </TouchableOpacity>

      {/* Contact Modal */}
      <Modal
        visible={showContactModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.contactModalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft} />
              <Text style={styles.modalTitle}>Contact Dealer form</Text>
              <TouchableOpacity onPress={() => setShowContactModal(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.contactInput}
              placeholder="Subject"
              placeholderTextColor="#999"
              value={contactForm.subject}
              onChangeText={(text) => setContactForm({ ...contactForm, subject: text })}
            />
            <TextInput
              style={styles.contactInput}
              placeholder="Email or Phone"
              placeholderTextColor="#999"
              value={contactForm.email}
              onChangeText={(text) => setContactForm({ ...contactForm, email: text })}
            />
            <TextInput
              style={[styles.contactInput, styles.contactTextarea]}
              placeholder="Message"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={contactForm.message}
              onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
            />

            {/* reCAPTCHA placeholder */}
            <View style={styles.recaptchaRow}>
              <View style={styles.recaptchaPlaceholder}>
                <Text style={styles.recaptchaText}>protected by reCAPTCHA</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.contactSubmitButton,
                  (!contactForm.subject || !contactForm.email || !contactForm.message) && styles.contactSubmitButtonDisabled,
                ]}
                onPress={handleSubmitContact}
              >
                <Text style={styles.contactSubmitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Give Feedback</Text>
              <TouchableOpacity onPress={() => setShowFeedbackModal(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.ratingLabel}>Rate your experience</Text>
            <View style={styles.ratingSelector}>
              {renderStarRating(feedbackRating, true)}
            </View>

            <TextInput
              style={[styles.modalInput, styles.modalTextarea]}
              placeholder="Write your feedback..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={feedbackText}
              onChangeText={setFeedbackText}
            />

            <TouchableOpacity style={styles.modalSubmitButton} onPress={handleSubmitFeedback}>
              <Text style={styles.modalSubmitText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Enquiry Modal */}
      <Modal
        visible={showEnquiryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEnquiryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Enquiry</Text>
              <TouchableOpacity onPress={() => setShowEnquiryModal(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Topic"
              placeholderTextColor="#999"
              value={enquiryForm.topic}
              onChangeText={(text) => setEnquiryForm({ ...enquiryForm, topic: text })}
            />
            <TextInput
              style={[styles.modalInput, styles.modalTextarea]}
              placeholder="Your Enquiry"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={enquiryForm.enquiry}
              onChangeText={(text) => setEnquiryForm({ ...enquiryForm, enquiry: text })}
            />

            <TouchableOpacity style={styles.modalSubmitButton} onPress={handleSubmitEnquiry}>
              <Text style={styles.modalSubmitText}>Send Enquiry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  favoriteButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#E91E63',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profileCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 2,
  },
  ratingStar: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
  },
  distanceText: {
    fontSize: 12,
    color: '#FF6B35',
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  viewAll: {
    fontSize: 14,
    color: '#FF6B35',
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mapIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  mapText: {
    fontSize: 14,
    color: '#666',
  },
  addressText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  contactRow: {
    gap: 4,
  },
  contactItem: {
    fontSize: 14,
    color: '#666',
  },
  productCard: {
    width: 120,
    marginRight: 12,
  },
  productImage: {
    width: 120,
    height: 80,
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaItem: {
    width: '23%',
    aspectRatio: 1,
  },
  mediaPlaceholder: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
  },
  videoCard: {
    width: 160,
    height: 100,
    marginRight: 12,
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 30,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  linkIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  linkArrow: {
    fontSize: 18,
    color: '#999',
  },
  // User Feedback Section
  userFeedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userFeedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  userFeedbackRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 4,
  },
  userRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  userFeedbackComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // Feedback List
  feedbackItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  feedbackItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  feedbackDate: {
    fontSize: 12,
    color: '#999',
  },
  feedbackRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIconSmall: {
    fontSize: 14,
    color: '#4CAF50',
    marginRight: 4,
  },
  feedbackRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  feedbackCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  feedbackAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  feedbackInfo: {
    flex: 1,
  },
  feedbackName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  feedbackComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  starContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
    color: '#DDD',
    marginRight: 2,
  },
  starFilled: {
    color: '#FFB800',
  },
  enquiryButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  enquiryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
    }),
  },
  contactPartnerButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  contactPartnerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  enquiryBottomButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  enquiryBottomText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  floatingFeedbackButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  floatingFeedbackIcon: {
    fontSize: 20,
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  feedbackButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  feedbackButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalClose: {
    fontSize: 28,
    color: '#666',
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  modalTextarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  modalSubmitButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
  },
  modalSubmitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  ratingSelector: {
    alignItems: 'center',
    marginBottom: 20,
  },
  // Contact Modal Styles
  contactModalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  modalHeaderLeft: {
    width: 32,
  },
  contactInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  contactTextarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  recaptchaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  recaptchaPlaceholder: {
    backgroundColor: '#1A3A5C',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recaptchaText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  contactSubmitButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  contactSubmitButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  contactSubmitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default DealerProfileScreen;
