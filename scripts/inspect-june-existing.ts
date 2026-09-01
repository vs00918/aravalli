import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const juneTopics = Object.values(reg.topics).filter((t: any) => t.chronologicalMonth === '2026-06');

console.log('=== EXISTING JUNE 2026 TOPICS IN REGISTRY ===');
console.log('Total Existing June Topics:', juneTopics.length);
console.log('June P1 Topics:', juneTopics.filter((t: any) => t.priority.startsWith('P1')).length);
console.log('June P2 Topics:', juneTopics.filter((t: any) => t.priority === 'P2_HIGH').length);
console.log('June P3 Topics:', juneTopics.filter((t: any) => t.priority === 'P3_MODERATE').length);

console.log('\nSample Existing June Topics:');
juneTopics.forEach((t: any, i: number) => {
  console.log(`[${i+1}] [${t.priority}] ${t.title}`);
});
