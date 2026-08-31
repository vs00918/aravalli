import fs from 'fs';
import { routeTopicSemantically } from '../lib/banking-ca/semantic-router';
import { classifyTopicPresentation } from '../lib/banking-ca/presentation-classifier';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const aug = Object.values(reg.topics).filter((t: any) => t.chronologicalMonth === '2026-08');

const p1Reg = aug.filter((t: any) => t.priority.startsWith('P1') && (t.primaryCategory.includes('REGULATION') || t.primaryCategory.includes('MONETARY') || t.primaryCategory.includes('BANKING')));
const p1Econ = aug.filter((t: any) => t.priority.startsWith('P1') && (t.primaryCategory.includes('MACRO') || t.primaryCategory.includes('CAPITAL') || t.title.toLowerCase().includes('sdrf')));
const p1Scheme = aug.filter((t: any) => t.priority.startsWith('P1') && (t.primaryCategory.includes('SCHEME') || t.informationType === 'SCHEME' || t.title.toLowerCase().includes('scheme') || t.title.toLowerCase().includes('yojana') || t.title.toLowerCase().includes('gobardhan')));
const p2RegBank = aug.filter((t: any) => t.priority === 'P2_HIGH' && (t.primaryCategory.includes('BANKING') || t.primaryCategory.includes('REGULATION') || t.primaryCategory.includes('INSURANCE') || t.primaryCategory.includes('DIGITAL')));
const p2Report = aug.filter((t: any) => t.priority === 'P2_HIGH' && (t.primaryCategory.includes('REPORT') || t.informationType === 'REPORT' || t.informationType === 'INDEX' || t.informationType === 'RANKING' || t.primaryCategory.includes('REPORTS')));

console.log('=== SELECTED AUDIT COHORTS ===');
console.log('1. P1 Regulatory (', p1Reg.length, 'topics )');
p1Reg.slice(0, 6).forEach((t: any, i: number) => console.log(`  [R${i+1}] ${t.title} -> ${classifyTopicPresentation(t)}`));

console.log('\n2. P1 Economic / Policy (', p1Econ.length, 'topics )');
p1Econ.slice(0, 6).forEach((t: any, i: number) => console.log(`  [E${i+1}] ${t.title} -> ${classifyTopicPresentation(t)}`));

console.log('\n3. P1 Schemes (', p1Scheme.length, 'topics )');
p1Scheme.slice(0, 6).forEach((t: any, i: number) => console.log(`  [S${i+1}] ${t.title} -> ${classifyTopicPresentation(t)}`));

console.log('\n4. P2 Banking / Regulatory (', p2RegBank.length, 'topics )');
p2RegBank.slice(0, 10).forEach((t: any, i: number) => console.log(`  [B${i+1}] ${t.title} -> ${classifyTopicPresentation(t)}`));

console.log('\n5. P2 Reports / Rankings (', p2Report.length, 'topics )');
p2Report.slice(0, 6).forEach((t: any, i: number) => console.log(`  [P${i+1}] ${t.title} -> ${classifyTopicPresentation(t)}`));
