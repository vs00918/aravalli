import { CanonicalTopic } from './schema';
import { identifyEventType, EventType } from './event-types';
import { InformationType } from './schema';

export type PresentationPrimitive =
  | 'DeepBrief'         // Multi-section analytical policy/regulatory topics (P1 & deep P2)
  | 'Brief'             // Clean editorial prose & concise bullets (default study view)
  | 'AppointmentBoard'  // Appointments, board elevations, and personnel transitions
  | 'RankingTable'      // Reports, surveys, global/national indices, and benchmark tables
  | 'SchemeFlow'        // Government welfare schemes, outlays, and multi-stage missions
  | 'MoUBlock'          // Strategic MoUs, bilateral pacts, and corridor agreements (A <-> B)
  | 'MetricCallout'     // Numerical / rate / inflation / GDP / macroeconomic dominant data
  | 'EventRow'          // Awards, sports championships, summits, and milestones
  | 'FactStrip';        // Compact rapid-revision atomic facts (C1/P3)

export interface ExtractedMetric {
  value: string;
  label?: string;
}

/**
 * Classifies a canonical topic into the optimal visual presentation primitive
 * based strictly on its SEMANTIC INFORMATION SHAPE, independent of its exam priority.
 *
 * PRIORITY answers: "How important is this for the student?" (P1/P2/P3/P4)
 * PRESENTATION answers: "What is the simplest useful way to communicate it?"
 */
export function classifyTopicPresentation(topic: CanonicalTopic): PresentationPrimitive {
  const isP1 = topic.priority.startsWith('P1');
  const isP2 = topic.priority === 'P2_HIGH';
  const isP3 = topic.priority === 'P3_MODERATE';
  const isP4 = topic.priority === 'P4_LOW_YIELD';

  const infoType = topic.informationType || 'OTHER';
  const compLevel = topic.compressionLevel || (isP1 ? 'C4' : isP2 ? 'C2' : isP3 ? 'C1' : 'C0');
  const bulletCount = (topic.mustMemorizeFacts?.length || 0) + (topic.whatHappened?.length || 0);

  // 1. C1 / C0 / Compact P3 Atomic Fact -> FactStrip
  if (compLevel === 'C1' || compLevel === 'C0' || (isP3 && bulletCount <= 2)) {
    return 'FactStrip';
  }

  // 2. Appointments & Leadership Transitions (P1, P2, or P3) -> AppointmentBoard
  if (infoType === 'APPOINTMENT' || topic.primaryCategory === 'APPOINTMENTS') {
    return 'AppointmentBoard';
  }

  // 3. Reports, Indices & Comparative Rankings (P1 or P2) -> RankingTable
  if (
    infoType === 'INDEX' ||
    infoType === 'RANKING' ||
    infoType === 'REPORT' ||
    topic.primaryCategory === 'REPORTS_AND_INDICES'
  ) {
    return 'RankingTable';
  }

  // 4. Government Schemes & Programmes (P1 or P2) -> SchemeFlow
  if (
    infoType === 'SCHEME' ||
    infoType === 'PROGRAMME' ||
    topic.primaryCategory === 'GOVERNMENT_SCHEMES'
  ) {
    return 'SchemeFlow';
  }

  // 5. Strategic MoUs and Bilateral Pacts -> MoUBlock (A <-> B)
  if (infoType === 'MoU' || infoType === 'INTERNATIONAL_RELATION') {
    return 'MoUBlock';
  }

  // 6. Macroeconomic Indicators & Strong Numerical Data -> MetricCallout
  if ((infoType === 'DATA_RELEASE' || infoType === 'ECONOMIC_DEVELOPMENT') && bulletCount <= 5) {
    const leadMetric = extractLeadMetric(topic);
    if (leadMetric) {
      return 'MetricCallout';
    }
  }

  // 7. Awards, Sports Championships & Summits -> EventRow
  if (
    infoType === 'AWARD' ||
    infoType === 'SPORTS_EVENT' ||
    infoType === 'CONFERENCE' ||
    topic.primaryCategory === 'SPORTS_AND_AWARDS'
  ) {
    return 'EventRow';
  }

  // 8. Complex Multi-Section Analytical Topics (Regulatory Policies, Monetary Policy, Major Reforms) -> DeepBrief
  const hasFullSections =
    Boolean(topic.whatHappened?.length) &&
    Boolean(topic.mustMemorizeFacts?.length) &&
    Boolean(topic.examFocus?.length);

  if (isP1 || hasFullSections || (topic.revisionMinutes && topic.revisionMinutes >= 6)) {
    return 'DeepBrief';
  }

  // 9. Standard Editorial Prose & Bullets -> Brief
  return 'Brief';
}

/**
 * Extracts a prominent key numerical stat from title or first bullet for MetricCallout display.
 */
export function extractLeadMetric(topic: CanonicalTopic): ExtractedMetric | null {
  const combinedText = `${topic.title} ${(topic.mustMemorizeFacts || []).join(' ')}`;

  // 1. Indian Currency (e.g. ₹7,086 crore, ₹30 lakh, ₹2,86,588.46 cr)
  const inrMatch = combinedText.match(/₹\s*([\d,]+(?:\.\d+)?)\s*(crore|lakh|cr|trn|trillion)?/i);
  if (inrMatch) {
    const unit = inrMatch[2] ? (inrMatch[2].toLowerCase().startsWith('cr') ? ' Cr' : inrMatch[2].toLowerCase().startsWith('l') ? ' Lakh' : ` ${inrMatch[2]}`) : '';
    return { value: `₹${inrMatch[1]}${unit}` };
  }

  // 2. Foreign Currency (e.g. $182.89 million, $1 billion, $863.1B, JPY 80 billion)
  const usdMatch = combinedText.match(/(?:\$|USD\s*)([\d,]+(?:\.\d+)?)\s*(billion|million|bn|m|trillion)?/i);
  if (usdMatch) {
    const unit = usdMatch[2] ? (usdMatch[2].toLowerCase().startsWith('b') ? 'B' : usdMatch[2].toLowerCase().startsWith('m') ? 'M' : ` ${usdMatch[2]}`) : '';
    return { value: `$${usdMatch[1]}${unit}` };
  }

  const jpyMatch = combinedText.match(/JPY\s*([\d,]+(?:\.\d+)?)\s*(billion|bn)?/i);
  if (jpyMatch) {
    return { value: `¥${jpyMatch[1]}B` };
  }

  // 3. Percentages (e.g. 70.0%, 8.05%, 6.4%, 59.8%)
  const percentMatch = combinedText.match(/([\d,]+(?:\.\d+)?)\s*%/);
  if (percentMatch) {
    return { value: `${percentMatch[1]}%` };
  }

  return null;
}
