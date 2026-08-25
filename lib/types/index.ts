export interface Chapter {
  id: string;
  slug: string;
  title: string;
  icon: string;
  description: string;
  overview?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  concepts?: Concept[];
  questions?: Question[];
}

export type DifficultyTier = "FOUNDATION" | "CORE" | "INTERMEDIATE" | "ADVANCED" | "FRONTIER";

export interface Concept {
  id: string;
  slug: string;
  title: string;
  chapterId: string;
  chapter?: Chapter;
  difficulty: DifficultyTier | string;
  order: number;
  
  // Layered Explanations
  oneLiner: string;
  intuition?: string | null;
  howItWorks?: string | null;
  firstPrinciples?: string | null;
  mathematicalModel?: string | null;
  commonMisconceptions?: string | null;
  whyItMatters?: string | null;
  example?: string | null;
  
  createdAt: Date;
  updatedAt: Date;
  sources?: SourceConcept[];
  outgoingConnections?: Connection[];
  incomingConnections?: Connection[];
  questions?: Question[];
}

export type SourceType =
  | "YOUTUBE"
  | "PODCAST"
  | "BOOK"
  | "PAPER"
  | "ARTICLE"
  | "LECTURE"
  | "NOTE"
  | "OTHER";

export interface Source {
  id: string;
  title: string;
  type: SourceType | string;
  url?: string | null;
  author?: string | null;
  publisher?: string | null;
  publishedAt?: string | null;
  accessedAt?: Date | null;
  description?: string | null;
  transcript?: string | null;
  createdAt: Date;
  updatedAt: Date;
  concepts?: SourceConcept[];
  ingestionItems?: IngestionItem[];
}

export interface SourceConcept {
  id: string;
  sourceId: string;
  conceptId: string;
  source?: Source;
  concept?: Concept;
  relevance?: string | null;
  contributionType?: string | null;
  excerpt?: string | null;
  notes?: string | null;
  evidenceStatus?: string | null;
  createdAt?: Date;
}

export type RelationshipType =
  | "STRUCTURAL_ANALOGY"
  | "DIRECT_PHYSICAL_CONNECTION"
  | "CAUSAL_CONNECTION"
  | "MATHEMATICAL_CONNECTION"
  | "SHARED_PRINCIPLE"
  | "APPLICATION"
  | "CONTRAST";

export interface Connection {
  id: string;
  sourceConceptId: string;
  targetConceptId: string;
  relationshipType: RelationshipType | string;
  explanation: string;
  strength: number;
  createdAt: Date;
  sourceConcept?: Concept;
  targetConcept?: Concept;
}

export type QuestionStatus = "OPEN" | "EXPLORING" | "ANSWERED" | "ARCHIVED";

export interface Question {
  id: string;
  question: string;
  description?: string | null;
  chapterId?: string | null;
  chapter?: Chapter | null;
  relatedConceptId?: string | null;
  relatedConcept?: Concept | null;
  status: QuestionStatus | string;
  createdAt: Date;
  updatedAt: Date;
}

export type IngestionStatus = "INBOX" | "PROCESSING" | "REVIEW" | "ACCEPTED" | "REJECTED" | "ARCHIVED";

export interface IngestionItem {
  id: string;
  title: string;
  sourceId?: string | null;
  source?: Source | null;
  rawContent?: string | null;
  extractedSummary?: string | null;
  candidateConcepts?: string | null;
  candidateConnections?: string | null;
  targetChapterId?: string | null;
  status: IngestionStatus | string;
  createdAt: Date;
  updatedAt: Date;
}

export type SearchEntityType = "CONCEPT" | "CHAPTER" | "CONNECTION" | "QUESTION" | "SOURCE";

export interface SearchResultItem {
  id: string;
  title: string;
  snippet?: string;
  type: SearchEntityType;
  url: string;
  meta?: string;
}
