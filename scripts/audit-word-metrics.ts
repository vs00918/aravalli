import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const aug = Object.values(reg.topics).filter((t: any) => t.chronologicalMonth === '2026-08');

const p1 = aug.filter((t: any) => t.priority.startsWith('P1'));
const p2 = aug.filter((t: any) => t.priority === 'P2_HIGH');
const p3 = aug.filter((t: any) => t.priority === 'P3_MODERATE');

let p1Words = 0;
let p2Words = 0;
let p3Words = 0;
let totalWords = 0;

aug.forEach((t: any) => {
  const text = [
    t.title,
    t.subtitle || '',
    ...(t.whatHappened || []),
    ...(t.mustMemorizeFacts || []),
    ...(t.knowUnderstandContext || []),
    ...(t.examFocus || [])
  ].join(' ');
  const wc = text.split(/\s+/).filter(Boolean).length;
  totalWords += wc;
  if (t.priority.startsWith('P1')) p1Words += wc;
  else if (t.priority === 'P2_HIGH') p2Words += wc;
  else if (t.priority === 'P3_MODERATE') p3Words += wc;
});

console.log('=== WORD COUNT METRICS (LOCAL AUG 2026) ===');
console.log('Total Topics:', aug.length);
console.log('P1 Count:', p1.length, '| Total Words:', p1Words, '| Avg Words/P1:', (p1Words / p1.length).toFixed(1));
console.log('P2 Count:', p2.length, '| Total Words:', p2Words, '| Avg Words/P2:', (p2Words / p2.length).toFixed(1));
console.log('P3 Count:', p3.length, '| Total Words:', p3Words, '| Avg Words/P3:', (p3Words / p3.length).toFixed(1));
console.log('Overall Total Words across August:', totalWords);
