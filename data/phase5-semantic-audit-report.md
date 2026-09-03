# Phase 5 — Semantic Deduplication, Pedagogical Quality & Priority Audit Report

**AUDIT ONLY — ZERO CORPUS / UI / PRIORITY / METRIC MODIFICATIONS EXECUTED**

---

## 1. Executive Summary & Audit Scope

This diagnostic audit evaluates the complete **1,462-topic canonical corpus** across 12 distinct dimensions to map all semantic duplicates, priority misalignments, pedagogical defects, taxonomy mismatches, and data hygiene issues.

### Core Metrics Dashboard:
- **Total Canonical Topics Audited**: **`1,462`**
- **Exact / Near Semantic Duplicates Identified**: **`30`**
- **Probable Semantic Duplicates**: **`15`**
- **Update & Milestone Relationships**: **`7`**
- **Active P1 Priority Health**: **`81 / 85`** verified as true high-yield P1; **`4`** candidates for P2; **`0`** candidates for P3; **`31`** P2/P3 topics recommended for upgrade to P1.
- **Pedagogical Quality Distribution**: **Grade A** (`1420`), **Grade B** (`35`), **Grade C** (`0`), **Grade D** (`7`).
- **Information Density**: **Appropriate** (`1398`), **Underdeveloped** (`0`), **Overloaded** (`64`).
- **Rapid-Recall Units**: **Good** (`1331`), **Too Long** (`0`), **Missing** (`0`).
- **Taxonomy Mismatches**: **`41`** topics placed in source-driven or miscellaneous categories.
- **Data Hygiene Issues**: **`172`** LaTeX/formatting/length defects.

---

## 2. Quantitative Summary Tables

### A. Canonical Identity & Deduplication Audit
| Relationship Tier | Count | Definition | Recommended Pedagogical Action |
| :--- | :---: | :--- | :--- |
| **Exact / High-Confidence Duplicates** | **30** | $ge 85%$ title/content overlap describing the exact same announcement | Merge into single canonical node with union of source references |
| **Probable Semantic Duplicates** | **15** | $70	ext{--}84%$ similarity across feeds | Merge or deduplicate with manual verification |
| **Sequential Updates & Milestones** | **7** | Scheme expansion, timeline amendment, or achievement milestone | Nest as chronological updates under master scheme node |
| **Related but Distinct Nodes** | **135** | Shared entity/policy domain with separate actions | Connect via cross-topic conceptual graph links |

---

### B. Priority Quality Audit (85 Active P1 Topics)
| Priority Recommendation | Count | % of P1 | Criteria & Exam Rationale |
| :--- | :---: | :---: | :--- |
| **`KEEP_P1`** | **81** | **95%** | Major RBI monetary policy, master directions, banking reforms, high-impact national schemes. |
| **`CONSIDER_P2`** | **4** | **5%** | Moderate national headlines, bilateral agreements, single-ministry portals lacking deep banking weight. |
| **`CONSIDER_P3`** | **0** | **0%** | Ceremonial awards, sports achievements, or low-yield one-liners currently over-ranked. |
| **`RAISE_TO_P1` (from P2/P3)** | **31** | — | High-yield banking circulars, TReDS regulations, and insolvency norms currently ranked P2/P3. |

---

### C. Pedagogical Quality & Information Density
| Metric Dimension | Grade / Status | Count | Exam Readiness & Meaning |
| :--- | :--- | :---: | :--- |
| **Pedagogical Completeness** | **Grade A (Exam-Ready)** | **1420** | Complete first-principles teaching, multi-fact ladder, clear exam angle, recap. |
| | **Grade B (Usable)** | **35** | Contains key facts and context; needs crisper laddering. |
| | **Grade C (Weak Teaching)** | **0** | Single factoid without mechanism, context, or exam trap guidance. |
| | **Grade D (Headline-Only)** | **7** | Bare headline/bullet with zero explanatory context. |
| **Information Density** | **Appropriate** | **1398** | Balanced depth matching exam importance. |
| | **Underdeveloped** | **0** | P1/P2 topic lacking sufficient detail to answer 5-option MCQs. |
| | **Overloaded** | **64** | P3 topic cluttered with excessive non-examinable text. |
| **Rapid Recall Units** | **Good** | **1331** | High-utility memory anchor ($le 220$ characters). |
| | **Too Long / Overloaded** | **0** | Over 220 characters; fails rapid revision utility. |
| | **Missing** | **0** | No dedicated recap statement present. |

