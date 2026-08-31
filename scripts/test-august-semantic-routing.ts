import { routeTopicSemantically } from '../lib/banking-ca/semantic-router';
import { CanonicalTopic } from '../lib/banking-ca/schema';

function createMockTopic(partial: Partial<CanonicalTopic>): CanonicalTopic {
  return {
    id: partial.slug || 'test-topic',
    slug: partial.slug || 'test-topic',
    title: partial.title || 'Test Topic',
    priority: partial.priority || 'P2_HIGH',
    revisionMinutes: partial.revisionMinutes || 3,
    primaryCategory: partial.primaryCategory || 'MACRO_ECONOMY',
    secondaryCategories: [],
    primaryInstitution: partial.primaryInstitution || 'OTHER',
    verificationStatus: 'SOURCE_ONLY',
    whatHappened: partial.whatHappened || [],
    mustMemorizeFacts: partial.mustMemorizeFacts || [],
    knowUnderstandContext: [],
    examFocus: [],
    optionalFacts: [],
    initialEventDate: '2026-08-01',
    firstPublicationDate: '2026-08-15',
    lastUpdatedDate: '2026-08-15',
    chronologicalMonth: '2026-08',
    eventMonth: '2026-08',
    activeInMonths: ['2026-08'],
    chronologicalWeek: 'week-1-4',
    informationType: partial.informationType || 'OTHER',
    compressionLevel: partial.compressionLevel || 'C2',
    lifecycleStatus: 'ACTIVE',
    updatesHistory: [],
    sourceReferences: partial.sourceReferences || [{
      sourceName: 'CGB_MENTORS',
      batchName: '09-august-2026-cgb-pib',
      publishedDate: '2026-08-15'
    }],
    contentMarkdown: ''
  };
}

console.log('────────────────────────────────────────────────────────');
console.log('🧪 Running 22-Point Adversarial Classification Test Suite...');
console.log('────────────────────────────────────────────────────────\n');

let passed = 0;
let total = 0;

