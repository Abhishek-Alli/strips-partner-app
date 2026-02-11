/**
 * Form Validation Utilities
 * 
 * Reusable validation functions for registration and forms
 */

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation regex (supports international format)
 * Allows digits, spaces, dashes, parentheses, and + for country code
 */
const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

/**
 * Minimum password length
 */
const MIN_PASSWORD_LENGTH = 8;

/**
 * Validate email format
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove common formatting characters for validation
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's all digits (with optional + at start)
  if (!/^\+?[0-9]{10,15}$/.test(cleaned)) {
    return { isValid: false, error: 'Invalid phone number format' };
  }

  return { isValid: true };
}

/**
 * Validate password
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { 
      isValid: false, 
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` 
    };
  }

  return { isValid: true };
}

/**
 * Validate name
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  return { isValid: true };
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): { isValid: boolean; error?: string } {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
}

/**
 * Validate OTP (6 digits)
 */
export function validateOTP(otp: string): { isValid: boolean; error?: string } {
  if (!otp || otp.trim().length === 0) {
    return { isValid: false, error: 'OTP is required' };
  }

  if (!/^\d{6}$/.test(otp.trim())) {
    return { isValid: false, error: 'OTP must be 6 digits' };
  }

  return { isValid: true };
}

/**
 * Interface for form validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate registration form
 */
export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
}

export function validateRegistrationForm(data: RegistrationFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate name
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error || 'Invalid name';
  }

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error || 'Invalid email';
  }

  // Validate phone
  const phoneValidation = validatePhone(data.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error || 'Invalid phone';
  }

  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error || 'Invalid password';
  }

  // Validate password confirmation
  const confirmPasswordValidation = validatePasswordConfirmation(
    data.password,
    data.confirmPassword
  );
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error || 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
