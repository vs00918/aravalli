import { CanonicalTopic, BankingCaMasterRegistry } from './schema';
import { TopicRevisionRecord } from './revision-state';

export interface SelectedDeckItem {
  topic: CanonicalTopic;
  reasons: string[];
}

export interface SelectedRevisionDeck {
  deckType: '15_MIN' | '30_MIN' | '60_MIN' | 'ALL_P1' | 'SINGLE_TOPIC';
  targetBudgetMinutes: number;
  actualRevisionMinutes: number;
  items: SelectedDeckItem[];
  overflowItems: SelectedDeckItem[];
}

export interface RecallPrompt {
  id: string;
  topicId: string;
  topicTitle: string;
  priority: string;
  category: string;
  institution: string;
  promptNumber: number;
  totalInTopic: number;
  question: string;
  answer: string;
  rawFact: string;
}

/**
 * Deterministic rank scoring function for topic prioritization in revision decks.
 */
export function calculateTopicRevisionScore(
  topic: CanonicalTopic,
  userRecord?: TopicRevisionRecord | null
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Priority Base Weight (Disproportionate exam weighting)
  if (topic.priority === 'P1_CRITICAL_DEEP' || topic.priority === 'P1_CRITICAL_MEMORIZE') {
    score += 10000;
    reasons.push('P1 Master Priority');
  } else if (topic.priority === 'P2_HIGH') {
    score += 5000;
    reasons.push('P2 High-Yield');
  } else if (topic.priority === 'P3_MODERATE') {
    score += 1000;
    reasons.push('P3 Moderate Factoid');
  }

  // 2. Change-Sensitive / Regulatory Draft status boost
  if (topic.changeAlert && topic.changeAlert.isChangeSensitive) {
    score += 3000;
    reasons.push('⚠️ Active Change-Sensitive Alert');
  }
  if (topic.regulatoryStatus === 'DRAFT' || topic.regulatoryStatus === 'PROPOSAL') {
    score += 1500;
    reasons.push(`Regulatory Status: ${topic.regulatoryStatus}`);
  }

  // 3. User Study State Modulation (if student history exists)
  if (userRecord) {
    if (userRecord.isWeak) {
      score += 4000;
      reasons.push(`Marked ${userRecord.lastRating} in previous review`);
    } else if (userRecord.lastRating === 'GOOD') {
      score += 200;
    } else if (userRecord.lastRating === 'EASY') {
      score -= 500; // Deprioritize easily mastered items slightly
    }

    // Days since last review boost
    if (userRecord.lastReviewedAt) {
      const daysSince = Math.floor(
        (Date.now() - new Date(userRecord.lastReviewedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSince >= 7) {
        score += 800;
        reasons.push(`Last revised ${daysSince} days ago`);
      }
    }
  } else {
    score += 1000;
    reasons.push('Unreviewed');
  }

  return { score, reasons };
}

/**
 * Builds a deterministic, time-budgeted revision deck without exceeding the student's chosen minutes.
 */
export function buildRevisionDeck(
  budgetMinutes: 15 | 30 | 60 | 'ALL_P1',
  registry: BankingCaMasterRegistry,
  userStateMap: Record<string, TopicRevisionRecord> = {}
): SelectedRevisionDeck {
  const allTopics = Object.values(registry.topics);

  // Special Mode: Revise ALL P1 Master Items
  if (budgetMinutes === 'ALL_P1') {
    const p1Topics = [
      ...registry.indexes.byPriority.P1_CRITICAL_DEEP,
      ...registry.indexes.byPriority.P1_CRITICAL_MEMORIZE
    ].map(id => registry.topics[id]).filter(Boolean);

    let totalP1Minutes = 0;
    const items: SelectedDeckItem[] = p1Topics.map(topic => {
      totalP1Minutes += topic.revisionMinutes;
      const { reasons } = calculateTopicRevisionScore(topic, userStateMap[topic.id]);
      return { topic, reasons };
    });

    return {
      deckType: 'ALL_P1',
      targetBudgetMinutes: registry.summary.activeP1RevisionMinutes,
      actualRevisionMinutes: totalP1Minutes,
      items,
      overflowItems: []
    };
  }

  // General Mode: Rank all topics deterministically
  const ranked = allTopics.map(topic => {
    const { score, reasons } = calculateTopicRevisionScore(topic, userStateMap[topic.id]);
    return { topic, score, reasons };
  });

  // Sort descending by score, tie-break deterministically by slug
  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.topic.slug.localeCompare(b.topic.slug);
  });

  // Greedy time-budget packing (Must NEVER exceed budget)
  let accumulatedMinutes = 0;
  const selected: SelectedDeckItem[] = [];
  const overflow: SelectedDeckItem[] = [];

  for (const entry of ranked) {
    if (accumulatedMinutes + entry.topic.revisionMinutes <= budgetMinutes) {
      selected.push({ topic: entry.topic, reasons: entry.reasons });
      accumulatedMinutes += entry.topic.revisionMinutes;
    } else if (overflow.length < 3) {
      overflow.push({ topic: entry.topic, reasons: entry.reasons });
    }
  }

  const deckTypeMap = {
    15: '15_MIN' as const,
    30: '30_MIN' as const,
    60: '60_MIN' as const
  };

  return {
    deckType: deckTypeMap[budgetMinutes],
    targetBudgetMinutes: budgetMinutes,
    actualRevisionMinutes: accumulatedMinutes,
    items: selected,
    overflowItems: overflow
  };
}

