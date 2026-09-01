import fs from 'fs';
import path from 'path';
import { parseCanonicalMarkdownFile } from '../lib/banking-ca/markdown-parser';
import { CanonicalTopic } from '../lib/banking-ca/schema';

const caDir = path.resolve('./knowledge-tree/banking-ca');
const files = fs.readdirSync(caDir).filter(f => f.endsWith('.md')).sort();

console.log('========================================================================');
console.log('FORENSIC ACCOUNTING & CORPUS RECONCILIATION');
console.log('========================================================================\n');

console.log(`Files in knowledge-tree/banking-ca (${files.length} files):\n`);

let rawParsedTotal = 0;
const fileStats: { file: string; count: number; rawCount: number; batchId: string }[] = [];
const allParsedTopics: CanonicalTopic[] = [];
const uniqueTopicsMap: Record<string, CanonicalTopic> = {};

files.forEach(file => {
  const filePath = path.join(caDir, file);
  const batchId = path.basename(file, '.md');
  const sourceDefault = file.includes('smartkeeda') ? 'SMARTKEEDA' : 'CGB_MENTORS';
  
  let month = '2026-08';
  if (file.includes('january')) month = '2026-01';
  else if (file.includes('february')) month = '2026-02';
  else if (file.includes('march')) month = '2026-03';
  else if (file.includes('april')) month = '2026-04';
  else if (file.includes('may')) month = '2026-05';
  else if (file.includes('june')) month = '2026-06';
  else if (file.includes('july')) month = '2026-07';
  else if (file.includes('august')) month = '2026-08';

  const { topics, batch } = parseCanonicalMarkdownFile(filePath, batchId, sourceDefault, month, 'week-1-4');
  rawParsedTotal += topics.length;
  fileStats.push({ file, count: topics.length, rawCount: batch.rawItemsCount, batchId });
  
  topics.forEach(t => {
    allParsedTopics.push(t);
    if (!uniqueTopicsMap[t.id]) {
      uniqueTopicsMap[t.id] = t;
    }
  });

  console.log(`${file.padEnd(45, ' ')} : ${topics.length.toString().padStart(3, ' ')} topics (batch parsed: ${batch.rawItemsCount})`);
});

console.log(`\nRaw Parsed Total across all batches : ${rawParsedTotal}`);
console.log(`Unique Canonical Topics after Deduplication : ${Object.keys(uniqueTopicsMap).length}`);

// Month distribution of compiled unique canonical topics
const monthDistribution: Record<string, { uniqueTopics: number; p1: number; p2: number; p3: number; p4: number }> = {};

Object.values(uniqueTopicsMap).forEach(t => {
  const m = t.chronologicalMonth;
  if (!monthDistribution[m]) {
    monthDistribution[m] = { uniqueTopics: 0, p1: 0, p2: 0, p3: 0, p4: 0 };
  }
  monthDistribution[m].uniqueTopics++;
  if (t.priority.startsWith('P1')) monthDistribution[m].p1++;
  else if (t.priority === 'P2_HIGH') monthDistribution[m].p2++;
  else if (t.priority === 'P3_MODERATE') monthDistribution[m].p3++;
  else if (t.priority === 'P4_LOW_YIELD') monthDistribution[m].p4++;
});

console.log('\n--- UNIQUE CANONICAL TOPICS PER MONTH ---');
console.table(monthDistribution);
