import fs from 'fs';
import path from 'path';
import { identifyEventType, EventType } from '../lib/banking-ca/event-types';
import { 
  resolveTopicMagazineSection, 
  MAGAZINE_SECTIONS, 
  groupTopicsByMagazineSection 
} from '../lib/banking-ca/monthly-magazine-sections';
import { classifyTopicPresentation } from '../lib/banking-ca/presentation-classifier';
import { CanonicalTopic, BankingCaMasterRegistry } from '../lib/banking-ca/schema';

const regPath = path.resolve(__dirname, '../data/banking-ca-registry.json');
const registry: BankingCaMasterRegistry = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const augustTopics: CanonicalTopic[] = Object.values(registry.topics).filter(
  t => t.activeInMonths.includes('2026-08') || t.chronologicalMonth === '2026-08'
);

console.log('====================================================');
console.log('AUGUST 2026 INTELLIGENCE & CLASSIFICATION AUDIT');
console.log('====================================================');
console.log(`Total August Canonical Topics: ${augustTopics.length}`);

// 1. Priority Breakdown
const p1Topics = augustTopics.filter(t => t.priority.startsWith('P1'));
const p2Topics = augustTopics.filter(t => t.priority === 'P2_HIGH');
const p3Topics = augustTopics.filter(t => t.priority === 'P3_MODERATE');
const p4Topics = augustTopics.filter(t => t.priority === 'P4_LOW_YIELD');

console.log('\n--- 1. PRIORITY DISTRIBUTION ---');
console.log(`P1 Critical Topics  : ${p1Topics.length}`);
console.log(`P2 High-Yield Topics: ${p2Topics.length}`);
console.log(`P3 Rapid Recall     : ${p3Topics.length}`);
console.log(`P4 Optional/Background : ${p4Topics.length}`);

// 2. Event Type Distribution
const eventTypeCounts: Record<string, number> = {};
for (const t of augustTopics) {
  const ev = identifyEventType(t);
  eventTypeCounts[ev] = (eventTypeCounts[ev] || 0) + 1;
}

console.log('\n--- 2. EVENT TYPE TAXONOMY BREAKDOWN ---');
Object.entries(eventTypeCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([ev, count]) => {
    console.log(`  - ${ev.padEnd(30)}: ${count}`);
  });

// 3. Section Distribution & Primitives
console.log('\n--- 3. 10 FIXED SECTIONS & PRIMITIVES ---');
const sectionGroups = groupTopicsByMagazineSection(augustTopics);

for (const group of sectionGroups) {
  const sec = group.section;
  console.log(`\n[${sec.number}] ${sec.icon} ${sec.title} (${group.topics.length} topics, ~${group.totalRevisionTime} min)`);
  console.log(`     P1: ${group.p1Count} | P2: ${group.p2Count} | P3/P4: ${group.p3Count}`);
  
  const primitives: Record<string, number> = {};
  for (const t of group.topics) {
    const p = classifyTopicPresentation(t);
    primitives[p] = (primitives[p] || 0) + 1;
  }
  console.log(`     Primitives:`, JSON.stringify(primitives));
}

// 4. Audit Specific Items Highlighted by User
console.log('\n--- 4. CONCRETE USER AUDIT TARGETS ---');
const targetCheck = [
  'd-sib',
  'lic-gets-rbi',
  'nipu',
  'special-economic-zones',
  'irdai-master-framework',
  'apex-financial'
];

for (const query of targetCheck) {
  const found = augustTopics.filter(t => t.slug.includes(query) || t.title.toLowerCase().includes(query));
  found.forEach(t => {
    const secId = resolveTopicMagazineSection(t);
    const sec = MAGAZINE_SECTIONS.find(s => s.id === secId);
    const ev = identifyEventType(t);
    const pres = classifyTopicPresentation(t);
    console.log(`  * ${t.title}`);
    console.log(`    Slug       : ${t.slug}`);
    console.log(`    Section    : [${sec?.number}] ${sec?.title}`);
    console.log(`    Event Type : ${ev}`);
    console.log(`    Primitive  : ${pres}`);
    console.log(`    Priority   : ${t.priority}`);
  });
}
