import { CategoryId, PriorityLevel, RegulatoryStatus, SourceReference } from '../schema';
import { OfficialVerificationEvidence, TrustState } from '../trust-architecture';

export interface RawIncomingFeedItem {
  id?: string;
  headline: string;
  bodyText: string;
  sourceName: 'CGB_MENTORS' | 'SMARTKEEDA' | 'PIB' | 'OFFICIAL_GAZETTE' | 'OTHER';
  batchName: string;
  publishedDate: string;
  pageNumbers?: number[];
  categoryHint?: string;
  priorityHint?: 'P1' | 'P2' | 'P3' | 'P4';
}

export interface ExtractedFactClaim {
  claimId: string;
  claimText: string;
  numericValues?: string[];
  namedEntities?: string[];
  effectiveDate?: string;
}

export interface ExtractedEvent {
  eventId: string;
  title: string;
  slugCandidate: string;
  category: CategoryId;
  priority: PriorityLevel;
  primaryInstitution: string;
  regulatoryStatus?: RegulatoryStatus;
  eventDate: string;
  sourceReference: SourceReference;
  claims: ExtractedFactClaim[];
  mustMemorizeFacts: string[];
  knowUnderstandContext: string[];
  examFocus: string[];
  rawText: string;
}

export type EntityResolutionOutcome = 
  | 'NEW_ENTITY'
  | 'EXACT_MATCH'
  | 'COMPLEMENTARY_MATCH'
  | 'AMBIGUOUS_MATCH';

export interface EntityResolutionResult {
  outcome: EntityResolutionOutcome;
  matchedTopicSlug?: string;
  confidenceScore: number;
  reason: string;
}

export interface VerificationRegistryRecord {
  recordId: string;
  entitySlug: string;
  claimId: string;
  authority: string;
  documentIdentifier: string;
  requestedUrl: string;
  finalUrl: string;
  httpStatus: number;
  contentType: string;
  documentTitle: string;
  publicationDate: string;
  retrievalTimestamp: string;
  artifactHash: string;
  artifactPath: string;
  evidencePassage: string;
  evidenceLocator: string;
  canonicalClaim: string;
  observedValue: string;
  verificationStatus: 'OFFICIALLY_VERIFIED' | 'EXTERNAL_VERIFICATION_PENDING' | 'SOURCE_UNAVAILABLE' | 'CONFLICT_DETECTED';
}

export interface ReviewQueueItem {
  queueId: string;
  timestamp: string;
  reason: 'CONFLICT_DETECTED' | 'AMBIGUOUS_ENTITY_MATCH' | 'CONTENT_QUALITY_DEFECT' | 'UNRESOLVED_PRIMARY_SOURCE';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  topicSlug?: string;
  incomingFeedItemId?: string;
  description: string;
  conflictingDetails?: {
    existingClaim: string;
    incomingClaim: string;
    incomingSource: string;
  };
  resolved: boolean;
}

export interface PipelineReport {
  timestamp: string;
  batchId: string;
  totalIncomingItems: number;
  newEntitiesCreated: number;
  existingEntitiesMatched: number;
  exactDuplicatesFiltered: number;
  complementaryEnrichments: number;
  verificationsReused: number;
  newOfficialVerifications: number;
  reviewQueueItemsCreated: number;
  topicsProcessed: {
    slug: string;
    title: string;
    action: 'CREATED' | 'ENRICHED' | 'PROVENANCE_ADDED' | 'FLAGGED_CONFLICT';
    trustState: TrustState;
    verificationSource: 'REUSED_EXISTING_EVIDENCE' | 'NEW_OFFICIAL_FETCH' | 'SOURCE_GROUNDED_ONLY';
  }[];
}
