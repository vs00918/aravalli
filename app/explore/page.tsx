import React from "react";
import { ConnectionsPreview } from "@/components/home/ConnectionsPreview";
import { QuestionsPreview } from "@/components/home/QuestionsPreview";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
        <Link href="/" className="hover:text-emerald-500 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-semibold">Explore</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
          Exploration & Curiosity Radar
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Discover cross-domain connections, shared mathematical principles, and foundational open questions.
        </p>
      </div>

      <ConnectionsPreview />
      <QuestionsPreview />
    </div>
  );
}
