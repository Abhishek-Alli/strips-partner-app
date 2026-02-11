/**
 * Shared Business Service
 * 
 * Common business logic for Partner and Dealer features
 * Platform-agnostic service layer
 */

import {
  Work,
  Event,
  Offer,
  LoyaltyPoint,
  SteelMarketUpdate,
  Lecture,
  TradingAdvice,
  Project,
  Tender,
  EducationPost,
  Quiz,
  QuizAttempt,
  Referral,
  GalleryItem,
  Note,
  Statistics,
} from '../types/business.types';

// Mock data store (in production, this would be API calls)
const worksStore: Work[] = [];
const eventsStore: Event[] = [];
const offersStore: Offer[] = [];
const loyaltyPointsStore: LoyaltyPoint[] = [];
const steelUpdatesStore: SteelMarketUpdate[] = [];
const lecturesStore: Lecture[] = [];
const tradingAdvicesStore: TradingAdvice[] = [];
const projectsStore: Project[] = [];
const tendersStore: Tender[] = [];
const educationPostsStore: EducationPost[] = [];
const quizzesStore: Quiz[] = [];
const quizAttemptsStore: QuizAttempt[] = [];
const referralsStore: Referral[] = [];
const galleryStore: GalleryItem[] = [];
const notesStore: Note[] = [];

export class BusinessService {
  // Works / Portfolio
  async getWorks(userId: string, filters?: { category?: string }): Promise<Work[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return worksStore.filter(w => w.userId === userId && (!filters?.category || w.category === filters.category));
  }

  async createWork(work: Omit<Work, 'id' | 'createdAt' | 'updatedAt'>): Promise<Work> {
    const newWork: Work = {
      ...work,
      id: `work_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    worksStore.push(newWork);
    return newWork;
  }

  async updateWork(workId: string, updates: Partial<Work>): Promise<Work> {
    const index = worksStore.findIndex(w => w.id === workId);
    if (index === -1) throw new Error('Work not found');
    worksStore[index] = { ...worksStore[index], ...updates, updatedAt: new Date() };
    return worksStore[index];
  }

  async deleteWork(workId: string): Promise<void> {
    const index = worksStore.findIndex(w => w.id === workId);
    if (index === -1) throw new Error('Work not found');
    worksStore.splice(index, 1);
  }

  // Events
  async getEvents(filters?: { eventType?: string; organizerId?: string }): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return eventsStore.filter(e => {
      if (filters?.eventType && e.eventType !== filters.eventType) return false;
      if (filters?.organizerId && e.organizerId !== filters.organizerId) return false;
      return true;
    });
  }

  async createEvent(event: Omit<Event, 'id' | 'createdAt'>): Promise<Event> {
    const newEvent: Event = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
    };
    eventsStore.push(newEvent);
    return newEvent;
  }

  // Offers & Discounts
  async getOffers(filters?: { applicableTo?: string }): Promise<Offer[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const now = new Date();
    return offersStore.filter(o => {
      if (filters?.applicableTo && o.applicableTo !== filters.applicableTo && o.applicableTo !== 'all') return false;
      return o.validFrom <= now && (!o.validUntil || o.validUntil >= now);
    });
  }

  // Loyalty Points
  async getLoyaltyPoints(userId: string): Promise<{ total: number; history: LoyaltyPoint[] }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const history = loyaltyPointsStore.filter(lp => lp.userId === userId);
    const total = history.reduce((sum, lp) => {
      const now = new Date();
      if (lp.expiresAt && lp.expiresAt < now) return sum;
      return sum + lp.points;
    }, 0);
    return { total, history };
  }

  // Steel Market Updates
  async getSteelMarketUpdates(filters?: { marketType?: string; region?: string }): Promise<SteelMarketUpdate[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return steelUpdatesStore.filter(u => {
      if (filters?.marketType && u.marketType !== filters.marketType) return false;
      if (filters?.region && u.region !== filters.region) return false;
      return true;
    }).sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  // Lectures
  async getLectures(filters?: { category?: string }): Promise<Lecture[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return lecturesStore.filter(l => !filters?.category || l.category === filters.category)
      .sort((a, b) => {
        if (a.scheduledAt && b.scheduledAt) return a.scheduledAt.getTime() - b.scheduledAt.getTime();
        if (a.scheduledAt) return -1;
        if (b.scheduledAt) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }

  // Trading Advices
  async getTradingAdvices(filters?: { adviceType?: string; materialType?: string }): Promise<TradingAdvice[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return tradingAdvicesStore.filter(a => {
      if (filters?.adviceType && a.adviceType !== filters.adviceType) return false;
      if (filters?.materialType && a.materialType !== filters.materialType) return false;
      if (a.validUntil && a.validUntil < new Date()) return false;
      return true;
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Projects
  async getProjects(filters?: { status?: string; projectType?: string }): Promise<Project[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return projectsStore.filter(p => {
      if (filters?.status && p.status !== filters.status) return false;
      if (filters?.projectType && p.projectType !== filters.projectType) return false;
      return true;
    }).sort((a, b) => {
      if (a.startDate && b.startDate) return a.startDate.getTime() - b.startDate.getTime();
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  // Tenders
  async getTenders(filters?: { status?: string; category?: string }): Promise<Tender[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return tendersStore.filter(t => {
      if (filters?.status && t.status !== filters.status) return false;
      if (filters?.category && t.category !== filters.category) return false;
      return true;
    }).sort((a, b) => a.submissionDeadline.getTime() - b.submissionDeadline.getTime());
  }

  // Education Posts
  async getEducationPosts(filters?: { category?: string; tag?: string }): Promise<EducationPost[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return educationPostsStore.filter(p => {
      if (filters?.category && p.category !== filters.category) return false;
      if (filters?.tag && !p.tags?.includes(filters.tag)) return false;
      return true;
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Quizzes
  async getQuizzes(filters?: { category?: string; isActive?: boolean }): Promise<Quiz[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return quizzesStore.filter(q => {
      if (filters?.category && q.category !== filters.category) return false;
      if (filters?.isActive !== undefined && q.isActive !== filters.isActive) return false;
      return true;
    });
  }

  async submitQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completedAt'>): Promise<QuizAttempt> {
    const quiz = quizzesStore.find(q => q.id === attempt.quizId);
    if (!quiz) throw new Error('Quiz not found');

    // Calculate score
    let correct = 0;
    Object.entries(attempt.answers).forEach(([questionId, selectedIndex]) => {
      const question = quiz.questions.find(q => q.id === questionId);
      if (question && question.correctAnswer === selectedIndex) correct++;
    });

    const percentage = (correct / quiz.questions.length) * 100;
    const passed = percentage >= quiz.passingScore;

    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      score: correct,
      percentage,
      passed,
      completedAt: new Date(),
    };

    quizAttemptsStore.push(newAttempt);
    return newAttempt;
  }

  // Referrals
  async getReferrals(userId: string): Promise<Referral[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return referralsStore.filter(r => r.referrerId === userId);
  }

  async createReferral(referral: Omit<Referral, 'id' | 'createdAt' | 'status'>): Promise<Referral> {
    const newReferral: Referral = {
      ...referral,
      id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      status: 'pending',
      createdAt: new Date(),
    };
    referralsStore.push(newReferral);
    return newReferral;
  }

  // Gallery
  async getGallery(userId: string, filters?: { category?: string }): Promise<GalleryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return galleryStore.filter(g => g.userId === userId && (!filters?.category || g.category === filters.category))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addGalleryItem(item: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<GalleryItem> {
    const newItem: GalleryItem = {
      ...item,
      id: `gallery_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
    };
    galleryStore.push(newItem);
    return newItem;
  }

