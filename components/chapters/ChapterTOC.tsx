import React from "react";
import { ListTree, ArrowRight } from "lucide-react";
import { Concept } from "@/lib/types";

interface ChapterTOCProps {
  concepts: Concept[];
}

export function ChapterTOC({ concepts }: ChapterTOCProps) {
  if (!concepts || concepts.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <ListTree className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-xs uppercase font-bold tracking-widest text-slate-800 dark:text-slate-200 font-mono">
          Table of Contents
        </h2>
      </div>

      <nav className="space-y-1.5 font-mono text-xs">
        {concepts.map((concept, idx) => (
          <a
            key={concept.id}
            href={`#concept-${concept.slug}`}
            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#151e2d] text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <span className="text-slate-400 font-bold opacity-75">
                {String(idx + 1).padStart(2, "0")}.
              </span>
              <span className="font-sans text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                {concept.title}
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 transition-all text-emerald-600" />
          </a>
        ))}
      </nav>
    </div>
  );
}
