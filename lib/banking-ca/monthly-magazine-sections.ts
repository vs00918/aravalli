import { CanonicalTopic } from './schema';
import {
  MAGAZINE_SECTIONS,
  MagazineSectionMeta,
  routeTopicSemantically,
  SemanticRoutingResult
} from './semantic-router';

export { MAGAZINE_SECTIONS };
export type { MagazineSectionMeta as MagazineSectionDef };

/**
 * Resolves a CanonicalTopic into one of the 10 Fixed Magazine Sections using the Semantic Router.
 */
export function resolveTopicMagazineSection(topic: CanonicalTopic): string {
  const result = routeTopicSemantically(topic);
  return result.sectionId;
}

export interface SectionGroup {
  section: MagazineSectionMeta;
  topics: CanonicalTopic[];
  p1Count: number;
  p2Count: number;
  p3Count: number;
  p4Count: number;
  totalRevisionTime: number;
}

export function groupTopicsByMagazineSection(topics: CanonicalTopic[]): SectionGroup[] {
  const sectionMap = new Map<string, CanonicalTopic[]>();
  for (const s of MAGAZINE_SECTIONS) {
    sectionMap.set(s.id, []);
  }

  for (const topic of topics) {
    const sId = resolveTopicMagazineSection(topic);
    const list = sectionMap.get(sId) || [];
    list.push(topic);
    sectionMap.set(sId, list);
  }

  const result: SectionGroup[] = [];

  for (const s of MAGAZINE_SECTIONS) {
    const list = sectionMap.get(s.id) || [];
    if (list.length > 0) {
      // Sort within section strictly by exam priority (P1 -> P2 -> P3 -> P4) and revision importance
      list.sort((a, b) => {
        const pOrder: Record<string, number> = {
          P1_CRITICAL_DEEP: 1,
          P1_CRITICAL_MEMORIZE: 2,
          P2_HIGH: 3,
          P3_MODERATE: 4,
          P4_LOW_YIELD: 5
        };
        const pA = pOrder[a.priority] || 99;
        const pB = pOrder[b.priority] || 99;
        if (pA !== pB) return pA - pB;
        return (b.revisionMinutes || 0) - (a.revisionMinutes || 0);
      });

      const p1 = list.filter(t => t.priority.startsWith('P1')).length;
      const p2 = list.filter(t => t.priority === 'P2_HIGH').length;
      const p3 = list.filter(t => t.priority === 'P3_MODERATE').length;
      const p4 = list.filter(t => t.priority === 'P4_LOW_YIELD').length;

      // Calculate total revision time: P4 items add 0 or minimal study burden
      const time = list.reduce((acc, t) => {
        if (t.priority === 'P4_LOW_YIELD') return acc;
        return acc + (t.revisionMinutes || 2);
      }, 0);

      result.push({
        section: s,
        topics: list,
        p1Count: p1,
        p2Count: p2,
        p3Count: p3,
        p4Count: p4,
        totalRevisionTime: time
      });
    }
  }

  return result;
}