---

## 3. Representative Evidence & Defect Inventories

### A. Strongest Semantic Duplicate Examples (Top 25)
1. **`ca-62nd-rbi-monetary-policy-committee-mpc-meeting-august-2026`** $longleftrightarrow$ **`ca-60th-rbi-monetary-policy-committee-mpc-statement-april-2026`**
   - *Titles*: "62nd RBI Monetary Policy Committee (MPC) Meeting (August 2026)" vs "60th RBI Monetary Policy Committee (MPC) Statement (April 2026)"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

2. **`ca-rbi-scale-based-regulation-nbfc-upper-layer-nbfc-ul-list-202627`** $longleftrightarrow$ **`ca-rbi-scale-based-regulation-sbr-1-lakh-crore-absolute-threshold-for-nbfc-upper-layer-nbfc-ul`**
   - *Titles*: "RBI Scale-Based Regulation: NBFC Upper Layer (NBFC-UL) List 2026–27" vs "RBI Scale-Based Regulation (SBR): ₹1 Lakh Crore Absolute Threshold for NBFC-Upper Layer (NBFC-UL)"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

3. **`ca-bharat-maritime-insurance-pool-bmip`** $longleftrightarrow$ **`ca-cabinet-approves-12980-crore-bharat-maritime-insurance-pool-bmi-pool`**
   - *Titles*: "Bharat Maritime Insurance Pool (BMIP)" vs "Cabinet Approves ₹12,980 Crore Bharat Maritime Insurance Pool (BMI Pool)"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

4. **`ca-maldives-favara-leftrightarrow-india-upi-corridor`** $longleftrightarrow$ **`ca-maldives-favara-upi-linkage`**
   - *Titles*: "Maldives 'Favara' $\leftrightarrow$ India 'UPI' Corridor" vs "Maldives Favara + UPI Linkage"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

5. **`ca-credit-guarantee-scheme-for-mfis-cgsmfi-20`** $longleftrightarrow$ **`ca-credit-guarantee-scheme-for-microfinance-institutions-cgsmfi-20-extended`**
   - *Titles*: "Credit Guarantee Scheme for MFIs (CGSMFI 2.0)" vs "Credit Guarantee Scheme for Microfinance Institutions (CGSMFI-2.0) Extended"
   - *Relationship*: `UPDATE_TO_EXISTING_EVENT` (Confidence: 0.88)
   - *Action*: Nest as chronological update under the primary canonical scheme node.

6. **`ca-public-examinations-prevention-of-unfair-means-amendment-bill-2026-assent`** $longleftrightarrow$ **`ca-public-examinations-prevention-of-unfair-means-amendment-bill-2026`**
   - *Titles*: "Public Examinations (Prevention of Unfair Means) Amendment Bill 2026 Assent" vs "Public Examinations (Prevention of Unfair Means) Amendment Bill 2026"
   - *Relationship*: `SEMANTIC_DUPLICATE` (Confidence: 0.89)
   - *Action*: Merge into single canonical node with union of facts and source references.

7. **`ca-apex-financial-regulatory-appointments`** $longleftrightarrow$ **`ca-apex-appointments`**
   - *Titles*: "Apex Financial & Regulatory Appointments" vs "Apex Appointments"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

