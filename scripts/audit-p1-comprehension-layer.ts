import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const p1s = Object.values(reg.topics).filter((t: any) => t.priority.startsWith('P1'));

console.log('=== P1 COMPREHENSION & ORIENTATION AUDIT ===');
console.log('Total P1 topics:', p1s.length);

let withWhatHappened = 0;
let withKnowUnderstand = 0;
let emptyWhatHappened = 0;

p1s.forEach((t: any) => {
  const whCount = t.whatHappened?.length || 0;
  const kuCount = t.knowUnderstandContext?.length || 0;
  if (whCount > 0) withWhatHappened++;
  else emptyWhatHappened++;
  if (kuCount > 0) withKnowUnderstand++;
});

console.log('P1 with whatHappened prose/bullets:', withWhatHappened);
console.log('P1 with EMPTY whatHappened:', emptyWhatHappened);
console.log('P1 with knowUnderstandContext:', withKnowUnderstand);

console.log('\n--- Sample P1 Topics & Their Orientation State ---');
p1s.slice(0, 15).forEach((t: any, idx) => {
  console.log(`\n[${idx + 1}] ${t.title}`);
  console.log('    whatHappened (count: ' + (t.whatHappened?.length || 0) + '):', t.whatHappened?.[0]?.slice(0, 90) || 'NONE');
  console.log('    mustMemorize (count: ' + (t.mustMemorizeFacts?.length || 0) + '):', t.mustMemorizeFacts?.[0]?.slice(0, 90) || 'NONE');
  console.log('    knowUnderstand (count: ' + (t.knowUnderstandContext?.length || 0) + '):', t.knowUnderstandContext?.[0]?.slice(0, 90) || 'NONE');
});
