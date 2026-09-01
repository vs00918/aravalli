import { execSync } from 'child_process';

function getRegistryAtCommit(commit: string) {
  const jsonStr = execSync(`git show ${commit}:data/banking-ca-registry.json`, { maxBuffer: 50 * 1024 * 1024 }).toString();
  return JSON.parse(jsonStr);
}

const reg64 = getRegistryAtCommit('64b8b0d');
const regD1 = getRegistryAtCommit('d17a03f');
const reg90 = getRegistryAtCommit('907445d');

function analyzeRegistry(reg: any, name: string) {
  const topics = Object.values(reg.topics) as any[];
  const byMonth: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  topics.forEach(t => {
    byMonth[t.chronologicalMonth] = (byMonth[t.chronologicalMonth] || 0) + 1;
    byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
  });
  return {
    name,
    total: topics.length,
    byMonth,
    byPriority
  };
}

console.log('=== REGISTRY FORENSIC AUDIT ACROSS RECENT COMMITS ===\n');

const res64 = analyzeRegistry(reg64, '64b8b0d (Baseline before Aug W3 & July Monthly)');
const resD1 = analyzeRegistry(regD1, 'd17a03f (After Aug W3 Ingestion)');
const res90 = analyzeRegistry(reg90, '907445d (After July Monthly Ingestion)');

console.log('1. Commit 64b8b0d:');
console.log('   Total:', res64.total);
console.log('   By Month:', JSON.stringify(res64.byMonth));
console.log('   By Priority:', JSON.stringify(res64.byPriority));

console.log('\n2. Commit d17a03f:');
console.log('   Total:', resD1.total, `(+${resD1.total - res64.total} from 64b8b0d)`);
console.log('   By Month:', JSON.stringify(resD1.byMonth));
console.log('   By Priority:', JSON.stringify(resD1.byPriority));

console.log('\n3. Commit 907445d:');
console.log('   Total:', res90.total, `(+${res90.total - resD1.total} from d17a03f, +${res90.total - res64.total} from 64b8b0d)`);
console.log('   By Month:', JSON.stringify(res90.byMonth));
console.log('   By Priority:', JSON.stringify(res90.byPriority));
