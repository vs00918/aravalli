import { CanonicalTopic, InformationType, CompressionLevel } from './schema';

/**
 * Classifies a canonical topic into one of the 28 controlled Information Types.
 * Strictly independent of Subject Domain, Priority, and Presentation.
 */
export function classifyInformationType(topic: CanonicalTopic): InformationType {
  const title = topic.title.toLowerCase();
  const cat = topic.primaryCategory;
  const combined = `${topic.title} ${(topic.mustMemorizeFacts || []).join(' ')} ${(topic.whatHappened || []).join(' ')}`.toLowerCase();

  // 1. First in India / World (Superlatives / Historical Firsts)
  if (/\b(1st in india|first in india|india's 1st|india's first|first-ever in india|first indian|1st indian|1st woman|first woman|1st port|1st state|1st to operationalise|first to operationalise)\b/i.test(title)) {
    return 'FIRST_IN_INDIA';
  }
  if (/\b(1st in world|first in world|world's 1st|world's first|global first|1st globally|first globally)\b/i.test(title)) {
    return 'FIRST_IN_WORLD';
  }

  // 2. RAMSAR Sites & GI Tags
  if (/\b(ramsar|wetland)\b/i.test(title)) {
    return 'RAMSAR';
  }
  if (/\b(gi tag|gi tags|geographical indication|gi-tagged)\b/i.test(title)) {
    return 'GI';
  }

  // 3. Appointments, Resignations & Leadership Transitions
  if (
    cat === 'APPOINTMENTS' ||
    /\b(appoint[a-z]*|chairperson|chairman|chief of|president|ceo|cmd|director general|governor|re-elected|assumes charge|nominated to|vice-chancellor|foreign deputation|deputations? approved|acc approved|acc clears)\b/i.test(title)
  ) {
    return 'APPOINTMENT';
  }

  // 4. Awards & Honors (Excluding competitive sporting trophies/medals)
  if (
    /\b(award|awards|prize|jnanpith|medal|honour|conferred|green oscars|whitley|order of the|wolf prize|khel ratna|padma|swaminathan award|anubhav awards)\b/i.test(title) &&
    !/\b(cup|trophy|championship|tournament|olympic|commonwealth|games|wimbledon|squash|chess|fide|cricket|hockey|badminton|athletics|table tennis)\b/i.test(title)
  ) {
    return 'AWARD';
  }

  // 5. Sports Events & Tournaments
  if (
    cat === 'SPORTS_AND_AWARDS' ||
    /\b(olympic|commonwealth|cwg|glasgow|wimbledon|games|trophy|cup|championship|tournament|squash|chess|fide|cricket|hockey|badminton|athletics|table tennis|fih|saff|durand cup|medal tally|sports|fields medals)\b/i.test(title)
  ) {
    return 'SPORTS_EVENT';
  }

  // 6. Defence Exercises vs Defence Systems / Hardware
  if (/\b(exercise|pitch black|khaan quest|varuna|malabar|nomadic elephant|maitri|sampriti|yudh abhyas|garuda|corpat)\b/i.test(title)) {
    return 'DEFENCE_EXERCISE';
  }
  if (/\b(missile|frigate|warship|submarine|destroyer|radar|air defence|torpedo|drdo tests|artillery|ignite|pinaka|akash|brahmos|qrsam|vessels?|patrol vessel|ngopv|shruti|loiter munitions?|munitions?|drone|armoured vehicle|iaf fighter)\b/i.test(title)) {
    return 'DEFENCE_SYSTEM';
  }

  // 7. Space, Science Discovery & Deep-Tech
  if (/\b(isro|nasa|satellite|trishna|space|lunar|moon|chandrayaan|gaganyaan|sun mission|aditya|exoplanet|james webb)\b/i.test(title)) {
    return 'SPACE';
  }
  if (/\b(supercomputer|supercomputing|param pragya|quantum|discovery|fossil|new species|fusion reactor|nanobots|breast cancer therapy|csir-nbri|prakriti gyan dham|iisc)\b/i.test(title)) {
    return 'SCIENCE_DISCOVERY';
  }
  if (/\b(technology|data centre|v2v|c-v2x|ais-230|5g|6g|semiconductor|hydrogen train|digital platform|e-samudra|portal|app|mobile app|gramin gyan setu|rsvc-amrit|cpgrams|samadhan didi|vyoma\.ai|together ai|speech ai|sraVaani|i4c|e-zero firs?)\b/i.test(title)) {
    return 'TECHNOLOGY';
  }

  // 8. Genuine Observance Days vs Institutional Milestones
  // Semantic Rule: "Anniversary" with financial milestones (₹, crore, GMV) is an ECONOMIC_DEVELOPMENT / DATA_RELEASE, NOT an Important Day!
  const hasFinancialMilestone = /\b(₹|crore|lakh crore|gmv|turnover|disbursement|exports? rise|exports? grow)\b/i.test(title);
  if (
    !hasFinancialMilestone &&
    ((title.includes('day') && (title.includes('world') || title.includes('international') || title.includes('national') || title.includes('theme') || title.includes('observed') || title.includes('organ donation') || title.includes('handloom day'))) ||
     /\b(\d+(?:st|nd|rd|th)?\s+(?:indian|national|world|international)\s+[a-z\s]+day)\b/i.test(title))
  ) {
    return 'IMPORTANT_DAY';
  }
  if (title.includes('passed away') || title.includes('obituary') || title.includes('dies at')) {
    return 'PERSON_IN_NEWS';
  }

  // 9. MoUs, Bilateral Agreements & Strategic Pacts
  if (
    /\b(mou|bilateral agreement|signed pact|strategic alliance|ties up with|partners with|joint crediting mechanism|pax silica|ai pacts|aaeri|degreverify|loan agreement)\b/i.test(title) &&
    !title.includes('exercise') && !title.includes('games')
  ) {
    return 'MoU';
  }
  if (/\b(conference|summit|conclave|symposium|assembly|meeting of|dialogue|forum)\b/i.test(title)) {
    return 'CONFERENCE';
  }

  // 10. Indices, Rankings & Reports
  if (/\b(index|ranking|ranked|score|sdg index|peace index|passport index|gender gap|air power|hurun|brand finance|epi 2026)\b/i.test(title)) {
    return title.includes('ranking') || title.includes('ranked') ? 'RANKING' : 'INDEX';
  }
  if (/\b(report|survey|bulletin|world economic outlook|plfs|census|evaluation report|outlook|workforce report)\b/i.test(title)) {
    return 'REPORT';
  }

  // 11. Economic Data Releases & Institutional Volume Milestones
  if (
    /\b(gdp|inflation|cpi|wpi|ppi|double deflation|debt-to-gdp|trade deficit|forex reserves|gst collection|sovereign rating|fitch|moody|exports rise|exports fell|exports grow|milestone|₹[\d,]+\s*(?:lakh|crore|cr)?\s*milestone)\b/i.test(title)
  ) {
    return 'DATA_RELEASE';
  }

  // 12. Regulations vs Banking Developments
  if (
    cat === 'MONETARY_POLICY' ||
    cat === 'BANKING_REGULATION' ||
    cat === 'CAPITAL_MARKETS' ||
    /\b(master direction|prudential norm|scale-based regulation|nbfc-ul|d-sib|basel iii|leverage ratio|expected credit loss|ecl|repo rate|mpc|on-tap licensing|ad category-ii|trai|fssai|sebi notifies|buyback framework|irdai master framework|psl sub-target|lockout norms|recovery directions|sim card rule|dot rule)\b/i.test(title)
  ) {
    return 'REGULATION';
  }

  if (
    cat === 'DIGITAL_PAYMENTS' ||
    cat === 'INSURANCE_SECTOR' ||
    /\b(bank|banking|savings max|tier-ii bonds|cross-border payment|favara|upi|cbdc|rupay|unclaimed deposits|dea fund|lic|hdfc|canara bank|repco bank|blue bonds|bank credit milestone)\b/i.test(title)
  ) {
    return 'BANKING_DEVELOPMENT';
  }

  // 13. Government Schemes & Public Programmes
  if (
    cat === 'GOVERNMENT_SCHEMES' ||
    /\b(pm-kisan|pmay|pm-svanidhi|svanidhi|pm-vbry|viksit bharat rojgar|pm-ssy|surya sarovar|pm surya ghar|gobardhan|pm e-drive|pm-kusum|khelo india|ansf|my bharat|yojana|scheme|cgsmfi|nps e-shramik|pm-sym|shram yogi maandhan|bharatnet)\b/i.test(title)
  ) {
    return 'SCHEME';
  }
  if (/\b(mission|abhiyan|programme|program|initiative|jug jug jiyo|samudra manthan|paimana|palna|urban challenge fund|ucf|natural farming centres|ras facility)\b/i.test(title)) {
    return 'PROGRAMME';
  }

  // 14. Policies, Acts, Executive Orders vs International Relations
  if (/\b(bill|act|policy|amendment|rules|nipu-2026|framework|guidelines|evidence act|tribunals reforms|unfair means|notified calamities|sdrf|ndrf|executive orders?|cbam)\b/i.test(title)) {
    return 'POLICY';
  }
  if (/\b(bilateral|diplomacy|icc|rome statute|treaty|unsc|nauru|naoero|venezuela|corridor|e-visa|ports of entry|birthright citizenship|china|zhejiang)\b/i.test(title)) {
    return 'INTERNATIONAL_RELATION';
  }

  // 15. Macro / Institutional Developments & Architecture
  if (
    cat === 'MACRO_ECONOMY' ||
    /\b(economic development|sez|special economic zones?|investment|loan agreement|thermal power|cochin shipyard|delivery|epfo|member id)\b/i.test(title)
  ) {
    return 'ECONOMIC_DEVELOPMENT';
  }

  // 16. Organisational Architecture Changes
  if (/\b(epfo account timelines|member id architecture|restructuring|merger|acquisition)\b/i.test(title)) {
    return 'ORGANISATIONAL_CHANGE';
  }

  return 'OTHER';
}

