import { CanonicalTopic } from './schema';
import { identifyEventType, EventType } from './event-types';

export type RoutingConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface SemanticRoutingResult {
  sectionId: string;
  sectionNumber: string;
  sectionTitle: string;
  eventType: EventType;
  confidence: RoutingConfidence;
  classificationReason: string;
  isReviewRequired: boolean;
}

export interface MagazineSectionMeta {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  accentColor: string;
}

export const MAGAZINE_SECTIONS: MagazineSectionMeta[] = [
  {
    id: 'sec-1',
    number: '01',
    title: 'ESI, FINANCE & BUSINESS NEWS',
    shortTitle: 'Finance & Economy',
    icon: '💰',
    description: 'Macroeconomic trends, GDP, fiscal policies, markets, trade, and corporate developments',
    accentColor: 'emerald'
  },
  {
    id: 'sec-2',
    number: '02',
    title: 'REGULATORY BODIES NEWS',
    shortTitle: 'Regulators (RBI/SEBI/IRDAI)',
    icon: '🏛️',
    description: 'Master directions, prudential norms, statutory circulars, and licensing frameworks',
    accentColor: 'indigo'
  },
  {
    id: 'sec-3',
    number: '03',
    title: 'BANKING & INSURANCE NEWS',
    shortTitle: 'Banking & Insurance',
    icon: '🏦',
    description: 'Commercial banks, SFBs, UCBs, NBFCs, digital payments, pensions, and insurance',
    accentColor: 'blue'
  },
  {
    id: 'sec-4',
    number: '04',
    title: 'NATIONAL, STATE & INTERNATIONAL NEWS',
    shortTitle: 'National & Global',
    icon: '🌐',
    description: 'National policies, state initiatives, bilateral relations, and global summit diplomacy',
    accentColor: 'sky'
  },
  {
    id: 'sec-5',
    number: '05',
    title: 'MoUs, CONFERENCES & APPOINTMENTS',
    shortTitle: 'MoUs & Appointments',
    icon: '🤝',
    description: 'Strategic bilateral partnerships, leadership appointments, and global conferences',
    accentColor: 'violet'
  },
  {
    id: 'sec-6',
    number: '06',
    title: 'SCIENCE, TECHNOLOGY, DEFENCE & SPORTS',
    shortTitle: 'Sci-Tech & Defence',
    icon: '🔬',
    description: 'Space missions, AI, defense exercises, missile tests, and sporting championships',
    accentColor: 'amber'
  },
  {
    id: 'sec-7',
    number: '07',
    title: 'AWARDS, BOOKS, INDICES & RANKINGS',
    shortTitle: 'Awards & Rankings',
    icon: '🏆',
    description: 'Global benchmark indices, national honors, literary awards, and prominent publications',
    accentColor: 'yellow'
  },
  {
    id: 'sec-8',
    number: '08',
    title: 'IMPORTANT DAYS & PERSONS IN NEWS',
    shortTitle: 'Important Days',
    icon: '📅',
    description: 'UN/National observances, annual themes, milestones, and prominent figures',
    accentColor: 'rose'
  },
  {
    id: 'sec-9',
    number: '09',
    title: 'PIB, CIRCULARS & NOTIFICATIONS',
    shortTitle: 'PIB & Circulars',
    icon: '📋',
    description: 'Union Cabinet decisions, official gazette notifications, and statutory releases',
    accentColor: 'teal'
  },
  {
    id: 'sec-10',
    number: '10',
    title: 'MISCELLANEOUS — GOVT SCHEMES & STATIC',
    shortTitle: 'Schemes & Static GK',
    icon: '📌',
    description: 'Central welfare schemes, outlays, GI tags, Ramsar wetlands, and institutional static GK',
    accentColor: 'slate'
  }
];

/**
 * Deterministic Semantic Routing Decision Tree V2.
 * Strictly enforces domain boundaries and eliminates the Section 04 fallback sink.
 */