/**
 * Builds a single-topic revision deck.
 */
export function buildSingleTopicDeck(
  topic: CanonicalTopic,
  userRecord?: TopicRevisionRecord | null
): SelectedRevisionDeck {
  const { reasons } = calculateTopicRevisionScore(topic, userRecord);
  return {
    deckType: 'SINGLE_TOPIC',
    targetBudgetMinutes: topic.revisionMinutes,
    actualRevisionMinutes: topic.revisionMinutes,
    items: [{ topic, reasons }],
    overflowItems: []
  };
}

/**
 * Generates active recall prompts deterministically from canonical Must Memorize facts.
 * Zero runtime LLM calls — 100% source-grounded question patterns.
 */
export function generateRecallPrompts(topic: CanonicalTopic): RecallPrompt[] {
  const facts = topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0
    ? topic.mustMemorizeFacts
    : [topic.title];

  return facts.map((fact, index) => {
    let question = `Key fact for: ${topic.title}`;
    let answer = fact;

    // Pattern 1: Key-Value Split (e.g. "Policy Repo Rate: 5.25% (Unchanged)")
    if (fact.includes(':')) {
      const parts = fact.split(/:\s*(.+)/);
      if (parts.length > 1 && parts[1].trim()) {
        const key = parts[0].replace(/^[\*\-•]\s*/, '').trim();
        question = `${key}?`;
        answer = parts[1].trim();
      }
    } 
    // Pattern 2: Arrow Split (e.g. "Tata Sons -> Upper Layer")
    else if (fact.includes('→') || fact.includes('->')) {
      const parts = fact.split(/[→\->]\s*(.+)/);
      if (parts.length > 1 && parts[1].trim()) {
        const key = parts[0].replace(/^[\*\-•]\s*/, '').trim();
        question = `What is the standard/rule for: ${key}?`;
        answer = parts[1].trim();
      }
    }
    // Pattern 3: Threshold / Number recall
    else if (/\b(\d+(\.\d+)?%|₹\s*\d+|[\$]\s*\d+|\d+\s*years?|\d+\s*months?)\b/i.test(fact)) {
      question = `What is the key number / rule regarding: "${fact.substring(0, 45)}..."?`;
      answer = fact;
    }

    return {
      id: `${topic.id}-prompt-${index + 1}`,
      topicId: topic.id,
      topicTitle: topic.title,
      priority: topic.priority,
      category: topic.primaryCategory,
      institution: topic.primaryInstitution,
      promptNumber: index + 1,
      totalInTopic: facts.length,
      question,
      answer,
      rawFact: fact
    };
  });
}
