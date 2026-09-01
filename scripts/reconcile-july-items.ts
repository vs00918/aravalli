import fs from 'fs';

const md = fs.readFileSync('./knowledge-tree/banking-ca/18-july-2026-smartkeeda-monthly.md', 'utf8');

// Count P1s (H3 headers under Part 1)
const p1Matches = md.match(/^### \d+\..*$/gm) || [];
// Count P2s (H3 headers under Part 2)
const p2Section = md.split('## PART 2: P2')[1]?.split('## PART 3: P3')[0] || '';
const p2Matches = p2Section.match(/^### \d+\..*$/gm) || [];
// Count P3s (Bullet items under Part 3 subheadings)
const p3Section = md.split('## PART 3: P3')[1] || '';
const p3Matches = p3Section.match(/^- \*\*.*$/gm) || [];

console.log('=== JULY MONTHLY FILE (18-july-2026-smartkeeda-monthly.md) BREAKDOWN ===');
console.log('P1 Topics (Part 1):', p1Matches.length);
console.log('P2 Topics (Part 2):', p2Matches.length);
console.log('P3 Topics (Part 3):', p3Matches.length);
console.log('Total Topics in File:', p1Matches.length + p2Matches.length + p3Matches.length);

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const julyTopics = Object.values(reg.topics).filter((t: any) => t.chronologicalMonth === '2026-07');
console.log('\nTotal July Topics in Master Registry:', julyTopics.length);
console.log('Existing July before this file was 33.');
console.log('33 + 193 =', 33 + (p1Matches.length + p2Matches.length + p3Matches.length));
