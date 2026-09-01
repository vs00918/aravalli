import fs from 'fs';
import path from 'path';
import { CanonicalTopic, BankingCaMasterRegistry } from '../lib/banking-ca/schema';
import { classifyInformationType } from '../lib/banking-ca/information-types';

const regPath = path.resolve(__dirname, '../data/banking-ca-registry.json');
const registry: BankingCaMasterRegistry = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const augustTopics: CanonicalTopic[] = Object.values(registry.topics).filter(
  t => t.activeInMonths.includes('2026-08') || t.chronologicalMonth === '2026-08'
);

console.log('--- TOPICS CURRENTLY CLASSIFIED AS IMPORTANT_DAY ---');
augustTopics.filter(t => (t.informationType || classifyInformationType(t)) === 'IMPORTANT_DAY').forEach(t => {
  console.log(`- [${t.priority}] ${t.title}`);
});

console.log('\n--- TOPICS CURRENTLY CLASSIFIED AS OTHER (Total: ' + augustTopics.filter(t => (t.informationType || classifyInformationType(t)) === 'OTHER').length + ') ---');
augustTopics.filter(t => (t.informationType || classifyInformationType(t)) === 'OTHER').forEach((t, i) => {
  console.log(`${(i+1).toString().padStart(2, '0')}. [${t.priority}] [${t.primaryCategory}] ${t.title}`);
});
