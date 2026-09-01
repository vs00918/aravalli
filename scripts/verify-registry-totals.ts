import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const topics = Object.values(reg.topics);

console.log('=== CANONICAL REGISTRY INTEGRITY AUDIT ===');
console.log('Total Master Registry Topics:', topics.length);
console.log('Total July Topics:', topics.filter((t: any) => t.chronologicalMonth === '2026-07').length);
console.log('Total August Topics:', topics.filter((t: any) => t.chronologicalMonth === '2026-08').length);
console.log('Total Jan-June Topics:', topics.filter((t: any) => !['2026-07', '2026-08'].includes(t.chronologicalMonth)).length);
