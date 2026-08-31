import fs from 'fs';
import { routeTopicSemantically, MAGAZINE_SECTIONS } from '../lib/banking-ca/semantic-router';
import { classifyTopicPresentation } from '../lib/banking-ca/presentation-classifier';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const aug = Object.values(reg.topics).filter((t: any) => t.chronologicalMonth === '2026-08');

console.log('=== AUGUST 2026 10-SECTION BREAKDOWN & PRIMITIVES ===\n');
MAGAZINE_SECTIONS.forEach(s => {
  const list = aug.filter((t: any) => routeTopicSemantically(t).sectionNumber === s.number);
  const p1 = list.filter((t: any) => t.priority.startsWith('P1')).length;
  const p2 = list.filter((t: any) => t.priority === 'P2_HIGH').length;
  const p3 = list.filter((t: any) => t.priority === 'P3_MODERATE').length;
  const p4 = list.filter((t: any) => t.priority === 'P4_LOW_YIELD').length;
  const prims: Record<string, number> = {};
  list.forEach((t: any) => {
    const p = classifyTopicPresentation(t);
    prims[p] = (prims[p] || 0) + 1;
  });
  console.log(`Sec ${s.number} [${s.title}]: ${list.length} topics (P1:${p1}, P2:${p2}, P3:${p3}, P4:${p4})`);
  console.log(`       Primitives: ${JSON.stringify(prims)}\n`);
});