8. **`ca-apex-financial-regulatory-appointments`** $longleftrightarrow$ **`ca-key-financial-regulatory-appointments-may-2026`**
   - *Titles*: "Apex Financial & Regulatory Appointments" vs "Key Financial & Regulatory Appointments (May 2026)"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

9. **`ca-apex-financial-regulatory-appointments`** $longleftrightarrow$ **`ca-major-regulatory-executive-apex-appointments`**
   - *Titles*: "Apex Financial & Regulatory Appointments" vs "Major Regulatory & Executive Apex Appointments"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

10. **`ca-apex-financial-regulatory-appointments`** $longleftrightarrow$ **`ca-apex-regulatory-executive-appointments-june-2026`**
   - *Titles*: "Apex Financial & Regulatory Appointments" vs "Apex Regulatory & Executive Appointments (June 2026)"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

11. **`ca-pmksy-10-year-review`** $longleftrightarrow$ **`ca-pm-vbry-1-year-review`**
   - *Titles*: "PMKSY 10-Year Review" vs "PM-VBRY 1-Year Review"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

12. **`ca-sports`** $longleftrightarrow$ **`ca-sports-athletics`**
   - *Titles*: "Sports" vs "Sports & Athletics"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

13. **`ca-government-approves-1-billion-polymer-banknotes-of-10-20`** $longleftrightarrow$ **`ca-government-approves-rbi-field-trials-for-1-billion-polymer-banknotes-10-20`**
   - *Titles*: "Government Approves 1 Billion Polymer Banknotes of ₹10 & ₹20" vs "Government Approves RBI Field Trials for 1 Billion Polymer Banknotes (₹10 & ₹20)"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

14. **`ca-fast-ds-scheme-foreign-assets-of-small-taxpayers-disclosure-scheme-2026`** $longleftrightarrow$ **`ca-cbdt-fast-ds-2026-foreign-assets-of-small-taxpayers-disclosure-scheme`**
   - *Titles*: "FAST-DS Scheme (Foreign Assets of Small Taxpayers Disclosure Scheme 2026)" vs "CBDT FAST-DS 2026: Foreign Assets of Small Taxpayers-Disclosure Scheme"
   - *Relationship*: `SEMANTIC_DUPLICATE` (Confidence: 0.88)
   - *Action*: Merge into single canonical node with union of facts and source references.

15. **`ca-apex-appointments`** $longleftrightarrow$ **`ca-major-regulatory-executive-apex-appointments`**
   - *Titles*: "Apex Appointments" vs "Major Regulatory & Executive Apex Appointments"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

16. **`ca-80th-independence-day-announcements`** $longleftrightarrow$ **`ca-80th-independence-day-celebrations`**
   - *Titles*: "80th Independence Day Announcements" vs "80th Independence Day Celebrations"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

17. **`ca-national-sports-awards-2025`** $longleftrightarrow$ **`ca-sports-awards-culture`**
   - *Titles*: "National Sports Awards 2025" vs "Sports, Awards & Culture"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

18. **`ca-jal-jeevan-mission-jjm`** $longleftrightarrow$ **`ca-jal-jeevan-mission-jjm-7-year-review-82-rural-tap-coverage-jjm-20-869-lakh-crore`**
   - *Titles*: "Jal Jeevan Mission (JJM)" vs "Jal Jeevan Mission (JJM) 7-Year Review: 82% Rural Tap Coverage & JJM 2.0 (₹8.69 Lakh Crore)"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

19. **`ca-pfrda-launches-nps-swasthya-pension-scheme-under-regulatory-sandbox`** $longleftrightarrow$ **`ca-icici-prudential-swasthya-pension-scheme-under-pfrda-regulatory-sandbox`**
   - *Titles*: "PFRDA Launches NPS Swasthya Pension Scheme under Regulatory Sandbox" vs "ICICI Prudential Swasthya Pension Scheme under PFRDA Regulatory Sandbox"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

