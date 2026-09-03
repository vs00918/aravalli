import fs from 'fs';
import path from 'path';
import {
  BankingCaMasterRegistry,
  CanonicalTopic,
  PriorityLevel,
  CategoryId
} from './schema';
import {
  RecallPrompt,
  generateRecallPrompts,
  calculateTopicRevisionScore,
  buildRevisionDeck
} from './revision-engine';
import { TopicRevisionRecord } from './revision-state';

export interface CramCapsuleMetadata {
  capsuleId: string;
  capsuleType: 'P1_MASTER' | 'P2_HIGH_YIELD_CORE' | 'SPRINT_15MIN' | 'SPRINT_30MIN' | 'SPRINT_60MIN';
  title: string;
  generatedAt: string;
  sourceRegistryVersion: string;
  totalTopics: number;
  totalEstimatedMinutes: number;
  prioritiesIncluded: string[];
  categoriesIncluded: string[];
  totalRecallPrompts: number;
}

export interface CapsuleTopicEntry {
  topicId: string;
  slug: string;
  title: string;
  priority: PriorityLevel;
  primaryCategory: CategoryId;
  primaryInstitution: string;
  revisionMinutes: number;
  chronologicalMonth: string;
  mustMemorizeFacts: string[];
  recallPrompts: RecallPrompt[];
  isChangeSensitive: boolean;
  changeSummary?: string;
  relatedTopics: string[];
  updatesHistory: any[];
}

export interface CramCapsule {
  metadata: CramCapsuleMetadata;
  topics: CapsuleTopicEntry[];
}

/**
 * Converts a CanonicalTopic into a self-contained CapsuleTopicEntry.
 */
export function formatCapsuleTopicEntry(topic: CanonicalTopic): CapsuleTopicEntry {
  const recallPrompts = generateRecallPrompts(topic);

  return {
    topicId: topic.id,
    slug: topic.slug,
    title: topic.title,
    priority: topic.priority,
    primaryCategory: topic.primaryCategory,
    primaryInstitution: topic.primaryInstitution,
    revisionMinutes: topic.revisionMinutes,
    chronologicalMonth: topic.chronologicalMonth,
    mustMemorizeFacts: topic.mustMemorizeFacts || [],
    recallPrompts,
    isChangeSensitive: Boolean(topic.changeAlert?.isChangeSensitive),
    changeSummary: topic.changeAlert?.currentFactSummary,
    relatedTopics: topic.relatedTopics || [],
    updatesHistory: topic.updatesHistory || []
  };
}

/**
 * Generates the P1 Master Capsule containing all 99 P1 topics (763 min total revision load).
 */
export function generateP1MasterCapsule(
  registry: BankingCaMasterRegistry,
  timestamp = '2026-09-03T12:00:00.000Z'
): CramCapsule {
  const p1TopicIds = [
    ...registry.indexes.byPriority.P1_CRITICAL_DEEP,
    ...registry.indexes.byPriority.P1_CRITICAL_MEMORIZE
  ];

  const p1Topics: CanonicalTopic[] = p1TopicIds
    .map(id => registry.topics[id])
    .filter(Boolean);

  // Deterministic sorting: by chronological month (newest first), then by slug
  p1Topics.sort((a, b) => {
    if (b.chronologicalMonth !== a.chronologicalMonth) {
      return b.chronologicalMonth.localeCompare(a.chronologicalMonth);
    }
    return a.slug.localeCompare(b.slug);
  });

  const topicEntries = p1Topics.map(formatCapsuleTopicEntry);
  const totalMinutes = topicEntries.reduce((sum, t) => sum + t.revisionMinutes, 0);
  const totalRecallPrompts = topicEntries.reduce((sum, t) => sum + t.recallPrompts.length, 0);
  const categories = Array.from(new Set(topicEntries.map(t => t.primaryCategory))).sort();

  return {
    metadata: {
      capsuleId: 'capsule-p1-master',
      capsuleType: 'P1_MASTER',
      title: 'Mind of Aravalli — Master P1 High-Yield Examination Capsule',
      generatedAt: timestamp,
      sourceRegistryVersion: registry.schemaVersion,
      totalTopics: topicEntries.length,
      totalEstimatedMinutes: totalMinutes,
      prioritiesIncluded: ['P1_CRITICAL_DEEP', 'P1_CRITICAL_MEMORIZE'],
      categoriesIncluded: categories,
      totalRecallPrompts
    },
    topics: topicEntries
  };
}

