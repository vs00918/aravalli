import { 
  CanonicalTopic, 
  BankingCaMasterRegistry, 
  PriorityLevel, 
  CategoryId, 
  InstitutionId, 
  RegulatoryStatus 
} from './schema';
import { TopicRevisionRecord } from './revision-state';

export interface SearchFilterCriteria {
  query?: string;
  priority?: 'ALL' | PriorityLevel;
  category?: 'ALL' | CategoryId;
  institution?: 'ALL' | InstitutionId;
  month?: 'ALL' | string;
  regulatoryStatus?: 'ALL' | RegulatoryStatus;
  changeSensitiveOnly?: boolean;
  revisionStatus?: 'ALL' | 'UNREVIEWED' | 'WEAK' | 'REVIEWED' | 'MASTERED';
  sortBy?: 'RELEVANCE' | 'PRIORITY' | 'NEWEST' | 'TIME' | 'ALPHA';
}

export interface SearchResultItem {
  topic: CanonicalTopic;
  relevanceScore: number;
  matchingFields: string[];
  snippet?: string;
  userRecord?: TopicRevisionRecord | null;
}

export type QueryIntent = 'EXACT_TOPIC' | 'INSTITUTION' | 'NUMERIC_FACT' | 'MONTH' | 'GENERAL_KEYWORD';

/**
 * Normalizes query string for safe matching
 */
