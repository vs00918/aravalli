import { SourceSpan, ExtractedFact, ExtractedMechanism, KnowledgeIR } from './schema';

export interface ProvenanceValidationResult {
  isValid: boolean;
  code: 'VALIDATED' | 'INVALID_PROVENANCE_QUOTE_MISMATCH' | 'MISSING_PROVENANCE' | 'EMPTY_EVIDENCE';
  details: string;
  matchedText?: string;
}

export interface SegmentStore {
  getSegmentText(segmentId: string): string | undefined;
  getRangeText(segmentIds: string[]): string;
}

/**
 * Normalizes harmless whitespace (collapses multiple spaces, tabs, newlines into single spaces).
 * Does not mutate letter case, punctuation, or numerical characters.
 */
export function normalizeEvidenceWhitespace(text: string): string {
  return text.replace(/[\r\n\t\s]+/g, ' ').trim();
}

/**
 * Validates a single SourceSpan against provided evidence text.
 */
export function validateSourceSpan(
  span: SourceSpan,
  evidenceText: string
): ProvenanceValidationResult {
  if (!span || !span.quotedText || span.quotedText.trim().length === 0) {
    return {
      isValid: false,
      code: 'MISSING_PROVENANCE',
      details: 'Claim is missing quoted provenance text or has an empty source span.'
    };
  }

  if (!evidenceText || evidenceText.trim().length === 0) {
    return {
      isValid: false,
      code: 'EMPTY_EVIDENCE',
      details: 'Referenced evidence segment text is empty or unavailable.'
    };
  }

  const normalizedEvidence = normalizeEvidenceWhitespace(evidenceText);
  const normalizedQuote = normalizeEvidenceWhitespace(span.quotedText);

  if (normalizedEvidence.includes(normalizedQuote)) {
    return {
      isValid: true,
      code: 'VALIDATED',
      details: 'Quoted text verified as an exact substring of the reconstructed source evidence.',
      matchedText: normalizedQuote
    };
  }

  return {
    isValid: false,
    code: 'INVALID_PROVENANCE_QUOTE_MISMATCH',
    details: `Quoted text could not be found as an exact substring in referenced source segments. Quoted: "${span.quotedText.slice(0, 80)}..."`
  };
}

/**
 * Validates an entire KnowledgeIR object against a segment store.
 * Returns valid facts, quarantined facts, and overall status.
 */
export function validateKnowledgeIRProvenance(
  ir: KnowledgeIR,
  segmentMap: Record<string, string>
): {
  isFullyValid: boolean;
  validFacts: ExtractedFact[];
  quarantinedFacts: Array<{ fact: ExtractedFact; reason: string; code: string }>;
  validMechanisms: ExtractedMechanism[];
  quarantinedMechanisms: Array<{ mechanism: ExtractedMechanism; reason: string; code: string }>;
} {
  const validFacts: ExtractedFact[] = [];
  const quarantinedFacts: Array<{ fact: ExtractedFact; reason: string; code: string }> = [];

  for (const fact of ir.facts) {
    // Reconstruct referenced text from segmentIds
    const evidenceChunks: string[] = [];
    for (const segId of fact.provenance.segmentIds) {
      if (segmentMap[segId]) {
        evidenceChunks.push(segmentMap[segId]);
      }
    }
    const reconstructedEvidence = evidenceChunks.join(' ');

    const result = validateSourceSpan(fact.provenance, reconstructedEvidence);
    if (result.isValid) {
      validFacts.push(fact);
    } else {
      quarantinedFacts.push({
        fact,
        reason: result.details,
        code: result.code
      });
    }
  }

  const validMechanisms: ExtractedMechanism[] = [];
  const quarantinedMechanisms: Array<{ mechanism: ExtractedMechanism; reason: string; code: string }> = [];

  for (const mech of ir.mechanisms) {
    let mechValid = true;
    let failureReason = '';
    let failureCode = 'VALIDATED';

    for (const step of mech.steps) {
      const evidenceChunks: string[] = [];
      for (const segId of step.provenance.segmentIds) {
        if (segmentMap[segId]) {
          evidenceChunks.push(segmentMap[segId]);
        }
      }
      const reconstructedEvidence = evidenceChunks.join(' ');
      const stepResult = validateSourceSpan(step.provenance, reconstructedEvidence);
      if (!stepResult.isValid) {
        mechValid = false;
        failureReason = `Step ${step.stepNumber}: ${stepResult.details}`;
        failureCode = stepResult.code;
        break;
      }
    }

    if (mechValid) {
      validMechanisms.push(mech);
    } else {
      quarantinedMechanisms.push({
        mechanism: mech,
        reason: failureReason,
        code: failureCode
      });
    }
  }

  return {
    isFullyValid: quarantinedFacts.length === 0 && quarantinedMechanisms.length === 0,
    validFacts,
    quarantinedFacts,
    validMechanisms,
    quarantinedMechanisms
  };
}
