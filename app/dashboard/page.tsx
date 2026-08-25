import React from "react";
import { getBankingCaRegistry, getP1Topics, getChangeSensitiveTopics, getExamProfiles } from "@/lib/banking-ca/data";
import { ExamTargetStrip } from "@/components/dashboard/ExamTargetStrip";
import { KnowledgeOverview } from "@/components/dashboard/KnowledgeOverview";
import { CoveragePeriodCards } from "@/components/dashboard/CoveragePeriodCards";
import { RapidRevisionSheets } from "@/components/dashboard/RapidRevisionSheets";
import { ContinueStudyingCard } from "@/components/dashboard/ContinueStudyingCard";
import { TodayStudyPlan } from "@/components/dashboard/TodayStudyPlan";
import { ChangeSensitiveCard } from "@/components/dashboard/ChangeSensitiveCard";
import { CurrentMonthSnapshot } from "@/components/dashboard/CurrentMonthSnapshot";
import { Sparkles, Calendar, Zap } from "lucide-react";

export const dynamic = "force-static";

export default function DashboardPage() {
  const registry = getBankingCaRegistry();
  const p1Topics = getP1Topics();
  const changeTopics = getChangeSensitiveTopics();
  const examProfiles = getExamProfiles();
  const defaultTopic = p1Topics[0] || Object.values(registry.topics)[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1. Command Center Hero & Greeting */}
      <div className="space-y-2 select-none">
        <div className="flex items-center gap-2 font-mono text-xs text-amber-900 dark:text-amber-400 font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Banking Current Affairs Command Center</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
          Good evening, Vishal
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-serif italic max-w-2xl">
          &ldquo;One focused session is enough to master today&apos;s banking intelligence and regulatory developments.&rdquo;
        </p>
      </div>

      {/* 2. Exam Target Strip */}
      <ExamTargetStrip profiles={examProfiles} />

      {/* 3. Current Affairs Overview Metrics */}
      <KnowledgeOverview summary={registry.summary} />

      {/* 4. 2026 Coverage Period Cards */}
      <CoveragePeriodCards registry={registry} />

      {/* 5. Section 11 / Rapid Revision Sheets */}
      <RapidRevisionSheets registry={registry} />

      {/* 6. Today's Revision Plan Launcher */}
      <TodayStudyPlan
        p1Count={registry.summary.activeP1Count}
        p1Minutes={registry.summary.activeP1RevisionMinutes}
      />

      {/* 7. Continue Studying & Change-Sensitive Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContinueStudyingCard defaultTopic={defaultTopic} />
        <ChangeSensitiveCard changeTopics={changeTopics} />
      </div>

      {/* 8. Monthly Ingestion Snapshot */}
      <CurrentMonthSnapshot
        batches={registry.batches}
        topicsCount={registry.summary.totalCanonicalTopics}
      />
    </div>
  );
}
