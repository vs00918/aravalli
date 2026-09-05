import fs from 'fs';
import path from 'path';
import {
  CanonicalTopic,
  IngestionBatch,
  PriorityLevel,
  CategoryId,
  InstitutionId
} from './schema';
import {
  classifyInformationType,
  deriveCompressionLevel,
  generateMemoryAnchor,
  generateAtomicRecall,
  generateExamAngle
} from './information-types';

export function generateStableSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function identifyInstitution(title: string, content: string): InstitutionId {
  const text = `${title} ${content}`.toUpperCase();
  if (text.includes('RESERVE BANK OF INDIA') || text.includes('RBI')) return 'RBI';
  if (text.includes('SECURITIES AND EXCHANGE BOARD OF INDIA') || text.includes('SEBI')) return 'SEBI';
  if (text.includes('IRDAI') || text.includes('INSURANCE REGULATORY')) return 'IRDAI';
  if (text.includes('PFRDA') || text.includes('PENSION FUND')) return 'PFRDA';
  if (text.includes('NPCI') || text.includes('NATIONAL PAYMENTS CORPORATION')) return 'NPCI';
  if (text.includes('IFSCA') || text.includes('GIFT CITY')) return 'IFSCA';
  if (text.includes('MINISTRY OF FINANCE') || text.includes('FINMIN')) return 'MINISTRY_OF_FINANCE';
  if (text.includes('EXIM BANK')) return 'EXIM_BANK';
  if (text.includes('NABARD')) return 'NABARD';
  if (text.includes('SIDBI')) return 'SIDBI';
  if (text.includes('NCGTC')) return 'NCGTC';
  if (text.includes('WORLD BANK') || text.includes('IMF') || text.includes('ADB') || text.includes('BIS') || text.includes('FATF')) return 'INTERNATIONAL_BODIES';
  return 'OTHER';
}

export function normalizeCategoryString(catStr: string): CategoryId | null {
  if (!catStr) return null;
  const upper = catStr.toUpperCase().trim();
  if (upper.includes('MONETARY') || upper.includes('MPC') || upper.includes('REPO')) return 'MONETARY_POLICY';
  if (upper.includes('DIGITAL PAYMENT') || upper.includes('UPI') || upper.includes('CBDC') || upper.includes('POSTRANSFER')) return 'DIGITAL_PAYMENTS';
  if (upper.includes('CAPITAL MARKET') || upper.includes('SEBI') || upper.includes('COMMODITY') || upper.includes('BOND') || upper.includes('SETTLEMENT')) return 'CAPITAL_MARKETS';
  if (upper.includes('INSURANCE') || upper.includes('IRDAI') || upper.includes('THIRD-PARTY')) return 'INSURANCE_SECTOR';
  if (upper.includes('PENSION') || upper.includes('PFRDA') || upper.includes('NPS') || upper.includes('APY')) return 'PENSION_SYSTEMS';
  if (upper.includes('SCHEME') || upper.includes('YOJANA') || upper.includes('BIOENERGY') || upper.includes('GOBARDHAN') || upper.includes('WELFARE') || upper.includes('MISSION') || upper.includes('ABHIYAN')) return 'GOVERNMENT_SCHEMES';
  if (upper.includes('BANKING') || upper.includes('REGULATION') || upper.includes('COOPERATIVE') || upper.includes('CO-OPERATIVE') || upper.includes('EXIM') || upper.includes('NABARD') || upper.includes('SIDBI') || upper.includes('MSMED')) return 'BANKING_REGULATION';
  if (upper.includes('MACRO') || upper.includes('ECONOMY') || upper.includes('FISCAL') || upper.includes('TAX') || upper.includes('INFLATION') || upper.includes('PRODUCER PRICE') || upper.includes('CPI') || upper.includes('WPI') || upper.includes('TRADE') || upper.includes('EXPORT') || upper.includes('SDRF') || upper.includes('NDRF')) return 'MACRO_ECONOMY';
  if (upper.includes('APPOINTMENT') || upper.includes('RESIGNATION') || upper.includes('CHAIRPERSON') || upper.includes('DIRECTOR GENERAL')) return 'APPOINTMENTS';
  if (upper.includes('REPORT') || upper.includes('INDEX') || upper.includes('SURVEY') || upper.includes('RANK') || upper.includes('CENSUS') || upper.includes('PLFS')) return 'REPORTS_AND_INDICES';
  if (upper.includes('DEFENCE') || upper.includes('SCIENCE') || upper.includes('SPACE') || upper.includes('TECH') || upper.includes('ISRO') || upper.includes('NASA') || upper.includes('AI') || upper.includes('AMCA')) return 'DEFENCE_AND_SCIENCE';
  if (upper.includes('SPORT') || upper.includes('AWARD') || upper.includes('PRIZE') || upper.includes('GAME') || upper.includes('PADAK') || upper.includes('CHAMPIONSHIP')) return 'SPORTS_AND_AWARDS';
  if (upper.includes('NATIONAL') || upper.includes('STATE') || upper.includes('WETLAND') || upper.includes('RAMSAR') || upper.includes('TRIBUNAL') || upper.includes('PARICHHA')) return 'NATIONAL_AND_STATES';
  if (upper.includes('INTERNATIONAL') || upper.includes('BILATERAL') || upper.includes('SACU') || upper.includes('FOREIGN')) return 'INTERNATIONAL_AFFAIRS';
  return null;
}

