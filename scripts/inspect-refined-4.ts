import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const augP1s = Object.values(reg.topics).filter(
  (t: any) => t.chronologicalMonth === '2026-08' && t.priority.startsWith('P1')
);

// Topics: 7 (Supreme Court Motor Insurance), 8 (GOBARdhan), 9 (MSMED), 10 (SDRF)
[7, 8, 9, 10].forEach(sIdx => {
  const t = augP1s[sIdx] as any;
  console.log(`=== ${t.title} ===`);
  console.log('ORIENTATION:');
  t.whatHappened?.forEach((p: string) => console.log('  ' + p));
  console.log('WHY IT MATTERS:');
  if (t.knowUnderstandContext?.length) {
    t.knowUnderstandContext?.forEach((p: string) => console.log('  ' + p));
  } else {
    console.log('  [NONE]');
  }
  console.log('KEY RULES (Count: ' + (t.mustMemorizeFacts?.length || 0) + '):');
  t.mustMemorizeFacts?.forEach((p: string) => console.log('  • ' + p));
  console.log('');
});