  async deleteGalleryItem(itemId: string): Promise<void> {
    const index = galleryStore.findIndex(g => g.id === itemId);
    if (index === -1) throw new Error('Gallery item not found');
    galleryStore.splice(index, 1);
  }

  // Notes
  async getNotes(userId: string, filters?: { category?: string; isPinned?: boolean }): Promise<Note[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return notesStore.filter(n => {
      if (n.userId !== userId) return false;
      if (filters?.category && n.category !== filters.category) return false;
      if (filters?.isPinned !== undefined && n.isPinned !== filters.isPinned) return false;
      return true;
    }).sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }

  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    notesStore.push(newNote);
    return newNote;
  }

  async updateNote(noteId: string, updates: Partial<Note>): Promise<Note> {
    const index = notesStore.findIndex(n => n.id === noteId);
    if (index === -1) throw new Error('Note not found');
    notesStore[index] = { ...notesStore[index], ...updates, updatedAt: new Date() };
    return notesStore[index];
  }

  async deleteNote(noteId: string): Promise<void> {
    const index = notesStore.findIndex(n => n.id === noteId);
    if (index === -1) throw new Error('Note not found');
    notesStore.splice(index, 1);
  }

  // Statistics
  async getStatistics(userId: string, startDate: Date, endDate: Date): Promise<Statistics> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In production, these would be aggregated from database
    return {
      totalWorks: worksStore.filter(w => w.userId === userId).length,
      totalEnquiries: 0, // Would come from enquiry service
      totalFeedbacks: 0, // Would come from feedback service
      averageRating: 4.5, // Would come from feedback service
      totalReferrals: referralsStore.filter(r => r.referrerId === userId).length,
      totalLoyaltyPoints: (await this.getLoyaltyPoints(userId)).total,
      totalEvents: eventsStore.filter(e => e.organizerId === userId).length,
      upcomingEvents: eventsStore.filter(e => 
        e.organizerId === userId && 
        e.startDate > new Date()
      ).length,
      period: { start: startDate, end: endDate },
    };
  }
}

export const businessService = new BusinessService();






