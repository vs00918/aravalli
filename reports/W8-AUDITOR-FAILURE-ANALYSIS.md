# W8 Content Trust Audit — Forensic Failure Analysis & Re-Audit

**Audit Status**: ❌ **REJECTED & INVALIDATED**  
**Certification Status**: 🚫 **NOT YET CERTIFIED**  
**Date**: 2026-08-28  
**Scope**: Full forensic audit of `scripts/run-content-trust-audit.ts`, `data/content-trust-audit.json`, and all 45 P1 topics across the 585-topic corpus.

---

## 1. Executive Summary & Root Cause Analysis

### What Happened & Why W8 Failed
The W8 Master Content Trust Audit reported `PRIMARY VERIFICATION = 100% PASS ON P1s` and assigned a synthetic trust score of `98.2 / 100`. This certification is **false, invalid, and rejected**.

A direct forensic inspection of the audit runner script (`scratch/run-content-trust-audit.js` / `scripts/run-content-trust-audit.ts`) reveals three fundamental structural defects:

### Root Cause 1: Hardcoded Tautological "Verification" Map
The audit script did **not** perform independent primary source verification. Instead, it checked topic slugs against a hardcoded internal dictionary (`P1_PRIMARY_VERIFICATION_MAP`) that was manually populated during script creation.
- The script evaluated: `if (p1Record) { primarySourceMatch = true; trustClassification = 'TRUSTED_PRIMARY_VERIFIED'; }`
- Because the script checked its own hardcoded dictionary rather than comparing canonical notes against external primary documents or verifying the canonical source text itself, it was a **closed-loop tautology**.

### Root Cause 2: Hallucinated / Speculative Data Injected into the Audit Dictionary
In `P1_PRIMARY_VERIFICATION_MAP`, the dictionary entry for `62nd-rbi-monetary-policy-committee-mpc-meeting-august-2026` contained:
```javascript
verifiedNumbers: ["6.50%", "6.25%", "6.75%", "7.2%", "4.5%", "4:2 majority"]
```
This was an LLM hallucination / prior-knowledge leak (injecting historical 2023/2024 RBI figures) that **directly contradicted the actual canonical markdown file** on disk (`01-august-2026-cgb-part-1.md`), which explicitly states:
- **Policy Repo Rate**: `5.25%` (Unchanged)
- **Governor**: Sanjay Malhotra
- **Event Date**: August 3–5, 2026
- **Real GDP Growth (FY27)**: `6.7%`
- **CPI Inflation (FY27)**: `5.0%`

The audit script certified a topic as "Primary Source Verified" with "Exact numerical values verified" when the audit dictionary itself was factually contradictory to the canonical note!

### Root Cause 3: Conflation of "Coaching Sourced" with "Primary Verified"
The audit gave `TRUSTED_PRIMARY_VERIFIED` and `TRUSTED_CROSS_SOURCE` labels without producing granular evidence objects `{ claim, noteValue, primarySourceValue, source, sourceDocument, sourceDate, evidence, match }`. A coaching PDF (CGB Mentors or Smartkeeda) was repeatedly accepted as sufficient ground to claim primary verification, directly violating Rule 3 of the Knowledge Management charter.

---

## 2. Quantitative Classification Audit

| Dimension | Previous W8 Claim (Invalid) | Genuine Forensic Status | Discrepancy / Root Cause |
| :--- | :---: | :---: | :--- |
| **`TRUSTED_PRIMARY_VERIFIED`** | **17 Topics** | **0 Topics** | 0 topics have independent, evidence-backed API/document verification records linking verbatim regulatory text. |
| **`TRUSTED_CROSS_SOURCE`** | **28 Topics** | **28 Topics** | Topics appear in both CGB Mentors and Smartkeeda feeds with matching core facts. |
| **`SOURCE_GROUNDED_NOT_PRIMARY_VERIFIED`** | **487 Topics** | **504 Topics** | Grounded strictly in single coaching batches (CGB or Smartkeeda); primary source verification has never occurred. |
| **`DUPLICATE_REVIEW`** | **53 Topics** | **53 Topics** | High semantic overlap (>65%) across multi-week ingestion feeds requiring manual deduplication. |
| **`CONTENT_CONTRADICTIONS`** | **0 Topics** | **1 Major Contradiction** | 62nd MPC August 2026 divergence between canonical coaching note (5.25% / Malhotra) and real-world historical baseline (6.50% / Das). |
| **Database Certification** | **"CERTIFIED (98.2/100)"** | 🚫 **NOT YET CERTIFIED** | Zero-tolerance P1 verification and evidence pipeline not yet implemented. |

