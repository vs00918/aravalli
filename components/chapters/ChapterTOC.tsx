import React from "react";
import { ListTree, Map, ArrowRight } from "lucide-react";
import { Concept } from "@/lib/types";
import { CHAPTER_ROADMAPS } from "@/lib/data/roadmaps";

interface ChapterTOCProps {
  chapterSlug: string;
  concepts: Concept[];
}

export function ChapterTOC({ chapterSlug, concepts }: ChapterTOCProps) {
  const roadmap = CHAPTER_ROADMAPS[chapterSlug] ?? [];
  const documentedSlugs = new Set(concepts.map((c) => c.title.toLowerCase()));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      {/* Column 1: Currently Documented Concepts */}
      <div className="space-y-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] p-5">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <ListTree className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs uppercase font-bold tracking-widest text-slate-800 dark:text-slate-200 font-mono">
            Documented In This Volume ({concepts.length})
          </h2>
        </div>

        <nav className="space-y-1.5 font-mono text-xs">
          {concepts.map((concept, idx) => (
            <a
              key={concept.id}
              href={`#concept-${concept.slug}`}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#151e2d] text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors group"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  {String(idx + 1).padStart(2, "0")}.
                </span>
                <span className="font-sans text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                  {concept.title}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 transition-all text-emerald-600" />
            </a>
          ))}
        </nav>
      </div>

      {/* Column 2: Full Knowledge Curriculum Roadmap */}
      <div className="space-y-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-[#0b1017]/60 p-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Map className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-xs uppercase font-bold tracking-widest text-slate-600 dark:text-slate-400 font-mono">
              Knowledge Roadmap ({roadmap.length})
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Target Curriculum</span>
        </div>

        <div className="space-y-1.5 font-mono text-[11px] max-h-64 overflow-y-auto pr-1">
          {roadmap.map((item) => {
            const isDocumented = concepts.some(
              (c) => c.title.toLowerCase().includes(item.title.toLowerCase()) ||
                     item.title.toLowerCase().includes(c.title.toLowerCase())
            );

            return (
              <div
                key={item.order}
                className={`flex items-center justify-between py-1 px-2 rounded ${
                  isDocumented
                    ? "text-slate-800 dark:text-slate-200 font-medium bg-emerald-500/5 dark:bg-emerald-500/10"
                    : "text-slate-400 dark:text-slate-500 opacity-70"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono opacity-60">
                    {String(item.order).padStart(2, "0")}.
                  </span>
                  <span>{item.title}</span>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-500">
                  {item.tier}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
