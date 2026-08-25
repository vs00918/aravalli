import React from "react";
import { BookOpen, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function ContinueExploring() {
  const recentConcepts = [
    {
      title: "Entropy & Statistical States",
      chapter: "Universe & Physics",
      oneLiner: "A measure of how many microscopic arrangements are compatible with the observable state.",
      readProgress: "Level 4: First Principles",
    },
    {
      title: "Emergence in Complex Systems",
      chapter: "Complex Systems & Human Body",
      oneLiner: "How microscopic agents following simple local rules produce macroscopic intelligence.",
      readProgress: "Level 3: Mechanics",
    },
    {
      title: "The Energy Density Quadrilemma",
      chapter: "Energy & Technology",
      oneLiner: "The multi-dimensional trade-off space between density, cycle life, safety, and levelized cost.",
      readProgress: "Level 2: Intuition",
    },
  ];

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300 font-mono">
            Continue Exploring
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Recently Viewed</span>
      </div>

      {/* Concept Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {recentConcepts.map((item, idx) => (
          <div
            key={idx}
            className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-4 text-left transition-all hover:border-emerald-500/40 hover:shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-emerald-700 dark:text-emerald-400">
                  {item.chapter}
                </span>
                <Badge variant="subtle">{item.readProgress}</Badge>
              </div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                {item.oneLiner}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-emerald-500 transition-colors">
              <span>Resume reading</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
