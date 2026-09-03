# Phase 6A Forensic Report — Priority Remediation Identity Failure

**STATUS: FORENSIC AUDIT ONLY — ZERO MUTATIONS EXECUTED — AWAITING AUTHORIZATION**

---

## 1. Executive Determination: **`ACTUAL_CORPUS_EXECUTION_ERROR`**

The forensic audit confirms that Phase 6A suffered an **actual execution error at the topic-identity level**:
1. **Root Cause**: During Phase 6A priority configuration, the execution script pulled 4 candidate topics from the initial heuristic Phase 5 audit (`data/phase5-semantic-audit.json`) instead of reading the validated Phase 5B / 5B-D closure artifact (`data/phase5bd-audit-closure.json`).
2. **Incorrect Downgrades Executed**: Overrides were actively placed in `lib/banking-ca/canonical-deduplication.ts` on:
   - **GeM 10th Foundation Anniversary** (`ca-government-e-marketplace-gem-10th-foundation-anniversary-20-lakh-crore-milestone`)
   - **IFSCA Unified "One KYC" Framework** (`ca-ifsca-notifies-unified-one-kyc-framework-for-gift-ifsc-regulated-entities`)
   - **MoSPI Revised IIP Base Year 2022-23** (`ca-mospi-releases-revised-index-of-industrial-production-iip-series-with-base-year-202223-4-sectors`)
   - **FPI G-Sec Tax Exemptions / FAR Expansion** (`ca-central-government-unveils-fpi-g-sec-tax-exemptions-fully-accessible-route-far-expansion`)
3. **Status of the 4 Authorized Downgrade Topics**:
   - The 4 authorized Phase-5B downgrade topics (*Insults to National Honour Act, Birth/Death Registration Rules, V2V AIS-230 Standard, DRDO Gaurav Glide Bomb*) were **already classified as P2 in the pre-remediation markdown files and registry snapshot**. They did not exist in P1.
4. **Status of the 12 Duplicate Merges**:
   - The 12 duplicate merges are **100% sound, verified, and independently safe**. They retired 6 P2 topics and 6 P3 topics (0 P1 topics).

---

## 2. Comprehensive Identity-Level Priority Forensics Table

