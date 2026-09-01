import fs from 'fs';
import { routeTopicSemantically, MAGAZINE_SECTIONS } from '../lib/banking-ca/semantic-router';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const aug = Object.values(reg.topics).filter((t: any) => t.chronologicalMonth === '2026-08');

console.log('=== CURRENT AUGUST SECTION DISTRIBUTION ===');
const counts: Record<string, { title: string; count: number; p1: number; p2: number; p3: number; p4: number }> = {};
MAGAZINE_SECTIONS.forEach(s => {
  counts[s.number] = { title: s.title, count: 0, p1: 0, p2: 0, p3: 0, p4: 0 };
});

aug.forEach((t: any) => {
  const r = routeTopicSemantically(t);
  if (counts[r.sectionNumber]) {
    counts[r.sectionNumber].count++;
    if (t.priority.startsWith('P1')) counts[r.sectionNumber].p1++;
    else if (t.priority === 'P2_HIGH') counts[r.sectionNumber].p2++;
    else if (t.priority === 'P3_MODERATE') counts[r.sectionNumber].p3++;
    else if (t.priority === 'P4_LOW_YIELD') counts[r.sectionNumber].p4++;
  }
});

console.table(counts);
