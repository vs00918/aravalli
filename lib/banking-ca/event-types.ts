import { CanonicalTopic } from './schema';

export type EventType =
  | 'Monetary Policy'
  | 'Regulation / Master Direction'
  | 'Regulatory Approval'
  | 'Prudential Norm'
  | 'Banking Development'
  | 'Insurance Development'
  | 'Payment System'
  | 'Government Scheme'
  | 'Government Policy'
  | 'Economic Data'
  | 'Report'
  | 'Index / Ranking'
  | 'Appointment'
  | 'Award'
  | 'MoU'
  | 'Bilateral Agreement'
  | 'Acquisition / Investment'
  | 'Corporate Partnership'
  | 'First / Record'
  | 'GI Tag'
  | 'Science / Technology'
  | 'Defence'
  | 'Space'
  | 'Sports'
  | 'Important Day'
  | 'Person in News'
  | 'PIB / Notification'
  | 'Static GK'
  | 'Other';

/**
 * Derives the semantic Event Type of a topic independently from its Primary Subject or Category.
 */
export function identifyEventType(topic: CanonicalTopic): EventType {
  const title = topic.title.toLowerCase();
  const cat = topic.primaryCategory;
  const combined = `${topic.title} ${(topic.mustMemorizeFacts || []).join(' ')} ${(topic.whatHappened || []).join(' ')}`.toLowerCase();

  // 1. Monetary Policy
  if (
    cat === 'MONETARY_POLICY' ||
    /\b(monetary policy|mpc meeting|repo rate|standing deposit facility|sdf rate|msf rate|bank rate|cash reserve ratio|statutory liquidity ratio)\b/i.test(title)
  ) {
    return 'Monetary Policy';
  }

  // 2. Prudential Norms / Risk / Capital Adequacy
  if (
    /\b(d-sib|basel iii|pillar 3|leverage ratio|crar|capital adequacy|expected credit loss|ecl|cva risk|scale-based regulation|nbfc-ul|risk weight|rwa|anbc deduction|concentration norms)\b/i.test(title)
  ) {
    return 'Prudential Norm';
  }

  // 3. Regulatory Approvals & Stake / Acquisitions
  if (
    /\b(approves acquisition|approval to raise stake|clears stake|approves merger|approves license|approves licence|in-principle approval|approves take over)\b/i.test(title) ||
    (title.includes('rbi approval') || title.includes('sebi approval') || title.includes('irdai approves'))
  ) {
    return 'Regulatory Approval';
  }

  // 4. Acquisitions & Corporate Investments
  if (
    /\b(acquires|acquisition|buys stake|raises stake|invests \$|funding commitment|equity investment|takeover)\b/i.test(title) &&
    !title.includes('approval')
  ) {
    return 'Acquisition / Investment';
  }

  // 5. Appointments & Personnel Changes
  if (
    cat === 'APPOINTMENTS' ||
    /\b(appoint[a-z]*|chairperson|chairman|chief of|president|ceo|cmd|re-elected|assumes charge|nominated to|acting central vigilance commissioner|director general|governor)\b/i.test(title)
  ) {
    return 'Appointment';
  }

  // 6. GI Tags
  if (
    /\b(gi tag|geographical indication|gi-tagged)\b/i.test(title)
  ) {
    return 'GI Tag';
  }

  // 7. Awards & Honors
  if (
    /\b(award|prize|jnanpith|medal|honour|conferred|green oscars|whitley|order of the|wolf prize|khel ratna|padma)\b/i.test(title) &&
    !title.includes('exercise') &&
    !title.includes('games') &&
    !title.includes('championship')
  ) {
    return 'Award';
  }

  // 8. Sports Tournaments & Records
  if (
    cat === 'SPORTS_AND_AWARDS' ||
    /\b(olympic|commonwealth|wimbledon|games|trophy|cup|championship|tournament|squash|chess|fide|cricket|hockey|badminton|athletics|table tennis|fih|saff|durand cup)\b/i.test(title)
  ) {
    return 'Sports';
  }

  // 9. Reports & Indices / Rankings
  if (
    cat === 'REPORTS_AND_INDICES' ||
    /\b(index|ranking|ranked|score|survey|liveability|passport index|future skills|sdg index|peace index|world investment report|economic outlook|cppi|gender gap|air power)\b/i.test(title)
  ) {
    return 'Index / Ranking';
  }
  if (/\b(report|edition|state of world|yearbook|prospects report)\b/i.test(title)) {
    return 'Report';
  }

  // 10. Important Days & Obituaries
  if (title.includes('day') && (title.includes('world') || title.includes('international') || title.includes('national') || title.includes('theme'))) {
    return 'Important Day';
  }
  if (title.includes('passed away') || title.includes('obituary') || title.includes('dies at')) {
    return 'Person in News';
  }

  // 11. Government Schemes & Missions
  if (
    cat === 'GOVERNMENT_SCHEMES' ||
    /\b(yojana|pm-surya|pm-kisan|gramodyam|subvention|outlay|surya ghar|surya sarovar|samudra manthan|maha water|senehjori|shikhar|shatayu|jal sanrakshit|bharatnet)\b/i.test(title)
  ) {
    return 'Government Scheme';
  }

  // 12. Government Policy & Acts / Bills
  if (
    /\b(policy|bill|act 2023|act 2025|act 2026|ordinance|guidelines for|rules 2026|framework for|national investment policy|dpdp act|bankers' books evidence)\b/i.test(title)
  ) {
    return 'Government Policy';
  }

  // 13. MoUs & Bilateral Agreements
  if (
    /\b(mou|bilateral agreement|signed pact|strategic alliance|joint crediting mechanism|pax silica|ai pacts)\b/i.test(title)
  ) {
    return 'MoU';
  }
  if (/\b(ties up with|partners with|partnered with|collaboration with)\b/i.test(title)) {
    return 'Corporate Partnership';
  }

  // 14. Payment Systems & Fintech
  if (
    cat === 'DIGITAL_PAYMENTS' ||
    /\b(upi|cbdc|rupay|khqr|cross-border payment|credit-on-upi|bharatpe flex|star nps|drunix|tokenisation|pso|payment system operator)\b/i.test(title)
  ) {
    return 'Payment System';
  }

  // 15. Regulations & Master Directions
  if (
    /\b(master directions|master framework|regulations 2026|directions 2026|on-tap licensing|buyback framework|qtp|scores 2.0|smartphone lock|loan recovery|dea fund|snfa|lockout)\b/i.test(title) ||
    title.includes('rbi issues') || title.includes('sebi notifies') || title.includes('irdai master')
  ) {
    return 'Regulation / Master Direction';
  }

  // 16. Insurance Developments
  if (
    cat === 'INSURANCE_SECTOR' ||
    /\b(insurance|irdai|protec|bmip|maritime insurance|dark patterns in insurance|pepf)\b/i.test(title)
  ) {
    return 'Insurance Development';
  }

  // 17. Banking Developments
  if (
    cat === 'BANKING_REGULATION' ||
    /\b(bank|banking|nbfc|ucb|sfb|deposit growth|fcnr|kakinada|treds|sro|sahamati|locker liability)\b/i.test(title)
  ) {
    return 'Banking Development';
  }

  // 18. Economic Data & Macro Statistics
  if (
    cat === 'MACRO_ECONOMY' ||
    /\b(cpi inflation|wpi|gdp growth|exports|imports|forex reserves|fdi inflow|current account deficit|cad|tax collection|gst)\b/i.test(title)
  ) {
    return 'Economic Data';
  }

  // 19. Defence, Space & Science
  if (/\b(missile|exercise|pitch black|khaan quest|navy|air force|army|warship|submarine|defence|frigate)\b/i.test(title)) {
    return 'Defence';
  }
  if (/\b(isro|nasa|satellite|trishna|maven|space|lunar|moon)\b/i.test(title)) {
    return 'Space';
  }
  if (cat === 'DEFENCE_AND_SCIENCE' || /\b(ai|supercomputer|anchor|quantum|hydrogen train|data centre)\b/i.test(title)) {
    return 'Science / Technology';
  }

  // 20. Static GK
  if (
    /\b(ramsar site|wetland|national park|sanctuary|temple|presses|spmcil|brbnmpl|nhb capital|fiu-ind mandate|world bank group|unsc members|european union|eurozone)\b/i.test(title)
  ) {
    return 'Static GK';
  }

  return 'Other';
}
