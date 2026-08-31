import fs from 'fs';
import { routeTopicSemantically, MAGAZINE_SECTIONS } from '../lib/banking-ca/semantic-router';
import { classifyTopicPresentation } from '../lib/banking-ca/presentation-classifier';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const aug = Object.values(reg.topics).filter((t: any) => t.chronologicalMonth === '2026-08');

console.log('=== DETAILED SECTION-BY-SECTION AUDIT ===');
MAGAZINE_SECTIONS.forEach(s => {
  const list = aug.filter((t: any) => routeTopicSemantically(t).sectionNumber === s.number);
  const p1 = list.filter((t: any) => t.priority.startsWith('P1'));
  const p2 = list.filter((t: any) => t.priority === 'P2_HIGH');
  const p3 = list.filter((t: any) => t.priority === 'P3_MODERATE');
  const p4 = list.filter((t: any) => t.priority === 'P4_LOW_YIELD');

  let secWords = 0;
  list.forEach((t: any) => {
    const text = [t.title, t.subtitle || '', ...(t.whatHappened || []), ...(t.mustMemorizeFacts || []), ...(t.knowUnderstandContext || []), ...(t.examFocus || [])].join(' ');
    secWords += text.split(/\s+/).filter(Boolean).length;
  });

  const secMins = list.reduce((acc: number, t: any) => acc + (t.revisionMinutes || 2), 0);

  console.log(`\nSection ${s.number}: ${s.title}`);
  console.log(`  Count: ${list.length} | P1: ${p1.length}, P2: ${p2.length}, P3: ${p3.length}, P4: ${p4.length}`);
  console.log(`  Words: ${secWords} | Avg Words/Topic: ${(secWords / (list.length || 1)).toFixed(1)}`);
  console.log(`  Est Study Time: ${secMins} min (${(secMins / 60).toFixed(1)} hrs)`);
});
