import { ExtractedFact, KnowledgeIR } from './schema';
import { CanonicalTopic, BankingCaMasterRegistry } from '../banking-ca/schema';
import { CANONICAL_SLUG_ALIASES, resolveCanonicalSlug } from '../banking-ca/canonical-deduplication';
import { normalizeSearchString } from '../banking-ca/search-engine';

export type ClassificationCategory = 'DUPLICATE' | 'UPDATE' | 'NOVEL' | 'REVIEW_REQUIRED';

export interface FactClassificationResult {
  factId: string;
  statement: string;
  classification: ClassificationCategory;
  matchedTopicId?: string;
  matchedTopicTitle?: string;
  confidence: number;
  similarityScore: number;
  rationale: string;
  isTemporalUpdate?: boolean;
  temporalEvidence?: string;
  reviewRequired: boolean;
}

export interface KnowledgeIRClassificationResult {
  irVersion: string;
  documentId: string;
  batchId: string;
  chunkId: string;
  totalFacts: number;
  duplicatesCount: number;
  updatesCount: number;
  novelCount: number;
  reviewRequiredCount: number;
  factClassifications: FactClassificationResult[];
  classifierVersion: string;
}

// Stop words to exclude during token similarity calculation
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'up', 'about', 'into', 'over', 'after', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'as', 'per', 'under'
]);

/**
 * Extracts informative token set from a string.
 */
function extractInformativeTokens(text: string): Set<string> {
  const normalized = normalizeSearchString(text);
  const rawTokens = normalized.split(/\s+/).filter(t => t.length > 1);
  return new Set(rawTokens.filter(t => !STOP_WORDS.has(t)));
}

/**
 * Computes Jaccard and Overlap similarity between two token sets.
 */
function computeTokenSimilarity(tokensA: Set<string>, tokensB: Set<string>): number {
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersectionCount = 0;
  tokensA.forEach(t => {
    if (tokensB.has(t)) intersectionCount++;
  });

  const unionSet = new Set<string>();
  tokensA.forEach(t => unionSet.add(t));
  tokensB.forEach(t => unionSet.add(t));
  const unionCount = unionSet.size;
  const jaccard = unionCount === 0 ? 0 : intersectionCount / unionCount;
  const minSize = Math.min(tokensA.size, tokensB.size);
  const overlap = minSize === 0 ? 0 : intersectionCount / minSize;
  const cosine = intersectionCount / Math.sqrt(tokensA.size * tokensB.size);

  // If at least 3 significant tokens match or (>= 80% overlap AND minSize >= 2), emphasize overlap
  if (intersectionCount >= 3 || (overlap >= 0.80 && minSize >= 2)) {
    return (overlap * 0.75) + (cosine * 0.25);
  }

  // Otherwise, use cosine similarity
  return cosine;
}

/**
 * Update indicator keywords for chronological/policy amendments
 */
const UPDATE_INDICATORS = [
  'extended', 'extension', 'amended', 'amendment', 'revised', 'revision',
  'deferred', 'deferral', 'increased', 'reduced', 'upgraded', 'downgraded',
  'phase 2', 'phase ii', 'tranche', 'new deadline', 'modified', 'superseded',
  'replaces', 'annual review', 'subsequent', 'updated'
];

function containsUpdateIndicator(text: string): boolean {
  const norm = text.toLowerCase();
  return UPDATE_INDICATORS.some(ind => norm.includes(ind));
}

/**
 * Classifies an individual extracted fact against the canonical topics in the master registry.
 */