| # | Topic ID | Title | Pre-6A Priority | Post-6A Priority | Phase-5B Authorized Action | Phase-6A Actual Action | Correct / Incorrect |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| 1 | `ca-government-e-marketplace-gem-10th-foundation-anniversary-20-lakh-crore-milestone` | GeM 10th Anniversary (₹20 Lakh Cr) | **P1** | **P2** | **KEEP_P1** | DOWNGRADE_TO_P2 | ❌ **INCORRECT** |
| 2 | `ca-ifsca-notifies-unified-one-kyc-framework-for-gift-ifsc-regulated-entities` | IFSCA Unified "One KYC" Framework | **P1** | **P2** | **KEEP_P1** | DOWNGRADE_TO_P2 | ❌ **INCORRECT** |
| 3 | `ca-mospi-releases-revised-index-of-industrial-production-iip-series-with-base-year-202223-4-sectors` | MoSPI Revised IIP Base Year 2022-23 | **P1** | **P2** | **KEEP_P1** | DOWNGRADE_TO_P2 | ❌ **INCORRECT** |
| 4 | `ca-central-government-unveils-fpi-g-sec-tax-exemptions-fully-accessible-route-far-expansion` | FPI G-Sec Tax / FAR Expansion | **P1** | **P2** | **KEEP_P1** | DOWNGRADE_TO_P2 | ❌ **INCORRECT** |
| 5 | `ca-presidential-assent-to-prevention-of-insults-to-national-honour-amendment-act-2026` | Prevention of Insults to Honour | **P2** | **P2** | **P1_TO_P2** | NO_OP (Already P2) | ⚠️ Pre-existed as P2 |
| 6 | `ca-birth-and-death-registration-amendment-rules-2026-mandatory-digital-reporting` | Birth & Death Registration Rules | **P2** | **P2** | **P1_TO_P2** | NO_OP (Already P2) | ⚠️ Pre-existed as P2 |
| 7 | `ca-v2v-communication-safety-standard-ais-230-mandated-for-all-commercial-vehicles-by-2027` | V2V AIS-230 Standard | **P2** | **P2** | **P1_TO_P2** | NO_OP (Already P2) | ⚠️ Pre-existed as P2 |
| 8 | `ca-drdo-successfully-flight-tests-long-range-glide-bomb-gaurav-from-su-30-mki` | DRDO Gaurav Glide Bomb | **P2** | **P2** | **P1_TO_P2** | NO_OP (Already P2) | ⚠️ Pre-existed as P2 |
| 9 | `ca-d-sib-framework-rbi-leverage-ratio-buffer` | D-SIB Framework & Leverage Ratio | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |
| 10 | `ca-rbi-credit-valuation-adjustment-cva-risk-capital-framework` | RBI CVA Risk Capital Framework | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |
| 11 | `ca-sebi-swagat-fi-framework-for-trusted-foreign-investors` | SEBI SWAGAT-FI Framework | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |
| 12 | `ca-rbi-principle-based-resolution-framework-for-natural-calamity-hit-loans` | RBI Calamity Loan Resolution | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |
| 13 | `ca-rbi-monetary-policy-relief-up-to-25000-compensation-for-small-digital-fraud-victims` | RBI ₹25k Digital Fraud Relief | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |
| 14 | `ca-rbi-consolidated-e-mandate-framework-15000-auto-pay-1-lakh-limit-for-sipsinsurance` | RBI Consolidated E-Mandate | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |
| 15 | `ca-rbi-guidelines-for-faster-cross-border-inward-payments-nostro-reconciliation` | RBI Nostro Inward Payments | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |
| 16 | `ca-rbi-utkarsh-2029-medium-term-strategic-framework-for-20262029` | RBI Utkarsh 2029 Strategic Roadmap | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |
| 17 | `ca-irdai-revises-information-security-cybersecurity-governance-guidelines` | IRDAI Cybersecurity Governance | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |
| 18 | `ca-epfo-30-framework-75-corpus-access-upi-withdrawals-e-praapti-portal` | EPFO 3.0 Framework (75% / UPI) | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |
| 19 | `ca-rbi-draft-guidelines-inclusion-of-quarterly-profits-in-bank-cet1-capital` | RBI CET1 Quarterly Profits | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |
| 20 | `ca-rbi-draft-framework-on-smartphone-disabling-recovery-code-of-conduct` | RBI Smartphone Recovery Code | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |
| 21 | `ca-rbi-bank-locker-guidelines-negligence-liability-cap` | RBI Bank Locker Liability Cap | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |
| 22 | `ca-rbi-expands-credit-derivatives-framework-credit-default-swaps-cds-total-return-swaps` | RBI Credit Derivatives CDS/TRS | **P2** | **P1** | **RAISE_TO_P1** | RAISE_TO_P1 | ✅ **CORRECT** |

---

## 3. Duplicate Merge Priority Effects (Audit of the 12 Pairs)

The 12 duplicate merges did not alter any P1 topic. They retired exactly **6 P2 topics** and **6 P3 topics**:

