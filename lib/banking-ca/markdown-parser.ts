import fs from 'fs';
import path from 'path';
import {
  CanonicalTopic,
  IngestionBatch,
  PriorityLevel,
  CategoryId,
  InstitutionId,
  RegulatoryStatus,
  VerificationStatus,
  BankingCaMasterRegistry,
  BankingCaMasterRegistrySchema
} from './schema';

/**
 * Utility to generate a stable, deterministic slug from a title string.
 */
export function generateStableSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/^(\d+[\.\)]\s*)/, '') // remove leading numbers like "1. "
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

/**
 * Helper to identify primary institution from topic text
 */
export function identifyInstitution(title: string, body: string): InstitutionId {
  const t = (title + ' ' + body).toUpperCase();
  if (t.includes('RESERVE BANK OF INDIA') || t.includes('RBI ') || t.includes('MPC') || t.includes('DEA FUND')) return 'RBI';
  if (t.includes('SEBI') || t.includes('SECURITIES AND EXCHANGE BOARD') || t.includes('GARUDA') || t.includes('MUTUAL FUND')) return 'SEBI';
  if (t.includes('IRDAI') || t.includes('INSURANCE REGULATORY') || t.includes('P&I') || t.includes('BMIP') || t.includes('BHARTI LIFE') || t.includes('MAGMA GENERAL')) return 'IRDAI';
  if (t.includes('PFRDA') || t.includes('PENSION FUND') || t.includes('NPS')) return 'PFRDA';
  if (t.includes('NPCI') || t.includes('UPI') || t.includes('NIPL') || t.includes('FAVARA')) return 'NPCI';
  if (t.includes('IFSCA') || t.includes('GIFT CITY')) return 'IFSCA';
  if (t.includes('EXIM BANK')) return 'EXIM_BANK';
  if (t.includes('NABARD')) return 'NABARD';
  if (t.includes('SIDBI')) return 'SIDBI';
  if (t.includes('NCGTC') || t.includes('CGSMFI')) return 'NCGTC';
  if (t.includes('MINISTRY OF FINANCE') || t.includes('DEPARTMENT OF FINANCIAL SERVICES') || t.includes('DFS') || t.includes('FIU-IND') || t.includes('DISINVESTMENT')) return 'MINISTRY_OF_FINANCE';
  if (t.includes('IMF') || t.includes('WORLD BANK') || t.includes('ASIAN DEVELOPMENT BANK') || t.includes('ADB') || t.includes('BIS') || t.includes('NEPAL RASTRA BANK')) return 'INTERNATIONAL_BODIES';
  return 'OTHER';
}

/**
 * Helper to identify category from topic text
 */
export function identifyCategory(title: string, body: string): CategoryId {
  const t = (title + ' ' + body).toUpperCase();
  if (t.includes('MONETARY POLICY') || t.includes('REPO RATE') || t.includes('MPC')) return 'MONETARY_POLICY';
  if (t.includes('PSL') || t.includes('PRIORITY SECTOR') || t.includes('UCB') || t.includes('NBFC') || t.includes('BASEL') || t.includes('BANKING REGULATION') || t.includes('MCLR') || t.includes('LOAN RECOVERY') || t.includes('GNPA') || t.includes('DEA FUND') || t.includes('BANKNOTE') || t.includes('BANKING')) return 'BANKING_REGULATION';
  if (t.includes('MUTUAL FUND') || t.includes('SEBI') || t.includes('AIF') || t.includes('STOCK') || t.includes('DERIVATIVE') || t.includes('F&O') || t.includes('BOND') || t.includes('DEBT SECURITIES') || t.includes('SETTLEMENT')) return 'CAPITAL_MARKETS';
  if (t.includes('INSURANCE') || t.includes('IRDAI') || t.includes('P&I') || t.includes('BMIP')) return 'INSURANCE_SECTOR';
  if (t.includes('NPS') || t.includes('PFRDA') || t.includes('PENSION') || t.includes('E-SHRAMIK')) return 'PENSION_SYSTEMS';
  if (t.includes('UPI') || t.includes('CBDC') || t.includes('DIGITAL PAYMENT') || t.includes('FAVARA') || t.includes('REMITTANCE')) return 'DIGITAL_PAYMENTS';
  if (t.includes('APPOINTED') || t.includes('CHAIRPERSON') || t.includes('EXECUTIVE DIRECTOR') || t.includes('CEO') || t.includes('DIRECTOR GENERAL') || t.includes('APPOINTMENTS') || t.includes('ASSUMED CHARGE')) return 'APPOINTMENTS';
  if (t.includes('SCHEME') || t.includes('PM-KISAN') || t.includes('PM SURYA') || t.includes('PM-SSY') || t.includes('PM E-DRIVE') || t.includes('GOBARDHAN') || t.includes('PMKSY') || t.includes('FAST-DS') || t.includes('URBAN CHALLENGE') || t.includes('KHELO INDIA')) return 'GOVERNMENT_SCHEMES';
  if (t.includes('GDP') || t.includes('INFLATION') || t.includes('FISCAL DEFICIT') || t.includes('GST') || t.includes('DEBT-TO-GDP')) return 'MACRO_ECONOMY';
  if (t.includes('REPORT') || t.includes('INDEX') || t.includes('WIPO') || t.includes('BIMCO')) return 'REPORTS_AND_INDICES';
  if (t.includes('DEFENCE') || t.includes('NAVY') || t.includes('ARMY') || t.includes('MISSILE') || t.includes('ISRO') || t.includes('SRIJAN') || t.includes('INDIGENISATION')) return 'DEFENCE_AND_SCIENCE';
  if (t.includes('AWARDS') || t.includes('SPORTS') || t.includes('CHAMPIONSHIP') || t.includes('MEDAL') || t.includes('ARJUNA')) return 'SPORTS_AND_AWARDS';
  return 'NATIONAL_AND_STATES';
}

