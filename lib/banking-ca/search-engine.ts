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

/**
 * Normalizes query string for safe matching
 */
export function normalizeSearchString(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\.\-%₹\$]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Deterministic search and exploration filter engine.
 * Consumes the validated registry and runtime personal state.
 * Zero runtime LLM, zero external search services.
 */
export function searchCanonicalTopics(
  criteria: SearchFilterCriteria,
  registry: BankingCaMasterRegistry,
  userStateMap: Record<string, TopicRevisionRecord> = {}
): SearchResultItem[] {
  const qRaw = criteria.query ? criteria.query.trim() : '';
  const q = normalizeSearchString(qRaw);
  const queryTokens = q ? q.split(/\s+/).filter(t => t.length > 0) : [];

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

    // Revision status filter (combines runtime personal study state)
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
      // Exact title match
      if (normTitle === q) {
        score += 1000000;
        matchingFields.push('Exact Title Match');
        bestSnippet = topic.title;
      } 
      // Title prefix / starts with
      else if (normTitle.startsWith(q)) {
        score += 500000;
        matchingFields.push('Title Prefix Match');
        bestSnippet = topic.title;
      } 
      // Title substring
      else if (normTitle.includes(q)) {
        score += 250000;
        matchingFields.push('Title Match');
        bestSnippet = topic.title;
      }

      // Title individual tokens
      let tokenMatchesInTitle = 0;
      for (const token of queryTokens) {
        if (normTitle.includes(token)) {
          tokenMatchesInTitle++;
        }
      }
      if (tokenMatchesInTitle > 0) {
        score += tokenMatchesInTitle * 50000;
      }

      // Institution match
      if (normInstitution.includes(q) || (q === 'rbi' && topic.primaryInstitution === 'RBI') || (q === 'sebi' && topic.primaryInstitution === 'SEBI')) {
        score += 80000;
        matchingFields.push(`Institution: ${topic.primaryInstitution}`);
      }

      // Category match
      if (normCategory.includes(q)) {
        score += 60000;
        matchingFields.push(`Category: ${topic.primaryCategory}`);
      }

      // Must Memorize Facts match
      if (topic.mustMemorizeFacts) {
        for (const fact of topic.mustMemorizeFacts) {
          const normFact = normalizeSearchString(fact);
          if (normFact.includes(q)) {
            score += 40000;
            matchingFields.push('Must-Memorize Fact');
            if (!bestSnippet) bestSnippet = fact;
          } else {
            // Check token matches
            let tokenHits = 0;
            for (const token of queryTokens) {
              if (normFact.includes(token)) tokenHits++;
            }
            if (tokenHits === queryTokens.length) {
              score += 20000;
              matchingFields.push('Fact All Tokens');
              if (!bestSnippet) bestSnippet = fact;
            }
          }
        }
      }

      // What Happened / Context match
      if (topic.whatHappened) {
        for (const wh of topic.whatHappened) {
          if (normalizeSearchString(wh).includes(q)) {
            score += 15000;
            matchingFields.push('What Happened');
            if (!bestSnippet) bestSnippet = wh;
          }
        }
      }

      // Content markdown match
      if (score === 0 && normalizeSearchString(topic.contentMarkdown).includes(q)) {
        score += 5000;
        matchingFields.push('Detailed Notes Content');
        if (!bestSnippet) bestSnippet = topic.mustMemorizeFacts[0] || topic.title;
      }

      // If query specified but zero matches in any field, skip
      if (score === 0) {
        continue;
      }
    } else {
      // Default score when no query typed (pure browsing/filtering)
      score = 1000;
      bestSnippet = topic.mustMemorizeFacts[0] || topic.title;
    }

    // Secondary priority bonus (Bounded tie-breaker only)
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