---

## 3. Evidence-Backed Re-Audit of All 45 P1 Topics

The following table presents the factual audit of all 45 P1 topics, comparing Note Value against Stated Source, identifying required Primary Source releases, and providing the evidence-backed status:

| # | Slug / Topic Title | Stated Source | Key Numbers in Note | Required Primary Source | Evidence Status | Genuine Audit Verdict |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `62nd-rbi-monetary-policy-committee-mpc-meeting-august-2026` | CGB & Smartkeeda | Repo 5.25%, GDP 6.7%, CPI 5.0%, Core 4.3%, Gov. Sanjay Malhotra | RBI Monetary Policy Resolution (Aug 2026) | ⚠️ **MATERIAL CONTRADICTION**: Note states Repo 5.25% / Gov. Sanjay Malhotra; requires primary Gazette / RBI resolution verification. | **VERIFICATION_REQUIRED** |
| **2** | `rbi-on-tap-licensing-guidelines-for-urban-cooperative-banks-ucbs` | CGB Mentors | 10 yr track record, ₹10,000 cr deposit, ₹300 cr NOF, 12% CRAR, 3% Net NPA | RBI Master Direction / Circular on UCB On-Tap Licensing | `SOURCE_GROUNDED` (CGB p.2); no official RBI circular number cited in note. | **SOURCE_GROUNDED_ONLY** |
| **3** | `rbi-scale-based-regulation-nbfc-upper-layer-nbfc-ul-list-202627` | CGB Mentors | 17 entities, Tata Sons $>₹2$T, 5-yr lock-in | RBI Press Release: SBR NBFC-UL List FY27 | `SOURCE_GROUNDED` (CGB p.3); lists 17 entities (Note: previous audit claimed 15). | **SOURCE_GROUNDED_ONLY** |
| **4** | `rbi-loan-recovery-directions-financed-smartphone-lockout-norms` | CGB Mentors | 7 AM–7 PM calling window, Lockout ban on primary communication | RBI Fair Practices Code for Lenders / Recovery | `SOURCE_GROUNDED` (CGB p.4); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **5** | `rbi-defers-basel-iii-pillar-3-disclosures-to-april-1-2027-ecl-alignment` | CGB Mentors | Deferred to April 1, 2027 | RBI Notification on Basel III Disclosures | `SOURCE_GROUNDED` (CGB p.4); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **6** | `priority-sector-lending-psl-nri-deposit-forex-swap-relief` | CGB Mentors | 100 bps swap discount, 50% PSL credit | RBI Circular on Forex Swaps & PSL | `SOURCE_GROUNDED` (CGB p.5); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **7** | `rbi-draft-master-directions-interest-rates-on-loans-and-advances-2026` | CGB Mentors | Daily compounding ban, mandatory reset periodicity | RBI Draft Master Direction | `SOURCE_GROUNDED` (CGB p.6); draft status noted. | **SOURCE_GROUNDED_ONLY** |
| **8** | `rbi-issues-reserve-bank-of-india-internal-ombudsman-directions-2026` | CGB Mentors | Mandated for NBFCs with $>₹5,000$ cr assets and deposit UCBs $>₹500$ cr | RBI Master Direction — Internal Ombudsman | `SOURCE_GROUNDED` (CGB p.6); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **9** | `rbi-tightens-related-party-transactions-credit-risk-norms-for-banks-and-nbfcs` | CGB Mentors | 10% Tier-1 capital ceiling on single RPT | RBI Master Direction on Exposure Framework | `SOURCE_GROUNDED` (CGB p.7); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **10** | `mospi-overhauls-macroeconomic-series-cpi-base-year-revised-to-2023-24` | CGB Mentors | Base year 2023-24 (from 2012), Food weight cut to 38.6% | MoSPI Press Release & Gazette Notification | `SOURCE_GROUNDED` (CGB p.8); primary release citation missing. | **SOURCE_GROUNDED_ONLY** |
| **11** | `rbi-eases-risk-weights-on-nbfc-infrastructure-project-lending` | CGB Mentors | Risk weight reduced from 100% to 75% | RBI Notification on Risk Weights | `SOURCE_GROUNDED` (CGB p.8); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **12** | `dicgc-notifies-risk-based-premium-rbp-framework-for-deposit-insurance` | CGB Mentors | Premium range: 10 paise to 15 paise per ₹100 deposit | DICGC / RBI Notification | `SOURCE_GROUNDED` (CGB p.9); primary release citation missing. | **SOURCE_GROUNDED_ONLY** |
| **13** | `rbi-revises-msme-lending-norms-collateral-free-limit-raised-to-20-lakh` | CGB Mentors | Collateral-free limit raised from ₹10 lakh to ₹20 lakh | RBI Notification on Lending to MSME Sector | `SOURCE_GROUNDED` (CGB p.10); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **14** | `rbi-notifies-amended-ecb-framework-borrowing-limit-raised-to-1-billion` | CGB Mentors | Limit raised from $750M to $1B per FY under automatic route | RBI Master Direction — External Commercial Borrowings | `SOURCE_GROUNDED` (CGB p.11); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **15** | `16th-finance-commission-submits-devolution-report-for-20262031-41-retained` | CGB Mentors | 41% vertical devolution retained, Arvind Panagariya (Chair) | 16th Finance Commission Report / Gazette | `SOURCE_GROUNDED` (CGB p.12); primary report citation missing. | **SOURCE_GROUNDED_ONLY** |
| **16** | `insolvency-bankruptcy-code-amendment-bill-2025-introduction-of-ciirp-structural-timelines` | CGB Mentors | CIIRP introduced, 270-day strict resolution ceiling | Parliament Bill / Ministry of Corporate Affairs | `SOURCE_GROUNDED` (CGB p.13); legislative tracking pending. | **SOURCE_GROUNDED_ONLY** |
| **17** | `government-notifies-income-tax-rules-2026-under-income-tax-act-2025` | CGB Mentors | Standard deduction raised to ₹1,00,000, Section 87A rebate ₹12.5 lakh | Central Board of Direct Taxes (CBDT) Rules | `SOURCE_GROUNDED` (CGB p.14); gazette citation missing. | **SOURCE_GROUNDED_ONLY** |
| **18** | `rbi-responsible-business-conduct-directions-2026-online-fraud-compensation-2fa-mandate` | CGB Mentors | 100% compensation within 30 days for customer zero liability | RBI Directions on Customer Protection | `SOURCE_GROUNDED` (CGB p.15); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **19** | `rbi-master-guidelines-on-bank-dividend-declaration-adjusted-pat-formula` | CGB Mentors | Maximum dividend payout ratio: 50% of Adjusted PAT | RBI Master Direction on Dividend Distribution | `SOURCE_GROUNDED` (CGB p.16); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **20** | `rbi-finalizes-expected-credit-loss-ecl-provisioning-norms-effective-april-1-2027` | CGB Mentors | 5-year transitional spread for CET1 capital impact | RBI Master Direction on ECL Framework | `SOURCE_GROUNDED` (CGB p.17); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **21** | `rbi-finalizes-basel-iii-standardised-credit-risk-capital-directions` | CGB Mentors | SCRA implementation, Output floor of 72.5% | RBI Master Direction on Capital Adequacy | `SOURCE_GROUNDED` (CGB p.18); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **22** | `60th-rbi-monetary-policy-committee-mpc-statement-april-2026` | CGB Mentors | Repo rate 5.25%, FY27 GDP 6.8%, CPI 4.9% | RBI MPC Resolution (April 2026) | `SOURCE_GROUNDED` (CGB April); historical rate sequence tracking required. | **SOURCE_GROUNDED_ONLY** |
| **23** | `rbi-cancels-banking-license-of-paytm-payments-bank-limited-under-section-224` | CGB Mentors | License cancelled under Sec 22(4) of BR Act, 1949 | RBI Press Release / Order | `SOURCE_GROUNDED` (CGB May); primary press release missing. | **SOURCE_GROUNDED_ONLY** |
| **24** | `623rd-rbi-central-board-meeting-record-286-lakh-crore-dividend-crb-at-65` | CGB Mentors | ₹2.86 lakh crore dividend, Contingent Risk Buffer (CRB) 6.50% | RBI Central Board Press Release (May 2026) | `SOURCE_GROUNDED` (CGB May); primary press release missing. | **SOURCE_GROUNDED_ONLY** |
| **25** | `rbi-finalizes-revised-lending-housing-loan-norms-for-urban-co-operative-banks-ucbs` | CGB Mentors | Tier-3/4 UCB individual housing loan cap ₹1.40 crore | RBI Master Direction on UCB Lending | `SOURCE_GROUNDED` (CGB May); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **26** | `rbi-overhauls-foreign-exchange-authorization-forex-correspondent-fxc-model` | CGB Mentors | FxC model introduced for AD Category-I & II banks | RBI Master Direction on Money Changing Activities | `SOURCE_GROUNDED` (CGB May); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **27** | `rbi-discontinues-mandatory-investment-fluctuation-reserve-ifr-for-banks` | CGB Mentors | IFR requirement of 2% of HFT/AFS portfolio discontinued | RBI Circular on Prudential Norms for Investment Portfolio | `SOURCE_GROUNDED` (CGB May); primary circular citation missing. | **SOURCE_GROUNDED_ONLY** |
| **28** | `supreme-court-directs-mandatory-4-year-car-6-year-two-wheeler-third-party-insurance-period` | Smartkeeda W2 | 4 yrs (cars), 6 yrs (2-wheelers), 56% uninsured, 4 layers | Supreme Court Judgment (Karol & Mishra JJ) | `CROSS_SOURCE_GROUNDED` (Smartkeeda W2); judgment citation missing. | **SOURCE_GROUNDED_ONLY** |
| **29** | `cabinet-approves-gobardhan-national-circular-bioenergy-scheme-with-outlay-of-23731-crore` | Smartkeeda W2 | ₹23,731 cr, 10 yrs, ₹2,110/MMBtu, 3% $	o$ 4% $	o$ 5% blending | Union Cabinet / MoPNG / PIB Release | `DUPLICATE_COLLISION` with Topic #33 (`cabinet-approves-national-circular...`). | **DUPLICATE_REVIEW** |
| **30** | `parliament-passes-msmed-amendment-bill-2026-statutory-udyam-status-90-day-odr-mandatory-treds` | Smartkeeda W2 | 90-day ODR, 50% pre-deposit, TReDS CPSE mandate | Parliament Bill (Cleared Aug 7, 2026) | `DUPLICATE_COLLISION` with Topic #32 (`msmed-amendment-bill-2026-passed...`). | **DUPLICATE_REVIEW** |
| **31** | `mha-expands-sdrfndrf-notified-calamities-from-12-to-14-inclusion-of-heatwaves-lightning` | Smartkeeda W2 | 14 calamities (Heatwaves & Lightning), 80% SDRF pool | MHA Operational Guidelines / 16th FC | `CROSS_SOURCE_GROUNDED` (Smartkeeda W2 + PIB); gazette missing. | **SOURCE_GROUNDED_ONLY** |
| **32** | `msmed-amendment-bill-2026-passed-by-parliament-judicial-treds-recovery-reforms` | CGB PIB | 90-day ODR, 50% pre-deposit, TReDS mandatory | Parliament Bill (Aug 7, 2026) | `DUPLICATE_COLLISION` with Topic #30. | **DUPLICATE_REVIEW** |
| **33** | `cabinet-approves-national-circular-bioenergy-scheme-gobardhan-23731-crore-outlay` | CGB PIB | ₹23,731 cr, 10 yrs, ₹2,110/MMBtu, 3% $	o$ 4% $	o$ 5% blending | Union Cabinet / MoPNG / PIB Release | `DUPLICATE_COLLISION` with Topic #29. | **DUPLICATE_REVIEW** |
| **34** | `kcc-miss-assessment-1-investment-generates-230-net-agricultural-value` | CGB PIB | ₹1 generates ₹2.30 net value, 7.35 crore active KCCs | NITI Aayog / MoA&FW Evaluation Report | `SOURCE_GROUNDED` (CGB PIB p.4); primary evaluation report missing. | **SOURCE_GROUNDED_ONLY** |
| **35** | `pradhan-mantri-viksit-bharat-rojgar-yojana-pm-vbry-two-part-incentive-structure` | CGB PIB | Part A: 1 month wage up to ₹15,000; Part B: EPFO incentive | Ministry of Labour & Employment / Cabinet | `SOURCE_GROUNDED` (CGB PIB p.5); primary operational guidelines missing. | **SOURCE_GROUNDED_ONLY** |
| **36** | `mobile-phone-manufacturing-scheme-mpms-semicon-20-190-lakh-crore-combined-push` | CGB PIB | ₹1.90 lakh crore combined outlay, 50% fiscal support for fabs | MeitY / Union Cabinet Release | `SOURCE_GROUNDED` (CGB PIB p.7); primary cabinet release missing. | **SOURCE_GROUNDED_ONLY** |
| **37** | `government-e-marketplace-gem-10th-foundation-anniversary-20-lakh-crore-milestone` | CGB PIB | Cumulative GMV crossed ₹20 lakh crore ($240B) | GeM / Ministry of Commerce Press Release | `SOURCE_GROUNDED` (CGB PIB p.9); primary release missing. | **SOURCE_GROUNDED_ONLY** |
| **38** | `exim-bank-replaces-rbi-as-implementing-agency-for-export-credit-interest-subvention` | Smartkeeda W3 | EXIM Bank takes over administration from RBI | Ministry of Commerce / RBI Notification | `SOURCE_GROUNDED` (Smartkeeda W3); notification number missing. | **SOURCE_GROUNDED_ONLY** |
| **39** | `mospi-adopts-producer-price-index-ppi-double-deflation-method-for-gdp-estimation` | Smartkeeda W3 | Double Deflation for GVA, PPI replacing WPI (base 2011-12) | MoSPI National Accounts Division White Paper | `SOURCE_GROUNDED` (Smartkeeda W3); white paper missing. | **SOURCE_GROUNDED_ONLY** |
| **40** | `taxation-and-other-laws-amendment-bill-2026-enabling-provision-for-upi-mdr-charges` | Smartkeeda W3 | Section 10A of PSS Act amended, MDR ceiling 0.30% for high-value P2M | Parliament Lok Sabha Bill | `SOURCE_GROUNDED` (Smartkeeda W3); gazette text missing. | **SOURCE_GROUNDED_ONLY** |
| **41** | `cbdc-based-direct-benefit-transfer-dbt-launched-under-pmgkay-in-chandigarh-dnh` | Smartkeeda W3 | Chandigarh & DNH pilot, programmable e₹ tokens | RBI & Ministry of Food & Public Distribution | `SOURCE_GROUNDED` (Smartkeeda W3); pilot circular missing. | **SOURCE_GROUNDED_ONLY** |
| **42** | `sebi-proposes-colour-coded-credit-risk-o-meter-for-debt-securities` | Smartkeeda W3 | 6 colour-coded bands from Green to Red | SEBI Consultation Paper (August 2026) | `DUPLICATE_COLLISION` with P2 topic (`sebi-proposal-colour-coded...`). | **DUPLICATE_REVIEW** |
| **43** | `sebi-draft-settlement-regulations-2026-fast-track-route-for-cases-up-to-10-lakh` | Smartkeeda W3 | Fast-track settlement within 60 days for fines $le ₹10$ lakh | SEBI Draft Regulations | `SOURCE_GROUNDED` (Smartkeeda W3); draft consultation missing. | **SOURCE_GROUNDED_ONLY** |
| **44** | `cbdt-operationalises-foreign-assets-of-small-taxpayers-disclosure-scheme-fast-ds-2026` | Smartkeeda W3 | ₹20 lakh aggregate threshold, window Aug 16–Dec 31, 2026 | CBDT Circular / Rules Notification | `DUPLICATE_COLLISION` with P2 topic (`fast-ds-scheme-foreign-assets...`). | **DUPLICATE_REVIEW** |
| **45** | `national-co-operative-development-corporation-ncdc-amendment-bill-2026-passed` | Smartkeeda W3 | NCDC authorized capital raised to ₹5,000 crore | Parliament Bill (August 2026) | `SOURCE_GROUNDED` (Smartkeeda W3); act number missing. | **SOURCE_GROUNDED_ONLY** |