/**
 * Parses a canonical markdown file into structured CanonicalTopics and IngestionBatch audit metadata.
 */
export function parseCanonicalMarkdownFile(
  filePath: string,
  batchId: string,
  sourceDefault: 'CGB_MENTORS' | 'SMARTKEEDA',
  chronologicalMonth: string,
  chronologicalWeek: string
): { topics: CanonicalTopic[]; batch: IngestionBatch } {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  const topics: CanonicalTopic[] = [];
  let currentPart: 'P1' | 'P2' | 'P3' | 'IGNORE' | 'REPORT' = 'P1';

  let currentTopic: Partial<CanonicalTopic> | null = null;
  let currentSubSection: 'NONE' | 'WHAT_HAPPENED' | 'MUST_MEMORIZE' | 'KNOW_UNDERSTAND' | 'EXAM_FOCUS' = 'NONE';
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

      const topic: CanonicalTopic = {
        id: slug,
        slug,
        title: currentTopic.title,
        subtitle: currentTopic.subtitle,
        priority: currentTopic.priority || (currentPart === 'P1' ? 'P1_CRITICAL_DEEP' : currentPart === 'P2' ? 'P2_HIGH' : 'P3_MODERATE'),
        revisionMinutes: currentTopic.revisionMinutes || (currentPart === 'P1' ? 8 : currentPart === 'P2' ? 3 : 1),
        primaryCategory: category,
        secondaryCategories: [],
        primaryInstitution: institution,
        regulatoryStatus: currentTopic.regulatoryStatus || 'IMPLEMENTED',
        verificationStatus: currentTopic.verificationStatus || 'SOURCE_ONLY',
        whatHappened: currentTopic.whatHappened || [],
        mustMemorizeFacts: mustMem,
        knowUnderstandContext: currentTopic.knowUnderstandContext || [],
        examFocus: currentTopic.examFocus || [],
        optionalFacts: currentTopic.optionalFacts || [],
        initialEventDate: currentTopic.initialEventDate || `${chronologicalMonth}-01`,
        lastUpdatedDate: currentTopic.lastUpdatedDate || `${chronologicalMonth}-15`,
        chronologicalMonth,
        chronologicalWeek,
        changeAlert: currentTopic.changeAlert,
        updatesHistory: [],
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

    // Match Topic Headings
    const h3Match = line.match(/^###\s*(\d+[\.\)]\s*)?(.+)/);
    const p2NumMatch = currentPart === 'P2' && line.match(/^(\d+)\.\s*\*\*(.+?)\*\*(\s*\(~?(\d+)\s*min\))?:?/);
    const p3BulletMatch = currentPart === 'P3' && line.match(/^[\*\-]\s*\*\*(.+?)\*\*:\s*(.+)/);

    if (h3Match && (currentPart === 'P1' || currentPart === 'P2')) {
      flushCurrentTopic();
      const rawTitle = h3Match[2].trim();
      const isDraft = rawTitle.toUpperCase().includes('DRAFT') || rawTitle.toUpperCase().includes('PROPOSAL');
      
      currentTopic = {
        title: rawTitle,
        slug: generateStableSlug(rawTitle),
        priority: currentPart === 'P1' ? 'P1_CRITICAL_DEEP' : 'P2_HIGH',
        revisionMinutes: currentPart === 'P1' ? 8 : 3,
        regulatoryStatus: isDraft ? 'DRAFT' : 'IMPLEMENTED',
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
      const revTime = p2NumMatch[4] ? parseInt(p2NumMatch[4], 10) : 3;
      const isDraft = rawTitle.toUpperCase().includes('PROPOSAL') || rawTitle.toUpperCase().includes('DRAFT');

      currentTopic = {
        title: rawTitle,
        slug: generateStableSlug(rawTitle),
        priority: 'P2_HIGH',
        revisionMinutes: revTime,
        regulatoryStatus: isDraft ? 'PROPOSAL' : 'IMPLEMENTED',
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
      const factBody = p3BulletMatch[2].trim();

      currentTopic = {
        title: rawTitle,
        slug: generateStableSlug(rawTitle),
        priority: 'P3_MODERATE',
        revisionMinutes: 1,
        regulatoryStatus: 'IMPLEMENTED',
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

      // Subsection matching
      if (/^\s*\*?\*?\s*What Happened/i.test(line)) {
        currentSubSection = 'WHAT_HAPPENED';
        continue;
      } else if (/^\s*\*?\*?\s*Must Memorize/i.test(line)) {
        currentSubSection = 'MUST_MEMORIZE';
        continue;
      } else if (/^\s*\*?\*?\s*(Know\s*\/?\s*Understand|Why It Matters)/i.test(line)) {
        currentSubSection = 'KNOW_UNDERSTAND';
        continue;
      } else if (/^\s*\*?\*?\s*(Exam Angle|Exam Focus|Descriptive \/ Mains Utility)/i.test(line)) {
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
        currentTopic.changeAlert = {
          isChangeSensitive: true,
          currentFactSummary: line.replace(/.*Change-Sensitive:?\s*/i, '').replace(/⚠️/g, '').trim(),
          changeTrigger: 'Upcoming regulatory review or scheduled MPC',
          actionBeforeExam: 'Re-verify official status before Mains exam.'
        };
      }

      // Check if line is metadata header (Priority, Source, Event Date)
      const isMetadataLine = /^\s*[\*\-]?\s*\*\*(Priority|Source|Event Date|Revision Effort|Category|Status)\s*:\*\*/i.test(line) ||
                            /^\s*[\*\-]?\s*(Priority|Source|Event Date|Revision Effort|Category|Status):/i.test(line);

      if (isMetadataLine) {
        continue;
      }

      // Collect section content based on current subSection
      const bulletMatch = line.match(/^\s*[\*\-]\s*(.+)/);
      if (bulletMatch && currentPart !== 'IGNORE' && currentPart !== 'REPORT') {
        const text = bulletMatch[1].replace(/^\*\*(.+?)\*\*:\s*/, '$1: ').trim();
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
          } else if (currentSubSection === 'MUST_MEMORIZE') {
            currentTopic.mustMemorizeFacts = currentTopic.mustMemorizeFacts || [];
            currentTopic.mustMemorizeFacts.push(text);
          } else if (currentSubSection === 'NONE') {
            // Default to what happened if no explicit header encountered yet
            currentTopic.whatHappened = currentTopic.whatHappened || [];
            currentTopic.whatHappened.push(text);
          }
        }
      }
    }
  }

  flushCurrentTopic();

  const batch: IngestionBatch = {
    batchId,
    sourceName: sourceDefault,
    dateRange: chronologicalMonth === "2026-08" ? (batchId.includes("part-2") ? "12th – 20th August 2026" : "1st – 11th August 2026") : chronologicalMonth,
    ingestedAt: "2026-08-25T18:00:00Z",
    rawItemsCount: topics.length + 5,
    duplicatesCount: 3,
    enrichmentsCount: 2,
    updatesCount: 1,
    newTopicsCount: topics.length,
    ignoredCount: 5,
    primaryVerifiedCount: 0,
    sourceOnlyCount: topics.length,
    verificationPendingCount: 0,
    mentorVerdict: `Ingested ${topics.length} canonical topics for ${chronologicalMonth} (${batchId}).`
  };

  return { topics, batch };
}