export function sanitizeTitle(rawTitle: string): string {
  if (!rawTitle) return '';
  return rawTitle
    .trim()
    .replace(/\s*\(\~?\s*\d+\s*min\)\s*(\*\*)?$/i, '$1') // Strip trailing time annotation (e.g. (~3 min))
    .replace(/^(\*\*|`)+|(\*\*|`)+$/g, '')               // Strip outer markdown bold (**) and code backticks (`)
    .replace(/\s*\(\~?\s*\d+\s*min\)\s*$/i, '')          // Strip trailing time annotation if previously inside bolding
    .trim();
}

function identifyCategory(title: string, content: string): CategoryId {
  const tUpper = title.toUpperCase();

  // 1. High-precision match against title first
  if (tUpper.includes('MONETARY POLICY') || tUpper.includes('REPO RATE') || tUpper.includes('MPC MEETING') || tUpper.includes('62ND RBI')) return 'MONETARY_POLICY';
  if (tUpper.includes('UPI') || tUpper.includes('CBDC') || tUpper.includes('POSTRANSFER') || tUpper.includes('FASTAG') || tUpper.includes('DIGITAL PAYMENT') || tUpper.includes('DIGITAL RUPEE') || tUpper.includes('123PAY') || tUpper.includes('MULEHUNTER')) return 'DIGITAL_PAYMENTS';
  if (tUpper.includes('CREDIT RISK-O-METER') || tUpper.includes('SETTLEMENT REGULATIONS') || tUpper.includes('SEBI') || tUpper.includes('DEBT SECURITIES') || tUpper.includes('MUTUAL FUND') || tUpper.includes('COMMODITY EXCHANGE') || tUpper.includes('MCX') || tUpper.includes('NISM') || tUpper.includes('JIO CREDIT') || tUpper.includes('FICP') || tUpper.includes('ITRI') || tUpper.includes('FTSE')) return 'CAPITAL_MARKETS';
  if (tUpper.includes('MOTOR THIRD PARTY') || tUpper.includes('THIRD-PARTY INSURANCE') || tUpper.includes('IRDAI') || tUpper.includes('INSURANCE') || tUpper.includes('BIMA') || tUpper.includes('MAHARAJAH INR BONDS')) return 'INSURANCE_SECTOR';
  if (tUpper.includes('PENSION') || tUpper.includes('PFRDA') || tUpper.includes('NPS') || tUpper.includes('APY') || tUpper.includes('PM-SYM') || tUpper.includes('ANUBHAV')) return 'PENSION_SYSTEMS';
  if (tUpper.includes('GOBARDHAN') || tUpper.includes('PM-KISAN') || tUpper.includes('PM E-DRIVE') || tUpper.includes('PM-VBRY') || tUpper.includes('JAL JEEVAN') || tUpper.includes('PM SVANIDHI') || tUpper.includes('AYUSHMAN BHARAT') || tUpper.includes('AB-PMJAY') || tUpper.includes('PM VISHWAKARMA') || tUpper.includes('SANDHYA KIRAN') || tUpper.includes('PM-RKVY') || tUpper.includes('KRISHONNATI') || tUpper.includes('SCHEME') || tUpper.includes('YOJANA') || tUpper.includes('MISSION') || tUpper.includes('ABHIYAN') || tUpper.includes('UREA') || tUpper.includes('NIPU') || tUpper.includes('NATIONAL INVESTMENT POLICY') || tUpper.includes('GOVERNMENT E-MARKETPLACE') || tUpper.includes('GEM 10TH') || tUpper.includes('LAKHPATI')) return 'GOVERNMENT_SCHEMES';
  if (tUpper.includes('ON TAP LICENSING') || tUpper.includes('MSMED') || tUpper.includes('EXIM BANK') || tUpper.includes('NCDC') || tUpper.includes('SYNTHETIC SECURITISATION') || tUpper.includes('URBAN COOPERATIVE') || tUpper.includes('UCB') || tUpper.includes('NBFC') || tUpper.includes('BANK') || tUpper.includes('BANKING') || tUpper.includes('BASEL') || tUpper.includes('KCC') || tUpper.includes('KISAN CREDIT CARD') || tUpper.includes('DEPOSIT GROWTH') || tUpper.includes('D-SIB') || tUpper.includes('LEVERAGE RATIO') || tUpper.includes('LOAN RECOVERY') || tUpper.includes('RECOVERY DIRECTIONS') || tUpper.includes('BSBD') || tUpper.includes('LRS') || tUpper.includes('NRI DEPOSIT')) return 'BANKING_REGULATION';
  if (tUpper.includes('PRODUCER PRICE INDEX') || tUpper.includes('DOUBLE DEFLATION') || tUpper.includes('CPI INFLATION') || tUpper.includes('WPI') || tUpper.includes('GDP') || tUpper.includes('FAST-DS') || tUpper.includes('WINDFALL TAX') || tUpper.includes('SEZ EXPORTS') || tUpper.includes('SPECIAL ECONOMIC ZONE') || tUpper.includes('SEZ') || tUpper.includes('FOREIGN ASSETS') || tUpper.includes('GOVERNMENT DEBT') || tUpper.includes('MINERAL EXCHANGE') || tUpper.includes('SDRF') || tUpper.includes('NDRF') || tUpper.includes('FISCAL') || tUpper.includes('TAXATION') || tUpper.includes('FOREIGN TRADE POLICY') || tUpper.includes('FTP') || tUpper.includes('EXPORT HOUSE') || tUpper.includes('SUGAR IMPORT') || tUpper.includes('FDI') || tUpper.includes('SOVEREIGN RATING') || tUpper.includes('HOUSE PRICE INDEX')) return 'MACRO_ECONOMY';
  if (tUpper.includes('APPOINTS') || tUpper.includes('APPOINTED') || tUpper.includes('CHAIRPERSON') || tUpper.includes('CHAIRMAN') || tUpper.includes('STEP DOWN') || tUpper.includes('VICE-CHANCELLOR') || tUpper.includes('RE-ELECTED AS PRESIDENT') || tUpper.includes('ARBITRATOR')) return 'APPOINTMENTS';
  if (tUpper.includes('PLFS') || tUpper.includes('LABOUR FORCE') || tUpper.includes('REPORT') || tUpper.includes('SURVEY') || tUpper.includes('INDEX') || tUpper.includes('PAIMANA') || tUpper.includes('REBR') || tUpper.includes('RANDSTAD') || tUpper.includes('HANDLOOM CENSUS') || tUpper.includes('CENSUS OF INDIA') || tUpper.includes('HOUSEHOLD SCHEDULE') || tUpper.includes('NOWCASTING') || tUpper.includes('CENSUS 2027') || tUpper.includes('NEET') || tUpper.includes('DEMOGRAPHIC TRANSITION')) return 'REPORTS_AND_INDICES';
  if (tUpper.includes('AMCA') || tUpper.includes('COMBAT ENGINE') || tUpper.includes('LOITER MUNITION') || tUpper.includes('FALCON 9') || tUpper.includes('SPACEX') || tUpper.includes('MOON BASE') || tUpper.includes('NASA') || tUpper.includes('ISRO') || tUpper.includes('SATELLITE') || tUpper.includes('SRAVAANI') || tUpper.includes('SEMICON') || tUpper.includes('AI FACTORY') || tUpper.includes('CYBER') || tUpper.includes('DEFENCE') || tUpper.includes('NAVY') || tUpper.includes('AIR FORCE') || tUpper.includes('EXERCISE') || tUpper.includes('UDARA SHAKTI') || tUpper.includes('MAITREE') || tUpper.includes('LUNAR ROVER') || tUpper.includes('DLI SCHEME') || tUpper.includes('VIHAAN') || tUpper.includes('BHASHINI') || tUpper.includes('PRAHAAR') || tUpper.includes('FIGHTER JET') || tUpper.includes('BAAZ') || tUpper.includes('AK-203') || tUpper.includes('SAMARTHAK') || tUpper.includes('NIPUN') || tUpper.includes('AVIONICS') || tUpper.includes('GCAP') || tUpper.includes('ROTATING DETONATION') || tUpper.includes('TELESCOPE') || tUpper.includes('SOIL TEXTURE')) return 'DEFENCE_AND_SCIENCE';
  if (tUpper.includes('SARVOTTAM JEEVAN RAKSHA') || tUpper.includes('SANGEET NATAK AKADEMI') || tUpper.includes('GAJ GAURAV') || tUpper.includes('SWAMINATHAN AWARD') || tUpper.includes('AWARD') || tUpper.includes('MEDAL') || tUpper.includes('CHAMPIONSHIP') || tUpper.includes('FENCING') || tUpper.includes('CHESS') || tUpper.includes('SINQUEFIELD') || tUpper.includes('ESPORTS') || tUpper.includes('WTA') || tUpper.includes('CANADIAN OPEN') || tUpper.includes('TROPHY') || tUpper.includes('GALLANTRY') || tUpper.includes('ANUBHAV AWARD') || tUpper.includes('PMIS INDUSTRY') || tUpper.includes('HOCKEY WORLD CUP') || tUpper.includes('GRAND CHESS') || tUpper.includes('DURAND CUP') || tUpper.includes('DIAMOND LEAGUE') || tUpper.includes('ASIAN GAMES') || tUpper.includes('COMMONWEALTH GAMES') || tUpper.includes('FIFA')) return 'SPORTS_AND_AWARDS';
  if (tUpper.includes('LEBANON') || tUpper.includes('SACU') || tUpper.includes('PREFERENTIAL TRADE') || tUpper.includes('HACKATHON') || tUpper.includes('INTERNATIONAL') || tUpper.includes('PEACOCK DIPLOMACY') || tUpper.includes('DEATH PENALTY') || tUpper.includes('TRANSSHIPMENT') || tUpper.includes('BRICS') || tUpper.includes('SCO SUMMIT') || tUpper.includes('UNCCD') || tUpper.includes('UZBEKISTAN')) return 'INTERNATIONAL_AFFAIRS';
  if (tUpper.includes('MEDIATION COUNCIL') || tUpper.includes('TRIBUNAL') || tUpper.includes('DPDP') || tUpper.includes('DATA PROTECTION') || tUpper.includes('AMARAVATI') || tUpper.includes('DMRC') || tUpper.includes('SAMRIDDH GAON')) return 'NATIONAL_AND_STATES';

  // 2. Fallback to broad content match
  const text = `${title} ${content}`.toUpperCase();
  if (text.includes('MONETARY POLICY') || text.includes('REPO RATE') || text.includes('MPC')) return 'MONETARY_POLICY';
  if (text.includes('SCHEME') || text.includes('YOJANA') || text.includes('GOBARDHAN') || text.includes('SUBSIDY') || text.includes('PRADHAN MANTRI')) return 'GOVERNMENT_SCHEMES';
  if (text.includes('LICENSING') || text.includes('PRUDENTIAL') || text.includes('NBFC') || text.includes('UCB') || text.includes('BASEL') || text.includes('BANKING')) return 'BANKING_REGULATION';
  if (text.includes('CAPITAL MARKET') || text.includes('MUTUAL FUND') || text.includes('EQUITY') || text.includes('DERIVATIVE') || text.includes('SEBI')) return 'CAPITAL_MARKETS';
  if (text.includes('UPI') || text.includes('FASTAG') || text.includes('DIGITAL PAYMENT') || text.includes('CBDC')) return 'DIGITAL_PAYMENTS';
  if (text.includes('INSURANCE') || text.includes('PREMIUM') || text.includes('IRDAI')) return 'INSURANCE_SECTOR';
  if (text.includes('PENSION') || text.includes('NPS') || text.includes('APY')) return 'PENSION_SYSTEMS';
  if (text.includes('APPOINTED') || text.includes('CHAIRMAN') || text.includes('GOVERNOR') || text.includes('CEO')) return 'APPOINTMENTS';
  if (text.includes('INDEX') || text.includes('REPORT') || text.includes('RANKING') || text.includes('SURVEY')) return 'REPORTS_AND_INDICES';
  if (text.includes('GDP') || text.includes('INFLATION') || text.includes('CPI') || text.includes('WPI') || text.includes('FISCAL')) return 'MACRO_ECONOMY';
  if (text.includes('DEFENCE') || text.includes('MISSILE') || text.includes('EXERCISE') || text.includes('ISRO') || text.includes('SATELLITE')) return 'DEFENCE_AND_SCIENCE';
  if (text.includes('OLYMPIC') || text.includes('CHAMPIONSHIP') || text.includes('MEDAL') || text.includes('AWARD')) return 'SPORTS_AND_AWARDS';

  return 'NATIONAL_AND_STATES';
}

