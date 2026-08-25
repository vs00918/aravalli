import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Layers } from "lucide-react";
import { Chapter } from "@/lib/types";

interface ChapterHeaderProps {
  chapter: Chapter & { concepts?: any[] };
}

export function ChapterHeader({ chapter }: ChapterHeaderProps) {
  const conceptCount = chapter.concepts?.length ?? 0;

  return (
    <div className="space-y-6 pb-6 border-b border-slate-200 dark:border-slate-800">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
        <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href="/library" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          Master Library
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">
          {chapter.title}
        </span>
      </div>

      {/* Chapter Title & Meta */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-[#111622] border border-slate-200 dark:border-slate-800">
            {chapter.icon}
          </span>
          <div>
            <span className="text-[11px] uppercase font-mono tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
              Volume {String(chapter.order).padStart(2, "0")}
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
              {chapter.title}
            </h1>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-sans max-w-3xl">
          {chapter.description}
        </p>

        {/* Metadata Badges */}
        <div className="flex items-center gap-4 pt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{conceptCount} {conceptCount === 1 ? "Concept" : "Concepts"} Documented</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Living Master Chapter</span>
          </div>
        </div>
      </div>
    </div>
  );
}
