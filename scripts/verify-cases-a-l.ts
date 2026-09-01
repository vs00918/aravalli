import fs from 'fs';
import path from 'path';
import { routeTopicSemantically } from '../lib/banking-ca/semantic-router';
import { CanonicalTopic, BankingCaMasterRegistry } from '../lib/banking-ca/schema';

const regPath = path.resolve(__dirname, '../data/banking-ca-registry.json');
const registry: BankingCaMasterRegistry = JSON.parse(fs.readFileSync(regPath, 'utf8'));
const topics: CanonicalTopic[] = Object.values(registry.topics);

const queries = [
  { label: 'Case A: GeM Milestone', fn: (t: CanonicalTopic) => t.title.toLowerCase().includes('gem') || t.title.toLowerCase().includes('government e-marketplace') },
  { label: 'Case B: MoSPI PPI + Double Deflation', fn: (t: CanonicalTopic) => t.slug.includes('double-deflation') || t.title.includes('Producer Price Index') },
  { label: 'Case C: PLFS', fn: (t: CanonicalTopic) => t.slug.includes('plfs') || t.title.includes('Labour Force') },
  { label: 'Case D: EPI 2026', fn: (t: CanonicalTopic) => t.slug.includes('epi') || t.title.includes('Export Preparedness') },
  { label: 'Case E: KCC-MISS Evaluation', fn: (t: CanonicalTopic) => t.slug.includes('kcc-miss') || t.title.includes('KCC-Modified') },
  { label: 'Case F: PMAY-G / PMAY Progress', fn: (t: CanonicalTopic) => t.slug.includes('pmay') || t.title.includes('PMAY') },
  { label: 'Case G: GI Tags', fn: (t: CanonicalTopic) => t.title.toLowerCase().includes('gi tag') || t.title.toLowerCase().includes('geographical indication') || t.slug.includes('pithora') },
  { label: 'Case H: Tribunals Reforms Bill', fn: (t: CanonicalTopic) => t.slug.includes('tribunals') || t.title.includes('Tribunals') },
  { label: 'Case I: RBI Regulatory (62nd MPC)', fn: (t: CanonicalTopic) => t.slug.includes('62nd-rbi') || t.title.includes('62nd RBI') },
  { label: 'Case J: Bank Product / Operations (Kakinada / Canara)', fn: (t: CanonicalTopic) => t.slug.includes('canara-bank') || t.slug.includes('kakinada') || t.title.includes('Canara Bank') },
  { label: 'Case K: Appointments (Apex Appointments)', fn: (t: CanonicalTopic) => t.slug.includes('apex-financial') || t.title.includes('Apex Financial') },
  { label: 'Case L: Defence/Sports (Pitch Black / CWG)', fn: (t: CanonicalTopic) => t.slug.includes('pitch-black') || t.slug.includes('commonwealth-games') || t.title.includes('Commonwealth Games') }
];

console.log('=== CASE-BY-CASE VERIFICATION ===\n');
for (const { label, fn } of queries) {
  const found = topics.filter(fn);
  if (found.length > 0) {
    const t = found[0];
    const res = routeTopicSemantically(t);
    console.log(`[${label}]`);
    console.log(`  Topic      : ${t.title}`);
    console.log(`  Section    : [${res.sectionNumber}] ${res.sectionTitle}`);
    console.log(`  Event Type : ${res.eventType}`);
    console.log(`  Confidence : ${res.confidence}`);
    console.log(`  Reason     : ${res.classificationReason}`);
    console.log('');
  } else {
    console.log(`[${label}] -> NOT FOUND IN CORPUS\n`);
  }
}
