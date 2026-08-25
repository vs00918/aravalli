"use client";

import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  slug: string;
  title: string;
}

export function BookmarkButton({ slug, title }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aravalli_bookmarks");
      if (saved) {
        const list: string[] = JSON.parse(saved);
        setIsBookmarked(list.includes(slug));
      }
    } catch {
      // localStorage fallback
    }
  }, [slug]);

  const toggleBookmark = () => {
    try {
      const saved = localStorage.getItem("aravalli_bookmarks");
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (list.includes(slug)) {
        list = list.filter((s) => s !== slug);
        setIsBookmarked(false);
      } else {
        list.push(slug);
        setIsBookmarked(true);
      }
      localStorage.setItem("aravalli_bookmarks", JSON.stringify(list));
    } catch {
      // safe fallback
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      type="button"
      className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-mono ${
        isBookmarked
          ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30"
          : "bg-white/60 dark:bg-[#0f1520] text-slate-500 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800"
      }`}
      title={isBookmarked ? "Saved in reading list" : "Bookmark this concept"}
    >
      <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
      <span className="hidden sm:inline">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
    </button>
  );
}
