# Banking Current Affairs Web Application — Data Model Specification (Phase W1)

> **Document Version**: 1.0.0  
> **Status**: Canonical Schema & Data Contract Baseline  
> **Target Schema**: `data/banking-ca-registry.json`

---

## 1. Schema Design Philosophy

The data contract is designed to:
1. **Model Canonical Topics as Primary Entities**: Ensure 1 real-world regulatory event = 1 entity with an immutable `id` and slug.
2. **Support Temporal History without Entity Duplication**: Separate *when news appeared* (Chronological batches) from *what the current truth is* (Topic State).
3. **Power Time-Budgeted Revision Engines**: Store exact `revisionMinutes`, `priorityLevel`, and `mustMemorizeFacts` for deterministic revision deck generation.
4. **Preserve Honest Verification & Regulatory Status**: Maintain explicit enums for `RegulatoryStatus` and `VerificationStatus`.

---

## 2. Core TypeScript Interfaces

```typescript
/** Priority Tiers strictly calibrated for Bank PO Mains */
export type PriorityLevel = 
  | 'P1_CRITICAL_DEEP'     // ~10-15 min: Core systemic RBI/Monetary/Banking reforms
  | 'P1_CRITICAL_MEMORIZE' // ~5-8 min: High-conviction factual clusters / major acts
  | 'P2_HIGH'              // ~3-5 min: Macro indicators, schemes, key appointments
  | 'P3_MODERATE'          // ~1-2 min: One-liners, awards, defence, sports
  | 'P4_LOW_YIELD';        // Peripheral items

/** Explicit Regulatory Stance */
export type RegulatoryStatus = 
  | 'DRAFT' 
  | 'PROPOSAL' 
  | 'CONSULTATION' 
  | 'APPROVED' 
  | 'NOTIFIED' 
  | 'IMPLEMENTED';

/** Strict Source-Fidelity & Verification Tags */
export type VerificationStatus = 
  | 'PRIMARY_SOURCE_VERIFIED'   // Inspected official gazette / RBI release in-session
  | 'CROSS_SOURCE_CORROBORATED' // Verified across multiple independent coaching feeds
  | 'SOURCE_ONLY'               // Grounded strictly in supplied coaching material
  | 'VERIFICATION_PENDING'      // High-stakes claim awaiting primary check
  | 'CONFLICTING';              // Disagreement between sources

/** Primary Institutions */
export type InstitutionId = 
  | 'RBI' 
  | 'SEBI' 
  | 'IRDAI' 
  | 'PFRDA' 
  | 'NPCI' 
  | 'IFSCA' 
  | 'MINISTRY_OF_FINANCE' 
  | 'EXIM_BANK' 
  | 'NABARD' 
  | 'SIDBI' 
  | 'NCGTC' 
  | 'INTERNATIONAL_BODIES' // IMF, World Bank, ADB, BIS, FATF
  | 'OTHER';

/** Broad Subject Categories */
export type CategoryId = 
  | 'BANKING_REGULATION'
  | 'MONETARY_POLICY'
  | 'MACRO_ECONOMY'
  | 'CAPITAL_MARKETS'
  | 'INSURANCE_SECTOR'
  | 'PENSION_SYSTEMS'
  | 'DIGITAL_PAYMENTS'
  | 'GOVERNMENT_SCHEMES'
  | 'APPOINTMENTS'
  | 'REPORTS_AND_INDICES'
  | 'NATIONAL_AND_STATES'
  | 'INTERNATIONAL_AFFAIRS'
  | 'DEFENCE_AND_SCIENCE'
  | 'SPORTS_AND_AWARDS';

/** Historical / Incremental Topic Update */
export interface TopicUpdate {
  updateId: string;
  date: string; // ISO format: YYYY-MM-DD
  batchId: string; // Reference to source batch
  summary: string;
  previousValue?: string;
  newValue?: string;
  changeReason?: string;
}

/** Change-Sensitive Alert Metadata */
export interface ChangeAlert {
  isChangeSensitive: boolean;
  currentFactSummary: string;
  changeTrigger: string; // e.g. "Next MPC Meeting on Oct 5-7, 2026"
  targetRecheckDate?: string; // YYYY-MM-DD
  actionBeforeExam: string;
}

/** Source Provenance Reference */
export interface SourceReference {
  sourceName: 'CGB_MENTORS' | 'SMARTKEEDA' | 'PIB' | 'OFFICIAL_GAZETTE' | 'OTHER';
  batchName: string; // e.g. "1st-11th August 2026 Compilation"
  pageNumbers?: number[];
  publishedDate: string;
  citationSnippet?: string;
}

/** Primary Canonical Topic Entity */
export interface CanonicalTopic {
  id: string; // e.g. "rbi-draft-interest-rates-2026"
  slug: string; // URL-safe slug
  title: string;
  subtitle?: string;
  priority: PriorityLevel;
  revisionMinutes: number; // e.g. 8
  
  primaryCategory: CategoryId;
  secondaryCategories: CategoryId[];
  primaryInstitution: InstitutionId;
  
  regulatoryStatus: RegulatoryStatus;
  verificationStatus: VerificationStatus;
  
  // Fact-Level Compression Fields
  mustMemorizeFacts: string[];     // Survives 3-minute pre-exam scan
  knowUnderstandContext: string[]; // Pedagogical plain-English mechanisms
  optionalFacts?: string[];        // Secondary numbers / background
  
  // Temporal & Change Tracking
  initialEventDate: string; // YYYY-MM-DD
  lastUpdatedDate: string;  // YYYY-MM-DD
  chronologicalMonth: string; // e.g. "2026-08"
  chronologicalWeek: string;  // e.g. "week-3"
  
  changeAlert?: ChangeAlert;
  updatesHistory: TopicUpdate[];
  sourceReferences: SourceReference[];
  
  // Full Markdown Body for Reader View
  contentMarkdown: string;
}

/** Chronological Source Batch Audit Log */
export interface IngestionBatch {
  batchId: string; // e.g. "2026-08-cgb-part-2"
  sourceName: string;
  dateRange: string; // e.g. "12th - 20th August 2026"
  ingestedAt: string; // ISO timestamp
  
  // Hard Accounting Metrics
  rawItemsCount: number;
  duplicatesCount: number;
  enrichmentsCount: number;
  updatesCount: number;
  newTopicsCount: number;
  ignoredCount: number;
  
  // Verification Breakdown
  primaryVerifiedCount: number;
  sourceOnlyCount: number;
  verificationPendingCount: number;
  
  mentorVerdict: string;
}

/** Master Registry Payload Contract */
export interface BankingCaMasterRegistry {
  schemaVersion: '1.0.0';
  generatedAt: string;
  activeWindowStart: string; // "2026-04-01"
  
  summary: {
    totalCanonicalTopics: number;
    activeP1Count: number;
    activeP1RevisionMinutes: number;
    totalP2Count: number;
    totalP3Count: number;
    totalBatchesIngested: number;
  };
  
  topics: Record<string, CanonicalTopic>; // Keyed by topic ID
  topicSlugMap: Record<string, string>;   // slug -> topic ID
  
  indexes: {
    byPriority: Record<PriorityLevel, string[]>; // topic IDs
    byCategory: Record<CategoryId, string[]>;
    byInstitution: Record<InstitutionId, string[]>;
    byMonth: Record<string, string[]>; // "2026-08" -> topic IDs
    changeSensitiveTopicIds: string[];
  };
  
  batches: IngestionBatch[];
}
```

