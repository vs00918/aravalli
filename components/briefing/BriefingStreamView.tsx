"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  CanonicalTopic, 
  BankingCaMasterRegistry,
  PriorityLevel 
} from "@/lib/banking-ca/schema";
import { FormattedText } from "@/components/common/FormattedText";
import { formatTopicCategory, formatTopicDate } from "@/lib/banking-ca/formatters";
import { 
  BookOpen, 
  Clock, 
  Zap, 
  ArrowRight, 
  AlertTriangle,
  Calendar,
  RotateCw,
  Layers,
  ChevronRight
} from "lucide-react";

interface BriefingStreamViewProps {
  month: string;
  monthTitle: string;
  topics: CanonicalTopic[];
  registry: BankingCaMasterRegistry;
  initialCategory?: string;
  initialPriority?: string;
}

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  BANKING_REGULATION: "Banking & Regulation",
  MONETARY_POLICY: "Monetary Policy",
  CAPITAL_MARKETS: "Capital Markets & SEBI",
  GOVERNMENT_SCHEMES: "Government Schemes",
  MACRO_ECONOMY: "Economy & Fiscal",
  DIGITAL_PAYMENTS: "Digital Payments & UPI",
  APPOINTMENTS: "Key Appointments",
  INSURANCE_SECTOR: "Insurance & IRDAI",
  PENSION_SYSTEMS: "Pensions & PFRDA",
  REPORTS_AND_INDICES: "Reports & Indices",
  DEFENCE_AND_SCIENCE: "Defence & Science",
  SPORTS_AND_AWARDS: "Sports & Awards",
  NATIONAL_AND_STATES: "National & States",
  INTERNATIONAL_AFFAIRS: "International Affairs"
};

