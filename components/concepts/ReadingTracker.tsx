"use client";

import { useEffect } from "react";

interface ReadingTrackerProps {
  slug: string;
  title: string;
  chapterTitle?: string;
  oneLiner?: string;
}

export function ReadingTracker({ slug, title, chapterTitle, oneLiner }: ReadingTrackerProps) {
  useEffect(() => {
    try {
      const historyRecord = {
        slug,
        title,
        chapterTitle: chapterTitle || "Master Library",
        summary: oneLiner || "",
        lastReadAt: new Date().toISOString(),
      };

      const raw = localStorage.getItem("aravalli_reading_history");
      let list: any[] = raw ? JSON.parse(raw) : [];
      // Deduplicate and place latest at front
      list = list.filter((item) => item.slug !== slug);
      list.unshift(historyRecord);
      // Keep up to 10 recent items
      list = list.slice(0, 10);
      localStorage.setItem("aravalli_reading_history", JSON.stringify(list));
    } catch {
      // localStorage safety
    }
  }, [slug, title, chapterTitle, oneLiner]);

  return null;
}
