import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const augP1s = Object.values(reg.topics).filter(
  (t: any) => t.chronologicalMonth === '2026-08' && t.priority.startsWith('P1')
);

console.log('=== AUGUST 2026 P1 TOPICS INVENTORY ===');
console.log('Total August P1 Count:', augP1s.length);

augP1s.forEach((t: any, idx: number) => {
  const text = [
    t.title,
    t.subtitle || '',
    ...(t.whatHappened || []),
    ...(t.mustMemorizeFacts || []),
    ...(t.knowUnderstandContext || []),
    ...(t.examFocus || [])
  ].join(' ');
  const wc = text.split(/\s+/).filter(Boolean).length;
  console.log(`[${idx + 1}] (${wc}w) [${t.primaryCategory}] ${t.title}`);
});
