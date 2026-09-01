import fs from 'fs';
import path from 'path';
import { routeTopicSemantically } from '../lib/banking-ca/semantic-router';
import { CanonicalTopic, BankingCaMasterRegistry } from '../lib/banking-ca/schema';

const regPath = path.resolve(__dirname, '../data/banking-ca-registry.json');
const registry: BankingCaMasterRegistry = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const augustTopics: CanonicalTopic[] = Object.values(registry.topics).filter(
  t => t.activeInMonths.includes('2026-08') || t.chronologicalMonth === '2026-08'
);

const sec4Topics = augustTopics.filter(t => routeTopicSemantically(t).sectionId === 'sec-4');

const report = sec4Topics.map((t, idx) => {
  const r = routeTopicSemantically(t);
  return {
    num: idx + 1,
    slug: t.slug,
    title: t.title,
    priority: t.priority,
    eventType: r.eventType,
    confidence: r.confidence,
    reason: r.classificationReason,
    isFallback: r.confidence === 'LOW' || r.classificationReason.includes('ROUTING_REVIEW_REQUIRED'),
    mustMemorize: t.mustMemorizeFacts || []
  };
});

fs.writeFileSync(
  path.resolve(__dirname, '../data/sec4-audit-dump.json'),
  JSON.stringify(report, null, 2)
);

console.log(`Audited ${report.length} topics. Saved to data/sec4-audit-dump.json`);
console.log(`Fallback count: ${report.filter(r => r.isFallback).length}`);
