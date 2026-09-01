import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const julyTopics = Object.values(reg.topics).filter((t: any) => t.chronologicalMonth === '2026-07');

console.log('=== EXISTING JULY 2026 TOPICS IN REGISTRY ===');
console.log('Total Existing July Topics:', julyTopics.length);
console.log('July P1 Topics:', julyTopics.filter((t: any) => t.priority.startsWith('P1')).length);
console.log('July P2 Topics:', julyTopics.filter((t: any) => t.priority === 'P2_HIGH').length);
console.log('July P3 Topics:', julyTopics.filter((t: any) => t.priority === 'P3_MODERATE').length);

console.log('\nSample Existing July Topics:');
julyTopics.slice(0, 15).forEach((t: any, i: number) => {
  console.log(`[${i+1}] [${t.priority}] ${t.title}`);
});
