import React from "react";
import Link from "next/link";
import { Compass, BookOpen, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto py-16 sm:py-24 text-center space-y-6">
      <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
          404 · Uncharted Territory
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-slate-100">
          That idea hasn&rsquo;t entered the encyclopedia yet.
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-sans max-w-md mx-auto leading-relaxed">
          The concept, chapter, or reference page you are looking for does not exist or may have been reorganized in the knowledge tree.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 font-mono text-xs">
        <Link
          href="/"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/library"
          className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f1520] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Browse Library</span>
        </Link>
      </div>
    </div>
  );
}
