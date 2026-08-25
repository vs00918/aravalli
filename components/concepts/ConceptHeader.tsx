import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Layers } from "lucide-react";
import { Concept, Chapter, DifficultyTier } from "@/lib/types";

interface ConceptHeaderProps {
  concept: Concept & { chapter?: Chapter | null };
}

export function ConceptHeader({ concept }: ConceptHeaderProps) {
  const chapter = concept.chapter;

  const getDifficultyBadge = (difficulty: DifficultyTier | string) => {
    switch (difficulty) {
      case "FOUNDATION":
        return (
          <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            FOUNDATION
          </span>
        );
      case "CORE":
        return (
          <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
            CORE
          </span>
        );
      case "INTERMEDIATE":
        return (
          <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            INTERMEDIATE
          </span>
        );
      case "ADVANCED":
        return (
          <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
            ADVANCED
          </span>
        );
      case "FRONTIER":
        return (
          <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
            FRONTIER
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
            {difficulty}
          </span>
        );
    }
  };

  return (
    <header className="space-y-6 pb-6 border-b border-slate-200/90 dark:border-slate-800">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-slate-500">
        <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href="/library" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          Library
        </Link>
        {chapter && (
          <>
            <span>/</span>
            <Link
              href={`/chapters/${chapter.slug}`}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate max-w-[160px] sm:max-w-none"
            >
              {chapter.title}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-900 dark:text-slate-100 font-semibold truncate">
          {concept.title}
        </span>
      </nav>

      {/* Main Title & Tier Badges */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {chapter && (
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {chapter.icon} Volume {String(chapter.order).padStart(2, "0")} · {chapter.title}
            </span>
          )}
          <span>•</span>
          {getDifficultyBadge(concept.difficulty)}
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
          {concept.title}
        </h1>

        {/* Level 1 Core Idea Definition */}
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-serif leading-relaxed pt-1">
          {concept.oneLiner}
        </p>

        {/* Subtle Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 pt-3 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>6-Layer Explanation</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>First-Principles Knowledge Node</span>
          </div>
        </div>
      </div>
    </header>
  );
}
