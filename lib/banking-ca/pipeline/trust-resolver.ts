import { CanonicalTopic } from '../schema';
import { OfficialVerificationEvidence, TrustState, evaluateTopicTrustState } from '../trust-architecture';
import { VerificationRegistry } from './verification-registry';
import { ExtractedEvent } from './types';

export interface TrustResolutionResult {
  trustState: TrustState;
  officialEvidence: OfficialVerificationEvidence | null;
  verificationSource: 'REUSED_EXISTING_EVIDENCE' | 'NEW_OFFICIAL_FETCH' | 'SOURCE_GROUNDED_ONLY';
  crossSourceCorroborated: boolean;
}

export class TrustResolver {
  private registry: VerificationRegistry;

  constructor(registry: VerificationRegistry) {
    this.registry = registry;
  }

  public resolve(
    topic: CanonicalTopic, 
    incomingEvent: ExtractedEvent,
    options?: {
      conflictDetected?: boolean;
      newOfficialFetchResult?: OfficialVerificationEvidence | null;
    }
  ): TrustResolutionResult {
    if (options?.conflictDetected) {
      return {
        trustState: 'CONFLICT_DETECTED',
        officialEvidence: null,
        verificationSource: 'SOURCE_GROUNDED_ONLY',
        crossSourceCorroborated: false
      };
    }

    // Step 1: Check Reusable Verification Registry (No unnecessary network call)
    if (this.registry.hasValidVerification(topic.slug)) {
      const regRec = this.registry.getRecord(topic.slug);
      if (regRec && regRec.verificationStatus === 'OFFICIALLY_VERIFIED') {
        const evidence: OfficialVerificationEvidence = {
          authority: regRec.authority,
          documentTitle: regRec.documentTitle,
          documentIdentifier: regRec.documentIdentifier,
          officialUrl: regRec.finalUrl || regRec.requestedUrl,
          retrievalTimestamp: regRec.retrievalTimestamp,
          documentHash: regRec.artifactHash,
          locator: regRec.evidenceLocator,
          officialObservedValue: regRec.observedValue,
          evidenceText: regRec.evidencePassage,
          comparisonResult: 'MATCH'
        };

        return {
          trustState: 'OFFICIALLY_VERIFIED',
          officialEvidence: evidence,
          verificationSource: 'REUSED_EXISTING_EVIDENCE',
          crossSourceCorroborated: topic.sourceReferences.length > 1
        };
      }
    }

    // Step 2: If a new official fetch was performed and passed
    if (options?.newOfficialFetchResult) {
      const state = evaluateTopicTrustState({
        sources: topic.sourceReferences.map(s => s.sourceName),
        officialEvidence: options.newOfficialFetchResult,
        conflictDetected: false
      });

      return {
        trustState: state,
        officialEvidence: options.newOfficialFetchResult,
        verificationSource: 'NEW_OFFICIAL_FETCH',
        crossSourceCorroborated: topic.sourceReferences.length > 1
      };
    }

    // Step 3: Layer A & Layer A+ Evaluation (Coaching Grounding vs Cross-Source Agreement)
    const sources = topic.sourceReferences.map(s => s.sourceName);
    const state = evaluateTopicTrustState({
      sources,
      officialEvidence: null,
      conflictDetected: false,
      externalAttemptedAndUnavailable: false
    });

    return {
      trustState: state,
      officialEvidence: null,
      verificationSource: 'SOURCE_GROUNDED_ONLY',
      crossSourceCorroborated: state === 'CROSS_SOURCE_CONFIRMED'
    };
  }
}
