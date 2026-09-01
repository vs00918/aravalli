import fs from 'fs';
import path from 'path';
import { routeTopicSemantically, MAGAZINE_SECTIONS } from '../lib/banking-ca/semantic-router';
import { classifyTopicPresentation } from '../lib/banking-ca/presentation-classifier';
import { CanonicalTopic, BankingCaMasterRegistry } from '../lib/banking-ca/schema';

const regPath = path.resolve(__dirname, '../data/banking-ca-registry.json');
const registry: BankingCaMasterRegistry = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const augustTopics: CanonicalTopic[] = Object.values(registry.topics).filter(
  t => t.activeInMonths.includes('2026-08') || t.chronologicalMonth === '2026-08'
);

console.log('========================================================================');
console.log('AUGUST 2026 V3 PRESENTATION ARCHITECTURE & VISUAL QA AUDIT');
console.log('========================================================================\n');

// 1. Distribution by Presentation Primitive
const primitiveCounts: Record<string, number> = {};
augustTopics.forEach(t => {
  const p = classifyTopicPresentation(t);
  primitiveCounts[p] = (primitiveCounts[p] || 0) + 1;
});

console.log('1. PRESENTATION PRIMITIVE BREAKDOWN:');
console.table(primitiveCounts);

// 2. Specific Topic Audits across Required Types
const targetCriteria = [
  { label: 'P1 Regulatory Item', match: (t: CanonicalTopic) => t.slug.includes('monetary-policy') || t.slug.includes('mpc') },
  { label: 'P2 Regulatory Item', match: (t: CanonicalTopic) => t.slug.includes('scale-based') || t.slug.includes('nbfc') },
  { label: 'P2 Appointment', match: (t: CanonicalTopic) => t.slug.includes('appointment') },
  { label: 'P2 Government Scheme', match: (t: CanonicalTopic) => t.slug.includes('urea') || t.slug.includes('pm-kisan') },
  { label: 'Economic Metric Item', match: (t: CanonicalTopic) => t.slug.includes('gem') || t.slug.includes('milestone') },
  { label: 'Report / Ranking Item', match: (t: CanonicalTopic) => t.slug.includes('plfs') || t.slug.includes('survey') },
  { label: 'Sports Event Item', match: (t: CanonicalTopic) => t.informationType === 'SPORTS_EVENT' || t.primaryCategory === 'SPORTS_AND_AWARDS' },
  { label: 'MoU / Partnership Item', match: (t: CanonicalTopic) => t.informationType === 'MoU' || t.slug.includes('agreement') },
  { label: 'Static GK / Monument Item', match: (t: CanonicalTopic) => t.informationType === 'RAMSAR' || t.slug.includes('heritage') || t.slug.includes('ramsar') },
  { label: 'P3 One-Liner Item', match: (t: CanonicalTopic) => t.priority === 'P3_MODERATE' }
];

console.log('\n2. TARGET TOPIC AUDIT SAMPLING:');
targetCriteria.forEach((target, i) => {
  const topic = augustTopics.find(target.match);
  if (!topic) {
    console.log(`[${i+1}] ❌ ${target.label} NOT FOUND in registry`);
    return;
  }
  const routing = routeTopicSemantically(topic);
  const primitive = classifyTopicPresentation(topic);

  console.log(`[${i+1}] ${target.label}:`);
  console.log(`    Title       : ${topic.title}`);
  console.log(`    Section     : [${routing.sectionNumber}] ${routing.sectionTitle}`);
  console.log(`    Priority    : ${topic.priority} (${topic.revisionMinutes} min)`);
  console.log(`    Info Type   : ${topic.informationType}`);
  console.log(`    Compression : ${topic.compressionLevel}`);
  console.log(`    Primitive   : ${primitive}`);
  console.log(`    Anchor      : ${topic.memoryAnchor || 'N/A'}`);
  console.log(`    Atomic Card : ${topic.atomicRecall || 'N/A'}`);
  console.log('');
});

// 3. Consecutive 35 Topics Inspection for Visual Monotony and Anti-Dumping
console.log('3. CONSECUTIVE 35 TOPICS INSPECTION:');
augustTopics.slice(0, 35).forEach((t, i) => {
  const r = routeTopicSemantically(t);
  const p = classifyTopicPresentation(t);
  console.log(`${(i+1).toString().padStart(2, '0')}. [${r.sectionNumber}] [${t.priority.padEnd(20, ' ')}] [${t.informationType?.padEnd(20, ' ')}] [${p.padEnd(16, ' ')}] ${t.title.slice(0, 45)}...`);
});
