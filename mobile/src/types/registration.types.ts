/**
 * Registration Types
 *
 * Types and interfaces for registration flow
 */

import { UserRole } from './auth.types';

/**
 * User type selection for registration
 */
export enum UserType {
  GENERAL_USER = 'GENERAL_USER',
  INFLUENCER_PARTNER = 'INFLUENCER_PARTNER',
  DEALER = 'DEALER',
  // Legacy types for backwards compatibility
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
  OTHER = 'OTHER'
}

/**
 * Partner subtype for Influencer/Partner registration
 */
export enum PartnerSubtype {
  ENGINEER = 'ENGINEER',
  ARCHITECT = 'ARCHITECT',
  VAASTU_SERVICE_PROVIDER = 'VAASTU_SERVICE_PROVIDER'
}

/**
 * User type option with display info
 */
export interface UserTypeOption {
  type: UserType;
  title: string;
  description: string;
  role: UserRole;
  backgroundColor?: string;
  iconColor?: string;
}

/**
 * Partner subtype option
 */
export interface PartnerSubtypeOption {
  type: PartnerSubtype;
  title: string;
  subtitle: string;
}

/**
 * Registration form data
 */
export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
  partnerSubtype?: PartnerSubtype;
}

/**
 * Social registration data
 */
export interface SocialRegistrationData {
  name: string;
  email: string;
  phone: string;
  referralCode?: string;
  socialId: string;
  provider: 'google' | 'facebook';
}

/**
 * OTP verification params
 */
export interface OTPVerificationParams {
  email: string;
  phone: string;
  isRegistration?: boolean;
  userType?: UserType;
}

/**
 * Registration navigation params
 */
export interface SignupStep2Params {
  userType: UserType;
  role?: UserRole;
}

export interface SignupStep2SocialParams extends SignupStep2Params {
  socialData: SocialRegistrationData;
}
