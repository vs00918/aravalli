import { CanonicalTopic, PriorityLevel } from './schema';

/**
 * Mapping of variant topic slugs / titles to the authoritative Canonical Slug.
 * Ensures 1 Real Event = 1 Canonical Topic Node in the knowledge graph.
 */
export const CANONICAL_SLUG_ALIASES: Record<string, string> = {
  // Phase 6A Validated True Coexisting Duplicates
  'fast-ds-scheme-foreign-assets-of-small-taxpayers-disclosure-scheme-2026': 'cbdt-fast-ds-2026-foreign-assets-of-small-taxpayers-disclosure-scheme',
  'henley-passport-index-february-2026': 'henley-passport-index-2026',
  'bharat-taxi-cooperative-ride-hailing': 'bharat-taxi-cooperative-ride-hailing-platform-launched',
  'rbi-imposes-monetary-penalties-on-multiple-financial-institutions': 'rbi-imposes-monetary-penalties-on-multiple-financial-entities',
  'solid-waste-management-rules-2026-notified': 'moefcc-notifies-solid-waste-management-swm-rules-2026-mandatory-4-stream-segregation',
  '131-padma-awards-2026-announced': 'president-droupadi-murmu-confers-131-padma-awards-2026',
  'government-approves-1-billion-polymer-banknotes-of-10-20': 'government-approves-rbi-field-trials-for-1-billion-polymer-banknotes-10-20',
  '100-fdi-in-insurance-sector-operationalized-under-automatic-route': 'ministry-of-finance-notifies-100-fdi-in-insurance-sector-under-automatic-route',
  'rbi-sets-3-year-cooling-off-for-co-operative-bank-directors-after-10-year-tenure': 'rbi-draft-governance-directions-for-co-operative-banks-3-year-cooling-off',
  'sebi-it-resilience-index-framework-for-market-infrastructure-institutions': 'sebi-scale-based-framework-for-market-infrastructure-it-resilience-index-itri',
  'irdai-regulations-on-ind-as-ind-as-117-implementation-by-insurers': 'irdai-mandates-ind-as-and-ind-as-117-for-all-insurers-from-april-1-2026',
  'sebi-minimum-public-shareholding-mps-timeline': 'ministry-of-finance-restructures-minimum-public-shareholding-mps-slabs',

  // PM Surya Ghar variants
  'adb-850-million-loan-for-pm-surya-ghar': 'pm-surya-ghar-muft-bijli-yojana',
  'pm-surya-ghar-muft-bijli-yojana-crosses-128-crore-registrations-3845-crore-dbt-disbursed': 'pm-surya-ghar-muft-bijli-yojana',
  'world-bank-adb-sign-joint-174-billion-financing-package-for-pm-surya-ghar-muft-bijli-yojana': 'pm-surya-ghar-muft-bijli-yojana',
  'pm-surya-ghar-muft-bijli-yojana-multi-agency-co-financing': 'pm-surya-ghar-muft-bijli-yojana',
  'pm-surya-ghar-solar-financing': 'pm-surya-ghar-muft-bijli-yojana',
  'world-bank-approves-890-million-financing-for-pm-surya-ghar-rooftop-solar': 'pm-surya-ghar-muft-bijli-yojana',

  // PM E-DRIVE variants
  'cabinet-approves-pm-e-drive-scheme-with-outlay-of-10900-crore-for-electric-mobility': 'cabinet-approves-pm-e-drive-scheme-10900-crore-outlay-for-ev-revolution',
  'cabinet-approves-pm-e-drive-scheme-10900-crore-outlay-for-ev-revolution': 'cabinet-approves-pm-e-drive-scheme-10900-crore-outlay-for-ev-revolution',

  // KCC-MISS (Modified Interest Subvention Scheme)
  'cabinet-approves-continuation-of-modified-interest-subvention-scheme-miss-with-127000-crore-allocation': 'modified-interest-subvention-scheme-miss-through-kcc-interest-support-framework',
  'continuation-of-modified-interest-subvention-scheme-miss-through-kcc-127-lakh-crore-outlay': 'modified-interest-subvention-scheme-miss-through-kcc-interest-support-framework',
  'modified-interest-subvention-scheme-miss-through-kcc-interest-support-framework': 'modified-interest-subvention-scheme-miss-through-kcc-interest-support-framework',
  'kcc-miss-assessment-1-investment-generates-230-net-agricultural-value': 'modified-interest-subvention-scheme-miss-through-kcc-interest-support-framework',

  // PM-VBRY (Viksit Bharat Rojgar Yojana)
  'cabinet-approves-pm-vbry-viksit-bharat-rojgar-yojana-with-107-lakh-crore-outlay': 'pradhan-mantri-viksit-bharat-rozgar-yojana-pm-vbry-employment-linked-incentive-scheme',
  'cabinet-approves-pradhan-mantri-viksit-bharat-rozgar-yojana-pm-vbry-107000-crore-outlay': 'pradhan-mantri-viksit-bharat-rozgar-yojana-pm-vbry-employment-linked-incentive-scheme',
  'pradhan-mantri-viksit-bharat-rozgar-yojana-pm-vbry-employment-linked-incentive-scheme': 'pradhan-mantri-viksit-bharat-rozgar-yojana-pm-vbry-employment-linked-incentive-scheme',
  'pradhan-mantri-viksit-bharat-rojgar-yojana-pm-vbry-two-part-incentive-structure': 'pradhan-mantri-viksit-bharat-rozgar-yojana-pm-vbry-employment-linked-incentive-scheme',

  // Jal Jeevan Mission 80% milestone
  'jal-jeevan-mission-reaches-80-rural-tap-water-milestone-155-crore-households-connected': 'jal-jeevan-mission-jjm-achieves-80-rural-household-tap-connection-milestone',
  'jal-jeevan-mission-jjm-achieves-80-rural-household-tap-connection-milestone': 'jal-jeevan-mission-jjm-achieves-80-rural-household-tap-connection-milestone',

  // Credit Risk-o-Meter (Canonical: sebi-proposal-colour-coded-credit-risk-o-meter-for-debt-securities)
  'sebi-proposal-colour-coded-credit-risk-o-meter-for-debt-securities': 'sebi-proposal-colour-coded-credit-risk-o-meter-for-debt-securities',
  'sebi-consultation-paper-mandatory-colour-coded-credit-risk-o-meter-for-debt-securities': 'sebi-proposal-colour-coded-credit-risk-o-meter-for-debt-securities',
  'sebi-proposes-colour-coded-credit-risk-o-meter-for-debt-securities': 'sebi-proposal-colour-coded-credit-risk-o-meter-for-debt-securities',

  // PosTransfer
  'india-post-launches-postransfer-mobile-remittance-service': 'department-of-posts-launches-postransfer-instant-digital-money-order-service',
  'department-of-posts-launches-postransfer-instant-digital-money-order-service': 'department-of-posts-launches-postransfer-instant-digital-money-order-service',

  // E-Samudra
  'ministry-of-ports-launches-e-samudra-maritime-single-window-portal': 'ministry-of-ports-shipping-waterways-launches-e-samudra-maritime-single-window-portal',
  'ministry-of-ports-shipping-waterways-launches-e-samudra-maritime-single-window-portal': 'ministry-of-ports-shipping-waterways-launches-e-samudra-maritime-single-window-portal',

  // PLFS 2025-26
  'mospi-releases-annual-periodic-labour-force-survey-plfs-202526-unemployment-rate-drops-to-31': 'mospi-releases-annual-periodic-labour-force-survey-plfs-202526',
  'mospi-releases-annual-periodic-labour-force-survey-plfs-202526': 'mospi-releases-annual-periodic-labour-force-survey-plfs-202526',

  // Reimagining Care / Demographic Transition
  'niti-aayog-transform-rural-india-release-reimagining-care-report-for-rural-elderly': 'transform-rural-india-tri-study-70-of-indias-347-million-elderly-to-live-in-rural-areas-by-2050',
  'transform-rural-india-tri-study-70-of-indias-347-million-elderly-to-live-in-rural-areas-by-2050': 'transform-rural-india-tri-study-70-of-indias-347-million-elderly-to-live-in-rural-areas-by-2050',

  // Parichha Thermal Power Expansion
  'up-govt-approves-2800-mw-parichha-thermal-power-expansion-18400-crore': 'up-govt-ntpc-sign-agreement-for-2800-mw-parichha-thermal-power-plant-expansion',
  'up-govt-ntpc-sign-agreement-for-2800-mw-parichha-thermal-power-plant-expansion': 'up-govt-ntpc-sign-agreement-for-2800-mw-parichha-thermal-power-plant-expansion',

  // FSSAI Food Safety on Wheels (FSW) / NABL
  'fssai-deploys-100-mobile-food-testing-labs-food-safety-on-wheels-with-nabl-accreditation': 'fssai-deploys-100-nabl-accredited-food-safety-on-wheels-fsw-mobile-testing-labs',
  'fssai-deploys-100-nabl-accredited-food-safety-on-wheels-fsw-mobile-testing-labs': 'fssai-deploys-100-nabl-accredited-food-safety-on-wheels-fsw-mobile-testing-labs',

  // Shabnam Sinha World Bank Appointment
  'shabnam-sinha-world-bank-appointment': 'appointments-governance-transitions-august-817-2026',

  // RBI Loan Recovery Directions
  'rbi-defers-revised-loan-recovery-recovery-agent-directions-to-january-1-2027': 'rbi-loan-recovery-directions-financed-smartphone-lockout-norms',
  'rbi-loan-recovery-directions-financed-smartphone-lockout-norms': 'rbi-loan-recovery-directions-financed-smartphone-lockout-norms',

  // PMJDY
  'india-achieves-9992-banking-coverage-5877-crore-pmjdy-accounts-with-312-lakh-crore-balance': 'pm-jan-dhan-yojana-pmjdy-12-year-milestones-317-lakh-crore-deposits-across-59-crore-accounts',
  'pm-jan-dhan-yojana-pmjdy-12-year-milestones-317-lakh-crore-deposits-across-59-crore-accounts': 'pm-jan-dhan-yojana-pmjdy-12-year-milestones-317-lakh-crore-deposits-across-59-crore-accounts',

  // Tribunals Reforms Bill 2026
  'parliament-passes-tribunals-reforms-bill-2026-national-tribunals-commission-formed': 'tribunals-reforms-bill-2026-mandates-national-tribunals-data-grid-ntdg',
  'tribunals-reforms-bill-2026-mandates-national-tribunals-data-grid-ntdg': 'tribunals-reforms-bill-2026-mandates-national-tribunals-data-grid-ntdg',

  // Maldives Favara + UPI
  'maldives-favara-linkage': 'cross-border-payments-maldives-favara-leftrightarrow-india-upi-corridor',
  'maldives-favara-india-upi-corridor': 'cross-border-payments-maldives-favara-leftrightarrow-india-upi-corridor',

  // SEBI Incident Reporting / FSB FIRE / Cyber Suraksha
  'sebi-cyber-suraksha-portal': 'sebi-incident-reporting-portal-fsb-fire-cyber-suraksha-portal',
  'sebi-incident-reporting-portal-fsb-fire-cyber-suraksha-portal': 'sebi-incident-reporting-portal-fsb-fire-cyber-suraksha-portal',

  // 61st RBI MPC Meeting (June)
  '61st-rbi-monetary-policy-committee-mpc-meeting-repo-rate-held-at-525-neutral-stance': '61st-rbi-monetary-policy-committee-mpc-meeting-repo-rate-held-at-525-fpi-g-sec-limit-overhaul',
  '61st-rbi-monetary-policy-committee-mpc-meeting-repo-rate-held-at-525-fpi-g-sec-limit-overhaul': '61st-rbi-monetary-policy-committee-mpc-meeting-repo-rate-held-at-525-fpi-g-sec-limit-overhaul',

  // RBI Lending to REITs/InvITs (June)
  'rbi-permits-commercial-bank-lending-to-reits-and-invits': 'rbi-final-directions-commercial-bank-lending-to-real-estate-investment-trusts-reits-invits',
  'rbi-final-directions-commercial-bank-lending-to-real-estate-investment-trusts-reits-invits': 'rbi-final-directions-commercial-bank-lending-to-real-estate-investment-trusts-reits-invits',

  // RBI Corporate Governance in Commercial Banks (June)
  'rbi-master-directions-on-corporate-governance-risk-internal-audit-in-commercial-banks-jan-1-2027': 'rbi-master-directions-on-control-assurance-corporate-governance-in-commercial-banks',
  'rbi-master-directions-on-control-assurance-corporate-governance-in-commercial-banks': 'rbi-master-directions-on-control-assurance-corporate-governance-in-commercial-banks',

  // RBI TReDS Net Worth Mandate (June)
  'rbi-final-directions-on-trade-receivables-discounting-system-treds-2026-25-cr-net-worth-mandate': 'rbi-final-directions-on-trade-receivables-discounting-system-treds-platform-net-worth',
  'rbi-final-directions-on-trade-receivables-discounting-system-treds-platform-net-worth': 'rbi-final-directions-on-trade-receivables-discounting-system-treds-platform-net-worth',

  // Surha Tal 100th Ramsar Site (June)
  'surha-tal-100th-ramsar-site': 'jai-prakash-narayan-bird-sanctuary-surha-tal-up-designated-indias-100th-ramsar-site',
  'jai-prakash-narayan-bird-sanctuary-surha-tal-designated-100th-ramsar-site': 'jai-prakash-narayan-bird-sanctuary-surha-tal-up-designated-indias-100th-ramsar-site',
  'jai-prakash-narayan-bird-sanctuary-surha-tal-up-designated-indias-100th-ramsar-site': 'jai-prakash-narayan-bird-sanctuary-surha-tal-up-designated-indias-100th-ramsar-site',

  // Airbus C-295 (June)
  'first-made-in-india-airbus-c-295': '1st-made-in-india-airbus-c295-completes-maiden-test-flight-at-vadodara-tasl',
  '1st-made-in-india-airbus-c295-completes-maiden-test-flight-at-vadodara-tasl': '1st-made-in-india-airbus-c295-completes-maiden-test-flight-at-vadodara-tasl',

  // UN Sustainable Development Report 2026 (June/July)
  'un-sustainable-development-report-2026-sdsn': 'un-sustainable-development-report-2026-india-ranks-94th-globally-score-683',
  'un-sustainable-development-report-2026-india-ranks-94th-globally-score-683': 'un-sustainable-development-report-2026-india-ranks-94th-globally-score-683',

  // Global Peace Index 2026 (June)
  'global-peace-index-2026-iep-sydney': 'global-peace-index-2026-iep-sydney',

  // UNCTAD World Investment Report (July)
  'unctad-world-investment-report-2026-india-ranks-11th-in-global-fdi': 'unctad-world-investment-report-2026-india-climbs-to-11th-largest-global-fdi-recipient',
  'unctad-world-investment-report-2026-india-climbs-to-11th-largest-global-fdi-recipient': 'unctad-world-investment-report-2026-india-climbs-to-11th-largest-global-fdi-recipient',

  // MoSPI Index of Services Production (July)
  'mospi-introduces-index-of-services-production-isp-with-base-year-202425': 'mospi-launches-trial-index-of-services-production-isp-with-base-year-202425',
  'mospi-launches-trial-index-of-services-production-isp-with-base-year-202425': 'mospi-launches-trial-index-of-services-production-isp-with-base-year-202425',

  // NSE Energy Derivative (July)
  'nse-energy-derivative': 'nse-launches-indias-1st-domestically-benchmarked-energy-derivative-indian-natural-gas-futures',
  'nse-launches-indias-1st-domestically-benchmarked-energy-derivative-indian-natural-gas-futures': 'nse-launches-indias-1st-domestically-benchmarked-energy-derivative-indian-natural-gas-futures',

  // SEBI Commodity ETF Framework (June)
  'sebi-revised-commodity-etf-framework-dynamic-price-bands-pre-open-auction': 'sebi-revised-commodity-etf-framework-dynamic-price-bands-pre-open-auctions',
  'sebi-revised-commodity-etf-framework-dynamic-price-bands-pre-open-auctions': 'sebi-revised-commodity-etf-framework-dynamic-price-bands-pre-open-auctions',

  // Skyroot Vikram-1 (July)
  'skyroot-aerospace-vikram-1-mission-aagaman': 'skyroot-aerospace-launches-vikram-1-orbital-rocket-on-mission-aagaman',
  'skyroot-aerospace-launches-vikram-1-orbital-rocket-on-mission-aagaman': 'skyroot-aerospace-launches-vikram-1-orbital-rocket-on-mission-aagaman',

  // India Hydrogen Train (July)
  'indias-first-hydrogen-train': 'pm-narendra-modi-inaugurates-indias-1st-hydrogen-train-namo-green-rail-jind-haryana',
  'pm-narendra-modi-inaugurates-indias-1st-hydrogen-train-namo-green-rail-jind-haryana': 'pm-narendra-modi-inaugurates-indias-1st-hydrogen-train-namo-green-rail-jind-haryana',

  // UNCCD COP17
  'unccd-cop17': 'unccd-cop17-at-ulaanbaatar-12-billion-rangelands-flagship-initiative-launched'
};