| # | Retired Node ID | Pre Priority | Survivor Node ID | Survivor Pre Priority | Post Priority | Effect |
| :---: | :--- | :---: | :--- | :---: | :---: | :--- |
| 1 | `ca-fast-ds-scheme-foreign-assets-of-small-taxpayers-disclosure-scheme-2026` | **P2** | `ca-cbdt-fast-ds-2026-foreign-assets-of-small-taxpayers-disclosure-scheme` | **P1** | **P1** | Retired 1 P2 $\to$ merged into P1 survivor |
| 2 | `ca-henley-passport-index-february-2026` | **P3** | `ca-henley-passport-index-2026` | **P3** | **P3** | Retired 1 P3 $\to$ merged into P3 survivor |
| 3 | `ca-bharat-taxi-cooperative-ride-hailing` | **P3** | `ca-bharat-taxi-cooperative-ride-hailing-platform-launched` | **P3** | **P3** | Retired 1 P3 $\to$ merged into P3 survivor |
| 4 | `ca-rbi-imposes-monetary-penalties-on-multiple-financial-institutions` | **P3** | `ca-rbi-imposes-monetary-penalties-on-multiple-financial-entities` | **P3** | **P3** | Retired 1 P3 $\to$ merged into P3 survivor |
| 5 | `ca-solid-waste-management-rules-2026-notified` | **P3** | `ca-moefcc-notifies-solid-waste-management-swm-rules-2026-mandatory-4-stream-segregation` | **P2** | **P2** | Retired 1 P3 $\to$ merged into P2 survivor |
| 6 | `ca-131-padma-awards-2026-announced` | **P3** | `ca-president-droupadi-murmu-confers-131-padma-awards-2026` | **P3** | **P3** | Retired 1 P3 $\to$ merged into P3 survivor |
| 7 | `ca-government-approves-1-billion-polymer-banknotes-of-10-20` | **P2** | `ca-government-approves-rbi-field-trials-for-1-billion-polymer-banknotes-10-20` | **P2** | **P2** | Retired 1 P2 $\to$ merged into P2 survivor |
| 8 | `ca-100-fdi-in-insurance-sector-operationalized-under-automatic-route` | **P2** | `ca-ministry-of-finance-notifies-100-fdi-in-insurance-sector-under-automatic-route` | **P2** | **P2** | Retired 1 P2 $\to$ merged into P2 survivor |
| 9 | `ca-rbi-sets-3-year-cooling-off-for-co-operative-bank-directors-after-10-year-tenure` | **P2** | `ca-rbi-draft-governance-directions-for-co-operative-banks-3-year-cooling-off` | **P2** | **P2** | Retired 1 P2 $\to$ merged into P2 survivor |
| 10 | `ca-sebi-it-resilience-index-framework-for-market-infrastructure-institutions` | **P2** | `ca-sebi-scale-based-framework-for-market-infrastructure-it-resilience-index-itri` | **P1** | **P1** | Retired 1 P2 $\to$ merged into P1 survivor |
| 11 | `ca-irdai-regulations-on-ind-as-ind-as-117-implementation-by-insurers` | **P2** | `ca-irdai-mandates-ind-as-and-ind-as-117-for-all-insurers-from-april-1-2026` | **P2** | **P2** | Retired 1 P2 $\to$ merged into P2 survivor |
| 12 | `ca-sebi-minimum-public-shareholding-mps-timeline` | **P3** | `ca-ministry-of-finance-restructures-minimum-public-shareholding-mps-slabs` | **P2** | **P2** | Retired 1 P3 $\to$ merged into P2 survivor |

---

## 4. Priority Derivation & Correct Target Distribution

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ EXACT PRIORITY ARITHMETIC RECONCILIATION                                               │
├──────────────────────────────────────────────────────┬─────────────────────────────────┤
│ Pre-Remediation Active Topics                        │ 1,462 (85 P1, 495 P2, 882 P3)   │
│ Deduplication Subtractions (12 Retired Nodes)        │ -12 (0 P1, -6 P2, -6 P3)        │
│ Post-Deduplication Pre-Priority Active Base          │ 1,450 (85 P1, 489 P2, 876 P3)   │
│ 14 Authorized P2 -> P1 Upgrades                      │ +14 P1, -14 P2                  │
│ 4 Authorized P1 -> P2 Downgrades                     │ (Already P2 in pre-base; 0 net) │
├──────────────────────────────────────────────────────┼─────────────────────────────────┤
│ CORRECT TARGET ACTIVE DISTRIBUTION                   │ 1,450 (99 P1, 475 P2, 876 P3)   │
│ Mathematical Sum Check (99 + 475 + 876)              │ 1,450 (Zero Residual)           │
│ Gross Lineage Sum Check (1,450 + 12 retired)         │ 1,462 (Zero Residual)           │
└──────────────────────────────────────────────────────┴─────────────────────────────────┘
```

---

## 5. Precise Restoration Plan (Pending Authorization)

1. **Remove the 4 Unauthorized Downgrades**: Delete the override entries for GeM, IFSCA, IIP, and FAR from `CANONICAL_PRIORITY_OVERRIDES` in `lib/banking-ca/canonical-deduplication.ts`, restoring them to P1.
2. **Preserve the 14 Authorized Upgrades**: Maintain the 14 validated regulatory P1 upgrades.
3. **Preserve the 12 Duplicate Merges**: Leave `CANONICAL_SLUG_ALIASES` intact.
4. **Recompile Registry**: Verify that active counts match **99 P1**, **475 P2**, **876 P3** (Total: **1,450**).
5. **Run Test Suites**: Confirm 100% pass rate across all 4 suites.

---

## 6. Non-Modification Confirmation & Git Status

- **Corpus Files Modified in this Forensic Turn**: **`0`**
- **Priority Values Changed in this Forensic Turn**: **`0`**
- **Deployments Executed**: **`0`**