/**
 * Derives the optimal Compression Level (C0 to C4) independently of Priority.
 */
export function deriveCompressionLevel(topic: CanonicalTopic): CompressionLevel {
  const isP1 = topic.priority.startsWith('P1');
  const isP2 = topic.priority === 'P2_HIGH';
  const isP3 = topic.priority === 'P3_MODERATE';
  const isP4 = topic.priority === 'P4_LOW_YIELD';
  const factCount = (topic.mustMemorizeFacts?.length || 0) + (topic.whatHappened?.length || 0);

  if (isP4) return 'C0';
  if (isP3) return factCount <= 2 ? 'C1' : 'C2';
  if (isP2) return factCount >= 4 || (topic.revisionMinutes && topic.revisionMinutes >= 4) ? 'C3' : 'C2';
  if (isP1) return factCount >= 5 || (topic.revisionMinutes && topic.revisionMinutes >= 6) ? 'C4' : 'C3';

  return 'C2';
}

/**
 * Generates an Atomic Recall Flashcard String (A -> B -> C) from canonical facts.
 */
export function generateAtomicRecall(topic: CanonicalTopic): string {
  const cleanTitle = topic.title.replace(/\s*\(~?\d+\s*min\)/gi, '').trim();
  const firstFact = topic.mustMemorizeFacts?.[0] || topic.whatHappened?.[0] || '';

  // Extract key numerical metric or entity from first fact
  const metricMatch = firstFact.match(/(?:₹\s*[\d,]+(?:\.\d+)?\s*(?:crore|lakh|cr|trn)?|\$[\d,]+(?:\.\d+)?\s*(?:billion|million|B|M)?|\d+(?:\.\d+)?%|#[0-9]+|\b(?:1st|2nd|3rd|4th|5th|10th|100th|101st)\b)/i);
  const metric = metricMatch ? metricMatch[0] : '';

  // Extract key date or institution if available
  const dateMatch = firstFact.match(/\b(?:\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}|\d{4})\b/i);
  const date = dateMatch ? dateMatch[0] : '';

  if (metric && date) {
    return `${cleanTitle} → ${metric} → ${date}`;
  }
  if (metric) {
    return `${cleanTitle} → ${metric}`;
  }
  return `${cleanTitle}`;
}

/**
 * Generates Memory Anchors (ALL-CAPS High-Contrast Retrieval Cues).
 */
export function generateMemoryAnchor(topic: CanonicalTopic): string {
  const cleanTitle = topic.title
    .replace(/\s*\(~?\d+\s*min\)/gi, '')
    .replace(/[^\w\s-]/g, '')
    .trim();

  const words = cleanTitle.split(/\s+/).filter(w => w.length > 2);
  const anchorWords = words.slice(0, 5).map(w => w.toUpperCase());

  return anchorWords.join(' → ');
}

/**
 * Generates Exam Angles highlighting likely question types and MCQ traps.
 */
export function generateExamAngle(topic: CanonicalTopic): {
  likelyAsks?: string[];
  possibleMcq?: string;
  numericalTarget?: string;
  implementingAgency?: string;
} {
  const combined = `${topic.title} ${(topic.mustMemorizeFacts || []).join(' ')}`;
  const likelyAsks: string[] = [];

  if (/₹\s*[\d,]+(?:\.\d+)?\s*(?:crore|lakh|cr)/i.test(combined)) {
    likelyAsks.push('Financial outlay / budgetary allocation figures');
  }
  if (/\b(nodal agency|ministry|implemented by|department of)\b/i.test(combined)) {
    likelyAsks.push('Implementing nodal ministry or statutory agency');
  }
  if (/\b(effective date|w\.e\.f|deadline|timeline)\b/i.test(combined)) {
    likelyAsks.push('Regulatory effective date / compliance timeline');
  }
  if (/\b(rank|index|score|publisher|released by)\b/i.test(combined)) {
    likelyAsks.push('Global rank of India / benchmark publishing institution');
  }

  return {
    likelyAsks: likelyAsks.length > 0 ? likelyAsks : ['Key factual numbers, dates, and institutional ownership'],
    implementingAgency: topic.primaryInstitution !== 'OTHER' ? topic.primaryInstitution : undefined
  };
}
