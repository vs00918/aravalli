import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const aug = Object.values(reg.topics).filter((t: any) => t.chronologicalMonth === '2026-08');
console.log('August Total Topics:', aug.length);

const pibCabinet = aug.filter((t: any) => 
  /cabinet|gazette|notification|circular|pib|union cabinet|ordinance/i.test(t.title) ||
  t.sourceReferences?.some((s: any) => /pib|gazette|circular/i.test(s.sourceName || ''))
);
console.log('PIB / Cabinet / Circular candidates:', pibCabinet.length);
pibCabinet.slice(0, 20).forEach((t: any) => console.log(' -', t.title, '(', t.priority, ')'));