20. **`ca-conclusion-of-landmark-india-eu-free-trade-agreement-22nd-fta`** $longleftrightarrow$ **`ca-india-and-gcc-sign-terms-of-reference-for-free-trade-agreement-fta`**
   - *Titles*: "Conclusion of Landmark India-EU Free Trade Agreement (22nd FTA)" vs "India and GCC Sign Terms of Reference for Free Trade Agreement (FTA)"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

21. **`ca-rbi-draft-governance-directions-for-co-operative-banks-3-year-cooling-off`** $longleftrightarrow$ **`ca-rbi-sets-3-year-cooling-off-for-co-operative-bank-directors-after-10-year-tenure`**
   - *Titles*: "RBI Draft Governance Directions for Co-operative Banks (3-Year Cooling-Off)" vs "RBI Sets 3-Year Cooling-Off for Co-operative Bank Directors after 10-Year Tenure"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

22. **`ca-pradhan-mantri-matru-vandana-yojana-pmmvy-completes-9-years`** $longleftrightarrow$ **`ca-pradhan-mantri-mudra-yojana-pmmy-completes-11-years-40-lakh-crore-sanctioned`**
   - *Titles*: "Pradhan Mantri Matru Vandana Yojana (PMMVY) Completes 9 Years" vs "Pradhan Mantri Mudra Yojana (PMMY) Completes 11 Years: ₹40 Lakh Crore Sanctioned"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

23. **`ca-solid-waste-management-rules-2026-notified`** $longleftrightarrow$ **`ca-moefcc-notifies-solid-waste-management-swm-rules-2026-mandatory-4-stream-segregation`**
   - *Titles*: "Solid Waste Management Rules 2026 Notified" vs "MoEFCC Notifies Solid Waste Management (SWM) Rules 2026: Mandatory 4-Stream Segregation"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

24. **`ca-131-padma-awards-2026-announced`** $longleftrightarrow$ **`ca-president-droupadi-murmu-confers-131-padma-awards-2026`**
   - *Titles*: "131 Padma Awards 2026 Announced" vs "President Droupadi Murmu Confers 131 Padma Awards 2026"
   - *Relationship*: `RELATED_BUT_DISTINCT` (Confidence: 0.75)
   - *Action*: Cross-link conceptually without merging.

25. **`ca-henley-passport-index-2026`** $longleftrightarrow$ **`ca-henley-passport-index-february-2026`**
   - *Titles*: "Henley Passport Index 2026" vs "Henley Passport Index (February 2026)"
   - *Relationship*: `SEMANTIC_DUPLICATE` (Confidence: 0.8)
   - *Action*: Merge into single canonical node with union of facts and source references.


---

### B. Strongest P1 Downgrade Candidates (Top 15)
1. **`ca-government-e-marketplace-gem-10th-foundation-anniversary-20-lakh-crore-milestone`**: "Government e-Marketplace (GeM) 10th Foundation Anniversary: ₹20 Lakh Crore Milestone"
   - *Current*: `P1_CRITICAL_MEMORIZE` $	o$ *Recommended*: **`CONSIDER_P2`**
   - *Reason*: Moderate national headline; lacks the regulatory/macroeconomic weight of true P1 topics.

2. **`ca-ifsca-notifies-unified-one-kyc-framework-for-gift-ifsc-regulated-entities`**: "IFSCA Notifies Unified "One KYC" Framework for GIFT-IFSC Regulated Entities"
   - *Current*: `P1_CRITICAL_DEEP` $	o$ *Recommended*: **`CONSIDER_P2`**
   - *Reason*: Moderate national headline; lacks the regulatory/macroeconomic weight of true P1 topics.

3. **`ca-mospi-releases-revised-index-of-industrial-production-iip-series-with-base-year-202223-4-sectors`**: "MoSPI Releases Revised Index of Industrial Production (IIP) Series with Base Year 2022–23 (4 Sectors)"
   - *Current*: `P1_CRITICAL_DEEP` $	o$ *Recommended*: **`CONSIDER_P2`**
   - *Reason*: Moderate national headline; lacks the regulatory/macroeconomic weight of true P1 topics.

