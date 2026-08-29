import crypto from 'crypto';

export interface VerifiedClaimResult {
  claim: string;
  canonicalValue: string;
  verificationAuthority: string;
  documentTitle: string;
  documentIdentifier: string;
  officialUrl: string;
  retrievalTimestamp: string;
  documentHash: string;
  locator: string;
  officialObservedValue: string;
  evidenceText: string;
  comparisonResult: 'MATCH' | 'MISMATCH' | 'NOT_FOUND' | 'UNVERIFIABLE';
}

export function extractAndCompareClaim(
  rawDocumentContent: string,
  claimSpec: {
    claim: string;
    canonicalValue: string;
    authority: string;
    documentTitle: string;
    documentIdentifier: string;
    officialUrl: string;
    retrievalTimestamp: string;
    documentHash: string;
    targetPattern: RegExp | string;
    locatorLabel: string;
  }
): VerifiedClaimResult {
  let evidenceText = '';
  let officialObservedValue = '';
  let comparisonResult: 'MATCH' | 'MISMATCH' | 'NOT_FOUND' | 'UNVERIFIABLE' = 'NOT_FOUND';

  // Search raw document content for pattern
  let match: RegExpMatchArray | null = null;
  if (typeof claimSpec.targetPattern === 'string') {
    const idx = rawDocumentContent.indexOf(claimSpec.targetPattern);
    if (idx !== -1) {
      const start = Math.max(0, idx - 100);
      const end = Math.min(rawDocumentContent.length, idx + claimSpec.targetPattern.length + 100);
      evidenceText = rawDocumentContent.substring(start, end).replace(/\s+/g, ' ').trim();
      officialObservedValue = claimSpec.targetPattern;
      comparisonResult = 'MATCH';
    }
  } else {
    match = rawDocumentContent.match(claimSpec.targetPattern);
    if (match) {
      evidenceText = match[0].replace(/\s+/g, ' ').trim();
      officialObservedValue = match[1] || match[0];
      // Compare canonical value against observed value
      const cleanCanonical = claimSpec.canonicalValue.toLowerCase().replace(/[^a-z0-9.%]/g, '');
      const cleanObserved = officialObservedValue.toLowerCase().replace(/[^a-z0-9.%]/g, '');

      if (cleanCanonical.includes(cleanObserved) || cleanObserved.includes(cleanCanonical)) {
        comparisonResult = 'MATCH';
      } else {
        comparisonResult = 'MISMATCH';
      }
    }
  }

  return {
    claim: claimSpec.claim,
    canonicalValue: claimSpec.canonicalValue,
    verificationAuthority: claimSpec.authority,
    documentTitle: claimSpec.documentTitle,
    documentIdentifier: claimSpec.documentIdentifier,
    officialUrl: claimSpec.officialUrl,
    retrievalTimestamp: claimSpec.retrievalTimestamp,
    documentHash: claimSpec.documentHash,
    locator: claimSpec.locatorLabel,
    officialObservedValue: officialObservedValue || 'NOT_LOCATED_IN_RAW_DOCUMENT',
    evidenceText: evidenceText || 'NO_MATCHING_PASSAGE_FOUND',
    comparisonResult,
  };
}