/**
 * Deterministically selects the Top P2 High-Yield Core topics.
 * Ranking Criteria:
 * 1. Change-sensitive alerts (+5000)
 * 2. Regulatory & Banking Core Categories (+2000 for BANKING_REGULATION, MACRO_ECONOMY, CAPITAL_MARKETS)
 * 3. Revision minute density (higher minutes = deeper exam relevance)
 * 4. Deterministic tie-break by slug.
 */
export function selectTopP2HighYieldCore(
  registry: BankingCaMasterRegistry,
  limit = 50
): CapsuleTopicEntry[] {
  const p2Ids = registry.indexes.byPriority.P2_HIGH || [];
  const p2Topics = p2Ids.map(id => registry.topics[id]).filter(Boolean);

  const ranked = p2Topics.map(topic => {
    let score = 0;
    if (topic.changeAlert?.isChangeSensitive) score += 5000;
    if (['BANKING_REGULATION', 'MACRO_ECONOMY', 'CAPITAL_MARKETS', 'GOVERNMENT_SCHEMES'].includes(topic.primaryCategory)) {
      score += 2000;
    }
    score += topic.revisionMinutes * 100;
    return { topic, score };
  });

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.topic.slug.localeCompare(b.topic.slug);
  });

  return ranked.slice(0, limit).map(r => formatCapsuleTopicEntry(r.topic));
}

/**
 * Generates a Time-Budgeted Revision Capsule (15 min, 30 min, 60 min)
 * strictly $\le$ requested minutes using the revision deck compiler.
 */
export function generateTimeBudgetedCapsule(
  budget: 15 | 30 | 60,
  registry: BankingCaMasterRegistry,
  userStateMap: Record<string, TopicRevisionRecord> = {},
  timestamp = '2026-09-03T12:00:00.000Z'
): CramCapsule {
  const deck = buildRevisionDeck(budget, registry, userStateMap);
  const topicEntries = deck.items.map(item => formatCapsuleTopicEntry(item.topic));
  const totalRecallPrompts = topicEntries.reduce((sum, t) => sum + t.recallPrompts.length, 0);
  const categories = Array.from(new Set(topicEntries.map(t => t.primaryCategory))).sort();
  const priorities = Array.from(new Set(topicEntries.map(t => t.priority))).sort();

  const typeMap = {
    15: 'SPRINT_15MIN' as const,
    30: 'SPRINT_30MIN' as const,
    60: 'SPRINT_60MIN' as const
  };

  return {
    metadata: {
      capsuleId: `capsule-sprint-${budget}min`,
      capsuleType: typeMap[budget],
      title: `Mind of Aravalli — ${budget}-Minute High-Yield Revision Sprint`,
      generatedAt: timestamp,
      sourceRegistryVersion: registry.schemaVersion,
      totalTopics: topicEntries.length,
      totalEstimatedMinutes: deck.actualRevisionMinutes,
      prioritiesIncluded: priorities,
      categoriesIncluded: categories,
      totalRecallPrompts
    },
    topics: topicEntries
  };
}

/**
 * Extracts all Active Recall Prompts from a Cram Capsule.
 */
export function generateActiveRecallDeck(capsule: CramCapsule): RecallPrompt[] {
  const allPrompts: RecallPrompt[] = [];
  for (const topic of capsule.topics) {
    allPrompts.push(...topic.recallPrompts);
  }
  return allPrompts;
}

/**
 * Exports a Cram Capsule to high-density, printable Markdown format.
 */
