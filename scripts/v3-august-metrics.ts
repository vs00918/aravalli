import fs from 'fs';
import path from 'path';
import { routeTopicSemantically, MAGAZINE_SECTIONS } from '../lib/banking-ca/semantic-router';
import { CanonicalTopic, BankingCaMasterRegistry } from '../lib/banking-ca/schema';

const regPath = path.resolve(__dirname, '../data/banking-ca-registry.json');
const registry: BankingCaMasterRegistry = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const augustTopics: CanonicalTopic[] = Object.values(registry.topics).filter(
  t => t.activeInMonths.includes('2026-08') || t.chronologicalMonth === '2026-08'
);

console.log('Total August Canonical Topics:', augustTopics.length);

// 1. Priorities
const priorities = { P1: 0, P2: 0, P3: 0, P4: 0 };
augustTopics.forEach(t => {
  if (t.priority.startsWith('P1')) priorities.P1++;
  else if (t.priority === 'P2_HIGH') priorities.P2++;
  else if (t.priority === 'P3_MODERATE') priorities.P3++;
  else if (t.priority === 'P4_LOW_YIELD') priorities.P4++;
});
console.log('\n--- PRIORITIES ---');
console.log(priorities);

// 2. Information Types
const infoTypes: Record<string, number> = {};
augustTopics.forEach(t => {
  const it = t.informationType || 'OTHER';
  infoTypes[it] = (infoTypes[it] || 0) + 1;
});
console.log('\n--- INFORMATION TYPES ---');
console.log(infoTypes);

// 3. Compression Levels
const compLevels: Record<string, number> = {};
augustTopics.forEach(t => {
  const cl = t.compressionLevel || 'C2';
  compLevels[cl] = (compLevels[cl] || 0) + 1;
});
console.log('\n--- COMPRESSION LEVELS ---');
console.log(compLevels);

// 4. Domains & Times
const domainStats = MAGAZINE_SECTIONS.map(sec => {
  const secTopics = augustTopics.filter(t => routeTopicSemantically(t).sectionId === sec.id);
  const p1 = secTopics.filter(t => t.priority.startsWith('P1'));
  const p2 = secTopics.filter(t => t.priority === 'P2_HIGH');
  const p3 = secTopics.filter(t => t.priority === 'P3_MODERATE');
  const p4 = secTopics.filter(t => t.priority === 'P4_LOW_YIELD');
  const coreTime = p1.reduce((acc, t) => acc + t.revisionMinutes, 0) + p2.reduce((acc, t) => acc + t.revisionMinutes, 0);
  const recallTime = p3.length;
  return {
    num: sec.number,
    title: sec.title,
    total: secTopics.length,
    p1: p1.length,
    p2: p2.length,
    p3: p3.length,
    p4: p4.length,
    coreTimeMinutes: coreTime,
    recallTimeMinutes: recallTime,
    totalStudyTime: coreTime + recallTime
  };
});
console.log('\n--- DOMAIN & STUDY TIME STATS ---');
console.log(JSON.stringify(domainStats, null, 2));
