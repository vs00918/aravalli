"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  CanonicalTopic, 
  BankingCaMasterRegistry,
  PriorityLevel 
} from "@/lib/banking-ca/schema";
import { FormattedText } from "@/components/common/FormattedText";
import { formatCleanCategory } from "@/lib/banking-ca/formatters";
import { 
  CANONICAL_CATEGORY_NAMES, 
  CANONICAL_CATEGORY_ICONS, 
  compareCategoriesByExamRank, 
  compareTopicsForStudyStream 
} from "@/lib/banking-ca/category-order";
import { 
  getReadTopicSlugs, 
  toggleTopicReadSlug, 
  calculateMonthlyReadStats,
  MonthlyReadStats 
} from "@/lib/banking-ca/reading-state";
import { 
  BookOpen, 
  Clock, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Circle,
  FileText,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { TopicRenderer } from "./TopicRenderer";

interface BriefingStreamViewProps {
  month: string;
  monthTitle: string;
  topics: CanonicalTopic[];
  registry: BankingCaMasterRegistry;
  initialCategory?: string;
  initialPriority?: string;
}

export function BriefingStreamView({
  monthTitle,
  topics,
  registry,
  initialCategory,
  initialPriority
}: BriefingStreamViewProps) {
  const [selectedPriority, setSelectedPriority] = useState<string>(initialPriority || "ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "ALL");
  const [readSlugs, setReadSlugs] = useState<Set<string>>(new Set());

  // Initialize read state from localStorage
  useEffect(() => {
    setReadSlugs(getReadTopicSlugs());

    const handleReadChange = () => {
      setReadSlugs(getReadTopicSlugs());
    };

    window.addEventListener("banking_ca_read_state_changed", handleReadChange);
    return () => {
      window.removeEventListener("banking_ca_read_state_changed", handleReadChange);
    };
  }, []);

  // Filter topics
  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      if (selectedPriority !== "ALL") {
        if (selectedPriority === "P1" && !t.priority.startsWith("P1")) return false;
        if (selectedPriority === "P2" && t.priority !== "P2_HIGH") return false;
        if (selectedPriority === "P3" && t.priority !== "P3_MODERATE" && t.priority !== "P4_LOW_YIELD") return false;
      }
      if (selectedCategory !== "ALL" && t.primaryCategory !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [topics, selectedPriority, selectedCategory]);

  // Group topics by Category
  const categoryGroups = useMemo(() => {
    const groups: { categoryKey: string; label: string; icon: string; topics: CanonicalTopic[] }[] = [];
    const map = new Map<string, CanonicalTopic[]>();

    const priorityWeight: Record<PriorityLevel, number> = {
      P1_CRITICAL_DEEP: 1,
      P1_CRITICAL_MEMORIZE: 2,
      P2_HIGH: 3,
      P3_MODERATE: 4,
      P4_LOW_YIELD: 5
    };

    for (const t of filteredTopics) {
      if (!map.has(t.primaryCategory)) {
        map.set(t.primaryCategory, []);
      }
      map.get(t.primaryCategory)!.push(t);
    }

    // Sort categories deterministically strictly by EXAM IMPORTANCE RANK
    const sortedCatKeys = Array.from(map.keys()).sort(compareCategoriesByExamRank);

    for (const catKey of sortedCatKeys) {
      const catTopics = map.get(catKey)!;
      catTopics.sort(compareTopicsForStudyStream);

      groups.push({
        categoryKey: catKey,
        label: CANONICAL_CATEGORY_NAMES[catKey] || catKey.replace(/_/g, " "),
        icon: CANONICAL_CATEGORY_ICONS[catKey] || "📌",
        topics: catTopics
      });
    }

    return groups;
  }, [filteredTopics]);

  const handleToggleRead = (slug: string) => {
    const next = toggleTopicReadSlug(slug);
    const updated = new Set(readSlugs);
    if (next) {
      updated.add(slug);
    } else {
      updated.delete(slug);
    }
    setReadSlugs(updated);
  };

  // Metrics
  const p1Count = topics.filter(t => t.priority.startsWith("P1")).length;
  const p2Count = topics.filter(t => t.priority === "P2_HIGH").length;
  const p3Count = topics.filter(t => t.priority === "P3_MODERATE" || t.priority === "P4_LOW_YIELD").length;
  const totalMinutes = topics.reduce((acc, t) => acc + (t.revisionMinutes || 1), 0);

  const readStats: MonthlyReadStats = useMemo(() => {
    return calculateMonthlyReadStats(topics, readSlugs);
  }, [topics, readSlugs]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    topics.forEach(t => set.add(t.primaryCategory));
    return Array.from(set).sort(compareCategoriesByExamRank);
  }, [topics]);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24 font-serif">
      {/* 1. Quiet Stream Header */}
      <header className="space-y-4 pb-6 border-b border-[var(--border-primary)] select-none">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <div className="text-xs font-mono text-[var(--text-subtle)] uppercase tracking-wider">
              Continuous Reading Stream
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] tracking-tight mt-0.5">
              {monthTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
            <span>{topics.length} Topics</span>
            <span>·</span>
            <span>~{totalMinutes} min est. active reading time</span>
          </div>
        </div>

        {/* Progress Bar (Quiet) */}
        {topics.length > 0 && (
          <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)]">Read Progress:</span>
              <span className="font-bold text-[var(--text-primary)]">
                {readStats.readCount} of {readStats.totalTopics} ({readStats.progressPercent}%)
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[var(--text-subtle)]">
              <span>P1: {readStats.p1Read}/{readStats.p1Total}</span>
              <span>·</span>
              <span>P2: {readStats.p2Read}/{readStats.p2Total}</span>
              <span>·</span>
              <span>P3: {readStats.p3Read}/{readStats.p3Total}</span>
            </div>
          </div>
        )}

        {/* Interactive Filter Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          {/* Priority Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ALL", label: `All (${topics.length})` },
              { id: "P1", label: `Must Know (${p1Count})` },
              { id: "P2", label: `High Yield (${p2Count})` },
              { id: "P3", label: `Quick Scan (${p3Count})` }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPriority(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all font-medium ${
                  selectedPriority === p.id
                    ? "bg-amber-800 text-white shadow-xs font-bold"
                    : "bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-primary)]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Category Filter dropdown/reset */}
          {availableCategories.length > 1 && (
            <div className="flex items-center gap-1.5">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by Category"
                className="px-2.5 py-1 rounded-lg text-xs bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)] font-mono"
              >
                <option value="ALL">All Categories</option>
                {availableCategories.map((catKey) => (
                  <option key={catKey} value={catKey}>
                    {CANONICAL_CATEGORY_NAMES[catKey] || catKey.replace(/_/g, " ")} ({topics.filter(t => t.primaryCategory === catKey).length})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </header>

      {/* 2. Empty Month State */}
      {topics.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-3 select-none">
          <BookOpen className="w-10 h-10 mx-auto text-[var(--text-subtle)] opacity-60" />
          <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
            {monthTitle} — Queued / Awaiting Source Release
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
            This month is indexed in the 2026 Master Archive. Canonical notes and revision drills will appear automatically as coaching batches are ingested.
          </p>
        </div>
      )}

      {/* 3. Category Reading Sections */}
      <div className="space-y-12">
        {categoryGroups.map((group) => {
          return (
            <section
              key={group.categoryKey}
              id={`category-${group.categoryKey}`}
              className="space-y-6 scroll-mt-20"
            >
              {/* Category Editorial Header */}
              <div className="pt-6 pb-2 border-b-2 border-amber-900/30 dark:border-amber-700/30 flex items-baseline justify-between select-none">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{group.icon}</span>
                  <h2 className="text-sm sm:text-base font-mono font-bold uppercase tracking-wider text-amber-950 dark:text-amber-300">
                    {group.label}
                  </h2>
                </div>
                <span className="text-xs font-mono text-[var(--text-subtle)]">
                  {group.topics.length} {group.topics.length === 1 ? "topic" : "topics"}
                </span>
              </div>

              {/* Topics inside Category — Intelligent Visual Presentation Stream */}
              <div className="divide-y divide-[var(--border-primary)]/80">
                {group.topics.map((topic) => (
                  <TopicRenderer
                    key={topic.id}
                    topic={topic}
                    isRead={readSlugs.has(topic.slug)}
                    onToggleRead={handleToggleRead}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