export function BriefingStreamView({
  month,
  monthTitle,
  topics,
  registry,
  initialCategory,
  initialPriority
}: BriefingStreamViewProps) {
  const [selectedPriority, setSelectedPriority] = useState<string>(initialPriority || "ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "ALL");
  const [selectedInstitution, setSelectedInstitution] = useState<string>("ALL");

  // Filter topics
  const filteredTopics = useMemo(() => {
    const filtered = topics.filter((t) => {
      if (selectedPriority !== "ALL") {
        if (selectedPriority === "P1" && !t.priority.startsWith("P1")) return false;
        if (selectedPriority === "P2" && t.priority !== "P2_HIGH") return false;
        if (selectedPriority === "P3" && t.priority !== "P3_MODERATE") return false;
      }
      if (selectedCategory !== "ALL" && t.primaryCategory !== selectedCategory) {
        return false;
      }
      if (selectedInstitution !== "ALL" && t.primaryInstitution !== selectedInstitution) {
        return false;
      }
      return true;
    });

    // Deterministic stream ordering: Priority Tier (P1 -> P2 -> P3) -> Event Date -> Slug
    const priorityWeight: Record<PriorityLevel, number> = {
      P1_CRITICAL_DEEP: 1,
      P1_CRITICAL_MEMORIZE: 2,
      P2_HIGH: 3,
      P3_MODERATE: 4,
      P4_LOW_YIELD: 5
    };

    return [...filtered].sort((a, b) => {
      const pDiff = (priorityWeight[a.priority] || 9) - (priorityWeight[b.priority] || 9);
      if (pDiff !== 0) return pDiff;
      if (a.initialEventDate !== b.initialEventDate) {
        return b.initialEventDate.localeCompare(a.initialEventDate);
      }
      return a.slug.localeCompare(b.slug);
    });
  }, [topics, selectedPriority, selectedCategory, selectedInstitution]);

  // Compute metrics
  const p1Count = topics.filter(t => t.priority.startsWith("P1")).length;
  const p2Count = topics.filter(t => t.priority === "P2_HIGH").length;
  const p3Count = topics.filter(t => t.priority === "P3_MODERATE").length;
  const totalMinutes = topics.reduce((acc, t) => acc + t.revisionMinutes, 0);

  // Available categories in this month
  const availableCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of topics) {
      counts[t.primaryCategory] = (counts[t.primaryCategory] || 0) + 1;
    }
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  }, [topics]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header & Summary Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-sm space-y-4 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-amber-900 dark:text-amber-400 font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Continuous Briefing Stream</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1 tracking-tight">
              {monthTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-mono">
              {topics.length} Canonical Briefings · ~{totalMinutes} min Total Reading Load
            </p>
          </div>

          {/* Metric Breakdown Badges */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800/40">
              {p1Count} P1
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[var(--surface-elevated)] text-[var(--text-primary)] font-semibold border border-[var(--border-primary)]">
              {p2Count} P2
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[var(--surface-elevated)] text-[var(--text-subtle)] border border-[var(--border-primary)]">
              {p3Count} P3
            </span>
          </div>
        </div>

        {/* 2. Interactive Filter Controls */}
        <div className="pt-4 border-t border-[var(--border-primary)] space-y-3">
          {/* Priority Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-[11px] text-[var(--text-subtle)] font-bold mr-1">Priority:</span>
            {[
              { id: "ALL", label: `All (${topics.length})` },
              { id: "P1", label: `P1 Critical (${p1Count})` },
              { id: "P2", label: `P2 High (${p2Count})` },
              { id: "P3", label: `P3 Moderate (${p3Count})` }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPriority(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all font-semibold ${
                  selectedPriority === p.id
                    ? "bg-amber-800 text-white shadow-xs"
                    : "bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Category Pills */}
          {availableCategories.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <span className="text-[11px] text-[var(--text-subtle)] font-bold mr-1">Category:</span>
              <button
                onClick={() => setSelectedCategory("ALL")}
                className={`px-2 py-0.5 rounded-md text-[11px] transition-all ${
                  selectedCategory === "ALL"
                    ? "bg-amber-800 text-white font-bold"
                    : "bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-primary)]"
                }`}
              >
                All Categories
              </button>
              {availableCategories.map((catKey) => {
                const count = topics.filter(t => t.primaryCategory === catKey).length;
                const label = CATEGORY_DISPLAY_NAMES[catKey] || catKey.replace(/_/g, " ");

                return (
                  <button
                    key={catKey}
                    onClick={() => setSelectedCategory(catKey)}
                    className={`px-2 py-0.5 rounded-md text-[11px] transition-all ${
                      selectedCategory === catKey
                        ? "bg-amber-800 text-white font-bold"
                        : "bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-primary)]"
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Empty Month State (if no topics ingested yet) */}
      {topics.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-3 shadow-xs select-none">
          <BookOpen className="w-10 h-10 mx-auto text-[var(--text-subtle)] opacity-60" />
          <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
            {monthTitle} — Queued / Awaiting Source Release
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
            This month is indexed in the 2026 Master Archive. Canonical notes, exam intelligence, and revision drills will appear automatically as coaching PDF batches are ingested.
          </p>
          <Link
            href="/briefing/2026-08"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-mono font-bold mt-2 shadow-xs"
          >
            <span>Read Active August 2026 Stream</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 4. Stream Cards List */}
      <div className="space-y-5">
        {filteredTopics.map((topic, index) => {
          const isP1 = topic.priority.startsWith("P1");
          const isP2 = topic.priority === "P2_HIGH";

          const categoryDisplay = formatTopicCategory(topic.primaryInstitution, topic.primaryCategory);
          const dateDisplay = formatTopicDate(topic.initialEventDate, topic.chronologicalMonth, topic.chronologicalWeek);

          return (
            <article
              key={topic.id}
              id={topic.slug}
              className={`rounded-2xl bg-[var(--surface-primary)] border transition-all shadow-sm ${
                isP1
                  ? "p-6 sm:p-7 border-amber-800/40 dark:border-amber-700/40 shadow-xs space-y-4"
                  : isP2
                  ? "p-5 sm:p-6 border-[var(--border-primary)] space-y-3.5"
                  : "p-4 sm:p-5 border-[var(--border-primary)] space-y-2.5" /* High density for P3 */
              }`}
            >
              {/* Card Meta Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-primary)]/80 select-none">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                  <span className="font-bold text-[var(--text-primary)]">
                    NOTE {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>·</span>
                  <span>{dateDisplay}</span>
                  <span>·</span>
                  <span className="font-semibold text-amber-900 dark:text-amber-400">
                    {categoryDisplay}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    isP1
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50"
                      : isP2
                      ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)]"
                      : "bg-[var(--surface-elevated)] text-[var(--text-subtle)] border border-[var(--border-primary)]"
                  }`}>
                    {topic.priority.replace(/_/g, " ")} · ~{topic.revisionMinutes}m
                  </span>

                  {/* ONLY render regulatory status if explicitly defined */}
                  {topic.regulatoryStatus && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800/40">
                      {topic.regulatoryStatus}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className={`font-serif font-bold text-[var(--text-primary)] leading-snug tracking-tight ${
                  isP1 ? "text-xl sm:text-2xl" : isP2 ? "text-lg sm:text-xl" : "text-base sm:text-lg"
                }`}>
                  <Link href={`/topics/${topic.slug}`} className="hover:underline">
                    {topic.title}
                  </Link>
                </h2>
                {topic.subtitle && (
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-serif italic">
                    {topic.subtitle}
                  </p>
                )}
              </div>

              {/* Change Alert (if active) */}
              {topic.changeAlert?.isChangeSensitive && (
                <div className="p-3 rounded-xl bg-amber-100/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-mono font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Change-Sensitive Fact Alert</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    <FormattedText text={topic.changeAlert.currentFactSummary} />
                  </p>
                </div>
              )}

              {/* WHAT HAPPENED Section */}
              {topic.whatHappened && topic.whatHappened.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] select-none">
                    What Happened
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed space-y-1">
                    {topic.whatHappened.map((para, pIdx) => (
                      <p key={pIdx}>
                        <FormattedText text={para} />
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* MUST MEMORIZE Section */}
              {topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0 && (
                <div className="space-y-1.5 p-3.5 rounded-xl bg-[var(--surface-elevated)]/60 border border-[var(--border-primary)]">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 select-none">
                    Must Memorize (Core Exam Numbers)
                  </div>
                  <ul className="space-y-1 text-xs sm:text-sm text-[var(--text-primary)]">
                    {topic.mustMemorizeFacts.map((fact, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <span className="text-amber-800 dark:text-amber-400 font-bold mt-0.5 select-none">•</span>
                        <span><FormattedText text={fact} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* EXAM FOCUS Section (Only if explicitly present) */}
              {topic.examFocus && topic.examFocus.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 select-none">
                    Exam Focus &amp; Tested Angles
                  </div>
                  <ul className="space-y-1 text-xs text-[var(--text-muted)]">
                    {topic.examFocus.map((focus, fcIdx) => (
                      <li key={fcIdx} className="flex items-start gap-2">
                        <span className="text-amber-800 font-bold select-none">↳</span>
                        <span><FormattedText text={focus} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Three Primary Actions (📖 Read, ⚡ Drill, 🧠 Revise) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-primary)]/80 select-none">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/topics/${topic.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-mono text-xs font-semibold transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-900 dark:text-amber-400" />
                    <span>📖 Read</span>
                  </Link>

                  <Link
                    href={`/revision?topic=${topic.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white font-mono text-xs font-bold transition-colors shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>⚡ Drill</span>
                  </Link>

                  <Link
                    href="/revision"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] font-mono text-xs transition-colors"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>🧠 Revise</span>
                  </Link>
                </div>

                <span className="text-[11px] font-mono text-[var(--text-subtle)]">
                  ~{topic.revisionMinutes} min revision load
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
