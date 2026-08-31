import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));

console.log('=== REGISTRY RECONCILIATION SUMMARY ===');
console.log('Schema version:', reg.schemaVersion);
console.log('Total topics in topics map:', Object.keys(reg.topics).length);
console.log('Summary totalCanonicalTopics:', reg.summary.totalCanonicalTopics);
console.log('Active P1 Count:', reg.summary.activeP1Count);
console.log('Active P1 Revision Minutes:', reg.summary.activeP1RevisionMinutes);
console.log('Total P2 Count:', reg.summary.totalP2Count);
console.log('Total P3 Count:', reg.summary.totalP3Count);
console.log('Indexed Months:', Object.keys(reg.indexes.byYearMonth || {}));

const months: Record<string, number> = {};
Object.values(reg.topics).forEach((t: any) => {
  months[t.chronologicalMonth] = (months[t.chronologicalMonth] || 0) + 1;
});
console.log('Per-Month Breakdown:', months);
