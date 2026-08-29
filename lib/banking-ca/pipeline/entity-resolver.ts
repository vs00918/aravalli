import { CanonicalTopic } from '../schema';
import { ExtractedEvent, EntityResolutionResult } from './types';

const BANKING_STOP_WORDS = new Set([
  'and', 'the', 'for', 'with', 'under', 'from', 'this', 'that', 'into', 'over', 'per', 'all',
  'rbi', 'bank', 'banks', 'banking', 'india', 'indian', 'framework', 'guidelines', 'circular',
  'scheme', 'policy', '2026', '2027', 'committee', 'approves', 'amendment', 'national', 'rules',
  'regulations', 'notification', 'directions', 'update', 'monthly', 'weekly', 'digest'
]);

function normalizeTokens(str: string): Set<string> {
  const tokens = str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !BANKING_STOP_WORDS.has(w));
  return new Set(tokens);
}

function calculateJaccard(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  const itemsA = Array.from(setA);
  for (const item of itemsA) {
    if (setB.has(item)) intersection++;
  }
  const allItems = itemsA.concat(Array.from(setB));
  const union = new Set(allItems).size;
  return intersection / union;
}

export class EntityResolver {
  private existingTopics: CanonicalTopic[];

  constructor(existingTopics: CanonicalTopic[]) {
    this.existingTopics = existingTopics;
  }

  public resolve(incoming: ExtractedEvent): EntityResolutionResult {
    // 1. Direct Slug / ID match
    const exactSlugMatch = this.existingTopics.find(
      t => t.slug === incoming.slugCandidate || t.id === incoming.eventId
    );
    if (exactSlugMatch) {
      return {
        outcome: 'EXACT_MATCH',
        matchedTopicSlug: exactSlugMatch.slug,
        confidenceScore: 1.0,
        reason: `Direct slug/id equality: ${exactSlugMatch.slug}`
      };
    }

    const incomingTokens = normalizeTokens(incoming.title);
    let bestMatch: CanonicalTopic | null = null;
    let highestScore = 0;

    for (const topic of this.existingTopics) {
      const topicTokens = normalizeTokens(topic.title);
      const score = calculateJaccard(incomingTokens, topicTokens);

      // Boost score if major statutory entities match exactly
      const statutoryKeywords = ['gobardhan', 'msmed', 'mpc', 'fast-ds', 'dicgc', 'credit risk-o-meter', 'scale-based regulation', 'nbfc-ul', 'on-tap licensing'];
      let keywordBoost = 0;
      for (const kw of statutoryKeywords) {
        const kwRegex = new RegExp(`\\b${kw.replace('-', '[- ]?')}\\b`, 'i');
        if (kwRegex.test(incoming.title) && kwRegex.test(topic.title)) {
          keywordBoost += 0.50;
        }
      }

      const finalScore = Math.min(1.0, score + keywordBoost);
      if (finalScore > highestScore) {
        highestScore = finalScore;
        bestMatch = topic;
      }
    }

    if (highestScore >= 0.80 && bestMatch) {
      return {
        outcome: 'EXACT_MATCH',
        matchedTopicSlug: bestMatch.slug,
        confidenceScore: highestScore,
        reason: `High semantic similarity (${highestScore.toFixed(2)}) with '${bestMatch.title}'`
      };
    }

    if (highestScore >= 0.65 && bestMatch) {
      return {
        outcome: 'COMPLEMENTARY_MATCH',
        matchedTopicSlug: bestMatch.slug,
        confidenceScore: highestScore,
        reason: `Complementary entity match (${highestScore.toFixed(2)}) with '${bestMatch.title}'`
      };
    }

    if (highestScore >= 0.45 && bestMatch) {
      return {
        outcome: 'AMBIGUOUS_MATCH',
        matchedTopicSlug: bestMatch.slug,
        confidenceScore: highestScore,
        reason: `Ambiguous similarity score (${highestScore.toFixed(2)}) with '${bestMatch.title}'`
      };
    }

    return {
      outcome: 'NEW_ENTITY',
      confidenceScore: 0,
      reason: 'No existing canonical topic met match threshold; registered as new canonical entity.'
    };
  }
}
