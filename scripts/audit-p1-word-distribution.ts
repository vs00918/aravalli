import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const augP1s = Object.values(reg.topics).filter(
  (t: any) => t.chronologicalMonth === '2026-08' && t.priority.startsWith('P1')
);

const getWordCount = (t: any) => {
  const text = [
    t.title,
    t.subtitle || '',
    ...(t.whatHappened || []),
    ...(t.mustMemorizeFacts || []),
    ...(t.knowUnderstandContext || []),
    ...(t.examFocus || [])
  ].join(' ');
  return text.split(/\s+/).filter(Boolean).length;
};

const wordCounts = augP1s.map((t: any) => ({
  title: t.title,
  words: getWordCount(t)
})).sort((a, b) => a.words - b.words);

const total = wordCounts.reduce((acc, curr) => acc + curr.words, 0);
const avg = total / wordCounts.length;
const median = wordCounts.length % 2 === 0
  ? (wordCounts[wordCounts.length / 2 - 1].words + wordCounts[wordCounts.length / 2].words) / 2
  : wordCounts[Math.floor(wordCounts.length / 2)].words;

const longest = wordCounts[wordCounts.length - 1];
const shortest = wordCounts[0];
const countOver250 = wordCounts.filter(w => w.words > 250).length;
const countUnder100 = wordCounts.filter(w => w.words < 100).length;

console.log('=== AUGUST 2026 P1 WORD COUNT DISTRIBUTION (23 TOPICS) ===');
console.log('Total August P1 Topics :', wordCounts.length);
console.log('Average Words per P1   :', avg.toFixed(1));
console.log('Median Words per P1    :', median);
console.log('Shortest P1 Topic      :', `${shortest.words} words ("${shortest.title}")`);
console.log('Longest P1 Topic       :', `${longest.words} words ("${longest.title}")`);
console.log('Topics with > 250 words:', countOver250);
console.log('Topics with < 100 words:', countUnder100);