export function exportCapsuleMarkdown(capsule: CramCapsule): string {
  const lines: string[] = [];

  lines.push(`# ${capsule.metadata.title}`);
  lines.push(`\n**Capsule Type:** \`${capsule.metadata.capsuleType}\` | **Total Topics:** \`${capsule.metadata.totalTopics}\` | **Revision Load:** \`${capsule.metadata.totalEstimatedMinutes} min\` | **Active Prompts:** \`${capsule.metadata.totalRecallPrompts}\``);
  lines.push(`**Generated:** \`${capsule.metadata.generatedAt}\` | **Schema:** \`${capsule.metadata.sourceRegistryVersion}\``);
  lines.push('\n---\n');

  capsule.topics.forEach((topic, idx) => {
    lines.push(`## ${idx + 1}. ${topic.title}`);
    lines.push(`- **ID:** \`${topic.topicId}\` | **Priority:** \`${topic.priority}\` | **Category:** \`${topic.primaryCategory}\` | **Time:** \`${topic.revisionMinutes} min\``);
    if (topic.isChangeSensitive) {
      lines.push(`- ⚠️ **Change Alert:** ${topic.changeSummary || 'Change-sensitive fact'}`);
    }

    lines.push('\n### Must Memorize Facts:');
    topic.mustMemorizeFacts.forEach(fact => {
      lines.push(`- ${fact}`);
    });

    if (topic.recallPrompts && topic.recallPrompts.length > 0) {
      lines.push('\n### Active Recall Cards:');
      topic.recallPrompts.forEach(p => {
        lines.push(`- **Q${p.promptNumber}:** ${p.question}`);
        lines.push(`  - **A:** ${p.answer}`);
      });
    }

    lines.push('\n---\n');
  });

  return lines.join('\n');
}

/**
 * Compiles and saves all cram capsules to disk in JSON and Markdown formats.
 */
export function compileAndSaveAllCapsules(
  registry: BankingCaMasterRegistry,
  outDir?: string
): Record<string, string> {
  const targetDir = outDir || path.join(process.cwd(), 'data/cram-capsules');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const artifacts: Record<string, string> = {};

  // 1. P1 Master Capsule
  const p1Capsule = generateP1MasterCapsule(registry);
  const p1JsonPath = path.join(targetDir, 'p1-master-capsule.json');
  const p1MdPath = path.join(targetDir, 'p1-master-capsule.md');
  fs.writeFileSync(p1JsonPath, JSON.stringify(p1Capsule, null, 2), 'utf-8');
  fs.writeFileSync(p1MdPath, exportCapsuleMarkdown(p1Capsule), 'utf-8');
  artifacts['p1-master.json'] = p1JsonPath;
  artifacts['p1-master.md'] = p1MdPath;

  // 2. 15-Minute Sprint Capsule
  const sprint15 = generateTimeBudgetedCapsule(15, registry);
  const s15JsonPath = path.join(targetDir, 'sprint-15min-capsule.json');
  const s15MdPath = path.join(targetDir, 'sprint-15min-capsule.md');
  fs.writeFileSync(s15JsonPath, JSON.stringify(sprint15, null, 2), 'utf-8');
  fs.writeFileSync(s15MdPath, exportCapsuleMarkdown(sprint15), 'utf-8');
  artifacts['sprint-15min.json'] = s15JsonPath;
  artifacts['sprint-15min.md'] = s15MdPath;

  // 3. 30-Minute Sprint Capsule
  const sprint30 = generateTimeBudgetedCapsule(30, registry);
  const s30JsonPath = path.join(targetDir, 'sprint-30min-capsule.json');
  const s30MdPath = path.join(targetDir, 'sprint-30min-capsule.md');
  fs.writeFileSync(s30JsonPath, JSON.stringify(sprint30, null, 2), 'utf-8');
  fs.writeFileSync(s30MdPath, exportCapsuleMarkdown(sprint30), 'utf-8');
  artifacts['sprint-30min.json'] = s30JsonPath;
  artifacts['sprint-30min.md'] = s30MdPath;

  // 4. 60-Minute Sprint Capsule
  const sprint60 = generateTimeBudgetedCapsule(60, registry);
  const s60JsonPath = path.join(targetDir, 'sprint-60min-capsule.json');
  const s60MdPath = path.join(targetDir, 'sprint-60min-capsule.md');
  fs.writeFileSync(s60JsonPath, JSON.stringify(sprint60, null, 2), 'utf-8');
  fs.writeFileSync(s60MdPath, exportCapsuleMarkdown(sprint60), 'utf-8');
  artifacts['sprint-60min.json'] = s60JsonPath;
  artifacts['sprint-60min.md'] = s60MdPath;

  return artifacts;
}