export function routeTopicSemantically(topic: CanonicalTopic): SemanticRoutingResult {
  const title = topic.title.toLowerCase();
  const slug = topic.slug.toLowerCase();
  const eventType = identifyEventType(topic);
  const cat = topic.primaryCategory;
  const combined = `${topic.title} ${(topic.mustMemorizeFacts || []).join(' ')} ${(topic.whatHappened || []).join(' ')}`.toLowerCase();

  const makeResult = (
    secId: string,
    ev: EventType,
    conf: RoutingConfidence,
    reason: string
  ): SemanticRoutingResult => {
    const sec = MAGAZINE_SECTIONS.find(s => s.id === secId)!;
    return {
      sectionId: sec.id,
      sectionNumber: sec.number,
      sectionTitle: sec.title,
      eventType: ev,
      confidence: conf,
      classificationReason: reason,
      isReviewRequired: conf === 'LOW'
    };
  };

  // =========================================================================
  // 1. OFFICIAL IMPLEMENTATION INSTRUMENTS (Section 09)
  // Gazette commencement orders, Office Memorandums (OMs), Quality Control Orders (QCOs),
  // statutory notifications where the instrument itself is the primary exam object.
  // =========================================================================
  const isOfficialInstrument =
    /\b(statutory notification|gazette notification|office memorandum|general financial rules|gfr amendment|quality control order|qco mandate|commencement notification|s\.o\.\s*\d+|statutory order|public examinations.*commencement)\b/i.test(title) &&
    !title.includes('pm-kisan') && !title.includes('pmay') && !title.includes('svanidhi');

  if (isOfficialInstrument) {
    return makeResult(
      'sec-9',
      'PIB / Notification',
      'HIGH',
      'Official statutory instrument, gazette commencement order, or administrative Office Memorandum.'
    );
  }

  // =========================================================================
  // 2. APPOINTMENTS, MoUs & CONFERENCES (Section 05)
  // Personnel postings, ACC cleared foreign deputations, institutional partnerships.
  // =========================================================================
  if (
    eventType === 'Appointment' ||
    cat === 'APPOINTMENTS' ||
    /\b(appoint[a-z]*|chairperson|chairman|chief of|president|ceo|cmd|director general|governor|re-elected|assumes charge|nominated to|vice-chancellor|foreign deputation|acc approved|acc clears|acc)\b/i.test(title)
  ) {
    return makeResult(
      'sec-5',
      'Appointment',
      'HIGH',
      'Personnel appointment, leadership transition, or ACC-cleared deputation.'
    );
  }

  if (
    eventType === 'MoU' ||
    eventType === 'Bilateral Agreement' ||
    eventType === 'Corporate Partnership' ||
    (/\b(mou|bilateral agreement|signed pact|strategic alliance|ties up with|partners with|joint crediting mechanism|pax silica|ai pacts|aaeri|degreverify)\b/i.test(title) &&
     !title.includes('exercise') && !title.includes('games'))
  ) {
    return makeResult(
      'sec-5',
      eventType === 'Bilateral Agreement' ? 'Bilateral Agreement' : 'MoU',
      'HIGH',
      'Institutional MoU, strategic bilateral partnership, or summit alliance.'
    );
  }

  // =========================================================================
  // 3. IMPORTANT DAYS & PERSONS IN NEWS (Section 08)
  // =========================================================================
  if (
    eventType === 'Important Day' ||
    eventType === 'Person in News' ||
    (title.includes('day') && (title.includes('world') || title.includes('international') || title.includes('national') || title.includes('theme') || title.includes('observed') || title.includes('organ donation'))) ||
    title.includes('passed away') || title.includes('obituary') || title.includes('dies at') || title.includes('centenary')
  ) {
    return makeResult(
      'sec-8',
      title.includes('passed away') || title.includes('obituary') ? 'Person in News' : 'Important Day',
      'HIGH',
      'National/International observance, annual theme, or prominent obituary/person milestone.'
    );
  }

  // =========================================================================
  // 4. AWARDS, BOOKS, INDICES & RANKINGS (Section 07 vs Section 01 / 10)
  // =========================================================================
  const isAward =
    eventType === 'Award' ||
    (/\b(award|prize|jnanpith|medal|honour|conferred|green oscars|whitley|order of the|wolf prize|khel ratna|padma|swaminathan award)\b/i.test(title) &&
     !/\b(cup|trophy|championship|tournament|olympic|commonwealth|games|wimbledon|squash|chess|fide|cricket|hockey|badminton|athletics|table tennis)\b/i.test(title));

  if (isAward) {
    return makeResult('sec-7', 'Award', 'HIGH', 'Recognised national/international award or honour.');
  }

  // Substantive scheme evaluation reports (e.g. KCC-MISS) belong to Section 10 (Government Schemes)
  if (title.includes('kcc-miss') || title.includes('kcc-modified interest subvention') || (title.includes('interest subvention') && title.includes('evaluation'))) {
    return makeResult(
      'sec-10',
      'Government Scheme',
      'HIGH',
      'KCC-MISS evaluation report is substantively a central agricultural credit subvention scheme; routed to Section 10.'
    );
  }

  // Economic surveys, census & labour reports belong to ESI / Section 01, NOT Section 07
  const isEconomicLabourReport =
    /\b(plfs|labour force|employment|unemployment|gdp|ppi|producer price index|double deflation|world economic outlook|debt-to-gdp|inflation|cpi|wpi|fast-ds|handloom census|sovereign rating|fitch|moody|s&p rating)\b/i.test(title);

  if (isEconomicLabourReport) {
    return makeResult(
      'sec-1',
      'Economic Data',
      'HIGH',
      'Substantive macroeconomic/labour data, sovereign rating, or economic methodology report; routed to Section 01.'
    );
  }

  if (
    eventType === 'Index / Ranking' ||
    eventType === 'Report' ||
    cat === 'REPORTS_AND_INDICES' ||
    /\b(index|ranking|ranked|score|survey|liveability|passport index|future skills|sdg index|peace index|world investment report|cppi|gender gap|air power|hurun india|brand finance|epi 2026|environmental performance)\b/i.test(title)
  ) {
    return makeResult(
      'sec-7',
      'Index / Ranking',
      'HIGH',
      'Global benchmark index, comparative institutional ranking, or composite index publication.'
    );
  }

  // =========================================================================
  // 5. SPORTS, DEFENCE, SPACE & SCIENCE / VEHICULAR TECH (Section 06)
  // =========================================================================
  const isGeMProcurement = /\b(gem|government e-marketplace)\b/i.test(title);
  if (!isGeMProcurement) {
    if (
      eventType === 'Sports' ||
      cat === 'SPORTS_AND_AWARDS' ||
      /\b(olympic|commonwealth|cwg|glasgow|wimbledon|games|trophy|cup|championship|tournament|squash|chess|fide|cricket|hockey|badminton|athletics|table tennis|fih|saff|durand cup|medal tally|sports)\b/i.test(title)
    ) {
      return makeResult('sec-6', 'Sports', 'HIGH', 'Sporting championship, tournament, medal tally, or athletic record.');
    }

    if (
      eventType === 'Defence' ||
      eventType === 'Space' ||
      eventType === 'Science / Technology' ||
      cat === 'DEFENCE_AND_SCIENCE' ||
      /\b(isro|nasa|satellite|trishna|space|lunar|moon|missile|pitch black|khaan quest|defence|navy|air force|army|warship|frigate|submarine|machilipatnam|nipun|supercomputer|anchor|quantum|hydrogen train|data centre|vehicle-to-vehicle|v2v|c-v2x|ais-230)\b/i.test(title)
    ) {
      return makeResult(
        'sec-6',
        eventType === 'Defence' ? 'Defence' : eventType === 'Space' ? 'Space' : 'Science / Technology',
        'HIGH',
        'Defence exercise, space mission, missile test, wireless/ITS vehicular tech, or core science milestone.'
      );
    }
  }

  // =========================================================================
  // 6. PIB, STATUTORY CIRCULARS & GAZETTE NOTIFICATIONS (Section 09)
  // Official ministry circulars, gazette notifications, quality control orders (QCO), office memorandums (OM), and statutory advisories.
  // =========================================================================
  const isPaymentOrBanking = /\b(upi|cbdc|rupay|cross-border payment|favara|bank|banking|deposit|nbfc)\b/i.test(title);

  const isOfficialCircularOrGazette =
    !isPaymentOrBanking &&
    /\b(statutory notification|gazette notification|office memorandum|\bom\b|quality control order|qco|sim card rule|dot sim|e-visa.*ports of entry|national security buffer|i4c|boss scam|pib notification|statutory circular)\b/i.test(title);

  if (isOfficialCircularOrGazette) {
    return makeResult(
      'sec-9',
      'PIB / Notification',
      'HIGH',
      'Official statutory gazette notification, ministry circular, cybersecurity advisory, or regulatory order.'
    );
  }

  // =========================================================================
  // 7. NATIONAL LEGISLATION, STATE INITIATIVES & GLOBAL GEOPOLITICS (Section 04)
  // Parliamentary acts/bills, state projects, national policy summits, and bilateral geopolitics
  // =========================================================================
  const isNationalStateInternational =
    !isPaymentOrBanking &&
    /\b(tribunals reforms bill|tribunals|bankers' books evidence|registration of births and deaths|public examinations.*bill|mekedatu|gandhi sarovar|haryana|bihar|assam|maharashtra|tamil nadu|gujarat.*farming|gramin gyan setu|red fort|independence day|nauru|naoero|venezuela|rome statute|icc|donald trump|birthright citizenship|typhoon dolphin|zhejiang|voc port|harit sagar|border renewable|nepal rastra bank|indian notes|sco|iora|g7|unsc|diplomacy|summit|economic corridor|transport corridor|urban challenge fund|ucf|e-zero fir|e-samudra)\b/i.test(title);

  if (isNationalStateInternational) {
    return makeResult(
      'sec-4',
      'Government Policy',
      'HIGH',
      'National legislation, state governance project, bilateral diplomacy, or international geopolitics.'
    );
  }

  // =========================================================================
  // 7. GOVERNMENT SCHEMES & STATIC GK (Section 10)
  // Central/State welfare schemes, missions, credit subventions, outlays, Ramsar, GI tags.
  // =========================================================================
  const isGovtScheme =
    eventType === 'Government Scheme' ||
    cat === 'GOVERNMENT_SCHEMES' ||
    /\b(pm-kisan|pmay|pm-svanidhi|svanidhi|pm-vbry|viksit bharat rojgar|pm-ssy|surya sarovar|pm surya ghar|samudra manthan|gobardhan|pm e-drive|pm-kusum|khelo india|ansf|ethanol interest subvention|my bharat|nasha mukt yuva|vcf-sc|rec-sc|ras facility|trout ras|rsvc-amrit|rutage|gramodyam|senehjori|maha water|shikhar|shatayu|jal sanrakshit|bharatnet|palna|paimana|yojana|scheme|mission|abhiyan)\b/i.test(title);

  if (isGovtScheme) {
    return makeResult(
      'sec-10',
      'Government Scheme',
      'HIGH',
      'Central/State welfare scheme, mission, credit subvention programme, or programme milestone.'
    );
  }

  if (
    eventType === 'GI Tag' ||
    eventType === 'Static GK' ||
    /\b(gi tag[s]?|geographical indication[s]?|gi-tagged|pithora|bihu pepa|jasdan patari|khurasani imli|ramsar|surha tal|parichha weir|whis|wetland|sanctuary|heritage site|temple|lake|dam|mela|presses|spmcil|brbnmpl|nhb capital|fiu-ind mandate|world bank group|unsc members|european union|eurozone)\b/i.test(title)
  ) {
    return makeResult(
      'sec-10',
      title.includes('gi tag') || title.includes('geographical indication') ? 'GI Tag' : 'Static GK',
      'HIGH',
      'Static GK institutional profile, Ramsar wetland, heritage irrigation structure, or GI tag registration/policy.'
    );
  }

  // =========================================================================
  // 7. REGULATORY BODIES (Section 02)
  // Statutory regulatory authorities: RBI, SEBI, IRDAI, PFRDA, IFSCA, TRAI, FSSAI, MCA (accounting norms).
  // =========================================================================
  const isRegulatoryBodyAction =
    eventType === 'Monetary Policy' ||
    eventType === 'Prudential Norm' ||
    eventType === 'Regulation / Master Direction' ||
    cat === 'MONETARY_POLICY' ||
    cat === 'CAPITAL_MARKETS' ||
    /\b(62nd rbi|mpc meeting|repo rate|standing deposit facility|on-tap licensing|scale-based regulation|nbfc-ul|smartphone lock|d-sib|basel iii|pillar 3|leverage ratio buffer|expected credit loss|ecl|cva risk|ad category-ii|ad-ii|trai|1601 series|1600 series|fssai|hfss thresholds|mca accounting rules|ind as|oecd pillar two|sebi notifies|buyback framework|qtp|scores 2.0|commodity etf|aif liquidation|irdai master framework|intermediaries governance|dpdp act|data protection board|pfrda star nps|pride-disha|pension sahayak|ifsca|psl sub-target|priority sector lending)\b/i.test(title);

  if (isRegulatoryBodyAction) {
    return makeResult(
      'sec-2',
      eventType === 'Monetary Policy' ? 'Monetary Policy' : eventType === 'Prudential Norm' ? 'Prudential Norm' : 'Regulation / Master Direction',
      'HIGH',
      'Substantive regulatory framework, master direction, prudential norm, licensing authorization, or statutory regulatory standards.'
    );
  }

  // =========================================================================
  // 8. BANKING & INSURANCE NEWS (Section 03)
  // Commercial bank operations, retail products, debt bonds, deposit stats (DEA fund), payments corridors.
  // =========================================================================
  const isBankingInsuranceDevelopment =
    eventType === 'Banking Development' ||
    eventType === 'Insurance Development' ||
    eventType === 'Payment System' ||
    eventType === 'Regulatory Approval' ||
    eventType === 'Acquisition / Investment' ||
    cat === 'BANKING_REGULATION' ||
    cat === 'INSURANCE_SECTOR' ||
    cat === 'DIGITAL_PAYMENTS' ||
    cat === 'PENSION_SYSTEMS' ||
    /\b(bank|banking|nbfc|ucb|sfb|insurance|upi|cbdc|rupay|cross-border payment|favara|bharatpe flex|credit-on-upi|drunix|tokenisation|fcnr|reits|invits|treds|sro|sahamati|lic|hdfc bank|savings max|magma|bmip|protec|bank of baroda|canara bank|repco bank|kakinada|lead bank|ldm|locker liability|dea fund|unclaimed deposits)\b/i.test(title);

  if (isBankingInsuranceDevelopment) {
    return makeResult(
      'sec-3',
      eventType === 'Payment System' ? 'Payment System' : eventType === 'Insurance Development' ? 'Insurance Development' : 'Banking Development',
      'HIGH',
      'Commercial banking operations, retail deposit products, unclaimed balances (DEA Fund), digital payment corridor, or institution transaction.'
    );
  }

  // =========================================================================
  // 9. ESI, FINANCE & BUSINESS NEWS (Section 01)
  // Macroeconomics, trade/forex, sovereign credit, GeM, industrial clusters (TMZ), project finance (REC/PFC), bonds, corporate branding/exports.
  // =========================================================================
  const isEsiFinanceBusiness =
    isGeMProcurement ||
    eventType === 'Economic Data' ||
    cat === 'MACRO_ECONOMY' ||
    /\b(gdp|inflation|cpi|wpi|ppi|double deflation|tax|revenue|budget|disinvestment|exports|imports|fdi|currency|forex|crude|petroleum|corporate|market cap|valuation|billionaires|sez|nipu|urea|mineral exchange|sdrf|ndrf|rec & pfc|pfc ₹26,850|meja thermal|blue bonds|sagarmala finance|telecom manufacturing zone|tmz|gwalior|sprite tejas|tejas express|cochin shipyard|ms maria|schiffahrts|cbam|eu cbam)\b/i.test(title);

  if (isEsiFinanceBusiness) {
    return makeResult(
      'sec-1',
      isGeMProcurement ? 'Government Policy' : eventType === 'Economic Data' ? 'Economic Data' : 'Government Policy',
      'HIGH',
      'Macroeconomic indicator, trade data, industrial cluster, corporate project financing, bond issue, or commercial logistics export.'
    );
  }

  // =========================================================================
  // 10. REVIEW QUEUE (ZERO SILENT SECTION 04 OR 10 SINK)
  // If an item reaches here, it is explicitly flagged with LOW confidence for mentor review.
  // =========================================================================
  return makeResult(
    'sec-4',
    'Other',
    'LOW',
    'ROUTING_REVIEW_REQUIRED: Unresolved domain boundary; requires manual mentor inspection.'
  );
}
