import fs from 'fs';
import path from 'path';
import { BankingCaMasterRegistry, BankingCaMasterRegistrySchema, CanonicalTopic } from './schema';

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
