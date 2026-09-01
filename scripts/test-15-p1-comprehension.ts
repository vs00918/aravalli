import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));

const testTopics = [
  {
    name: '1. Monetary Policy: 62nd RBI MPC Meeting',
    slug: '62nd-rbi-monetary-policy-committee-mpc-meeting-august-2026',
    domain: 'Monetary Policy'
  },
  {
    name: '2. Fiscal / Disaster: MHA SDRF/NDRF 12 to 14 Calamities',
    slug: 'mha-expands-sdrfndrf-notified-calamities-from-12-to-14',
    domain: 'Fiscal / Disaster Policy'
  },
  {
    name: '3. Banking Regulation: RBI Basel III Pillar 3 / ECL Alignment',
    slug: 'rbi-defers-basel-iii-pillar-3-disclosures-to-april-1-2027',
    domain: 'Banking Regulation & Basel III'
  },
  {
    name: '4. Banking Structure: RBI UCB On-Tap Licensing Guidelines',
    slug: 'rbi-on-tap-licensing-guidelines-for-urban-cooperative-banks-ucbs',
    domain: 'Banking Regulation & UCBs'
  },
  {
    name: '5. NBFC Regulation: RBI Scale-Based Regulation Upper Layer',
    slug: 'rbi-scale-based-regulation-nbfc-upper-layer-nbfc-ul-list-202627',
    domain: 'NBFC Regulation'
  },
  {
    name: '6. Consumer Protection: RBI Loan Recovery & Smartphone Lockout',
    slug: 'rbi-loan-recovery-directions-financed-smartphone-lockout-norms',
    domain: 'Consumer Protection & Digital Lending'
  },
  {
    name: '7. Government Scheme: Cabinet Approves GOBARdhan Scheme',
    slug: 'gobardhan',
    domain: 'Government Schemes & Bioenergy'
  },
  {
    name: '8. Macroeconomic Data: MoSPI Base Year Revision to 2023-24',
    slug: 'mospi-overhauls-macroeconomic-series-cpi-base-year-revised-to-2023-24',
    domain: 'Macroeconomic Statistics'
  },
  {
    name: '9. Financial Institution / Insurance: DICGC Risk-Based Premium',
    slug: 'dicgc-notifies-risk-based-premium-rbp-framework-for-deposit-insurance',
    domain: 'Deposit Insurance & Safety'
  },
  {
    name: '10. Priority Sector / MSME: RBI MSME Collateral-Free Limit ₹20 Lakh',
    slug: 'rbi-revises-msme-lending-norms-collateral-free-limit-raised-to-20-lakh',
    domain: 'MSME Lending & Credit Policy'
  },
  {
    name: '11. Regulatory Bodies / Dispute: RBI Internal Ombudsman Directions',
    slug: 'rbi-issues-reserve-bank-of-india-internal-ombudsman-directions-2026',
    domain: 'Regulatory Bodies & Grievance Redressal'
  },
  {
    name: '12. Corporate Governance: RBI Related Party Transactions & Credit Risk',
    slug: 'rbi-tightens-related-party-transactions-credit-risk-norms-for-banks-and-nbfcs',
    domain: 'Banking Prudential Norms'
  },
  {
    name: '13. External Sector: RBI Amended ECB Framework $1 Billion Limit',
    slug: 'rbi-notifies-amended-ecb-framework-borrowing-limit-raised-to-1-billion',
    domain: 'External Commercial Borrowings'
  },
  {
    name: '14. Infrastructure Policy: RBI Eases Risk Weights on NBFC Infra Lending',
    slug: 'rbi-eases-risk-weights-on-nbfc-infrastructure-project-lending',
    domain: 'Infrastructure Finance'
  },
  {
    name: '15. Intergovernmental Fiscal: 16th Finance Commission 41% Devolution',
    slug: '16th-finance-commission-submits-devolution-report-for-20262031-41-retained',
    domain: 'Fiscal Federalism'
  }
];

console.log('================================================================');
console.log('🧪 15-TOPIC P1 BEGINNER COMPREHENSION TEST AUDIT');
console.log('================================================================\n');

testTopics.forEach((tDef, idx) => {
  const t = Object.values(reg.topics).find((item: any) => item.slug.includes(tDef.slug) || item.id === tDef.slug || item.slug === tDef.slug) as any;
  if (!t) {
    console.log(`[${idx + 1}] ❌ TOPIC NOT FOUND FOR SLUG: ${tDef.slug}`);
    return;
  }

  const hasWhatHappened = Boolean(t.whatHappened && t.whatHappened.length > 0);
  const hasWhyItMatters = Boolean(t.knowUnderstandContext && t.knowUnderstandContext.length > 0);
  const hasKeyNumbers = Boolean(t.mustMemorizeFacts && t.mustMemorizeFacts.length > 0);
  const hasExamRecall = Boolean(t.examFocus && t.examFocus.length > 0);

  const q1 = hasWhatHappened ? 'YES' : 'NO';
  const q2 = (hasWhatHappened || hasKeyNumbers) ? 'YES' : 'NO';
  const q3 = hasWhyItMatters ? 'YES' : hasWhatHappened ? 'PARTIAL' : 'NO';
  const q4 = hasKeyNumbers ? 'YES' : 'NO';
  const q5 = (hasKeyNumbers && hasExamRecall) ? 'YES' : hasKeyNumbers ? 'PARTIAL' : 'NO';

  console.log(`Topic ${idx + 1}: ${t.title}`);
  console.log(`  • Domain: ${tDef.domain} | Category: ${t.primaryCategory}`);
  console.log(`  • 1. Understand WHAT HAPPENED? : ${q1}`);
  console.log(`       Preview: "${t.whatHappened?.[0] || 'N/A'}"`);
  console.log(`  • 2. Understand WHAT CHANGED?  : ${q2}`);
  console.log(`  • 3. Understand WHY IT MATTERS?: ${q3}`);
  if (t.knowUnderstandContext?.[0]) {
    console.log(`       Rationale: "${t.knowUnderstandContext[0]}"`);
  }
  console.log(`  • 4. Identify KEY NUMBERS?     : ${q4} (Count: ${t.mustMemorizeFacts?.length || 0})`);
  console.log(`  • 5. Identify WHAT TO MEMORIZE?: ${q5} (Exam angles: ${t.examFocus?.length || 0})`);
  console.log('----------------------------------------------------------------');
});
