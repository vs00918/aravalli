/**
 * Personal Revision State & Storage Abstraction
 * Separates mutable personal student progress from immutable canonical CA knowledge.
 */

export type SelfRating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

export interface TopicRevisionRecord {
  topicId: string;
  reviewCount: number;
  lastReviewedAt: string; // ISO Date string
  lastRating: SelfRating;
  isWeak: boolean; // Computed: rated AGAIN or HARD in last review
  history: Array<{
    reviewedAt: string;
    rating: SelfRating;
  }>;
}

export interface SessionResult {
  sessionId: string;
  completedAt: string;
  totalTopics: number;
  totalPrompts: number;
  ratingCounts: {
    AGAIN: number;
    HARD: number;
    GOOD: number;
    EASY: number;
  };
  weakTopicIds: string[];
}

export interface RevisionStateRepository {
  getTopicRecord(topicId: string): TopicRevisionRecord | null;
  getAllRecords(): Record<string, TopicRevisionRecord>;
  recordReview(topicId: string, rating: SelfRating): TopicRevisionRecord;
  saveSession(session: SessionResult): void;
  getRecentSessions(): SessionResult[];
  clearAllState(): void;
}

const STORAGE_KEY = 'aravalli_banking_ca_revision_state_v1';
const SESSIONS_KEY = 'aravalli_banking_ca_revision_sessions_v1';

/**
 * Browser-safe LocalRevisionStateRepository implementation.
 * Gracefully handles SSR environments by falling back to memory.
 */
export class LocalRevisionStateRepository implements RevisionStateRepository {
  private memoryStore: Record<string, TopicRevisionRecord> = {};
  private memorySessions: SessionResult[] = [];

  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  getAllRecords(): Record<string, TopicRevisionRecord> {
    if (!this.isClient()) return this.memoryStore;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return this.memoryStore;
    }
  }

  getTopicRecord(topicId: string): TopicRevisionRecord | null {
    const all = this.getAllRecords();
    return all[topicId] || null;
  }

  recordReview(topicId: string, rating: SelfRating): TopicRevisionRecord {
    const all = this.getAllRecords();
    const existing = all[topicId];
    const now = new Date().toISOString();

    const record: TopicRevisionRecord = {
      topicId,
      reviewCount: (existing ? existing.reviewCount : 0) + 1,
      lastReviewedAt: now,
      lastRating: rating,
      isWeak: rating === 'AGAIN' || rating === 'HARD',
      history: [
        ...(existing ? existing.history : []),
        { reviewedAt: now, rating }
      ]
    };

    all[topicId] = record;

    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      } catch (err) {
        console.error('Failed to save revision record to localStorage:', err);
      }
    } else {
      this.memoryStore[topicId] = record;
    }

    return record;
  }

  saveSession(session: SessionResult): void {
    const sessions = this.getRecentSessions();
    sessions.unshift(session);
    const trimmed = sessions.slice(0, 50); // Keep last 50 sessions

    if (this.isClient()) {
      try {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmed));
      } catch (err) {
        console.error('Failed to save session to localStorage:', err);
      }
    } else {
      this.memorySessions = trimmed;
    }
  }

  getRecentSessions(): SessionResult[] {
    if (!this.isClient()) return this.memorySessions;
    try {
      const data = localStorage.getItem(SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return this.memorySessions;
    }
  }

  clearAllState(): void {
    if (this.isClient()) {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SESSIONS_KEY);
      } catch {}
    }
    this.memoryStore = {};
    this.memorySessions = [];
  }
}

// Global Singleton Instance
export const revisionRepository = new LocalRevisionStateRepository();
