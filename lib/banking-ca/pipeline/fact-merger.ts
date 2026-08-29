import { CanonicalTopic, SourceReference } from '../schema';
import { ExtractedEvent } from './types';

export interface MergeResult {
  updatedTopic: CanonicalTopic;
  action: 'EXACT_DUPLICATE' | 'COMPLEMENTARY_ENRICHMENT' | 'CONFLICT_DETECTED';
  conflictDetails?: {
    existingClaim: string;
    incomingClaim: string;
    field: string;
  };
}

function areFactsEquivalent(factA: string, factB: string): boolean {
  const normA = factA.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  const normB = factB.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  return normA === normB || normA.includes(normB) || normB.includes(normA);
}

function detectRateConflict(existingFacts: string[], incomingFacts: string[]): { hasConflict: boolean; existing?: string; incoming?: string } {
  // Check for conflicting percentage rates on identical metrics (e.g. repo rate 5.25% vs 6.50%)
  const rateRegex = /(\b(?:repo\s+rate|crr|sdf|msf|bank\s+rate|gdp\s+growth|inflation)\b[^\.\n]*?(\d+\.?\d*)\s*%)/gi;

  for (const inc of incomingFacts) {
    const incMatches = Array.from(inc.matchAll(rateRegex));
    for (const incM of incMatches) {
      const metric = incM[1].toLowerCase().split(/\s+/)[0];
      const incRate = incM[2];

      for (const exist of existingFacts) {
        const existMatches = Array.from(exist.matchAll(rateRegex));
        for (const existM of existMatches) {
          const existMetric = existM[1].toLowerCase().split(/\s+/)[0];
          const existRate = existM[2];

          if (metric === existMetric && Math.abs(parseFloat(incRate) - parseFloat(existRate)) > 0.001) {
            return {
              hasConflict: true,
              existing: exist,
              incoming: inc
            };
          }
        }
      }
    }
  }

  return { hasConflict: false };
}

export class FactMerger {
  public static merge(existing: CanonicalTopic, incoming: ExtractedEvent): MergeResult {
    // 1. Conflict Check
    const allExistingFacts = [
      ...existing.mustMemorizeFacts,
      ...existing.knowUnderstandContext,
      ...existing.examFocus,
      ...existing.whatHappened
    ];
    const allIncomingFacts = [
      ...incoming.mustMemorizeFacts,
      ...incoming.knowUnderstandContext,
      ...incoming.examFocus
    ];

    const rateConflict = detectRateConflict(allExistingFacts, allIncomingFacts);
    if (rateConflict.hasConflict) {
      return {
        updatedTopic: existing,
        action: 'CONFLICT_DETECTED',
        conflictDetails: {
          existingClaim: rateConflict.existing || '',
          incomingClaim: rateConflict.incoming || '',
          field: 'interestRate_or_numericMetric'
        }
      };
    }

    // 2. Identify New Facts
    const newMemorizeFacts: string[] = [];
    for (const incFact of incoming.mustMemorizeFacts) {
      const alreadyPresent = existing.mustMemorizeFacts.some(f => areFactsEquivalent(f, incFact));
      if (!alreadyPresent) {
        newMemorizeFacts.push(incFact);
      }
    }

    const newContextFacts: string[] = [];
    for (const incCtx of incoming.knowUnderstandContext) {
      const alreadyPresent = existing.knowUnderstandContext.some(c => areFactsEquivalent(c, incCtx));
      if (!alreadyPresent) {
        newContextFacts.push(incCtx);
      }
    }

    const newExamFacts: string[] = [];
    for (const incExam of incoming.examFocus) {
      const alreadyPresent = existing.examFocus.some(e => areFactsEquivalent(e, incExam));
      if (!alreadyPresent) {
        newExamFacts.push(incExam);
      }
    }

    // 3. Merge Source References
    const mergedSources: SourceReference[] = [...existing.sourceReferences];
    const sourceExists = mergedSources.some(
      s => s.sourceName === incoming.sourceReference.sourceName && s.batchName === incoming.sourceReference.batchName
    );
    if (!sourceExists) {
      mergedSources.push(incoming.sourceReference);
    }

    const isEnrichment = newMemorizeFacts.length > 0 || newContextFacts.length > 0 || newExamFacts.length > 0;

    const updatedTopic: CanonicalTopic = {
      ...existing,
      mustMemorizeFacts: [...existing.mustMemorizeFacts, ...newMemorizeFacts],
      knowUnderstandContext: [...existing.knowUnderstandContext, ...newContextFacts],
      examFocus: [...existing.examFocus, ...newExamFacts],
      sourceReferences: mergedSources,
      lastUpdatedDate: incoming.eventDate > existing.lastUpdatedDate ? incoming.eventDate : existing.lastUpdatedDate
    };

    return {
      updatedTopic,
      action: isEnrichment ? 'COMPLEMENTARY_ENRICHMENT' : 'EXACT_DUPLICATE'
    };
  }
}
