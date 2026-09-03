import { ExtractedFact, SourceSpan } from './schema';
import { StagedKnowledgeItem, StagingState } from './staging';
import { normalizeSourceText } from './normalizer';

export type LayerBVerificationStatus =
  | 'SOURCE_ONLY'
  | 'PRIMARY_VERIFIED'
  | 'CONFLICTING'
  | 'QUARANTINED';

export type AuthoritativeSourceType =
  | 'RBI'
  | 'SEBI'
  | 'PIB'
  | 'OFFICIAL_GAZETTE'
  | 'UNION_BUDGET'
  | 'MINISTRY_OF_FINANCE'
  | 'NABARD'
  | 'IRDAI'
  | 'IFSCA'
  | 'NPCI'
  | 'NON_AUTHORITATIVE';

export interface PrimaryEvidence {
  sourceType: AuthoritativeSourceType;
  institution: string;
  documentTitle: string;
  documentNumber?: string;
  publicationDate?: string;
  primaryUrl?: string;
  sourceText: string;
  quotedSpan: string;
}

export interface VerificationConflict {
  candidateStatement: string;
  primaryAssertion: string;
  discrepancyType: 'NUMERICAL_MISMATCH' | 'TEMPORAL_MISMATCH' | 'STANCE_CONTRADICTION' | 'POLICY_AMENDMENT';
  candidateValue?: string;
  primaryValue?: string;
}

export interface LayerBVerificationRecord {
  candidateFactId: string;
  originatingSource: string;
  status: LayerBVerificationStatus;
  isAuthoritative: boolean;
  authorityType: AuthoritativeSourceType;
  evidence?: PrimaryEvidence;
  conflict?: VerificationConflict;
  rationale: string;
  verifiedAt: string;
  verifierId: string;
}

/**
 * Authoritative primary source policy registry.
 * Explicitly rejects commercial coaching sites, aggregators, blogs, Wikipedia, and non-statutory news.
 */
const AUTHORITATIVE_POLICY: Record<AuthoritativeSourceType, { isPrimary: boolean; description: string }> = {
  RBI: { isPrimary: true, description: 'Reserve Bank of India (Notifications, Circulars, MPC Resolutions, Master Directions)' },
  SEBI: { isPrimary: true, description: 'Securities and Exchange Board of India (Board Decisions, Circulars, Regulations)' },
  PIB: { isPrimary: true, description: 'Press Information Bureau, Government of India (Official Releases & Cabinet Decisions)' },
  OFFICIAL_GAZETTE: { isPrimary: true, description: 'The Gazette of India (Acts, Statutory Orders, Extraordinary Notifications)' },
  UNION_BUDGET: { isPrimary: true, description: 'Ministry of Finance Union Budget & Economic Survey Official Documents' },
  MINISTRY_OF_FINANCE: { isPrimary: true, description: 'Ministry of Finance Department of Financial Services / Economic Affairs' },
  NABARD: { isPrimary: true, description: 'National Bank for Agriculture and Rural Development Official Circulars' },
  IRDAI: { isPrimary: true, description: 'Insurance Regulatory and Development Authority of India' },
  IFSCA: { isPrimary: true, description: 'International Financial Services Centres Authority' },
  NPCI: { isPrimary: true, description: 'National Payments Corporation of India Official Circulars' },
  NON_AUTHORITATIVE: { isPrimary: false, description: 'Secondary aggregators, coaching portals, social media, news blogs' }
};

/**
 * Validates whether a source type is an authoritative primary institution.
 */
export function isAuthoritativePrimarySource(sourceType: AuthoritativeSourceType): boolean {
  return Boolean(AUTHORITATIVE_POLICY[sourceType]?.isPrimary);
}

/**
 * Helper to extract numerical figures from text
 */
function extractNumbers(text: string): string[] {
  const matches = text.match(/\b\d+(\.\d+)?%|\b₹\s*[\d,]+(\.\d+)?\s*(crore|lakh|billion|million)?\b|\b\d+(\.\d+)?\b/gi);
  return matches ? matches.map(m => m.replace(/\s+/g, ' ').trim()) : [];
}

/**
 * Deterministic Layer-B Verification Engine.
 * Verifies a candidate fact extracted from a secondary feed against primary source evidence.
 */
