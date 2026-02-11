/**
 * Shared Dealer Service
 * 
 * Common business logic for Dealer features
 * Platform-agnostic service layer
 */

import {
  DealerProduct,
  MasterProduct,
  DealerEnquiry,
  DealerFeedback,
  DealerOffer,
  DealerStats,
} from '../types/dealer.types';

// Mock data stores
const dealerProductsStore: DealerProduct[] = [];
const masterProductsStore: MasterProduct[] = [
  { id: 'mp1', name: 'Cement (OPC 53 Grade)', category: 'Cement', unit: 'Bag', isActive: true, createdAt: new Date() },
  { id: 'mp2', name: 'Steel TMT Bars', category: 'Steel', unit: 'Ton', isActive: true, createdAt: new Date() },
  { id: 'mp3', name: 'Sand (River)', category: 'Aggregates', unit: 'Cubic Meter', isActive: true, createdAt: new Date() },
  { id: 'mp4', name: 'Aggregate (20mm)', category: 'Aggregates', unit: 'Cubic Meter', isActive: true, createdAt: new Date() },
  { id: 'mp5', name: 'Bricks (Red)', category: 'Bricks', unit: 'Piece', isActive: true, createdAt: new Date() },
];
const dealerEnquiriesStore: DealerEnquiry[] = [];
const dealerFeedbacksStore: DealerFeedback[] = [];
const dealerOffersStore: DealerOffer[] = [];

export class DealerService {
  // Products
  async getMasterProducts(): Promise<MasterProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return masterProductsStore.filter(p => p.isActive);
  }

  async getDealerProducts(dealerId: string): Promise<DealerProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return dealerProductsStore.filter(p => p.dealerId === dealerId);
  }

  async addDealerProduct(product: Omit<DealerProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<DealerProduct> {
    const masterProduct = masterProductsStore.find(mp => mp.id === product.productId);
    if (!masterProduct) throw new Error('Master product not found');

    const newProduct: DealerProduct = {
      ...product,
      productName: masterProduct.name,
      id: `dp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dealerProductsStore.push(newProduct);
    return newProduct;
  }

  async updateDealerProduct(productId: string, updates: Partial<DealerProduct>): Promise<DealerProduct> {
    const index = dealerProductsStore.findIndex(p => p.id === productId);
    if (index === -1) throw new Error('Product not found');
    dealerProductsStore[index] = { ...dealerProductsStore[index], ...updates, updatedAt: new Date() };
    return dealerProductsStore[index];
  }

  async deleteDealerProduct(productId: string): Promise<void> {
    const index = dealerProductsStore.findIndex(p => p.id === productId);
    if (index === -1) throw new Error('Product not found');
    dealerProductsStore.splice(index, 1);
  }

  // Enquiries
  async getDealerEnquiries(dealerId: string, filters?: { status?: string }): Promise<DealerEnquiry[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return dealerEnquiriesStore
      .filter(e => {
        if (e.dealerId !== dealerId) return false;
        if (filters?.status && e.status !== filters.status) return false;
        return true;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getDealerEnquiryById(enquiryId: string): Promise<DealerEnquiry | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return dealerEnquiriesStore.find(e => e.id === enquiryId) || null;
  }

  async respondToEnquiry(enquiryId: string, response: string): Promise<DealerEnquiry> {
    const enquiry = dealerEnquiriesStore.find(e => e.id === enquiryId);
    if (!enquiry) throw new Error('Enquiry not found');
    enquiry.response = response;
    enquiry.status = 'responded';
    enquiry.respondedAt = new Date();
    enquiry.updatedAt = new Date();
    return enquiry;
  }

  async sendEnquiryToAdmin(dealerId: string, topic: string, message: string): Promise<void> {
    // In production, this would create an enquiry with admin as recipient
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Dealer ${dealerId} sent enquiry to admin: ${topic}`);
  }

  // Feedbacks
  async getDealerFeedbacks(dealerId: string): Promise<DealerFeedback[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return dealerFeedbacksStore
      .filter(f => f.dealerId === dealerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async reportFeedback(feedbackId: string, reason: string): Promise<void> {
    const feedback = dealerFeedbacksStore.find(f => f.id === feedbackId);
    if (!feedback) throw new Error('Feedback not found');
    feedback.isReported = true;
    feedback.reportedReason = reason;
  }

  // Offers
  async getDealerOffers(dealerId: string): Promise<DealerOffer[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return dealerOffersStore.filter(o => o.dealerId === dealerId);
  }

  async likeOffer(dealerId: string, offerId: string): Promise<DealerOffer> {
    let offer = dealerOffersStore.find(o => o.dealerId === dealerId && o.offerId === offerId);
    if (!offer) {
      offer = {
        id: `do_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        offerId,
        dealerId,
        isLiked: true,
        likedAt: new Date(),
      };
      dealerOffersStore.push(offer);
    } else {
      offer.isLiked = !offer.isLiked;
      offer.likedAt = offer.isLiked ? new Date() : undefined;
    }
    return offer;
  }

  // Statistics
  async getDealerStats(dealerId: string): Promise<DealerStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const products = dealerProductsStore.filter(p => p.dealerId === dealerId);
    const enquiries = dealerEnquiriesStore.filter(e => e.dealerId === dealerId);
    const feedbacks = dealerFeedbacksStore.filter(f => f.dealerId === dealerId);
    const offers = dealerOffersStore.filter(o => o.dealerId === dealerId);

    const totalRating = feedbacks.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;

    const uniqueCustomers = new Set(enquiries.map(e => e.userId)).size;

    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === 'active').length,
      totalEnquiries: enquiries.length,
      newEnquiries: enquiries.filter(e => e.status === 'new').length,
      respondedEnquiries: enquiries.filter(e => e.status === 'responded').length,
      customersContacted: uniqueCustomers,
      totalFeedbacks: feedbacks.length,
      averageRating,
      totalOffers: offers.length,
      likedOffers: offers.filter(o => o.isLiked).length,
    };
  }
}

export const dealerService = new DealerService();