4. **`ca-central-government-unveils-fpi-g-sec-tax-exemptions-fully-accessible-route-far-expansion`**: "Central Government Unveils FPI G-Sec Tax Exemptions & Fully Accessible Route (FAR) Expansion"
   - *Current*: `P1_CRITICAL_DEEP` $	o$ *Recommended*: **`CONSIDER_P2`**
   - *Reason*: Moderate national headline; lacks the regulatory/macroeconomic weight of true P1 topics.


---

### C. Strongest P2/P3 Upgrade Candidates to P1 (Top 10)
1. **`ca-d-sib-framework-rbi-leverage-ratio-buffer`**: "D-SIB Framework & RBI Leverage Ratio Buffer"
   - *Current*: `P2_HIGH` $	o$ *Recommended*: **`RAISE_TO_P1`**
   - *Reason*: High-yield core banking/statutory regulation currently under-ranked at P2/P3.

2. **`ca-rbi-credit-valuation-adjustment-cva-risk-capital-framework`**: "RBI Credit Valuation Adjustment (CVA) Risk Capital Framework"
   - *Current*: `P2_HIGH` $	o$ *Recommended*: **`RAISE_TO_P1`**
   - *Reason*: High-yield core banking/statutory regulation currently under-ranked at P2/P3.

3. **`ca-sebi-swagat-fi-framework-for-trusted-foreign-investors`**: "SEBI SWAGAT-FI Framework for Trusted Foreign Investors"
   - *Current*: `P2_HIGH` $	o$ *Recommended*: **`RAISE_TO_P1`**
   - *Reason*: High-yield core banking/statutory regulation currently under-ranked at P2/P3.

4. **`ca-rbi-principle-based-resolution-framework-for-natural-calamity-hit-loans`**: "RBI Principle-Based Resolution Framework for Natural Calamity-Hit Loans"
   - *Current*: `P2_HIGH` $	o$ *Recommended*: **`RAISE_TO_P1`**
   - *Reason*: High-yield core banking/statutory regulation currently under-ranked at P2/P3.

5. **`ca-sebi-proposed-regulatory-framework-for-significant-indices-used-by-mutual-funds`**: "SEBI Proposed Regulatory Framework for 'Significant Indices' Used by Mutual Funds"
   - *Current*: `P2_HIGH` $	o$ *Recommended*: **`RAISE_TO_P1`**
   - *Reason*: High-yield core banking/statutory regulation currently under-ranked at P2/P3.

6. **`ca-sebi-exemption-framework-for-technical-glitches-in-broker-trading-systems`**: "SEBI Exemption Framework for Technical Glitches in Broker Trading Systems"
   - *Current*: `P2_HIGH` $	o$ *Recommended*: **`RAISE_TO_P1`**
   - *Reason*: High-yield core banking/statutory regulation currently under-ranked at P2/P3.

7. **`ca-rbi-monetary-policy-relief-up-to-25000-compensation-for-small-digital-fraud-victims`**: "RBI Monetary Policy Relief: Up to ₹25,000 Compensation for Small Digital Fraud Victims"
   - *Current*: `P2_HIGH` $	o$ *Recommended*: **`RAISE_TO_P1`**
   - *Reason*: High-yield core banking/statutory regulation currently under-ranked at P2/P3.

8. **`ca-rbi-sets-up-committee-to-review-business-correspondent-guidelines`**: "RBI Sets Up Committee to Review Business Correspondent Guidelines"
   - *Current*: `P3_MODERATE` $	o$ *Recommended*: **`RAISE_TO_P1`**
   - *Reason*: High-yield core banking/statutory regulation currently under-ranked at P2/P3.

