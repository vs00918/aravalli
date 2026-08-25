import { CanonicalTopic } from "./schema";

const STORAGE_KEY = "banking_ca_read_slugs";

/**
 * Retrieves the set of read topic slugs from localStorage.
 */
export function getReadTopicSlugs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

/**
 * Toggles the read status of a topic slug and returns the updated status.
 */
export function toggleTopicReadSlug(slug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const set = getReadTopicSlugs();
    let isRead = false;
    if (set.has(slug)) {
      set.delete(slug);
      isRead = false;
    } else {
      set.add(slug);
      isRead = true;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    // Dispatch custom event for cross-component synchronization
    window.dispatchEvent(new CustomEvent("banking_ca_read_state_changed", { detail: { slug, isRead } }));
    return isRead;
  } catch {
    return false;
  }
}

/**
 * Checks if a specific topic slug is marked as read.
 */
export function isTopicReadSlug(slug: string): boolean {
  return getReadTopicSlugs().has(slug);
}

export interface MonthlyReadStats {
  totalTopics: number;
  readCount: number;
  progressPercent: number;
  p1Total: number;
  p1Read: number;
  p2Total: number;
  p2Read: number;
  p3Total: number;
  p3Read: number;
}

/**
 * Calculates personal reading progress metrics for a list of month topics.
 */
export function calculateMonthlyReadStats(
  topics: CanonicalTopic[],
  readSlugs: Set<string>
): MonthlyReadStats {
  const totalTopics = topics.length;
  let readCount = 0;
  let p1Total = 0;
  let p1Read = 0;
  let p2Total = 0;
  let p2Read = 0;
  let p3Total = 0;
  let p3Read = 0;

  for (const topic of topics) {
    const isRead = readSlugs.has(topic.slug);
    if (isRead) readCount++;

    if (topic.priority.startsWith("P1")) {
      p1Total++;
      if (isRead) p1Read++;
    } else if (topic.priority === "P2_HIGH") {
      p2Total++;
      if (isRead) p2Read++;
    } else if (topic.priority === "P3_MODERATE") {
      p3Total++;
      if (isRead) p3Read++;
    }
  }

  const progressPercent = totalTopics > 0 ? Math.round((readCount / totalTopics) * 100) : 0;

  return {
    totalTopics,
    readCount,
    progressPercent,
    p1Total,
    p1Read,
    p2Total,
    p2Read,
    p3Total,
    p3Read
  };
}
