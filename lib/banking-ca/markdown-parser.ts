import fs from 'fs';
import path from 'path';
import {
  CanonicalTopic,
  IngestionBatch,
  PriorityLevel,
  CategoryId,
  InstitutionId
} from './schema';

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

function identifyCategory(title: string, content: string): CategoryId {
  const text = `${title} ${content}`.toUpperCase();
  if (text.includes('MONETARY POLICY') || text.includes('REPO RATE') || text.includes('MPC')) return 'MONETARY_POLICY';
  if (text.includes('LICENSING') || text.includes('PRUDENTIAL') || text.includes('NBFC') || text.includes('UCB') || text.includes('BASEL') || text.includes('LENDING') || text.includes('DEPOSIT')) return 'BANKING_REGULATION';
  if (text.includes('CAPITAL MARKET') || text.includes('MUTUAL FUND') || text.includes('EQUITY') || text.includes('DERIVATIVE') || text.includes('FPI') || text.includes('INSIDER TRADING')) return 'CAPITAL_MARKETS';
  if (text.includes('UPI') || text.includes('FASTAG') || text.includes('DIGITAL PAYMENT') || text.includes('NEFT') || text.includes('RTGS') || text.includes('CBDC')) return 'DIGITAL_PAYMENTS';
  if (text.includes('INSURANCE') || text.includes('PREMIUM') || text.includes('BIMA')) return 'INSURANCE_SECTOR';
  if (text.includes('PENSION') || text.includes('NPS') || text.includes('APY')) return 'PENSION_SYSTEMS';
  if (text.includes('SCHEME') || text.includes('YOJANA') || text.includes('SUBSIDY') || text.includes('PRADHAN MANTRI')) return 'GOVERNMENT_SCHEMES';
  if (text.includes('APPOINTED') || text.includes('CHAIRMAN') || text.includes('GOVERNOR') || text.includes('EXECUTIVE DIRECTOR') || text.includes('CEO') || text.includes('MD & CEO')) return 'APPOINTMENTS';
  if (text.includes('INDEX') || text.includes('REPORT') || text.includes('RANKING') || text.includes('SURVEY')) return 'REPORTS_AND_INDICES';
  if (text.includes('GDP') || text.includes('INFLATION') || text.includes('CPI') || text.includes('WPI') || text.includes('FISCAL') || text.includes('FOREX') || text.includes('TRADE DEFICIT')) return 'MACRO_ECONOMY';
  if (text.includes('DEFENCE') || text.includes('MISSILE') || text.includes('EXERCISE') || text.includes('ISRO') || text.includes('SATELLITE') || text.includes('AI') || text.includes('DRDO')) return 'DEFENCE_AND_SCIENCE';
  if (text.includes('OLYMPIC') || text.includes('CHAMPIONSHIP') || text.includes('MEDAL') || text.includes('AWARD') || text.includes('PRIZE') || text.includes('TROPHY')) return 'SPORTS_AND_AWARDS';
  if (text.includes('STATE') || text.includes('CABINET') || text.includes('SUMMIT') || text.includes('PORTAL') || text.includes('MOU')) return 'NATIONAL_AND_STATES';
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
        regulatoryStatus: currentTopic.regulatoryStatus, // Optional: only if explicitly defined
        verificationStatus: currentTopic.verificationStatus || 'SOURCE_ONLY',
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
      const revTime = p2NumMatch[4] ? parseInt(p2NumMatch[4], 10) : 3;
      const isDraft = rawTitle.toUpperCase().includes('PROPOSAL') || rawTitle.toUpperCase().includes('DRAFT');

      currentTopic = {
        title: rawTitle,
        slug: generateStableSlug(rawTitle),
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
      const factBody = p3BulletMatch[2].trim();

      currentTopic = {
        title: rawTitle,
        slug: generateStableSlug(rawTitle),
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

      // Subsection matching (supports both **What Happened** and #### What Happened)
      if (/^\s*(####|\*?\*?)\s*What Happened/i.test(line)) {
        currentSubSection = 'WHAT_HAPPENED';
        continue;
      } else if (/^\s*(####|\*?\*?)\s*Must Memorize/i.test(line)) {
        currentSubSection = 'MUST_MEMORIZE';
        continue;
      } else if (/^\s*(####|\*?\*?)\s*(Know\s*\/?\s*Understand|Why It Matters)/i.test(line)) {
        currentSubSection = 'KNOW_UNDERSTAND';
        continue;
      } else if (/^\s*(####|\*?\*?)\s*(Exam Angle|Exam Focus|Descriptive \/ Mains Utility)/i.test(line)) {
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

      // Extract Explicit Regulatory Status (e.g. "Status: DRAFT", "Status: PROPOSAL", "Status: IMPLEMENTED")
      const statusMatch = line.match(/(?:Status|Regulatory Status):\s*\**([A-Z_]+)\**/i);
      if (statusMatch) {
        const rawStatus = statusMatch[1].toUpperCase();
        if (['DRAFT', 'PROPOSAL', 'CONSULTATION', 'APPROVED', 'NOTIFIED', 'IMPLEMENTED'].includes(rawStatus)) {
          currentTopic.regulatoryStatus = rawStatus as any;
        }
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
          } else {
            currentTopic.mustMemorizeFacts = currentTopic.mustMemorizeFacts || [];
            currentTopic.mustMemorizeFacts.push(text);
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