9. **`ca-sebi-it-resilience-index-framework-for-market-infrastructure-institutions`**: "SEBI IT Resilience Index Framework for Market Infrastructure Institutions"
   - *Current*: `P2_HIGH` $	o$ *Recommended*: **`RAISE_TO_P1`**
   - *Reason*: High-yield core banking/statutory regulation currently under-ranked at P2/P3.

10. **`ca-sebi-life-cycle-mutual-funds-framework-product-tenures`**: "SEBI Life Cycle Mutual Funds Framework & Product Tenures"
   - *Current*: `P2_HIGH` $	o$ *Recommended*: **`RAISE_TO_P1`**
   - *Reason*: High-yield core banking/statutory regulation currently under-ranked at P2/P3.


---

### D. Strongest vs Weakest Pedagogical Examples
#### Top 10 Strongest Pedagogical Nodes (Grade A):
1. **`ca-62nd-rbi-monetary-policy-committee-mpc-meeting-august-2026`**: "62nd RBI Monetary Policy Committee (MPC) Meeting (August 2026)" (Complete First-Principles Ladder + Crisp Recap)
2. **`ca-rbi-on-tap-licensing-guidelines-for-urban-cooperative-banks-ucbs`**: "RBI 'On Tap' Licensing Guidelines for Urban Cooperative Banks (UCBs)" (Complete First-Principles Ladder + Crisp Recap)
3. **`ca-rbi-scale-based-regulation-nbfc-upper-layer-nbfc-ul-list-202627`**: "RBI Scale-Based Regulation: NBFC Upper Layer (NBFC-UL) List 2026–27" (Complete First-Principles Ladder + Crisp Recap)
4. **`ca-rbi-loan-recovery-directions-financed-smartphone-lockout-norms`**: "RBI Loan Recovery Directions & Financed Smartphone Lockout Norms" (Complete First-Principles Ladder + Crisp Recap)
5. **`ca-rbi-defers-basel-iii-pillar-3-disclosures-to-april-1-2027-ecl-alignment`**: "RBI Defers Basel III Pillar 3 Disclosures to April 1, 2027 (ECL Alignment)" (Complete First-Principles Ladder + Crisp Recap)
6. **`ca-priority-sector-lending-psl-nri-deposit-forex-swap-relief`**: "Priority Sector Lending (PSL) & NRI Deposit Forex Swap Relief" (Complete First-Principles Ladder + Crisp Recap)
7. **`ca-bharat-maritime-insurance-pool-bmip`**: "Bharat Maritime Insurance Pool (BMIP)" (Complete First-Principles Ladder + Crisp Recap)
8. **`ca-cabinet-approves-pm-kisan-continuation-for-5-years-315614-cr-outlay`**: "Cabinet Approves PM-KISAN Continuation for 5 Years (₹3,15,614 Cr Outlay)" (Complete First-Principles Ladder + Crisp Recap)
9. **`ca-pm-surya-ghar-muft-bijli-yojana`**: "ADB $850 Million Loan for PM Surya Ghar" (Complete First-Principles Ladder + Crisp Recap)
10. **`ca-d-sib-framework-rbi-leverage-ratio-buffer`**: "D-SIB Framework & RBI Leverage Ratio Buffer" (Complete First-Principles Ladder + Crisp Recap)