export function verifyCandidateAgainstPrimary(
  candidate: ExtractedFact,
  evidence?: PrimaryEvidence,
  options: { verifierId?: string; timestamp?: string } = {}
): LayerBVerificationRecord {
  const verifiedAt = options.timestamp || new Date().toISOString();
  const verifierId = options.verifierId || 'LAYER_B_DETERMINISTIC_ENGINE';

  // Step 1: Missing primary evidence -> Strictly SOURCE_ONLY
  if (!evidence) {
    return {
      candidateFactId: candidate.factId,
      originatingSource: 'SECONDARY_FEED',
      status: 'SOURCE_ONLY',
      isAuthoritative: false,
      authorityType: 'NON_AUTHORITATIVE',
      rationale: 'No primary source evidence supplied. Fact remains SOURCE_ONLY.',
      verifiedAt,
      verifierId
    };
  }

  // Step 2: Authority Validation
  const isAuth = isAuthoritativePrimarySource(evidence.sourceType);
  if (!isAuth || evidence.sourceType === 'NON_AUTHORITATIVE') {
    return {
      candidateFactId: candidate.factId,
      originatingSource: 'SECONDARY_FEED',
      status: 'SOURCE_ONLY',
      isAuthoritative: false,
      authorityType: evidence.sourceType,
      evidence,
      rationale: `Source type '${evidence.sourceType}' is not an authoritative statutory primary source. Cannot upgrade beyond SOURCE_ONLY.`,
      verifiedAt,
      verifierId
    };
  }

  // Step 3: Provenance & Substring Verification against Primary Evidence Text
  if (!evidence.quotedSpan || evidence.quotedSpan.trim().length === 0) {
    return {
      candidateFactId: candidate.factId,
      originatingSource: 'SECONDARY_FEED',
      status: 'SOURCE_ONLY',
      isAuthoritative: true,
      authorityType: evidence.sourceType,
      evidence,
      rationale: 'Primary evidence lacks an exact quoted span. Cannot corroborate.',
      verifiedAt,
      verifierId
    };
  }

  const normSource = normalizeSourceText(evidence.sourceText);
  const normQuote = normalizeSourceText(evidence.quotedSpan);

  if (!normSource.includes(normQuote)) {
    return {
      candidateFactId: candidate.factId,
      originatingSource: 'SECONDARY_FEED',
      status: 'QUARANTINED',
      isAuthoritative: true,
      authorityType: evidence.sourceType,
      evidence,
      rationale: 'QUARANTINED: Corroborating quote not found within primary source document text (Provenance mismatch).',
      verifiedAt,
      verifierId
    };
  }

  // Step 4: Conflict Detection (Numerical and Semantic Contradictions)
  const candidateNums = candidate.numericalAnchors || extractNumbers(candidate.statement);
  const primaryNums = extractNumbers(evidence.quotedSpan);

  // Check if candidate makes numerical claims that are contradicted by primary quote
  if (candidateNums.length > 0 && primaryNums.length > 0) {
    const hasMatchingNum = candidateNums.some(cn => primaryNums.some(pn => pn.includes(cn) || cn.includes(pn)));
    if (!hasMatchingNum) {
      return {
        candidateFactId: candidate.factId,
        originatingSource: 'SECONDARY_FEED',
        status: 'CONFLICTING',
        isAuthoritative: true,
        authorityType: evidence.sourceType,
        evidence,
        conflict: {
          candidateStatement: candidate.statement,
          primaryAssertion: evidence.quotedSpan,
          discrepancyType: 'NUMERICAL_MISMATCH',
          candidateValue: candidateNums.join(', '),
          primaryValue: primaryNums.join(', ')
        },
        rationale: `CONFLICT: Primary source figures (${primaryNums.join(', ')}) contradict candidate assertion figures (${candidateNums.join(', ')}).`,
        verifiedAt,
        verifierId
      };
    }
  }

  // Step 5: Successful Primary Corroboration
  return {
    candidateFactId: candidate.factId,
    originatingSource: 'SECONDARY_FEED',
    status: 'PRIMARY_VERIFIED',
    isAuthoritative: true,
    authorityType: evidence.sourceType,
    evidence,
    rationale: `Successfully corroborated by primary statutory authority: ${evidence.institution} (${evidence.sourceType}) with exact traceable quote.`,
    verifiedAt,
    verifierId
  };
}

/**
 * Enriches a StagedKnowledgeItem with Layer-B Verification metadata.
 * Retains human review boundary.
 */
export function attachLayerBVerificationToStagedItem(
  item: StagedKnowledgeItem,
  verification: LayerBVerificationRecord
): StagedKnowledgeItem {
  const timestamp = verification.verifiedAt;

  // If conflicting, update state to QUARANTINED / REVIEW_REQUIRED flag
  let nextState: StagingState = item.state;
  if (verification.status === 'CONFLICTING') {
    nextState = 'QUARANTINED';
  }

  return {
    ...item,
    state: nextState,
    updatedAt: timestamp,
    auditTrail: [
      ...item.auditTrail,
      {
        fromState: item.state,
        toState: nextState,
        actor: verification.verifierId,
        timestamp,
        rationale: `Layer-B Verification [${verification.status}]: ${verification.rationale}`
      }
    ]
  };
}
