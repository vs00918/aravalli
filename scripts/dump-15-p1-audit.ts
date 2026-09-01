import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));

// Selection of 15 representative August P1 topics covering diverse domains
const sampleIndices = [
  0,  // 1. 62nd RBI MPC Meeting (Monetary Policy)
  1,  // 2. RBI 'On Tap' Licensing Guidelines for UCBs (Banking Regulation / Structure)
  2,  // 3. RBI Scale-Based Regulation: NBFC-UL List (NBFC Regulation)
  3,  // 4. RBI Loan Recovery & Smartphone Lockout (Consumer Protection)
  4,  // 5. RBI Defers Basel III Pillar 3 (Complex Technical Regulation / Basel III)
  6,  // 6. RBI Draft Master Directions: Interest Rates on Loans (Banking Regulation)
  7,  // 7. Supreme Court Mandatory Motor Insurance (Insurance Regulation)
  8,  // 8. Cabinet Approves GOBARdhan Scheme (Government Scheme)
  9,  // 9. Parliament Passes MSMED Amendment Bill (Legislative / MSME Reform)
  10, // 10. MHA Expands SDRF/NDRF Calamities 12 -> 14 (Fiscal & Disaster Policy)
  11, // 11. KCC-MISS Assessment Report (Report / Data Evaluation)
  13, // 12. MPMS & Semicon 2.0 (Infrastructure / Industrial Policy)
  15, // 13. EXIM Bank Replaces RBI for Export Subvention (Financial Institution)
  16, // 14. MoSPI Adopts PPI & Double Deflation (Macroeconomic Data / Methodology)
  19  // 15. SEBI Draft Settlement Regulations Fast-Track (SEBI Capital Markets)
];

const augP1s = Object.values(reg.topics).filter(
  (t: any) => t.chronologicalMonth === '2026-08' && t.priority.startsWith('P1')
);

console.log('=== QUALITATIVE AUDIT: 15 AUGUST P1 TOPICS ===\n');

sampleIndices.forEach((sIdx, auditNum) => {
  const t = augP1s[sIdx] as any;
  if (!t) return;

  // Simulate DeepBrief.tsx exact state
  let orientation = t.whatHappened || [];
  let whyItMatters = t.knowUnderstandContext || [];
  let memoFacts = t.mustMemorizeFacts || [];

  if (orientation.length === 0 && memoFacts.length > 0) {
    orientation = [memoFacts[0]];
    memoFacts = memoFacts.slice(1);
  }

  const orientationNorm = new Set(
    [...orientation, ...whyItMatters].map((s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, ''))
  );

  const distinctMemo = memoFacts.filter((fact: string) => {
    const clean = fact.toLowerCase().replace(/[^a-z0-9]/g, '');
    return !orientationNorm.has(clean);
  });

  console.log(`================================================================`);
  console.log(`TOPIC ${auditNum + 1}: ${t.title}`);
  console.log(`Category: ${t.primaryCategory} | RevTime: ~${t.revisionMinutes} min`);
  console.log(`----------------------------------------------------------------`);
  console.log(`ORIENTATION TEXT:`);
  if (orientation.length > 0) {
    orientation.forEach((p: string) => console.log(`  "${p}"`));
  } else {
    console.log(`  [NONE]`);
  }

  console.log(`\nCONTEXT / WHY IT MATTERS:`);
  if (whyItMatters.length > 0) {
    whyItMatters.forEach((p: string) => console.log(`  "${p}"`));
  } else {
    console.log(`  [NOT PRESENT / NOT FORCED]`);
  }

  console.log(`\nKEY RULES & NUMBERS:`);
  if (distinctMemo.length > 0) {
    distinctMemo.forEach((f: string) => console.log(`  • ${f}`));
  } else {
    console.log(`  [NONE - ALL COVERED IN ORIENTATION]`);
  }

  console.log(`\nEXAM RECALL:`);
  if (t.examFocus && t.examFocus.length > 0) {
    t.examFocus.forEach((ef: string) => console.log(`  🎯 ${ef}`));
  } else {
    console.log(`  [NONE]`);
  }
  console.log(`================================================================\n`);
});