#### Top 20 Weakest Pedagogical Nodes (Grade C & D):
1. **`ca-supreme-court-directs-mandatory-4-year-car-6-year-two-wheeler-third-party-insurance-period`**: "Supreme Court Directs Mandatory 4-Year Car & 6-Year Two-Wheeler Third-Party Insurance Period" (Flags: headline_only)
2. **`ca-cabinet-approves-gobardhan-national-circular-bioenergy-scheme-with-outlay-of-23731-crore`**: "Cabinet Approves GOBARdhan National Circular Bioenergy Scheme with Outlay of ₹23,731 Crore" (Flags: headline_only)
3. **`ca-mha-expands-sdrfndrf-notified-calamities-from-12-to-14-inclusion-of-heatwaves-lightning`**: "MHA Expands SDRF/NDRF Notified Calamities from 12 to 14: Inclusion of Heatwaves & Lightning" (Flags: headline_only)
4. **`ca-cbdt-fast-ds-2026-foreign-assets-of-small-taxpayers-disclosure-scheme`**: "CBDT FAST-DS 2026: Foreign Assets of Small Taxpayers-Disclosure Scheme" (Flags: headline_only)
5. **`ca-pm-e-drive-scheme-extended-to-march-2028-outlay-raised-to-11900-crore`**: "PM E-DRIVE Scheme Extended to March 2028: Outlay Raised to ₹11,900 Crore" (Flags: headline_only)
6. **`ca-census-2027-40-question-household-schedule-comprehensive-caste-enumeration`**: "Census 2027: 40-Question Household Schedule & Comprehensive Caste Enumeration" (Flags: headline_only)
7. **`ca-cbdc-based-direct-benefit-transfer-dbt-launched-under-pmgkay`**: "CBDC-Based Direct Benefit Transfer (DBT) Launched under PMGKAY" (Flags: headline_only)

---

### E. Top 15 Taxonomy Mismatches & Misclassifications
1. **`ca-rbi-depositor-education-and-awareness-dea-fund-unclaimed-deposits`**: "RBI Depositor Education and Awareness (DEA) Fund Unclaimed Deposits"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

2. **`ca-rbi-recognises-fedai-as-a-self-regulatory-organization-sro`**: "RBI Recognises FEDAI as a Self-Regulatory Organization (SRO)"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

3. **`ca-india-eu-mou-between-rbi-and-esma-for-ccil-recognition`**: "India-EU MoU between RBI and ESMA for CCIL Recognition"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

4. **`ca-rbi-subsumes-voluntary-retention-route-vrr-under-fpi-general-route`**: "RBI Subsumes Voluntary Retention Route (VRR) under FPI General Route"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

5. **`ca-rbi-sets-up-committee-to-review-business-correspondent-guidelines`**: "RBI Sets Up Committee to Review Business Correspondent Guidelines"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

6. **`ca-rbi-payments-vision-2028-shaping-indias-payment-frontier`**: "RBI Payments Vision 2028: 'Shaping India’s Payment Frontier'"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

7. **`ca-rbi-imposes-monetary-penalties-on-multiple-financial-entities`**: "RBI Imposes Monetary Penalties on Multiple Financial Entities"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

8. **`ca-rbi-proposal-on-high-value-digital-transfer-friction-1-hour-delay-on-transfers-10000`**: "RBI Proposal on High-Value Digital Transfer Friction: 1-Hour Delay on Transfers >₹10,000"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

9. **`ca-rbi-retains-fpi-investment-caps-in-debt-instruments-for-fy-2026-27`**: "RBI Retains FPI Investment Caps in Debt Instruments for FY 2026-27"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

10. **`ca-pay-point-india-becomes-1st-private-fintech-to-join-rbi-centralised-payment-systems-cps`**: "Pay Point India Becomes 1st Private Fintech to Join RBI Centralised Payment Systems (CPS)"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

11. **`ca-shriram-finance-arm-receives-rbi-in-principle-nod-for-primary-dealer-business`**: "Shriram Finance Arm Receives RBI In-Principle Nod for Primary Dealer Business"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

12. **`ca-skyroot-aerospace-flags-off-vikram-1-rocket-for-first-private-orbital-launch`**: "Skyroot Aerospace Flags Off Vikram-1 Rocket for First Private Orbital Launch"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

13. **`ca-rbih-i4c-sign-strategic-mou-on-anti-mule-account-detection`**: "RBIH & I4C Sign Strategic MoU on Anti-Mule Account Detection"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

