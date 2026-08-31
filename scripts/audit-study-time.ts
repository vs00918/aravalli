import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const aug = Object.values(reg.topics).filter((t: any) => t.chronologicalMonth === '2026-08');

const p1 = aug.filter((t: any) => t.priority.startsWith('P1'));
const p2 = aug.filter((t: any) => t.priority === 'P2_HIGH');
const p3 = aug.filter((t: any) => t.priority === 'P3_MODERATE');
const p4 = aug.filter((t: any) => t.priority === 'P4_LOW_YIELD');

const p1Mins = p1.reduce((acc: number, t: any) => acc + (t.revisionMinutes || 5), 0);
const p2Mins = p2.reduce((acc: number, t: any) => acc + (t.revisionMinutes || 3), 0);
const p3Mins = p3.reduce((acc: number, t: any) => acc + (t.revisionMinutes || 1), 0);
const p4Mins = p4.reduce((acc: number, t: any) => acc + (t.revisionMinutes || 0), 0);
const totalCoreMins = p1Mins + p2Mins + p3Mins;

console.log('P1 Count:', p1.length, '| Total Minutes:', p1Mins, '| Avg per Topic:', (p1Mins/p1.length).toFixed(1), 'min');
console.log('P2 Count:', p2.length, '| Total Minutes:', p2Mins, '| Avg per Topic:', (p2Mins/p2.length).toFixed(1), 'min');
console.log('P3 Count:', p3.length, '| Total Minutes:', p3Mins, '| Avg per Topic:', (p3Mins/p3.length).toFixed(1), 'min');
console.log('P4 Count:', p4.length, '| Total Minutes:', p4Mins);
console.log('Total Core Active Reading Time:', totalCoreMins, 'minutes =', (totalCoreMins/60).toFixed(1), 'hours');