/**
 * Returns the canonical slug for any variant slug or title.
 */
export function resolveCanonicalSlug(slug: string): string {
  if (CANONICAL_SLUG_ALIASES[slug]) {
    return CANONICAL_SLUG_ALIASES[slug];
  }
  return slug;
}

/**
 * Merges incoming topic into an existing canonical topic.
 * Preserves the union of all legitimate facts, sources, updates, and active months without duplication.
 */
export function mergeCanonicalTopics(existing: CanonicalTopic, incoming: CanonicalTopic): CanonicalTopic {
  // 1. Source References Union
  const existingSourceKeys = new Set(existing.sourceReferences.map(s => `${s.sourceName}:${s.batchName}`));
  for (const src of incoming.sourceReferences) {
    const key = `${src.sourceName}:${src.batchName}`;
    if (!existingSourceKeys.has(key)) {
      existing.sourceReferences.push(src);
      existingSourceKeys.add(key);
    }
  }

  // 2. Active in Months Union
  existing.activeInMonths = Array.from(
    new Set([...(existing.activeInMonths || []), ...(incoming.activeInMonths || [])])
  ).sort();

  // 3. Must Memorize Facts Union (normalized deduplication)
  const existingFactSet = new Set(existing.mustMemorizeFacts.map(f => f.toLowerCase().replace(/[^\w]/g, '')));
  for (const fact of incoming.mustMemorizeFacts) {
    const norm = fact.toLowerCase().replace(/[^\w]/g, '');
    if (!existingFactSet.has(norm)) {
      existing.mustMemorizeFacts.push(fact);
      existingFactSet.add(norm);
    }
  }

  // 4. What Happened Union
  const existingWhatSet = new Set((existing.whatHappened || []).map(w => w.toLowerCase().replace(/[^\w]/g, '')));
  for (const item of (incoming.whatHappened || [])) {
    const norm = item.toLowerCase().replace(/[^\w]/g, '');
    if (!existingWhatSet.has(norm)) {
      if (!existing.whatHappened) existing.whatHappened = [];
      existing.whatHappened.push(item);
      existingWhatSet.add(norm);
    }
  }

  // 5. Context & Exam Focus Union
  if (incoming.knowUnderstandContext && incoming.knowUnderstandContext.length > 0) {
    if (!existing.knowUnderstandContext) existing.knowUnderstandContext = [];
    for (const ctx of incoming.knowUnderstandContext) {
      if (!existing.knowUnderstandContext.includes(ctx)) {
        existing.knowUnderstandContext.push(ctx);
      }
    }
  }

  // 6. Priority Upgrade (Keep highest priority)
  const priorityRank: Record<string, number> = {
    'P1_CRITICAL_DEEP': 5,
    'P1_CRITICAL_MEMORIZE': 4,
    'P2_HIGH': 3,
    'P3_MODERATE': 2,
    'P4_LOW_YIELD': 1
  };
  if (priorityRank[incoming.priority] > priorityRank[existing.priority]) {
    existing.priority = incoming.priority;
    existing.revisionMinutes = Math.max(existing.revisionMinutes, incoming.revisionMinutes);
  }

  // 7. Updates History Union
  if (incoming.updatesHistory && incoming.updatesHistory.length > 0) {
    existing.updatesHistory = [...(existing.updatesHistory || []), ...incoming.updatesHistory];
  }

  // 8. Verification Status
  if (existing.sourceReferences.length >= 2 && existing.verificationStatus === 'SOURCE_ONLY') {
    existing.verificationStatus = 'CROSS_SOURCE_CORROBORATED';
  }

  // 9. Last Updated Date
  if (incoming.lastUpdatedDate > existing.lastUpdatedDate) {
    existing.lastUpdatedDate = incoming.lastUpdatedDate;
  }

  return existing;
}

