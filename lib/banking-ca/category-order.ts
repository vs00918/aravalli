import { CategoryId, CanonicalTopic } from './schema';

/**
 * Exam-Weighted Category Priority Hierarchy for Banking Officer-Level Mains Exams
 * (SBI PO Mains / IBPS PO Mains / Regulatory Exams).
 *
 * Core Principle:
 * Exam importance strictly dictates presentation order across all views.
 * Topic count must NEVER dictate category position.
 */
export const EXAM_CATEGORY_RANKS: Record<CategoryId, number> = {
  BANKING_REGULATION: 1,      // Banking & Regulation / RBI Circulars & Prudential Norms
  MONETARY_POLICY: 2,         // Monetary Policy / MPC / Policy Rates & Liquidity Operations
  MACRO_ECONOMY: 3,           // Economy & Fiscal / GDP Projections, CPI Inflation & Trade
  CAPITAL_MARKETS: 4,         // Capital Markets & SEBI / Primary/Secondary Markets & Mutual Funds
  DIGITAL_PAYMENTS: 5,        // Digital Payments & UPI / NPCI, FinTech Innovations & CBDC
  GOVERNMENT_SCHEMES: 6,      // Government Schemes & Policies / DBT, Social Security & Agriculture
  INSURANCE_SECTOR: 7,        // Insurance & IRDAI / Master Directions & Solvency Norms
  PENSION_SYSTEMS: 8,         // Pensions & PFRDA / NPS, APY & Fund Management
  REPORTS_AND_INDICES: 9,     // Reports, Indices & Global Organizations / Benchmark Surveys
  APPOINTMENTS: 10,           // Key Appointments / RBI Governors, Bank MDs, Regulatory Bodies
  NATIONAL_AND_STATES: 11,    // National & States Affairs / Infrastructure & State Initiatives
  INTERNATIONAL_AFFAIRS: 12,  // International Affairs / Bilateral Treaties & Multilateral Summits
  DEFENCE_AND_SCIENCE: 13,    // Defence & Science / Space Missions & Military Technology
  SPORTS_AND_AWARDS: 14       // Sports & Awards / Major Honors & Miscellaneous Factoids
};

/**
 * Canonical Display Names (Consistent across sidebar, stream headers, and dropdowns)
 */
export const CANONICAL_CATEGORY_NAMES: Record<string, string> = {
  BANKING_REGULATION: "Banking & Regulation",
  MONETARY_POLICY: "Monetary Policy",
  MACRO_ECONOMY: "Economy & Fiscal",
  CAPITAL_MARKETS: "Capital Markets & SEBI",
  DIGITAL_PAYMENTS: "Digital Payments & UPI",
  GOVERNMENT_SCHEMES: "Government Schemes",
  INSURANCE_SECTOR: "Insurance & IRDAI",
  PENSION_SYSTEMS: "Pensions & PFRDA",
  REPORTS_AND_INDICES: "Reports & Indices",
  APPOINTMENTS: "Key Appointments",
  NATIONAL_AND_STATES: "National & States",
  INTERNATIONAL_AFFAIRS: "International Affairs",
  DEFENCE_AND_SCIENCE: "Defence & Science",
  SPORTS_AND_AWARDS: "Sports & Awards"
};

/**
 * Category Visual Icons
 */
export const CANONICAL_CATEGORY_ICONS: Record<string, string> = {
  BANKING_REGULATION: "🏦",
  MONETARY_POLICY: "🏛️",
  MACRO_ECONOMY: "📊",
  CAPITAL_MARKETS: "📈",
  DIGITAL_PAYMENTS: "💳",
  GOVERNMENT_SCHEMES: "📜",
  INSURANCE_SECTOR: "🛡️",
  PENSION_SYSTEMS: "👵",
  REPORTS_AND_INDICES: "📋",
  APPOINTMENTS: "👔",
  NATIONAL_AND_STATES: "🇮🇳",
  INTERNATIONAL_AFFAIRS: "🌐",
  DEFENCE_AND_SCIENCE: "🚀",
  SPORTS_AND_AWARDS: "🏆"
};

/**
 * Returns the numeric exam importance rank of a category (lower number = higher priority).
 */
export function getCategoryExamRank(category: string): number {
  return EXAM_CATEGORY_RANKS[category as CategoryId] ?? 999;
}

/**
 * Deterministic comparator to sort category keys strictly by exam importance rank.
 */
export function compareCategoriesByExamRank(catA: string, catB: string): number {
  const rankA = getCategoryExamRank(catA);
  const rankB = getCategoryExamRank(catB);
  if (rankA !== rankB) {
    return rankA - rankB;
  }
  return catA.localeCompare(catB);
}

/**
 * Numeric rank for topic priority tiers (P1 -> P2 -> P3 -> P4)
 */
export function getPriorityTierRank(priority: string): number {
  if (priority.startsWith("P1")) return 1;
  if (priority === "P2_HIGH") return 2;
  if (priority === "P3_MODERATE") return 3;
  if (priority === "P4_LOW_YIELD") return 4;
  return 5;
}

/**
 * Deterministic comparator to sort topics within a category:
 * 1. Priority Tier (P1 -> P2 -> P3 -> P4)
 * 2. Event Chronology (most recent / canonical date)
 * 3. Stable slug/id fallback
 */
export function compareTopicsForStudyStream(a: CanonicalTopic, b: CanonicalTopic): number {
  // 1. Priority Tier
  const tierA = getPriorityTierRank(a.priority);
  const tierB = getPriorityTierRank(b.priority);
  if (tierA !== tierB) {
    return tierA - tierB;
  }

  // 2. Event Chronology (descending: newest date first, or ascending if same date)
  if (a.initialEventDate && b.initialEventDate && a.initialEventDate !== b.initialEventDate) {
    return b.initialEventDate.localeCompare(a.initialEventDate);
  }

  // 3. Fallback to slug / id for stable deterministic ordering
  return a.slug.localeCompare(b.slug);
}
