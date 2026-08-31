import { CanonicalTopic } from '../lib/banking-ca/schema';
import { classifyTopicPresentation, extractLeadMetric } from '../lib/banking-ca/presentation-classifier';

console.log('────────────────────────────────────────────────────────');
console.log('🧪 Testing Intelligent Content Presentation Layer...');
console.log('────────────────────────────────────────────────────────\n');

// Mock test topics representing the 5 visual primitives
const testCases: { name: string; topic: Partial<CanonicalTopic>; expected: string }[] = [
  {
    name: 'P1 Regulatory Topic (EPF Scheme / Ombudsman)',
    topic: {
      id: 'p1-ombudsman',
      slug: 'rbi-revamped-integrated-ombudsman-scheme',
      title: "RBI's New Integrated Ombudsman Scheme Comes into Effect from 1 July",
      priority: 'P1_CRITICAL_DEEP',
      primaryCategory: 'BANKING_REGULATION',
      whatHappened: ['Under the new framework, customers must first approach the concerned regulated entity.'],
      mustMemorizeFacts: ['Compensation of up to ₹30 lakh for consequential losses'],
      revisionMinutes: 10
    },
    expected: 'DeepBrief'
  },
  {
    name: 'Appointment Event (NITI Aayog CEO / Anurag Jain)',
    topic: {
      id: 'appt-niti',
      slug: 'anurag-jain-appointed-niti-aayog-ceo',
      title: 'Anurag Jain Appointed Chief Executive Officer (CEO) of NITI Aayog',
      priority: 'P2_HIGH',
      primaryCategory: 'APPOINTMENTS',
      informationType: 'APPOINTMENT',
      mustMemorizeFacts: ['Succeeding BVR Subrahmanyam'],
      revisionMinutes: 2
    },
    expected: 'AppointmentBoard'
  },
  {
    name: 'Award Event (60th Jnanpith Award)',
    topic: {
      id: 'award-jnanpith',
      slug: '60th-jnanpith-award-vairamuthu',
      title: 'Tamil Poet and Lyricist R. Vairamuthu Conferred with 60th Jnanpith Award',
      priority: 'P3_MODERATE',
      primaryCategory: 'SPORTS_AND_AWARDS',
      informationType: 'AWARD',
      mustMemorizeFacts: ['3rd Tamil writer after Akilan and Jayakanthan'],
      revisionMinutes: 2
    },
    expected: 'FactStrip'
  },
  {
    name: 'Corporate Deal / Partnership (BofA-Jio / BoB-Mizuho)',
    topic: {
      id: 'mou-bob-mizuho',
      slug: 'bob-mizuho-bank-mou',
      title: 'Bank of Baroda and Japan Mizuho Bank Sign Strategic M&A Partnership',
      priority: 'P3_MODERATE',
      primaryCategory: 'NATIONAL_AND_STATES',
      mustMemorizeFacts: ['To enhance collaboration across M&A financing.'],
      revisionMinutes: 2
    },
    expected: 'FactStrip'
  },
  {
    name: 'Metric-Dominant Fact (MAB Penalties ₹7,086 Crore)',
    topic: {
      id: 'metric-mab',
      slug: 'banks-collected-7086-crore-mab-penalties-fy26',
      title: 'Banks collected ₹7,086 crore as minimum balance penalties in FY26',
      priority: 'P2_HIGH',
      primaryCategory: 'BANKING_REGULATION',
      mustMemorizeFacts: [
        'Private sector banks collected ₹4,948.71 crore.',
        'Public sector banks collected ₹2,137.92 crore.'
      ],
      revisionMinutes: 3
    },
    expected: 'Brief'
  },
  {
    name: 'Economic Metric (IMF World Economic Outlook GDP)',
    topic: {
      id: 'metric-imf',
      slug: 'imf-india-gdp-growth-projections-fy27-fy28',
      title: 'IMF Projects India GDP Growth at 6.4% in FY27 and 6.7% in FY28',
      priority: 'P2_HIGH',
      primaryCategory: 'MACRO_ECONOMY',
      mustMemorizeFacts: ['Global growth projected at 3.0% in 2026.'],
      revisionMinutes: 3
    },
    expected: 'Brief'
  },
  {
    name: 'Rapid-Scan FactStrip (BSE-MSCI / One-Line Fact)',
    topic: {
      id: 'factstrip-bse-msci',
      slug: 'bse-msci-strategic-partnership',
      title: 'BSE Partners with MSCI for Global Index Calculation',
      priority: 'P3_MODERATE',
      primaryCategory: 'NATIONAL_AND_STATES',
      mustMemorizeFacts: ['Calculates global benchmark indices for Indian equities.'],
      revisionMinutes: 1
    },
    expected: 'FactStrip'
  },
  {
    name: 'Standard Multi-Fact Brief (SEBI Demat SWP/STP Proposal)',
    topic: {
      id: 'brief-sebi-swp',
      slug: 'sebi-clears-standing-instructions-swp-stp-demat',
      title: 'SEBI Clears Standing Instructions for SWP and STP in Demat-Held Mutual Funds',
      priority: 'P2_HIGH',
      primaryCategory: 'CAPITAL_MARKETS',
      whatHappened: ['Allows investors in demat units to create standing instructions.'],
      mustMemorizeFacts: [
        'Unit-based SWPs by January 31, 2027.',
        'Amount-based SWPs by April 30, 2027.',
        'Depositories act as nodal facilitator.'
      ],
      revisionMinutes: 4
    },
    expected: 'Brief'
  }
];

let allPassed = true;

for (const tc of testCases) {
  const result = classifyTopicPresentation(tc.topic as CanonicalTopic);
  const pass = result === tc.expected;
  if (!pass) allPassed = false;

  console.log(`${pass ? '  ✅' : '  ❌'} ${tc.name}`);
  console.log(`     Inferred: [${result}] (Expected: [${tc.expected}])`);

  if (result === 'MetricCallout') {
    const metric = extractLeadMetric(tc.topic as CanonicalTopic);
    console.log(`     Extracted Lead Metric: ${metric ? metric.value : 'None'}`);
  }
}

if (!allPassed) {
  console.error('\n❌ Presentation classifier test failed!');
  process.exit(1);
}

console.log('\n🎉 Intelligent Content Presentation Layer Test PASSED 100%!\n');
