import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));

const sampleIndices = [
  0,  // 1. 62nd RBI MPC Meeting
  1,  // 2. RBI UCB On-Tap Licensing
  2,  // 3. RBI Scale-Based Regulation NBFC-UL
  3,  // 4. RBI Loan Recovery & Smartphone Lockout
  4,  // 5. RBI Defers Basel III Pillar 3 / ECL
  6,  // 6. RBI Draft Master Directions: Interest Rates
  7,  // 7. Supreme Court Mandatory Motor Insurance
  8,  // 8. Cabinet Approves GOBARdhan Scheme
  9,  // 9. Parliament Passes MSMED Amendment Bill
  10, // 10. MHA Expands SDRF/NDRF Calamities 12 -> 14
  11, // 11. KCC-MISS Assessment Report
  13, // 12. MPMS & Semicon 2.0
  15, // 13. EXIM Bank Replaces RBI for Export Subvention
  16, // 14. MoSPI Adopts PPI & Double Deflation
  19  // 15. SEBI Draft Settlement Regulations Fast-Track
];

const augP1s = Object.values(reg.topics).filter(
  (t: any) => t.chronologicalMonth === '2026-08' && t.priority.startsWith('P1')
);

console.log('=== AUDITING 15 REPRESENTATIVE AUGUST P1 TOPICS FOR HUMAN QUALITY ===\n');

sampleIndices.forEach((sIdx, auditNum) => {
  const t = augP1s[sIdx] as any;
  console.log(`[${auditNum + 1}] ${t.title}`);
  console.log('    Orientation lines:', t.whatHappened?.length || 0);
  t.whatHappened?.forEach((p: string, pIdx: number) => {
    console.log(`      (${pIdx + 1}) ${p.slice(0, 110)}...`);
  });
  console.log('    Why It Matters lines:', t.knowUnderstandContext?.length || 0);
  t.knowUnderstandContext?.forEach((p: string, pIdx: number) => {
    console.log(`      (${pIdx + 1}) ${p.slice(0, 110)}...`);
  });
  console.log('    Must Memorize count:', t.mustMemorizeFacts?.length || 0);
  console.log('');
});
