/**
 * Shared Profile Types
 *
 * Extended user profile data contracts
 */

// ============================================================================
// PROFILE
// ============================================================================

export interface Profile {
  id: string;
  userId: string;

  // Personal Information
  avatarUrl?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';

  // Address Information
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;

  // Location (for dealers/partners)
  latitude?: number;
  longitude?: number;
  locationName?: string;

  // Business Information (for dealers/partners)
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  panNumber?: string;
  businessLicense?: string;

  // Contact Information
  alternatePhone?: string;
  whatsappNumber?: string;
  websiteUrl?: string;

  // Social Links
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;

  // Referral
  referralCode?: string;
  referredBy?: string;
  commissionRate?: number;

  // Stats
  totalOrders?: number;
  totalRevenue?: number;
  averageRating?: number;
  totalReviews?: number;

  // Verification Status
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isBusinessVerified?: boolean;
  verifiedAt?: Date;

  // Settings
  notificationPreferences?: NotificationPreferences;
  languagePreference?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing?: boolean;
  orderUpdates?: boolean;
  promotions?: boolean;
}

// ============================================================================
// USER WITH PROFILE
// ============================================================================

export interface UserWithProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'GENERAL_USER' | 'PARTNER' | 'DEALER' | 'ADMIN';
  isActive: boolean;
  profile?: Profile;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// DEALER PROFILE (Extended)
// ============================================================================

export interface DealerProfile extends Profile {
  // Business Stats
  activeProducts?: number;
  pendingEnquiries?: number;
  pendingOrders?: number;
  customersContacted?: number;

  // Business Details
  establishedYear?: number;
  employeeCount?: number;
  serviceAreas?: string[];
  workingHours?: WorkingHours;
}

export interface WorkingHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string; // "09:00"
  close: string; // "18:00"
  isClosed?: boolean;
}

// ============================================================================
// PARTNER PROFILE (Extended)
// ============================================================================

export interface PartnerProfile extends Profile {
  // Business Stats
  totalWorks?: number;
  pendingEnquiries?: number;
  pendingOrders?: number;

  // Professional Details
  specializations?: string[];
  certifications?: string[];
  portfolioUrl?: string;
  yearsOfExperience?: number;
}

// ============================================================================
// PROFILE UPDATE
// ============================================================================

export interface UpdateProfileRequest {
  // Personal Information
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;

  // Address
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;

  // Location
  latitude?: number;
  longitude?: number;
  locationName?: string;

  // Business (dealer/partner only)
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  panNumber?: string;

  // Contact
  alternatePhone?: string;
  whatsappNumber?: string;
  websiteUrl?: string;

  // Social
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;

  // Settings
  notificationPreferences?: NotificationPreferences;
  languagePreference?: string;
}

// ============================================================================
// DEALER/PARTNER LISTING
// ============================================================================

export interface DealerListItem {
  id: string;
  userId: string;
  name: string;
  businessName?: string;
  avatarUrl?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  averageRating: number;
  totalReviews: number;
  activeProducts: number;
  distance?: number; // km, when searching by location
  isVerified: boolean;
}

export interface PartnerListItem {
  id: string;
  userId: string;
  name: string;
  businessName?: string;
  avatarUrl?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  averageRating: number;
  totalReviews: number;
  totalWorks: number;
  specializations?: string[];
  distance?: number;
  isVerified: boolean;
}

// ============================================================================
// PROFILE FILTERS
// ============================================================================

export interface DealerFilters {
  search?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // km
  minRating?: number;
  isVerified?: boolean;
  hasProducts?: boolean;
  sortBy?: 'rating' | 'distance' | 'reviews' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface PartnerFilters {
  search?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  minRating?: number;
  isVerified?: boolean;
  specialization?: string;
  sortBy?: 'rating' | 'distance' | 'reviews' | 'name' | 'experience';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// VERIFICATION
// ============================================================================

export interface VerificationRequest {
  userId: string;
  documentType: 'gst' | 'pan' | 'license' | 'identity';
  documentNumber: string;
  documentUrl: string;
}

export interface VerificationStatus {
  userId: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isBusinessVerified: boolean;
  documents: {
    type: string;
    status: 'pending' | 'verified' | 'rejected';
    submittedAt: Date;
    verifiedAt?: Date;
    rejectionReason?: string;
  }[];
}
