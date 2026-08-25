import fs from 'fs';
import path from 'path';
import {
  BankingCaMasterRegistry,
  BankingCaMasterRegistrySchema,
  CanonicalTopic,
  ExamTargetProfile
} from './schema';

/**
 * Loads the compiled Banking CA Master Registry synchronously at build time / in Server Components.
 */
export function getBankingCaRegistry(): BankingCaMasterRegistry {
  const registryPath = path.join(process.cwd(), 'data/banking-ca-registry.json');
  
  if (!fs.existsSync(registryPath)) {
    throw new Error(
      `Banking CA Registry not found at ${registryPath}. Run "npm run compile:banking-ca" first.`
    );
  }

  const raw = fs.readFileSync(registryPath, 'utf8');
  const parsed = JSON.parse(raw);
  const validated = BankingCaMasterRegistrySchema.parse(parsed);
  return validated;
}

/**
 * Helper to fetch a single canonical topic by slug or ID.
 */
export function getTopicBySlug(slug: string): CanonicalTopic | null {
  const registry = getBankingCaRegistry();
  const topicId = registry.topicSlugMap[slug] || slug;
  return registry.topics[topicId] || null;
}

/**
 * Helper to fetch all P1 topics.
 */
export function getP1Topics(): CanonicalTopic[] {
  const registry = getBankingCaRegistry();
  const p1Ids = [
    ...registry.indexes.byPriority.P1_CRITICAL_DEEP,
    ...registry.indexes.byPriority.P1_CRITICAL_MEMORIZE
  ];
  return p1Ids.map(id => registry.topics[id]).filter(Boolean);
}

/**
 * Helper to fetch change-sensitive topics.
 */
export function getChangeSensitiveTopics(): CanonicalTopic[] {
  const registry = getBankingCaRegistry();
  return registry.indexes.changeSensitiveTopicIds.map(id => registry.topics[id]).filter(Boolean);
}

/**
 * Helper to fetch all predefined exam target profiles.
 */
export function getExamProfiles(): ExamTargetProfile[] {
  const registry = getBankingCaRegistry();
  return registry.examProfiles || [];
}

/**
 * Helper to fetch default exam target profile.
 */
export function getDefaultExamProfile(): ExamTargetProfile {
  const profiles = getExamProfiles();
  return profiles.find(p => p.isDefault) || profiles[0] || {
    id: 'sbi-po-mains-2026',
    name: 'SBI PO Mains — September 2026',
    targetExamDate: '2026-09',
    windowStartMonth: '2026-04',
    windowEndMonth: '2026-09',
    isDefault: true
  };
}

/**
 * Helper to fetch topics within an exam target profile window.
 */
export function getTopicsByExamProfile(profileId?: string): CanonicalTopic[] {
  const registry = getBankingCaRegistry();
  const profiles = getExamProfiles();
  const profile = profileId
    ? profiles.find(p => p.id === profileId) || getDefaultExamProfile()
    : getDefaultExamProfile();

  const allTopics = Object.values(registry.topics);
  return allTopics.filter(t => {
    const months = t.activeInMonths && t.activeInMonths.length > 0
      ? t.activeInMonths
      : [t.chronologicalMonth];
    return months.some(m => m >= profile.windowStartMonth && m <= profile.windowEndMonth);
  });
}

/**
 * Helper to fetch topics active in a specific month (YYYY-MM).
 */
export function getTopicsByMonth(yearMonth: string): CanonicalTopic[] {
  const registry = getBankingCaRegistry();
  const topicIds = registry.indexes.byYearMonth?.[yearMonth] || registry.indexes.byMonth?.[yearMonth] || [];
  return topicIds.map(id => registry.topics[id]).filter(Boolean);
}

/**
 * Helper to generate a Year -> Month hierarchy tree from all indexed months.
 */
export function getChronologyTree(): Record<string, string[]> {
  const registry = getBankingCaRegistry();
  const indexedMonths = Object.keys(registry.indexes.byYearMonth || registry.indexes.byMonth || {}).sort().reverse();
  const tree: Record<string, string[]> = {};

  for (const ym of indexedMonths) {
    const [year] = ym.split('-');
    if (!tree[year]) tree[year] = [];
    tree[year].push(ym);
  }

  return tree;
}
