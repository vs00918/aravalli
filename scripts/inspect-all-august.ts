import fs from 'fs';
import { routeTopicSemantically } from '../lib/banking-ca/semantic-router';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const aug = Object.values(reg.topics).filter((t: any) => t.chronologicalMonth === '2026-08');

console.log('=== DISTRIBUTION ACROSS SECTIONS ===');
const sectionCounts: Record<string, number> = {};
aug.forEach((t: any) => {
  const r = routeTopicSemantically(t);
  sectionCounts[r.sectionNumber] = (sectionCounts[r.sectionNumber] || 0) + 1;
});
console.log(sectionCounts);

console.log('\n=== SECTION 04 TOPICS ===');
aug.filter((t: any) => routeTopicSemantically(t).sectionNumber === '04').forEach((t: any) => {
  console.log(`[04] ${t.title} (${t.priority})`);
});