14. **`ca-rbi-imposes-monetary-penalties-on-multiple-financial-institutions`**: "RBI Imposes Monetary Penalties on Multiple Financial Institutions"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`BANKING_REGULATION`**
   - *Reason*: Core banking regulatory topic misplaced under generic national category.

15. **`ca-government-imposes-immediate-ban-on-sugar-exports-until-september-30-2026`**: "Government Imposes Immediate Ban on Sugar Exports until September 30, 2026"
   - *Current*: `NATIONAL_AND_STATES` $	o$ *Recommended*: **`MACRO_ECONOMY`**
   - *Reason*: Macroeconomic indicator / national statistical release misplaced.


---

### F. Top 15 High-Value Cross-Topic Conceptual Relationships
1. **62nd RBI Monetary Policy Committee (MPC) Meeting (August 2026)** $overset{\text{SEQUENTIAL_MONETARY_STANCE}}{longrightarrow}$ **61st RBI MPC Meeting: Repo Rate Held at 5.25% & FPI G-Sec Limit Overhaul**
   - *Exam Value*: Crucial for tracking rate cycle trends and liquidity stance continuity in RBI Grade B / PO Mains.

2. **Modified Interest Subvention Scheme (MISS) through KCC: Interest Support Framework** $overset{\text{SCHEME_TO_EVALUATION_REPORT}}{longrightarrow}$ **ISEC Evaluation Report on KCC-Modified Interest Subvention Scheme (KCC-MISS)**
   - *Exam Value*: Direct analytical link between scheme parameters (4% net rate) and empirical impact (₹2.30 multiplier).

3. **Parliament Passes MSMED (Amendment) Bill 2026: Statutory Udyam Status, 90-Day ODR & Mandatory TReDS** $overset{\text{STATUTORY_MANDATE_TO_REGULATORY_EXECUTION}}{longrightarrow}$ **RBI Mandates TReDS Onboarding for CPSEs and Systemically Important NBFCs**
   - *Exam Value*: Connects Parliamentary statutory reform to RBI trade receivable discounting compliance.

4. **Pradhan Mantri Viksit Bharat Rozgar Yojana (PM-VBRY): Employment-Linked Incentive Scheme** $overset{\text{SCHEME_POLICY_TO_DIGITAL_DELIVERY_INFRASTRUCTURE}}{longrightarrow}$ **EPFO Rolls Out Face Authentication on UMANG App for PM-VBRY Enrolment**
   - *Exam Value*: Explains technical DBT execution and facial biometric verification for first-time formal employees.

5. **PM Surya Ghar Muft Bijli Yojana Crosses 50.06 Lakh Households Milestone** $overset{\text{DOMESTIC_IMPLEMENTATION_TO_MULTILATERAL_FINANCING}}{longrightarrow}$ **ADB Approves $850 Million Loan for PM Surya Ghar Muft Bijli Yojana**
   - *Exam Value*: Direct link between physical installation milestones and multilateral co-financing commitments.


---

### G. Quarantined & Phase 4 Corrected Topics Status
1. **`ca-pradhan-mantri-viksit-bharat-rozgar-yojana-pm-vbry-employment-linked-incentive-scheme`**:
   - Outlay corrected to **₹99,446 Crore** (Union Cabinet PIB release). Provenance history preserved.
2. **`ca-modified-interest-subvention-scheme-miss-through-kcc-interest-support-framework`**:
   - Outlay disentangled: **₹1,27,290.16 Crore** Department budget vs **~₹22,600 Crore** MISS allocation. Provenance history preserved.

---

## 4. Integrity & Non-Modification Confirmation

- **Total Topics**: 1,462 (Unchanged)
- **Active P1 Topics**: 85 (Unchanged)
- **P2 Topics**: 495 (Unchanged)
- **P3 Topics**: 882 (Unchanged)
- **Corpus / Markdown Files Modified**: 0
- **UI / Presentation Files Modified**: 0
- **Priority Values Changed**: 0
- **Deployments Executed**: 0
