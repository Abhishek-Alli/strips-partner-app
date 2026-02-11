/**
 * Contact Service
 * 
 * Handles contact enquiry submissions
 */

import { apiClient } from './apiClient';
import { mockService } from './mock/mockService';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '../core/security/inputSanitizer';

export interface ContactEnquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  recaptchaToken?: string;
  created_at?: string;
}

export interface ContactEnquiryResponse {
  enquiry: ContactEnquiry;
  message: string;
}

export interface ContactEnquiriesResponse {
  enquiries: ContactEnquiry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ContactService {
  /**
   * Submit contact enquiry
   */
  async submitEnquiry(data: ContactEnquiry): Promise<ContactEnquiryResponse> {
    // Sanitize inputs
    const sanitizedData: ContactEnquiry = {
      name: sanitizeString(data.name),
      email: sanitizeEmail(data.email),
      phone: sanitizePhone(data.phone),
      subject: sanitizeString(data.subject),
      message: sanitizeString(data.message),
      recaptchaToken: data.recaptchaToken,
    };

    if (apiClient.isMockMode()) {
      return mockService.submitContactEnquiry(sanitizedData);
    }

    return apiClient.post<ContactEnquiryResponse>('/contact', sanitizedData);
  }

  /**
   * Get all contact enquiries (Admin only)
   */
  async getAllEnquiries(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<ContactEnquiriesResponse> {
    const sanitizedSearch = sanitizeString(search);

    if (apiClient.isMockMode()) {
      return mockService.getContactEnquiries(page, limit, sanitizedSearch);
    }

    return apiClient.get<ContactEnquiriesResponse>('/contact/enquiries', {
      params: { page, limit, search: sanitizedSearch }
    });
  }

  /**
   * Get enquiry by ID (Admin only)
   */
  async getEnquiryById(id: string): Promise<{ enquiry: ContactEnquiry }> {
    if (apiClient.isMockMode()) {
      return mockService.getContactEnquiryById(id);
    }

    return apiClient.get<{ enquiry: ContactEnquiry }>(`/contact/enquiries/${id}`);
  }
}

export const contactService = new ContactService();