export function normalizeSearchString(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/[^\w\s\.\%₹\$]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detects the dominant search intent deterministically.
 */
export function detectQueryIntent(qNorm: string): { intent: QueryIntent; payload?: string } {
  if (!qNorm) return { intent: 'GENERAL_KEYWORD' };

  // 1. Month Intent (e.g. "august 2026", "2026-08", "aug 2026")
  if (/(august|aug|september|sep|october|oct|july|jul|june|jun|may|april|apr)\s*(\d{4})?/i.test(qNorm) || /^\d{4}-\d{2}$/.test(qNorm)) {
    return { intent: 'MONTH' };
  }

  // 2. Numeric / Fact Intent (e.g. "5.25%", "₹10,000", "12%")
  if (/\b(\d+(\.\d+)?%|₹\s*\d+|[\$]\s*\d+)\b/i.test(qNorm)) {
    return { intent: 'NUMERIC_FACT' };
  }

  // 3. Institution Intent (e.g. "rbi", "sebi", "irdai", "npci", "pfrda", "nabard", "sidbi", "exim bank")
  const instTokens = ['rbi', 'sebi', 'irdai', 'pfrda', 'npci', 'nabard', 'sidbi', 'exim bank', 'ministry of finance', 'adb', 'world bank'];
  if (instTokens.includes(qNorm)) {
    return { intent: 'INSTITUTION', payload: qNorm.toUpperCase() };
  }

  return { intent: 'GENERAL_KEYWORD' };
}

/**
 * Deterministic search and exploration filter engine.
 * Consumes the validated registry and runtime personal state.
 * Relevance strictly outranks priority; priority acts solely as a bounded tie-breaker.
 */
export function searchCanonicalTopics(
  criteria: SearchFilterCriteria,
  registry: BankingCaMasterRegistry,
  userStateMap: Record<string, TopicRevisionRecord> = {}
): SearchResultItem[] {
  const qRaw = criteria.query ? criteria.query.trim() : '';
  const q = normalizeSearchString(qRaw);
  const queryTokens = q ? q.split(/\s+/).filter(t => t.length > 0) : [];
  const { intent } = detectQueryIntent(q);

  const allTopics = Object.values(registry.topics);

  // 1. Filter phase
  const filteredTopics = allTopics.filter(topic => {
    // Priority filter
    if (criteria.priority && criteria.priority !== 'ALL') {
      if (criteria.priority === 'P1_CRITICAL_DEEP' || criteria.priority === 'P1_CRITICAL_MEMORIZE') {
        if (!topic.priority.startsWith('P1')) return false;
      } else if (topic.priority !== criteria.priority) {
        return false;
      }
    }

    // Category filter
    if (criteria.category && criteria.category !== 'ALL' && topic.primaryCategory !== criteria.category) {
      return false;
    }

    // Institution filter
    if (criteria.institution && criteria.institution !== 'ALL' && topic.primaryInstitution !== criteria.institution) {
      return false;
    }

    // Month filter
    if (criteria.month && criteria.month !== 'ALL' && topic.chronologicalMonth !== criteria.month) {
      return false;
    }

    // Regulatory status filter
    if (criteria.regulatoryStatus && criteria.regulatoryStatus !== 'ALL' && topic.regulatoryStatus !== criteria.regulatoryStatus) {
      return false;
    }

    // Change-sensitive filter
    if (criteria.changeSensitiveOnly) {
      if (!topic.changeAlert || !topic.changeAlert.isChangeSensitive) {
        return false;
      }
    }

    // Revision status filter
    if (criteria.revisionStatus && criteria.revisionStatus !== 'ALL') {
      const record = userStateMap[topic.id];
      if (criteria.revisionStatus === 'UNREVIEWED') {
        if (record && record.reviewCount > 0) return false;
      } else if (criteria.revisionStatus === 'WEAK') {
        if (!record || !record.isWeak) return false;
      } else if (criteria.revisionStatus === 'REVIEWED') {
        if (!record || record.reviewCount === 0) return false;
      } else if (criteria.revisionStatus === 'MASTERED') {
        if (!record || record.lastRating !== 'EASY') return false;
      }
    }

    return true;
  });

  // 2. Scoring & relevance calculation
  const results: SearchResultItem[] = [];

  for (const topic of filteredTopics) {
    let score = 0;
    const matchingFields: string[] = [];
    let bestSnippet = '';

    const normTitle = normalizeSearchString(topic.title);
    const normCategory = normalizeSearchString(topic.primaryCategory);
    const normInstitution = normalizeSearchString(topic.primaryInstitution);
    const userRecord = userStateMap[topic.id] || null;

    if (q) {
      // Intent A: Month Intent (e.g. "August 2026")
      if (intent === 'MONTH') {
        if (topic.chronologicalMonth === '2026-08' || normTitle.includes('august 2026')) {
          score += 1000000;
          matchingFields.push('Month Archive Match');
          bestSnippet = topic.title;
        }
      }

      // Intent B: Numeric Fact Intent (e.g. "5.25%", "₹10,000")
      if (intent === 'NUMERIC_FACT') {
        if (topic.mustMemorizeFacts) {
          for (const fact of topic.mustMemorizeFacts) {
            if (normalizeSearchString(fact).includes(q)) {
              score += 2000000;
              matchingFields.push('Exact Numeric Fact');
              bestSnippet = fact;
            }
          }
        }
      }

      // Intent C: Institution Intent (e.g. "RBI", "SEBI")
      if (intent === 'INSTITUTION') {
        const qUpper = q.toUpperCase();
        if (topic.primaryInstitution === qUpper || (qUpper === 'RBI' && topic.primaryInstitution === 'RBI')) {
          score += 1500000;
          matchingFields.push(`Institution: ${topic.primaryInstitution}`);
          bestSnippet = topic.title;
        }
      }

      // Exact Title Match (Highest relevance in general search)
      if (normTitle === q) {
        score += 3000000;
        matchingFields.push('Exact Title Match');
        bestSnippet = topic.title;
      } 
      // Title Starts-With / Prefix
      else if (normTitle.startsWith(q)) {
        score += 1500000;
        matchingFields.push('Title Prefix Match');
        bestSnippet = topic.title;
      } 
      // Title Substring Match (e.g. "Basel III" in "RBI Defers Basel III Pillar 3 Disclosures")
      else if (normTitle.includes(q)) {
        score += 1000000;
        matchingFields.push('Title Keyword Match');
        bestSnippet = topic.title;
      }

      // Title Token Matches (Multiple keywords present in title)
      let tokenMatchesInTitle = 0;
      for (const token of queryTokens) {
        if (normTitle.includes(token)) {
          tokenMatchesInTitle++;
        }
      }
      if (tokenMatchesInTitle > 0) {
        score += tokenMatchesInTitle * 200000;
        if (tokenMatchesInTitle === queryTokens.length) {
          matchingFields.push('Title All Tokens');
          if (!bestSnippet) bestSnippet = topic.title;
        }
      }

      // Must Memorize Facts Match (Subordinate to Title matches)
      if (topic.mustMemorizeFacts) {
        for (const fact of topic.mustMemorizeFacts) {
          const normFact = normalizeSearchString(fact);
          if (normFact.includes(q)) {
            score += 80000;
            matchingFields.push('Must-Memorize Fact');
            if (!bestSnippet) bestSnippet = fact;
          } else {
            let tokenHits = 0;
            for (const token of queryTokens) {
              if (normFact.includes(token)) tokenHits++;
            }
            if (tokenHits === queryTokens.length) {
              score += 40000;
              matchingFields.push('Fact All Tokens');
              if (!bestSnippet) bestSnippet = fact;
            }
          }
        }
      }

      // What Happened / Context Match
      if (topic.whatHappened) {
        for (const wh of topic.whatHappened) {
          if (normalizeSearchString(wh).includes(q)) {
            score += 20000;
            matchingFields.push('What Happened');
            if (!bestSnippet) bestSnippet = wh;
          }
        }
      }

      // Detailed Notes Content Match
      if (score === 0 && normalizeSearchString(topic.contentMarkdown).includes(q)) {
        score += 5000;
        matchingFields.push('Detailed Notes');
        if (!bestSnippet) bestSnippet = topic.mustMemorizeFacts[0] || topic.title;
      }

      // If query specified but zero matches in any field, skip topic
      if (score === 0) {
        continue;
      }
    } else {
      // Default score when no query typed (pure browsing/filtering)
      score = 1000;
      bestSnippet = topic.mustMemorizeFacts[0] || topic.title;
    }

    // Bounded Exam Priority Tie-Break (Max +500 to never overcome semantic relevance)
    if (topic.priority.startsWith('P1')) score += 500;
    else if (topic.priority === 'P2_HIGH') score += 250;
    else if (topic.priority === 'P3_MODERATE') score += 50;

    results.push({
      topic,
      relevanceScore: score,
      matchingFields: Array.from(new Set(matchingFields)),
      snippet: bestSnippet,
      userRecord
    });
  }

  // 3. Sorting Phase
  const sortBy = criteria.sortBy || 'RELEVANCE';

  results.sort((a, b) => {
    if (sortBy === 'RELEVANCE') {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
    } else if (sortBy === 'PRIORITY') {
      const pRank = (p: string) => p.startsWith('P1') ? 3 : p === 'P2_HIGH' ? 2 : p === 'P3_MODERATE' ? 1 : 0;
      if (pRank(b.topic.priority) !== pRank(a.topic.priority)) {
        return pRank(b.topic.priority) - pRank(a.topic.priority);
      }
    } else if (sortBy === 'NEWEST') {
      if (b.topic.initialEventDate !== a.topic.initialEventDate) {
        return b.topic.initialEventDate.localeCompare(a.topic.initialEventDate);
      }
    } else if (sortBy === 'TIME') {
      if (b.topic.revisionMinutes !== a.topic.revisionMinutes) {
        return b.topic.revisionMinutes - a.topic.revisionMinutes;
      }
    } else if (sortBy === 'ALPHA') {
      return a.topic.title.localeCompare(b.topic.title);
    }

    // Default stable tie-break
    return a.topic.slug.localeCompare(b.topic.slug);
  });

  return results;
}