---

## 3. Sample Normalized JSON Payload (`data/banking-ca-registry.json`)

```json
{
  "schemaVersion": "1.0.0",
  "generatedAt": "2026-08-25T18:20:00Z",
  "activeWindowStart": "2026-04-01",
  "summary": {
    "totalCanonicalTopics": 48,
    "activeP1Count": 7,
    "activeP1RevisionMinutes": 51,
    "totalP2Count": 18,
    "totalP3Count": 23,
    "totalBatchesIngested": 3
  },
  "topics": {
    "rbi-draft-interest-rates-2026": {
      "id": "rbi-draft-interest-rates-2026",
      "slug": "rbi-draft-master-directions-interest-rates-advances-2026",
      "title": "RBI Draft Master Directions: Interest Rates on Loans and Advances 2026",
      "subtitle": "Harmonization of Benchmark Pricing, 3-Month Reset Frequency Cap & MCLR Continuity",
      "priority": "P1_CRITICAL_DEEP",
      "revisionMinutes": 8,
      "primaryCategory": "BANKING_REGULATION",
      "secondaryCategories": ["MONETARY_POLICY"],
      "primaryInstitution": "RBI",
      "regulatoryStatus": "DRAFT",
      "verificationStatus": "SOURCE_ONLY",
      "mustMemorizeFacts": [
        "Lenders cannot price any loan below the applicable benchmark rate.",
        "Floating loan benchmark reset frequency is capped at not more than once every 3 months.",
        "Reset frequency cannot be altered during the loan tenor once fixed.",
        "MCLR internal benchmarking continues for commercial banks, RRBs, Tier 3/4 UCBs, and rural co-ops with deposits >₹1,000 crore.",
        "Mandatory External Benchmark Lending Rate (EBLR) linkage retained for personal and MSME floating loans of commercial banks.",
        "Proposed effective implementation date is 1 April 2027."
      ],
      "knowUnderstandContext": [
        "Eliminates opaque internal spread manipulation and prevents asymmetric rate transmissions during monetary policy cycles."
      ],
      "optionalFacts": [
        "Agricultural loan reset period is tied to crop seasons but capped at 12 months.",
        "Interest on advances must generally be charged at monthly rests."
      ],
      "initialEventDate": "2026-08-15",
      "lastUpdatedDate": "2026-08-20",
      "chronologicalMonth": "2026-08",
      "chronologicalWeek": "week-3",
      "changeAlert": {
        "isChangeSensitive": true,
        "currentFactSummary": "Draft framework open for public stakeholder consultation; effective 1 April 2027.",
        "changeTrigger": "Release of Final Master Directions by RBI",
        "actionBeforeExam": "Recheck if draft status transitions to final notification."
      },
      "updatesHistory": [],
      "sourceReferences": [
        {
          "sourceName": "CGB_MENTORS",
          "batchName": "12th-20th August 2026 Compilation",
          "pageNumbers": [6, 7],
          "publishedDate": "2026-08-20"
        }
      ],
      "contentMarkdown": "# RBI Draft Master Directions..."
    }
  },
  "topicSlugMap": {
    "rbi-draft-master-directions-interest-rates-advances-2026": "rbi-draft-interest-rates-2026"
  },
  "indexes": {
    "byPriority": {
      "P1_CRITICAL_DEEP": ["rbi-draft-interest-rates-2026"],
      "P1_CRITICAL_MEMORIZE": [],
      "P2_HIGH": [],
      "P3_MODERATE": [],
      "P4_LOW_YIELD": []
    },
    "byCategory": {
      "BANKING_REGULATION": ["rbi-draft-interest-rates-2026"]
    },
    "byInstitution": {
      "RBI": ["rbi-draft-interest-rates-2026"]
    },
    "byMonth": {
      "2026-08": ["rbi-draft-interest-rates-2026"]
    },
    "changeSensitiveTopicIds": ["rbi-draft-interest-rates-2026"]
  },
  "batches": []
}
```