function assertTest(name: string, condition: boolean, details?: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ Test ${total.toString().padStart(2, '0')}: ${name}`);
  } else {
    console.error(`  ❌ Test ${total.toString().padStart(2, '0')}: ${name}`);
    if (details) console.error(`     Details: ${details}`);
  }
}

// 1. GENUINE SECTION 04 ITEMS
{
  const t = createMockTopic({ title: "Bankers' Books Evidence Act, 2026 (~2 min)", primaryCategory: 'NATIONAL_AND_STATES' });
  const r = routeTopicSemantically(t);
  assertTest('National Legislation -> Section 04', r.sectionId === 'sec-4', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: 'Gujarat Approves 4 Natural Farming Centres of Excellence', primaryCategory: 'NATIONAL_AND_STATES' });
  const r = routeTopicSemantically(t);
  assertTest('State Governance Project -> Section 04', r.sectionId === 'sec-4', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: 'MHA e-Zero FIRs: 12,000+ Online Registrations Across 18 States', primaryCategory: 'NATIONAL_AND_STATES' });
  const r = routeTopicSemantically(t);
  assertTest('Internal Security & Cybersecurity Policing -> Section 04', r.sectionId === 'sec-4', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: 'Venezuela Formally Notifies UN of Withdrawal from Rome Statute (ICC)', primaryCategory: 'INTERNATIONAL_AFFAIRS' });
  const r = routeTopicSemantically(t);
  assertTest('International Geopolitics & UN Treaties -> Section 04', r.sectionId === 'sec-4', `Got ${r.sectionId}`);
}

// 2. ITEMS PREVIOUSLY DUMPED INTO SECTION 04 (NOW CORRECTLY REROUTED)
{
  const t = createMockTopic({ title: 'REC & PFC ₹26,850 Crore Loan Agreement for Meja Thermal Power', primaryCategory: 'MACRO_ECONOMY' });
  const r = routeTopicSemantically(t);
  assertTest('Project Finance Consortium Loan -> Section 01 (ESI & Business)', r.sectionId === 'sec-1', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: 'AD Category-II Licences Authorized by RBI for Trade Remittances', primaryCategory: 'BANKING_REGULATION' });
  const r = routeTopicSemantically(t);
  assertTest('AD-II Forex Regulatory Licensing -> Section 02 (Regulatory Bodies)', r.sectionId === 'sec-2', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: "Cross-Border Payments: Maldives 'Favara' ↔ India 'UPI' Corridor", primaryCategory: 'DIGITAL_PAYMENTS' });
  const r = routeTopicSemantically(t);
  assertTest('UPI Cross-Border Payment Corridor -> Section 03 (Banking & Insurance)', r.sectionId === 'sec-3', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: 'Senior Civil Service Foreign Deputations Approved by ACC', primaryCategory: 'APPOINTMENTS' });
  const r = routeTopicSemantically(t);
  assertTest('ACC Cleared Foreign Deputations -> Section 05 (MoUs & Appointments)', r.sectionId === 'sec-5', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: 'MoRTH Proposes Phased Mandate for Vehicle-to-Vehicle (V2V) Communication (AIS-230)', primaryCategory: 'DEFENCE_AND_SCIENCE' });
  const r = routeTopicSemantically(t);
  assertTest('Vehicular ITS & Wireless Tech -> Section 06 (Sci-Tech & Defence)', r.sectionId === 'sec-6', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: '16th Indian Organ Donation Day & e-Pratyaropan Portal Launch', primaryCategory: 'NATIONAL_AND_STATES' });
  const r = routeTopicSemantically(t);
  assertTest('National Health Observance Day -> Section 08 (Important Days)', r.sectionId === 'sec-8', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: 'Khelo India & ANSF Expansion: ₹36,441 Crore Combined Outlay', primaryCategory: 'GOVERNMENT_SCHEMES' });
  const r = routeTopicSemantically(t);
  assertTest('Central Sports Welfare Mission -> Section 10 (Govt Schemes & Static)', r.sectionId === 'sec-10', `Got ${r.sectionId}`);
}

// 3. GENUINE SECTION 09 OFFICIAL INSTRUMENTS
{
  const t = createMockTopic({ title: 'Public Examinations (Prevention of Unfair Means) Act: Statutory Notification', primaryCategory: 'NATIONAL_AND_STATES' });
  const r = routeTopicSemantically(t);
  assertTest('Statutory Commencement Gazette Notification -> Section 09', r.sectionId === 'sec-9', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: 'Department of Expenditure Office Memorandum: Revised General Financial Rules (GFR)', primaryCategory: 'MACRO_ECONOMY' });
  const r = routeTopicSemantically(t);
  assertTest('Central Procurement Office Memorandum (OM) -> Section 09', r.sectionId === 'sec-9', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: 'DPIIT Mandatory Quality Control Order (QCO Mandate) for Solar Inverters', primaryCategory: 'MACRO_ECONOMY' });
  const r = routeTopicSemantically(t);
  assertTest('Quality Control Order (QCO) -> Section 09', r.sectionId === 'sec-9', `Got ${r.sectionId}`);
}

// 4. REGULATORY VS BANKING PRODUCTS (SECTIONS 02 vs 03)
{
  const t = createMockTopic({ title: '62nd RBI Monetary Policy Committee (MPC) Meeting (August 2026)', primaryCategory: 'MONETARY_POLICY' });
  const r = routeTopicSemantically(t);
  assertTest('RBI MPC Decision -> Section 02 (Regulatory Bodies)', r.sectionId === 'sec-2', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: 'RBI Depositor Education and Awareness (DEA) Fund Unclaimed Deposits', primaryCategory: 'BANKING_REGULATION' });
  const r = routeTopicSemantically(t);
  assertTest('Bank Deposit Balances & DEA Fund -> Section 03 (Banking & Insurance)', r.sectionId === 'sec-3', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: "HDFC Bank Launches Savings Max Variants ('Max for Seniors' & 'Max for Her')", primaryCategory: 'BANKING_REGULATION' });
  const r = routeTopicSemantically(t);
  assertTest('Commercial Bank Retail Account Launch -> Section 03 (Banking & Insurance)', r.sectionId === 'sec-3', `Got ${r.sectionId}`);
}

// 5. ESI & MACROECONOMIC DATA (SECTION 01)
{
  const t = createMockTopic({ title: 'Periodic Labour Force Survey (PLFS) Quarterly Bulletin (April–June 2026)', primaryCategory: 'REPORTS_AND_INDICES' });
  const r = routeTopicSemantically(t);
  assertTest('PLFS Labour Survey -> Section 01 (ESI, Finance & Business)', r.sectionId === 'sec-1', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: 'Government e-Marketplace (GeM) 10th Anniversary: ₹20 Lakh Crore Milestone', primaryCategory: 'NATIONAL_AND_STATES' });
  const r = routeTopicSemantically(t);
  assertTest('GeM Public Procurement Milestone -> Section 01 (ESI, Finance & Business)', r.sectionId === 'sec-1', `Got ${r.sectionId}`);
}

// 6. SCHEMES & STATIC GK (SECTION 10)
{
  const t = createMockTopic({ title: 'ISEC Evaluation Report on KCC-Modified Interest Subvention Scheme (KCC-MISS)', primaryCategory: 'REPORTS_AND_INDICES' });
  const r = routeTopicSemantically(t);
  assertTest('KCC-MISS Interest Subvention Evaluation -> Section 10 (Govt Schemes)', r.sectionId === 'sec-10', `Got ${r.sectionId}`);
}

{
  const t = createMockTopic({ title: 'Parichha Weir on Betwa River Designated as ICID World Heritage Irrigation Structure', primaryCategory: 'NATIONAL_AND_STATES' });
  const r = routeTopicSemantically(t);
  assertTest('ICID World Heritage Irrigation Structure -> Section 10 (Static GK)', r.sectionId === 'sec-10', `Got ${r.sectionId}`);
}

// 7. UNRESOLVED DOMAIN BOUNDARY GUARDRAIL
{
  const t = createMockTopic({ title: 'Xyz Completely Unrelated Random Phenomenon', primaryCategory: 'NATIONAL_AND_STATES' });
  const r = routeTopicSemantically(t);
  assertTest('Unresolved Topic -> Flagged ROUTING_REVIEW_REQUIRED with LOW Confidence', r.confidence === 'LOW' && r.isReviewRequired, `Got conf ${r.confidence}`);
}

console.log('\n────────────────────────────────────────────────────────');
console.log(`Results: ${passed} / ${total} Tests Passed`);
console.log('────────────────────────────────────────────────────────\n');

if (passed !== total) {
  process.exit(1);
}
