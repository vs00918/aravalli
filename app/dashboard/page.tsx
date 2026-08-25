import React from "react";
import { getBankingCaRegistry, getP1Topics, getChangeSensitiveTopics } from "@/lib/banking-ca/data";
import { KnowledgeOverview } from "@/components/dashboard/KnowledgeOverview";
import { TodaysRevisionDeck } from "@/components/dashboard/TodaysRevisionDeck";
import { ChangeSensitiveCard } from "@/components/dashboard/ChangeSensitiveCard";
import { CurrentMonthSnapshot } from "@/components/dashboard/CurrentMonthSnapshot";
import { RecentlyUpdatedFeed } from "@/components/dashboard/RecentlyUpdatedFeed";

export const dynamic = "force-static";

export default function DashboardPage() {
  const registry = getBankingCaRegistry();
  const p1Topics = getP1Topics();
  const changeTopics = getChangeSensitiveTopics();
  const allTopics = Object.values(registry.topics);

  return (
    <div className="space-y-8">
      {/* Top Welcome / Status Hero */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Ingestion Cycle · April 2026 Onward</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
          Current Affairs Command Center
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-3xl leading-relaxed">
          Optimized exam intelligence for SBI PO &amp; IBPS PO Mains. Filtered, canonicalized, and strictly prioritized by expected exam yield per minute of revision.
        </p>
      </div>

      {/* 1. Dynamic Knowledge Overview Metrics */}
      <KnowledgeOverview summary={registry.summary} />

      {/* 2. Today's Core Revision Deck (P1 Master Items) */}
      <TodaysRevisionDeck
        p1Topics={p1Topics}
        totalMinutes={registry.summary.activeP1RevisionMinutes}
      />

      {/* 3. Grid for Alerts, Current Month & Recent Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ChangeSensitiveCard changeTopics={changeTopics} />
          <CurrentMonthSnapshot
            batches={registry.batches}
            topicsCount={registry.summary.totalCanonicalTopics}
          />
        </div>
        <div>
          <RecentlyUpdatedFeed topics={allTopics} />
        </div>
      </div>
    </div>
  );
}
