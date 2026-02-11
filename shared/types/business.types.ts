/**
 * Shared Business Types
 * 
 * Common data contracts for Partner and Dealer features
 */

export interface Work {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  videos?: string[];
  location?: string;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: 'workshop' | 'seminar' | 'exhibition' | 'meetup' | 'other';
  startDate: Date;
  endDate?: Date;
  location: string;
  organizerId: string;
  organizerType: 'partner' | 'dealer' | 'admin';
  imageUrl?: string;
  registrationUrl?: string;
  createdAt: Date;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'buy_x_get_y';
  discountValue: number;
  validFrom: Date;
  validUntil: Date;
  applicableTo: 'all' | 'partners' | 'dealers' | 'users';
  termsAndConditions?: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: Date;
}

export interface LoyaltyPoint {
  id: string;
  userId: string;
  points: number;
  source: 'referral' | 'purchase' | 'event' | 'feedback' | 'admin_grant';
  description: string;
  expiresAt?: Date;
  createdAt: Date;
}

export interface SteelMarketUpdate {
  id: string;
  title: string;
  content: string;
  marketType: 'steel' | 'cement' | 'aggregate' | 'other';
  priceChange?: number;
  priceChangePercent?: number;
  region: string;
  source?: string;
  publishedAt: Date;
  createdAt: Date;
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  speaker: string;
  videoUrl?: string;
  slidesUrl?: string;
  duration?: number; // minutes
  category: string;
  scheduledAt?: Date;
  recordedAt?: Date;
  createdAt: Date;
}

export interface TradingAdvice {
  id: string;
  title: string;
  content: string;
  adviceType: 'buy' | 'sell' | 'hold' | 'general';
  materialType: string;
  targetPrice?: number;
  currentPrice?: number;
  validUntil?: Date;
  createdBy: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  projectType: 'residential' | 'commercial' | 'industrial' | 'infrastructure';
  location: string;
  estimatedBudget?: number;
  startDate?: Date;
  endDate?: Date;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: Date;
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  tenderNumber: string;
  organization: string;
  category: string;
  estimatedValue?: number;
  submissionDeadline: Date;
  openingDate?: Date;
  location: string;
  documentUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'open' | 'closed' | 'awarded';
  createdAt: Date;
}

export interface EducationPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  imageUrl?: string;
  attachments?: string[];
  tags?: string[];
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
  timeLimit?: number; // minutes
  isActive: boolean;
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  score: number;
  percentage: number;
  passed: boolean;
  timeSpent: number; // seconds
  completedAt: Date;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredEmail?: string;
  referredPhone?: string;
  referredName?: string;
  referralCode: string;
  status: 'pending' | 'registered' | 'completed' | 'expired';
  rewardPoints?: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface GalleryItem {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  imageUrl: string;
  category?: string;
  tags?: string[];
  createdAt: Date;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: string;
  message: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  attachments?: string[];
  readAt?: Date;
  createdAt: Date;
}

export interface ChatConversation {
  id: string;
  participantIds: string[];
  participantRoles: string[];
  lastMessage?: ChatMessage;
  unreadCount: Record<string, number>; // userId -> count
  createdAt: Date;
  updatedAt: Date;
}

export interface Statistics {
  totalWorks: number;
  totalEnquiries: number;
  totalFeedbacks: number;
  averageRating: number;
  totalReferrals: number;
  totalLoyaltyPoints: number;
  totalEvents: number;
  upcomingEvents: number;
  period: {
    start: Date;
    end: Date;
  };
}






