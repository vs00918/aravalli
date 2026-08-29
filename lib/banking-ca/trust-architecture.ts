export type TrustState =
  | 'OFFICIALLY_VERIFIED'
  | 'CROSS_SOURCE_CONFIRMED'
  | 'COACHING_SOURCE_GROUNDED'
  | 'EXTERNAL_VERIFICATION_PENDING'
  | 'CONFLICT_DETECTED';

export interface SourceGrounding {
  sources: string[];
  batches: string[];
  reportDates: string[];
}

export interface OfficialVerificationEvidence {
  authority: string;
  documentTitle: string;
  documentIdentifier: string;
  officialUrl: string;
  retrievalTimestamp: string;
  documentHash: string;
  locator: string;
  officialObservedValue: string;
  evidenceText: string;
  comparisonResult: 'MATCH' | 'MISMATCH';
}

export interface TopicTrustProfile {
  topicSlug: string;
  canonicalTitle: string;
  layerA_SourceGrounding: SourceGrounding;
  layerB_OfficialVerification: OfficialVerificationEvidence | null;
  trustState: TrustState;
  quietSourceLabel: string;
  quietVerificationLabel: string;
}

/**
 * Deterministic Trust State Transition Engine
 * 
 * Rules:
 * 1. Conflict Detected -> CONFLICT_DETECTED
 * 2. Real Official Evidence with matching claim -> OFFICIALLY_VERIFIED
 * 3. Two or more independent coaching sources agree -> CROSS_SOURCE_CONFIRMED
 * 4. Single coaching source grounded & official fetch pending/unavailable -> EXTERNAL_VERIFICATION_PENDING / COACHING_SOURCE_GROUNDED
 * 
 * INVARIANT: Coaching source or cross-source agreement CAN NEVER produce OFFICIALLY_VERIFIED.
 */
export function evaluateTopicTrustState(params: {
  sources: string[];
  officialEvidence: OfficialVerificationEvidence | null;
  conflictDetected?: boolean;
  externalAttemptedAndUnavailable?: boolean;
}): TrustState {
  if (params.conflictDetected) {
    return 'CONFLICT_DETECTED';
  }

  // Real official verification requires valid document hash, matching comparison, and authority
  if (
    params.officialEvidence &&
    params.officialEvidence.documentHash &&
    params.officialEvidence.documentHash.length >= 32 &&
    params.officialEvidence.comparisonResult === 'MATCH' &&
    params.officialEvidence.authority &&
    !params.officialEvidence.documentTitle.toLowerCase().includes('generic')
  ) {
    return 'OFFICIALLY_VERIFIED';
  }

  if (params.externalAttemptedAndUnavailable) {
    return 'EXTERNAL_VERIFICATION_PENDING';
  }

  // Cross-source agreement between distinct coaching feeds
  const uniqueCoachingOrgs = new Set(
    params.sources.map((s) => {
      const lower = s.toLowerCase();
      if (lower.includes('cgb')) return 'CGB_MENTORS';
      if (lower.includes('smartkeeda')) return 'SMARTKEEDA';
      if (lower.includes('pib')) return 'PIB_DIGEST';
      return s;
    })
  );

  if (uniqueCoachingOrgs.size >= 2) {
    return 'CROSS_SOURCE_CONFIRMED';
  }

  return 'COACHING_SOURCE_GROUNDED';
}

export function formatQuietSourceLabels(profile: {
  sources: string[];
  trustState: TrustState;
  officialAuthority?: string;
}): { sourceLabel: string; verificationLabel: string } {
  const cleanSources = Array.from(
    new Set(
      profile.sources.map((s) => {
        if (s.toLowerCase().includes('cgb')) return 'CGB Mentors';
        if (s.toLowerCase().includes('smartkeeda')) return 'Smartkeeda';
        if (s.toLowerCase().includes('pib')) return 'PIB Digest';
        return s;
      })
    )
  );

  const sourceLabel =
    cleanSources.length > 1
      ? `Sources: ${cleanSources.join(' · ')}`
      : cleanSources.length === 1
      ? `Source: ${cleanSources[0]}`
      : 'Source: Ingested Batch';

  let verificationLabel = 'Official verification pending';
  if (profile.trustState === 'OFFICIALLY_VERIFIED') {
    verificationLabel = `Officially verified · ${profile.officialAuthority || 'Statutory Authority'}`;
  } else if (profile.trustState === 'CROSS_SOURCE_CONFIRMED') {
    verificationLabel = 'Cross-source confirmed · Official verification pending';
  } else if (profile.trustState === 'CONFLICT_DETECTED') {
    verificationLabel = '⚠️ Conflict detected';
  }

  return { sourceLabel, verificationLabel };
}
