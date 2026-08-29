import { CanonicalTopic } from './schema';

export type PresentationPrimitive = 
  | 'DeepBrief'      // P1 and substantial multi-section P2 topics
  | 'Brief'          // Standard structured multi-fact topics
  | 'MetricCallout'  // Numerical / rate / index / amount dominant facts
  | 'EventRow'       // Appointments, awards, sports, summits, key personnel
  | 'FactStrip';     // Compact rapid-revision one-liners / deals / partnerships

export interface ExtractedMetric {
  value: string;
  label?: string;
}

/**
 * Classifies a canonical topic into one of 5 reusable visual presentation primitives.
 */
export function classifyTopicPresentation(topic: CanonicalTopic): PresentationPrimitive {
  const isP1 = topic.priority.startsWith('P1');
  const isP2 = topic.priority === 'P2_HIGH';
  const isP3orP4 = topic.priority === 'P3_MODERATE' || topic.priority === 'P4_LOW_YIELD';

  // 1. P1 is always DeepBrief
  if (isP1) {
    return 'DeepBrief';
  }

  const category = topic.primaryCategory;
  const title = topic.title.toLowerCase();
  const bulletCount = (topic.mustMemorizeFacts?.length || 0) + (topic.whatHappened?.length || 0);

  // 2. EventRow: Appointments, Awards, Sports, Summits, Conferences (checked before FactStrip)
  const isEventCategory = 
    category === 'APPOINTMENTS' || 
    category === 'SPORTS_AND_AWARDS';

  const isEventTitle = 
    /\b(appoint|chairperson|chairman|director|governor|president|ceo|cmd|award|medal|prize|honour|jnanpith|trophy|cup|championship|tournament|summit|conference)\b/i.test(title);

  if ((isEventCategory || isEventTitle) && !isP1) {
    return 'EventRow';
  }

  // 3. MetricCallout: Number / Rate / Percentage / Index / Currency dominant
  const isDealOrPartnership = /\b(deal|partnership|partner|mou|ties|alliance|contract|invests|acquires|stake|merger)\b/i.test(title);
  const isMetricCategory = category === 'MACRO_ECONOMY' || category === 'REPORTS_AND_INDICES';
  const hasProminentMetricInTitle = 
    /(?:₹|\$|usd|jpy|percent|%|gdp|inflation|repo rate|gni|rate of interest|cii|sft|penalt|penalty|outlay|dividend|exports|fdi)\b/i.test(title);

  const leadMetric = extractLeadMetric(topic);

  if ((isMetricCategory || hasProminentMetricInTitle) && leadMetric && bulletCount <= 4 && !isP1 && !isDealOrPartnership) {
    return 'MetricCallout';
  }

  // 4. Substantial P2 with full sections -> DeepBrief
  const hasFullSections = 
    Boolean(topic.whatHappened?.length) && 
    Boolean(topic.mustMemorizeFacts?.length) && 
    Boolean(topic.examFocus?.length);

  if (isP2 && (hasFullSections || (topic.revisionMinutes && topic.revisionMinutes >= 6))) {
    return 'DeepBrief';
  }

  // 5. FactStrip for compact P3/P4 one-liners, corporate deals, partnerships (e.g. BofA-Jio, BSE-MSCI)
  if (isP3orP4 && (bulletCount <= 2 || isDealOrPartnership)) {
    return 'FactStrip';
  }

  // 6. Default to Brief for standard multi-fact topics / proposals
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

  // 3. Percentages (e.g. 70.0, 8.05%, 6.4%, 59.8%)
  const pctMatch = combinedText.match(/([\d]+(?:\.\d+)?)\s*%/);
  if (pctMatch) {
    return { value: `${pctMatch[1]}%` };
  }

  // 4. Index Scores (e.g. FI-Index 70.0, CII 384, Rank 81st)
  const rankMatch = combinedText.match(/\b(\d+)(?:st|nd|rd|th)\s+(?:rank|position)\b/i);
  if (rankMatch) {
    return { value: `#${rankMatch[1]}` };
  }

  const indexMatch = combinedText.match(/\b(?:index|cii|fi-index)(?:\s*(?:to|at|is|=))?\s*([\d]+(?:\.\d+)?)\b/i);
  if (indexMatch) {
    return { value: indexMatch[1] };
  }

  return null;
}