/**
 * Explicit Phase 6A Validated Priority Remediations
 * 4 Validated P1 -> P2 Downgrades
 * 14 Validated P2/P3 -> P1 Upgrades
 */
export const CANONICAL_PRIORITY_OVERRIDES: Record<string, { priority: PriorityLevel; revisionMinutes: number }> = {
  // 14 Validated P2/P3 -> P1 Upgrades
  'd-sib-framework-rbi-leverage-ratio-buffer': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 },
  'rbi-credit-valuation-adjustment-cva-risk-capital-framework': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 },
  'sebi-swagat-fi-framework-for-trusted-foreign-investors': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 },
  'rbi-principle-based-resolution-framework-for-natural-calamity-hit-loans': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 },
  'rbi-monetary-policy-relief-up-to-25000-compensation-for-small-digital-fraud-victims': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 },
  'rbi-consolidated-e-mandate-framework-15000-auto-pay-1-lakh-limit-for-sipsinsurance': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 },
  'rbi-guidelines-for-faster-cross-border-inward-payments-nostro-reconciliation': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 },
  'rbi-utkarsh-2029-medium-term-strategic-framework-for-20262029': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 },
  'irdai-revises-information-security-cybersecurity-governance-guidelines': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 },
  'epfo-30-framework-75-corpus-access-upi-withdrawals-e-praapti-portal': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 },
  'rbi-draft-guidelines-inclusion-of-quarterly-profits-in-bank-cet1-capital': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 },
  'rbi-draft-framework-on-smartphone-disabling-recovery-code-of-conduct': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 },
  'rbi-bank-locker-guidelines-negligence-liability-cap': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 },
  'rbi-expands-credit-derivatives-framework-credit-default-swaps-cds-total-return-swaps': { priority: 'P1_CRITICAL_DEEP', revisionMinutes: 8 }
};