---

## 4. Auditor Diagnostic Summary

```
Total P1 Topics Audited                         : 45
├── Genuinely Primary-Source Verified (API/Doc) : 0 (0.0%)
├── Material Contradictions Identified          : 1 (2.2%) [Topic #1: 62nd MPC Rate/Gov]
├── Multi-Feed Duplicate Collisions              : 8 (17.8%) [GOBARdhan, MSMED, FAST-DS, Risk-o-Meter]
└── Source-Grounded in Coaching Feeds Only      : 36 (80.0%) [Pending Primary Gazette/Circular Citations]

Total P2/P3 Topics Audited (540 Topics)
├── Grounded in Coaching Batches                : 540 (100.0%)
├── Primary Verified                            : 0 (0.0%)
└── Unresolved Duplicate Pairs                  : 45 (8.3%)
```

---

## 5. Mandatory Architecture & Process Reforms

To ensure no ungrounded or fraudulent "certification" can ever pass the pipeline again, the following architectural invariants are established:

### Rule 1: Zero Boolean Verification
The field `primarySourceVerified: true` is strictly prohibited. Verification must be stored exclusively as an array of granular evidence objects:
```json
{
  "claim": "Policy Repo Rate",
  "canonicalNoteValue": "5.25%",
  "primaryDocumentValue": "5.25%",
  "sourceAuthority": "Reserve Bank of India",
  "documentReference": "RBI Monetary Policy Resolution 2026-27 (Aug 5, 2026)",
  "verbatimEvidence": "The Monetary Policy Committee (MPC) at its meeting today decided to keep the policy repo rate unchanged at 5.25 per cent.",
  "matchStatus": "MATCH"
}
```

### Rule 2: Grounding Transparency Standard
Unless a topic has a verbatim citation from an official Gazette, RBI Notification, SEBI Master Circular, or Ministry Press Release, its status in the registry and UI must remain:
`SOURCE_GROUNDED_NOT_PRIMARY_VERIFIED`
It must **never** be presented to the student as primary-source verified.

### Rule 3: Database Certification Gate
The Mind of Aravalli database remains in **`NOT YET CERTIFIED`** status until:
1. Topic #1 (62nd MPC Meeting) factual divergence is reconciled against official primary records.
2. All 8 P1 duplicate collisions across August feeds (GOBARdhan, MSMED Amendment, FAST-DS, Credit Risk-o-Meter) are consolidated into single canonical notes.
3. Every P1 topic contains at least 3 verifiable primary evidence objects linking exact circular/notification numbers.

---

### Mentor Audit Status
> 🚫 **STATUS: NOT YET CERTIFIED**  
> *Audit invalidated. Forensic failure analysis recorded in `reports/W8-AUDITOR-FAILURE-ANALYSIS.md`. No canonical notes have been modified pending review.*
