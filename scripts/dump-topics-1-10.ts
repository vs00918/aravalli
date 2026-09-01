import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const augP1s = Object.values(reg.topics).filter(
  (t: any) => t.chronologicalMonth === '2026-08' && t.priority.startsWith('P1')
);

const sampleIndices = [0, 1, 2, 3, 4, 6, 7, 8, 9, 10];

sampleIndices.forEach((sIdx, auditNum) => {
  const t = augP1s[sIdx] as any;
  console.log(`=== TOPIC ${auditNum + 1}: ${t.title} ===`);
  console.log('ORIENTATION:', t.whatHappened);
  console.log('WHY IT MATTERS:', t.knowUnderstandContext);
  console.log('KEY RULES (Count: ' + (t.mustMemorizeFacts?.length || 0) + '):', t.mustMemorizeFacts?.slice(0, 3));
  console.log('EXAM RECALL (Count: ' + (t.examFocus?.length || 0) + '):', t.examFocus);
  console.log('');
});