export function parseCanonicalMarkdownFile(
  filePath: string,
  batchId: string,
  sourceDefault: 'CGB_MENTORS' | 'SMARTKEEDA' | 'PIB' | 'OFFICIAL_GAZETTE' | 'OTHER',
  chronologicalMonth: string,
  chronologicalWeek: string
): { topics: CanonicalTopic[]; batch: IngestionBatch } {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  const topics: CanonicalTopic[] = [];
  let currentPart: 'P1' | 'P2' | 'P3' | 'IGNORE' | 'REPORT' | 'NONE' = 'NONE';
  let currentTopic: Partial<CanonicalTopic> | null = null;
  let currentSubSection: 'WHAT_HAPPENED' | 'MUST_MEMORIZE' | 'KNOW_UNDERSTAND' | 'EXAM_FOCUS' | 'NONE' = 'NONE';
  let topicMarkdownBuffer: string[] = [];

  const flushCurrentTopic = () => {
    if (currentTopic && currentTopic.title) {
      const mustMem = (currentTopic.mustMemorizeFacts && currentTopic.mustMemorizeFacts.length > 0)
        ? currentTopic.mustMemorizeFacts
        : (currentTopic.whatHappened && currentTopic.whatHappened.length > 0)
        ? currentTopic.whatHappened
        : [currentTopic.title];

      const slug = currentTopic.slug || generateStableSlug(currentTopic.title);
      const fullMd = topicMarkdownBuffer.join('\n').trim();
      const institution = identifyInstitution(currentTopic.title, fullMd);
      const category = identifyCategory(currentTopic.title, fullMd);

      const priority = currentTopic.priority || (currentPart === 'P1' ? 'P1_CRITICAL_DEEP' : currentPart === 'P2' ? 'P2_HIGH' : 'P3_MODERATE');
      const revMin = currentTopic.revisionMinutes || (currentPart === 'P1' ? 8 : currentPart === 'P2' ? 3 : 1);

      const partialForClassification = {
        title: currentTopic.title,
        priority,
        revisionMinutes: revMin,
        primaryCategory: currentTopic.primaryCategory || category,
        mustMemorizeFacts: mustMem,
        whatHappened: currentTopic.whatHappened || []
      } as any;

      const informationType = classifyInformationType(partialForClassification);
      const compressionLevel = deriveCompressionLevel(partialForClassification);
      const memoryAnchor = generateMemoryAnchor(partialForClassification);
      const atomicRecall = generateAtomicRecall(partialForClassification);
      const examAngle = generateExamAngle(partialForClassification);

      const topic: CanonicalTopic = {
        id: slug,
        slug,
        title: currentTopic.title,
        subtitle: currentTopic.subtitle,
        priority,
        revisionMinutes: revMin,
        primaryCategory: currentTopic.primaryCategory || category,
        secondaryCategories: [],
        primaryInstitution: currentTopic.primaryInstitution || institution,
        regulatoryStatus: currentTopic.regulatoryStatus, // Optional: only if explicitly defined
        verificationStatus: currentTopic.verificationStatus || 'SOURCE_ONLY',

        // V3 Knowledge Architecture Axes
        informationType,
        compressionLevel,
        memoryAnchor,
        atomicRecall,
        examAngle,
        lifecycleStatus: 'ACTIVE',

        whatHappened: currentTopic.whatHappened || [],
        mustMemorizeFacts: mustMem,
        knowUnderstandContext: currentTopic.knowUnderstandContext || [],
        examFocus: currentTopic.examFocus || [],
        optionalFacts: currentTopic.optionalFacts || [],
        initialEventDate: currentTopic.initialEventDate || `${chronologicalMonth}-01`,
        firstPublicationDate: currentTopic.firstPublicationDate || `${chronologicalMonth}-15`,
        lastUpdatedDate: currentTopic.lastUpdatedDate || `${chronologicalMonth}-15`,
        chronologicalMonth,
        eventMonth: currentTopic.eventMonth || chronologicalMonth,
        activeInMonths: [chronologicalMonth],
        chronologicalWeek,
        changeAlert: currentTopic.changeAlert,
        updatesHistory: [],
        relatedTopics: [],
        sourceReferences: [
          {
            sourceName: sourceDefault,
            batchName: path.basename(filePath, '.md'),
            publishedDate: `${chronologicalMonth}-15`
          }
        ],
        contentMarkdown: fullMd || currentTopic.title
      };

      topics.push(topic);
    }
    currentTopic = null;
    currentSubSection = 'NONE';
    topicMarkdownBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('PART 1: P1')) {
      flushCurrentTopic();
      currentPart = 'P1';
      continue;
    } else if (line.includes('PART 2: P2')) {
      flushCurrentTopic();
      currentPart = 'P2';
      continue;
    } else if (line.includes('PART 3: P3')) {
      flushCurrentTopic();
      currentPart = 'P3';
      continue;
    } else if (line.includes('PART 4:') || line.includes('LOW YIELD')) {
      flushCurrentTopic();
      currentPart = 'IGNORE';
      continue;
    } else if (line.includes('MENTOR SESSION-END REPORT')) {
      flushCurrentTopic();
      currentPart = 'REPORT';
      continue;
    }

    // Match Topic Headings (Strictly 3 hashes, never 4)
    const h3Match = line.match(/^###\s+(?!#)(\d+[\.\)]\s*)?(.+)/);
    const p2NumMatch = currentPart === 'P2' && line.match(/^(\d+)\.\s*\*\*(.+?)\*\*(\s*\(~?(\d+)\s*min\))?:?/);
    const isP3Metadata = /^[\*\-]?\s*\*\*(Category|Primary Category|Institution|Primary Institution|Priority|Date|Source|Status|Regulatory Status)\*\*:/i.test(line);
    const p3BulletMatch = currentPart === 'P3' && !isP3Metadata ? line.match(/^[\*\-]\s*\*\*(.+?)\*\*:\s*(.+)/) : null;

    if (h3Match && (currentPart === 'P1' || currentPart === 'P2' || currentPart === 'P3')) {
      flushCurrentTopic();
      const rawTitle = h3Match[2].trim();
      const cleanTitle = sanitizeTitle(rawTitle);
      const isDraft = cleanTitle.toUpperCase().includes('DRAFT') || cleanTitle.toUpperCase().includes('PROPOSAL');

      let defaultPriority: PriorityLevel = 'P1_CRITICAL_DEEP';
      let defaultRevTime = 8;
      if (currentPart === 'P2') {
        defaultPriority = 'P2_HIGH';
        defaultRevTime = 3;
      } else if (currentPart === 'P3') {
        defaultPriority = 'P3_MODERATE';
        defaultRevTime = 1;
      }

      currentTopic = {
        title: cleanTitle,
        slug: generateStableSlug(cleanTitle),
        priority: defaultPriority,
        revisionMinutes: defaultRevTime,
        regulatoryStatus: isDraft ? 'DRAFT' : undefined, // Only assign DRAFT if explicit, never default to IMPLEMENTED
        verificationStatus: 'SOURCE_ONLY',
        whatHappened: [],
        mustMemorizeFacts: [],
        knowUnderstandContext: [],
        examFocus: [],
        optionalFacts: []
      };
      currentSubSection = 'NONE';
      topicMarkdownBuffer.push(line);
      continue;
    } else if (p2NumMatch && currentPart === 'P2') {
      flushCurrentTopic();
      const rawTitle = p2NumMatch[2].trim();
      const cleanTitle = sanitizeTitle(rawTitle);
      const revTime = p2NumMatch[4] ? parseInt(p2NumMatch[4], 10) : 3;
      const isDraft = cleanTitle.toUpperCase().includes('PROPOSAL') || cleanTitle.toUpperCase().includes('DRAFT');

      currentTopic = {
        title: cleanTitle,
        slug: generateStableSlug(cleanTitle),
        priority: 'P2_HIGH',
        revisionMinutes: revTime,
        regulatoryStatus: isDraft ? 'PROPOSAL' : undefined,
        verificationStatus: 'SOURCE_ONLY',
        whatHappened: [],
        mustMemorizeFacts: [],
        knowUnderstandContext: [],
        examFocus: [],
        optionalFacts: []
      };
      currentSubSection = 'MUST_MEMORIZE';
      topicMarkdownBuffer.push(line);
      continue;
    } else if (p3BulletMatch && currentPart === 'P3') {
      flushCurrentTopic();
      const rawTitle = p3BulletMatch[1].trim();
      const cleanTitle = sanitizeTitle(rawTitle);
      const factBody = p3BulletMatch[2].trim();

      currentTopic = {
        title: cleanTitle,
        slug: generateStableSlug(cleanTitle),
        priority: 'P3_MODERATE',
        revisionMinutes: 1,
        regulatoryStatus: undefined, // Non-regulatory factoids have NO regulatory status
        verificationStatus: 'SOURCE_ONLY',
        whatHappened: [],
        mustMemorizeFacts: [factBody],
        knowUnderstandContext: [],
        examFocus: [],
        optionalFacts: []
      };
      topicMarkdownBuffer.push(line);
      flushCurrentTopic();
      continue;
    }

    // Identify Subsections
    if (currentTopic) {
      topicMarkdownBuffer.push(line);

      // Explicit Know & Understand line detection (e.g. "**Know & Understand (Context)**:")
      if (/^\s*\*?\*?\s*Know\s*(?:&|\/|and)\s*Understand\s*(?:\(Context\))?\*?\*?:?\s*$/i.test(line.trim())) {
        currentSubSection = 'KNOW_UNDERSTAND';
        continue;
      }

      // Subsection matching (supports both **What Happened** and #### What Happened)
      if (/^\s*(####|\*?\*?)\s*(What Happened|Legislative Overview|Overview|Background|Core Announcement|Announcement|The Core Mechanism|Scheme Overview)/i.test(line)) {
        currentSubSection = 'WHAT_HAPPENED';
        continue;
      } else if (/^\s*(####|\*?\*?)\s*(Must[-\s]*Memorize|Key Rules|Key Provisions|Rules & Numbers|Structural Provisions|Key Structural Provisions|Insurance Structure|Approved \d+-Layer|Financial Allocation|Mandatory Blending|Regulatory Overrule|Specifications|Incentive Parameters|Specifications & Outlay|Core Findings|Parameters|Expansion & Calamity List|Statutory Mechanism|Valuation Rules|Valuation & Procedure|Pricing & Reset|Slabs & Caps)/i.test(line)) {
        currentSubSection = 'MUST_MEMORIZE';
        continue;
      } else if (/^\s*(####|\*?\*?)\s*(Know\s*\/?\s*Understand|Why It Matters|Fiscal Significance|Significance|Conceptual Context|Impact|Rationale|Context & Rationale|Judicial Rationale)/i.test(line)) {
        currentSubSection = 'KNOW_UNDERSTAND';
        continue;
      } else if (/^\s*(####|\*?\*?)\s*(Exam Angle|Exam Focus|Key Exam Takeaways|Key Takeaways|Descriptive \/ Mains Utility)/i.test(line)) {
        currentSubSection = 'EXAM_FOCUS';
        continue;
      }

      // Extract revision effort e.g. "**Revision Effort:** ~10 min"
      const revMatch = line.match(/Revision Effort:\*\*\s*~?(\d+)\s*min/i);
      if (revMatch) {
        currentTopic.revisionMinutes = parseInt(revMatch[1], 10);
      }

      // Extract Priority tag e.g. "* **Priority:** P1 — Critical / Deep"
      if (line.includes('Priority:')) {
        if (line.includes('P1 — Critical / Deep')) currentTopic.priority = 'P1_CRITICAL_DEEP';
        else if (line.includes('P1 — Critical / Memorize')) currentTopic.priority = 'P1_CRITICAL_MEMORIZE';
        else if (line.includes('P2')) currentTopic.priority = 'P2_HIGH';
        else if (line.includes('P3')) currentTopic.priority = 'P3_MODERATE';
      }

      // Extract Change Alerts
      if (line.includes('Change-Sensitive') || line.includes('⚠️')) {
        const summary = line
          .replace(/.*Change-Sensitive:?\*?\*?\s*/i, '')
          .replace(/⚠️/g, '')
          .replace(/^[*\s_:]+/, '')
          .trim();
        currentTopic.changeAlert = {
          isChangeSensitive: true,
          currentFactSummary: summary,
          changeTrigger: 'Upcoming regulatory review or scheduled MPC',
          actionBeforeExam: 'Re-verify official status before Mains exam.'
        };
      }

      // Extract Explicit Regulatory Status (e.g. "Status: DRAFT", "Status: PROPOSAL", "Status: IMPLEMENTED")
      const statusMatch = line.match(/(?:Status|Regulatory Status):\s*\**([A-Z_]+)\**/i);
      if (statusMatch) {
        const rawStatus = statusMatch[1].toUpperCase();
        if (['DRAFT', 'PROPOSAL', 'CONSULTATION', 'APPROVED', 'NOTIFIED', 'IMPLEMENTED'].includes(rawStatus)) {
          currentTopic.regulatoryStatus = rawStatus as any;
        }
      }

      // Extract Category e.g. "- **Category**: `GOVERNMENT_SCHEMES`" or "* **Category:** Government Schemes & Bioenergy"
      const catMatch = line.match(/(?:Category|Primary Category):\s*[`*]*([^`*|\n\r]+)[`*]*/i);
      if (catMatch) {
        const normalized = normalizeCategoryString(catMatch[1]);
        if (normalized) {
          currentTopic.primaryCategory = normalized;
        }
      }

      // Extract Institution e.g. "- **Institution**: `GOVERNMENT_OF_INDIA`"
      const instMatch = line.match(/(?:Institution|Primary Institution):\s*[`*]*([A-Z_]+)[`*]*/i);
      if (instMatch) {
        currentTopic.primaryInstitution = instMatch[1].trim() as any;
      }

      // Extract Date e.g. "- **Date**: `2026-08-06`"
      const dateMatch = line.match(/(?:Date|Event Date):\s*[`*]*(\d{4}-\d{2}-\d{2})[`*]*/i);
      if (dateMatch) {
        currentTopic.initialEventDate = dateMatch[1].trim();
      }

      // Check if line is metadata header (Priority, Source, Event Date, Category, Institution, Target Exams, Status)
      const isMetadataLine =
        /^\s*[\*\-]?\s*\**\s*(Priority|Source|Event Date|Date|Revision Effort|Category|Primary Category|Institution|Primary Institution|Status|Regulatory Status|Target Exams)\s*\**\s*:/i.test(line) ||
        /^\s*[\*\-]?\s*(\*\*|\*|`)*(Category|Priority|Institution|Date|Source|Status)(\*\*|\*|`)*\s*:\s*[`*]*/i.test(line) ||
        line.includes('| **Institution**:') ||
        line.includes('| **Priority**:');

      if (isMetadataLine) {
        continue;
      }

      // Check if this bullet is purely a container header with no factual body (e.g. "* **FAST-DS Valuation & Procedure Ladder:**")
      const containerHeaderMatch = line.match(/^\s*[\*\-]\s*\*\*([^*]+?)\*\*:\s*$/);
      if (containerHeaderMatch) {
        const hTitle = containerHeaderMatch[1].trim();
        if (/(?:Ladder|Overview|Rules|Architecture|Context|Provisions|Takeaways|Outlay|Mechanism)/i.test(hTitle)) {
          if (/Context|Rationale|Why It Matters/i.test(hTitle)) {
            currentSubSection = 'KNOW_UNDERSTAND';
          } else if (/Overview|Announcement/i.test(hTitle)) {
            currentSubSection = 'WHAT_HAPPENED';
          } else {
            currentSubSection = 'MUST_MEMORIZE';
          }
          continue;
        }
      }

      // Collect section content based on current subSection
      const bulletMatch = line.match(/^\s*[\*\-]\s*(.+)/);
      if (bulletMatch && currentPart !== 'IGNORE' && currentPart !== 'REPORT') {
        let text = bulletMatch[1].trim();
        // Skip if this bullet is just a metadata line
        if (/^(\*\*|\*|`)*(Category|Priority|Institution|Date|Source|Status|Regulatory Status)(\*\*|\*|`)*\s*:/i.test(text)) {
          continue;
        }
        // Strip redundant bullet prefixes like "- **Must-Memorize Fact**: " -> ""
        text = text.replace(/^\*\*(?:Must-Memorize Fact|Must Memorize Fact|Key Fact|Fact|Core Fact)\*\*:\s*/i, '');
        text = text.replace(/^(?:Must-Memorize Fact|Must Memorize Fact|Key Fact|Fact|Core Fact):\s*/i, '');
        // For general bold prefixes (e.g. "**Real GDP Growth**:") format nicely
        text = text.replace(/^\*\*(.+?)\*\*:\s*/, '$1: ').trim();

        // Sanitize LaTeX tokens and tabbed escapes during parsing
        text = text
          .replace(/\t\s*ext\{([^}]+)\}/g, ' $1')
          .replace(/\\text\{([^}]+)\}/g, '$1')
          .replace(/(?:^|[^\w])ext\{([^}]+)\}/g, ' $1')
          .replace(/\$\s*\t\s*o\s*\$/g, ' → ')
          .replace(/\t\s*o\b/g, ' → ')
          .replace(/\$\\to\$/g, ' → ')
          .replace(/\\to\b/g, ' → ')
          .replace(/\$\s*\\?mid\s*\$/g, ' • ')
          .replace(/\\mid\b/g, ' • ')
          .replace(/\s+mid\s+/g, ' • ')
          .replace(/\$\\le\s*([₹\$\d\w]+)\$/g, '≤ $1')
          .replace(/\$\\le\$/g, '≤')
          .replace(/\\le\b/g, '≤')
          .replace(/\$le\s*([₹\$\d\w]+)/g, '≤ $1')
          .replace(/\$\\ge\s*([₹\$\d\w]+)\$/g, '≥ $1')
          .replace(/\$\\ge\$/g, '≥')
          .replace(/\\ge\b/g, '≥')
          .replace(/\$ge\s*([₹\$\d\w]+)/g, '≥ $1');

        // Convert question-shaped bullets into direct declarative statements
        const qParenMatch = text.match(/^[\*\-_]?\s*[\*_]*([^?]+)\?[\*_]*\s*\(([^)]+)\)\.?$/i);
        if (qParenMatch) {
          let q = qParenMatch[1].trim();
          const ans = qParenMatch[2].trim();
          q = q.replace(/^What (?:is|are|was|were) (?:the|a|an)?\s*/i, '');
          q = q.replace(/^What percentage of\s*/i, 'Share of ');
          q = q.replace(/^What statutory timeline is mandated for\s*/i, 'Mandated statutory timeline for ');
          q = q.replace(/^What platform is made mandatory for\s*/i, 'Mandatory platform for ');
          q = q.replace(/^Which (?:two|three|four|\d+)?\s*/i, '');
          q = q.replace(/^How many\s*/i, 'Total ');
          q = q.replace(/^Whose\s*/i, 'Originating ');
          q = q.replace(/^(?:newly mandated|mandated)\s*/i, 'Mandated ');
          q = q.replace(/^statutory\s*/i, 'Statutory ');
          q = q.charAt(0).toUpperCase() + q.slice(1);
          text = `${q}: ${ans}`;
        } else if (/^(?:What|Which|Who|How|Where|When)\s+/i.test(text) && text.includes('?')) {
          const qMatch = text.match(/^[\*\-_]?\s*[\*_]*(?:What|Which|Who|How|Where|When)\s+([^?]+)\?[\*_]*\s*(.*)$/i);
          if (qMatch) {
            let q = qMatch[1].trim();
            const rem = qMatch[2].replace(/^[:\-\s]+/, '').trim();
            q = q.replace(/^(?:is|are|was|were) (?:the|a|an)?\s*/i, '');
            q = q.charAt(0).toUpperCase() + q.slice(1);
            text = rem ? `${q}: ${rem}` : q;
          }
        }
        text = text.replace(/\?$/, '');

        // Skip if this is a leaked section header
        if (/^\*{0,2}(?:Foreign Asset Voluntary Disclosure Window|FAST-DS Valuation & Procedure Ladder|PM E-DRIVE Slabs & Caps Ladder|Pricing & Reset Architecture Ladder|Digital Payment Charges Statutory Enablement|Scheme Overview & Window|Statutory Mechanism & Valuation Rules|Payment Architecture & Legal Provisions Ladder|Legislative Overview & Core Provision|Revised Incentive Architecture & Fiscal Sub-Limits|Know & Understand \(Context\)):\*{0,2}:?$/i.test(text.trim())) {
          continue;
        }

        if (text.length > 3) {
          if (currentSubSection === 'WHAT_HAPPENED') {
            currentTopic.whatHappened = currentTopic.whatHappened || [];
            currentTopic.whatHappened.push(text);
          } else if (currentSubSection === 'KNOW_UNDERSTAND') {
            currentTopic.knowUnderstandContext = currentTopic.knowUnderstandContext || [];
            currentTopic.knowUnderstandContext.push(text);
          } else if (currentSubSection === 'EXAM_FOCUS') {
            currentTopic.examFocus = currentTopic.examFocus || [];
            currentTopic.examFocus.push(text);
          } else {
            currentTopic.mustMemorizeFacts = currentTopic.mustMemorizeFacts || [];
            currentTopic.mustMemorizeFacts.push(text);
          }
        }
      } else if (
        !bulletMatch &&
        currentPart !== 'IGNORE' &&
        currentPart !== 'REPORT' &&
        !line.startsWith('#') &&
        !line.startsWith('---') &&
        !line.startsWith('|') &&
        !line.startsWith('>') &&
        !line.includes('MIGRATION RECORD') &&
        !isMetadataLine
      ) {
        const prose = line.trim();
        if (prose.length > 15) {
          if (currentSubSection === 'KNOW_UNDERSTAND') {
            currentTopic.knowUnderstandContext = currentTopic.knowUnderstandContext || [];
            currentTopic.knowUnderstandContext.push(prose);
          } else {
            currentTopic.whatHappened = currentTopic.whatHappened || [];
            currentTopic.whatHappened.push(prose);
          }
        }
      }
    }
  }

  flushCurrentTopic();

  // Ingestion Batch Record
  const batch: IngestionBatch = {
    batchId,
    sourceName: sourceDefault,
    dateRange: `${chronologicalMonth} (${chronologicalWeek})`,
    ingestedAt: '2026-08-25T18:00:00Z',
    rawItemsCount: topics.length,
    duplicatesCount: 0,
    enrichmentsCount: 0,
    updatesCount: 0,
    newTopicsCount: topics.length,
    ignoredCount: 0,
    primaryVerifiedCount: 0,
    sourceOnlyCount: topics.length,
    verificationPendingCount: 0,
    mentorVerdict: `Successfully processed ${topics.length} canonical topics for ${chronologicalMonth} ${chronologicalWeek}.`
  };

  return { topics, batch };
}
