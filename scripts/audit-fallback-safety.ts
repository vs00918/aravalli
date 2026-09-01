import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const allP1s = Object.values(reg.topics).filter((t: any) => t.priority.startsWith('P1'));

console.log('=== CRITICAL FALLBACK AUDIT ACROSS ALL 61 P1 TOPICS ===\n');
console.log('Total P1 Topics in Full Corpus:', allP1s.length);

let fallbackCount = 0;
const fallbackExamples: any[] = [];

allP1s.forEach((t: any, idx: number) => {
  const hasExplicitWhatHappened = Boolean(t.whatHappened && t.whatHappened.length > 0);
  if (!hasExplicitWhatHappened) {
    fallbackCount++;
    const firstSentence = t.mustMemorizeFacts?.[0] || t.title;
    fallbackExamples.push({
      idx: idx + 1,
      title: t.title,
      month: t.chronologicalMonth,
      firstSentence
    });
  }
});

console.log(`Topics with Explicit What Happened : ${allP1s.length - fallbackCount} / ${allP1s.length}`);
console.log(`Topics Relying on Fallback Extraction: ${fallbackCount} / ${allP1s.length}\n`);

if (fallbackCount === 0) {
  console.log('✅ ZERO topics in the entire 61-topic P1 corpus rely on dynamic fallback! 100% of P1 topics have explicit, parsed What Happened orientation.');
} else {
  console.log('Fallback Examples:');
  fallbackExamples.forEach(ex => {
    console.log(`[${ex.idx}] (${ex.month}) ${ex.title}`);
    console.log(`     Selected: "${ex.firstSentence}"`);
  });
}
