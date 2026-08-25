import React from "react";
import { Compass } from "lucide-react";

interface ChapterOverviewProps {
  overview?: string | null;
}

export function ChapterOverview({ overview }: ChapterOverviewProps) {
  if (!overview) return null;

  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] p-5 sm:p-6 space-y-3">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
        <Compass className="w-3.5 h-3.5" />
        <span>Domain Scope & Thesis</span>
      </div>

      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
        {overview}
      </p>
    </div>
  );
}