export function classifyFact(
  fact: ExtractedFact,
  canonicalTopics: CanonicalTopic[]
): FactClassificationResult {
  // Provenance Firewall Verification: Reject facts lacking valid provenance
  if (!fact.provenance || !fact.provenance.quotedText || fact.provenance.quotedText.trim().length === 0) {
    return {
      factId: fact.factId,
      statement: fact.statement,
      classification: 'REVIEW_REQUIRED',
      confidence: 0,
      similarityScore: 0,
      rationale: 'REJECTED: Extracted fact lacks verified source provenance.',
      reviewRequired: true
    };
  }

  const factTokens = extractInformativeTokens(fact.statement);
  const factNorm = normalizeSearchString(fact.statement);

  let bestMatch: { topic: CanonicalTopic; score: number; rationale: string } | null = null;
  let secondBestScore = 0;

  for (const topic of canonicalTopics) {
    const titleTokens = extractInformativeTokens(topic.title);
    const titleSim = computeTokenSimilarity(factTokens, titleTokens);

    // Also check topic slug tokens
    const slugTokens = extractInformativeTokens(topic.slug.replace(/^ca-/, '').replace(/-/g, ' '));
    const slugSim = computeTokenSimilarity(factTokens, slugTokens);

    // Also check facts tokens
    let maxFactSim = 0;
    if (topic.mustMemorizeFacts) {
      for (const tFact of topic.mustMemorizeFacts) {
        const tFactTokens = extractInformativeTokens(tFact);
        const sim = computeTokenSimilarity(factTokens, tFactTokens);
        if (sim > maxFactSim) maxFactSim = sim;
      }
    }

    // Composite score: Title/Slug is primary; fact matches augment the score
    const bestTitleSlugSim = Math.max(titleSim, slugSim);
    let compositeScore = Math.max(bestTitleSlugSim, (bestTitleSlugSim * 0.6) + (maxFactSim * 0.4));

    // Exact Title Substring / Alias bonus
    const topicNorm = normalizeSearchString(topic.title);
    const slugNorm = normalizeSearchString(topic.slug.replace(/^ca-/, ''));
    if (factNorm === topicNorm || factNorm === slugNorm ||
        (factNorm.includes(topicNorm) && topicNorm.length > 20) ||
        (topicNorm.includes(factNorm) && factNorm.length > 20)) {
      compositeScore = 1.0;
    }

    // Check numerical alignment
    let hasNumericalMismatch = false;
    if (fact.numericalAnchors && fact.numericalAnchors.length > 0 && topic.mustMemorizeFacts) {
      const topicFactsJoined = topic.mustMemorizeFacts.join(' ');
      const matchingAnchors = fact.numericalAnchors.filter(num => topicFactsJoined.includes(num));
      if (matchingAnchors.length === fact.numericalAnchors.length) {
        compositeScore = Math.min(1.0, compositeScore + 0.10);
      } else if (matchingAnchors.length === 0 && fact.numericalAnchors.length > 0) {
        hasNumericalMismatch = true;
      }
    }

    if (!bestMatch || compositeScore > bestMatch.score) {
      if (bestMatch) secondBestScore = bestMatch.score;
      bestMatch = {
        topic,
        score: compositeScore,
        rationale: hasNumericalMismatch ? 'Potential numerical change' : 'High semantic overlap'
      };
    } else if (compositeScore > secondBestScore) {
      secondBestScore = compositeScore;
    }
  }

  // Thresholds:
  // DUPLICATE >= 0.88 (and no update signals)
  // UPDATE >= 0.65 with update indicators / differing temporal/numerical anchors
  // REVIEW_REQUIRED: 0.60 to 0.87 (or conflicting close match)
  // NOVEL: < 0.40

  if (!bestMatch || bestMatch.score < 0.40) {
    return {
      factId: fact.factId,
      statement: fact.statement,
      classification: 'NOVEL',
      confidence: 0.95,
      similarityScore: bestMatch ? Math.round(bestMatch.score * 100) / 100 : 0,
      rationale: 'No existing canonical topic shares significant semantic overlap (Score < 0.40).',
      reviewRequired: false
    };
  }

  const isUpdate = containsUpdateIndicator(fact.statement) ||
    (fact.temporalAnchor && bestMatch.topic.chronologicalMonth && !bestMatch.topic.title.includes(fact.temporalAnchor) && bestMatch.score >= 0.50);

  // If score is high (>= 0.88)
  if (bestMatch.score >= 0.88) {
    if (isUpdate) {
      return {
        factId: fact.factId,
        statement: fact.statement,
        classification: 'UPDATE',
        matchedTopicId: bestMatch.topic.id,
        matchedTopicTitle: bestMatch.topic.title,
        confidence: 0.90,
        similarityScore: Math.round(bestMatch.score * 100) / 100,
        rationale: `Chronological update / amendment detected for existing canonical topic: ${bestMatch.topic.id}.`,
        isTemporalUpdate: true,
        temporalEvidence: fact.temporalAnchor || 'Amended terms detected',
        reviewRequired: false
      };
    }

    return {
      factId: fact.factId,
      statement: fact.statement,
      classification: 'DUPLICATE',
      matchedTopicId: bestMatch.topic.id,
      matchedTopicTitle: bestMatch.topic.title,
      confidence: 0.95,
      similarityScore: Math.round(bestMatch.score * 100) / 100,
      rationale: `Exact/high semantic duplicate of active canonical topic: ${bestMatch.topic.id}.`,
      reviewRequired: false
    };
  }

  // If score is in intermediate range (0.50 <= score < 0.88)
  if (bestMatch.score >= 0.50) {
    // Check if there is an update indicator
    if (isUpdate) {
      return {
        factId: fact.factId,
        statement: fact.statement,
        classification: 'UPDATE',
        matchedTopicId: bestMatch.topic.id,
        matchedTopicTitle: bestMatch.topic.title,
        confidence: 0.85,
        similarityScore: Math.round(bestMatch.score * 100) / 100,
        rationale: `Subsequent phase or modification for topic: ${bestMatch.topic.id}.`,
        isTemporalUpdate: true,
        temporalEvidence: fact.temporalAnchor || 'Update keywords detected',
        reviewRequired: false
      };
    }

    // If ambiguous / competing top scores
    if (bestMatch.score - secondBestScore < 0.10 && secondBestScore > 0.55) {
      return {
        factId: fact.factId,
        statement: fact.statement,
        classification: 'REVIEW_REQUIRED',
        matchedTopicId: bestMatch.topic.id,
        matchedTopicTitle: bestMatch.topic.title,
        confidence: 0.50,
        similarityScore: Math.round(bestMatch.score * 100) / 100,
        rationale: `Ambiguous match: Multiple competing canonical topics with similar score (${bestMatch.score.toFixed(2)} vs ${secondBestScore.toFixed(2)}).`,
        reviewRequired: true
      };
    }

    return {
      factId: fact.factId,
      statement: fact.statement,
      classification: 'REVIEW_REQUIRED',
      matchedTopicId: bestMatch.topic.id,
      matchedTopicTitle: bestMatch.topic.title,
      confidence: 0.60,
      similarityScore: Math.round(bestMatch.score * 100) / 100,
      rationale: `Borderline semantic similarity (${bestMatch.score.toFixed(2)}). Human review recommended before staging.`,
      reviewRequired: true
    };
  }

  // Low similarity (0.40 - 0.59) -> Likely novel but flagged for review
  return {
    factId: fact.factId,
    statement: fact.statement,
    classification: 'NOVEL',
    matchedTopicId: bestMatch.topic.id,
    matchedTopicTitle: bestMatch.topic.title,
    confidence: 0.80,
    similarityScore: Math.round(bestMatch.score * 100) / 100,
    rationale: `Distinct event with weak incidental overlap (${bestMatch.score.toFixed(2)}) with ${bestMatch.topic.id}.`,
    reviewRequired: false
  };
}

/**
 * Classifies an entire verified Knowledge IR document against the master registry.
 */
export function classifyKnowledgeIR(
  ir: KnowledgeIR,
  registry: BankingCaMasterRegistry
): KnowledgeIRClassificationResult {
  const canonicalTopics = Object.values(registry.topics);
  const factClassifications: FactClassificationResult[] = [];

  let duplicatesCount = 0;
  let updatesCount = 0;
  let novelCount = 0;
  let reviewRequiredCount = 0;

  for (const fact of ir.facts) {
    const result = classifyFact(fact, canonicalTopics);
    factClassifications.push(result);

    if (result.classification === 'DUPLICATE') duplicatesCount++;
    else if (result.classification === 'UPDATE') updatesCount++;
    else if (result.classification === 'NOVEL') novelCount++;
    else if (result.classification === 'REVIEW_REQUIRED') reviewRequiredCount++;
  }

  return {
    irVersion: ir.irVersion,
    documentId: ir.documentId,
    batchId: ir.batchId,
    chunkId: ir.chunkId,
    totalFacts: ir.facts.length,
    duplicatesCount,
    updatesCount,
    novelCount,
    reviewRequiredCount,
    factClassifications,
    classifierVersion: 'classifier-v1.0.0-deterministic'
  };
}
