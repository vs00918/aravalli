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
}

export type SourceType = "video" | "podcast" | "book" | "paper" | "article" | "lecture";

export interface Source {
  id: string;
  title: string;
  type: SourceType | string;
  url?: string | null;
  author?: string | null;
  publishedDate?: string | null;
  summary?: string | null;
  createdAt: Date;
  updatedAt: Date;
  concepts?: SourceConcept[];
}

export interface SourceConcept {
  id: string;
  sourceId: string;
  conceptId: string;
  source?: Source;
  concept?: Concept;
  notes?: string | null;
}

export type RelationshipType =
  | "depends_on"
  | "causes"
  | "enables"
  | "analogous_to"
  | "mathematically_related_to"
  | "emerges_from"
  | "constrained_by"
  | "applied_in"
  | "historically_influenced_by";

export interface Connection {
  id: string;
  fromConceptId: string;
  toConceptId: string;
  relationshipType: RelationshipType | string;
  explanation: string;
  createdAt: Date;
  fromConcept?: Concept;
  toConcept?: Concept;
}
