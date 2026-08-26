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

const CATEGORY_ICONS: Record<string, string> = {
  BANKING_REGULATION: "🏦",
  MONETARY_POLICY: "🏛️",
  CAPITAL_MARKETS: "📈",
  GOVERNMENT_SCHEMES: "📜",
  MACRO_ECONOMY: "📊",
  DIGITAL_PAYMENTS: "💳",
  APPOINTMENTS: "👔",
  INSURANCE_SECTOR: "🛡️",
  PENSION_SYSTEMS: "👵",
  REPORTS_AND_INDICES: "📋",
  DEFENCE_AND_SCIENCE: "🚀",
  SPORTS_AND_AWARDS: "🏆",
  NATIONAL_AND_STATES: "🇮🇳",
  INTERNATIONAL_AFFAIRS: "🌐"
};

export function BriefingStreamView({
  monthTitle,
  topics,
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

    // Sort categories deterministically by topic count descending
    const sortedCatKeys = Array.from(map.keys()).sort((a, b) => {
      const diff = map.get(b)!.length - map.get(a)!.length;
      if (diff !== 0) return diff;
      return a.localeCompare(b);
    });

    for (const catKey of sortedCatKeys) {
      const catTopics = map.get(catKey)!;
      catTopics.sort((a, b) => {
        const pDiff = (priorityWeight[a.priority] || 9) - (priorityWeight[b.priority] || 9);
        if (pDiff !== 0) return pDiff;
        if (a.initialEventDate !== b.initialEventDate) {
          return b.initialEventDate.localeCompare(a.initialEventDate);
        }
        return a.slug.localeCompare(b.slug);
      });

      groups.push({
        categoryKey: catKey,
        label: CATEGORY_DISPLAY_NAMES[catKey] || catKey.replace(/_/g, " "),
        icon: CATEGORY_ICONS[catKey] || "📌",
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
    return Array.from(set).sort((a, b) => {
      const countA = topics.filter(t => t.primaryCategory === a).length;
      const countB = topics.filter(t => t.primaryCategory === b).length;
      return countB - countA;
    });
  }, [topics]);

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-24 font-serif">
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
            <span>~{totalMinutes} min study load</span>
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
                    {CATEGORY_DISPLAY_NAMES[catKey] || catKey.replace(/_/g, " ")} ({topics.filter(t => t.primaryCategory === catKey).length})
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

              {/* Topics inside Category — Continuous Stream */}
              <div className="divide-y divide-[var(--border-primary)]/80">
                {group.topics.map((topic) => {
                  const isP1 = topic.priority.startsWith("P1");
                  const isP2 = topic.priority === "P2_HIGH";
                  const isP3 = topic.priority === "P3_MODERATE" || topic.priority === "P4_LOW_YIELD";
                  const isRead = readSlugs.has(topic.slug);

                  // ─── P3 ULTRA-COMPACT FACTOID INLINE ───
                  if (isP3) {
                    return (
                      <article
                        key={topic.id}
                        id={topic.slug}
                        className={`py-5 first:pt-2 space-y-2 transition-opacity ${
                          isRead ? "opacity-75" : ""
                        }`}
                      >
                        {/* Header controls line */}
                        <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-subtle)] select-none">
                          <span className="uppercase tracking-wider font-semibold text-[11px]">
                            {formatCleanCategory(topic.primaryCategory)}
                          </span>

                          <div className="flex items-center gap-3">
                            <span className="text-[11px]">~{topic.revisionMinutes || 1}m</span>
                            <button
                              onClick={() => handleToggleRead(topic.slug)}
                              className="hover:text-[var(--text-primary)]"
                              title={isRead ? "Mark as unread" : "Mark as read"}
                            >
                              {isRead ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Title (Link to optional standalone page) */}
                        <h3 className="font-serif font-bold text-base text-[var(--text-primary)] leading-snug">
                          <Link href={`/topics/${topic.slug}`} className="hover:underline text-[var(--text-primary)]">
                            {topic.title}
                          </Link>
                        </h3>

                        {/* Bullet points */}
                        {topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0 && (
                          <ul className="space-y-1 text-sm text-[var(--text-primary)] font-serif leading-relaxed pl-1">
                            {topic.mustMemorizeFacts.map((fact, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <span className="text-amber-800 dark:text-amber-400 font-bold select-none">•</span>
                                <span className="leading-relaxed"><FormattedText text={fact} /></span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    );
                  }

                  // ─── P2 HIGH-YIELD TOPIC INLINE ───
                  if (isP2) {
                    return (
                      <article
                        key={topic.id}
                        id={topic.slug}
                        className={`py-7 first:pt-2 space-y-4 transition-opacity ${
                          isRead ? "opacity-80" : ""
                        }`}
                      >
                        {/* Header controls line */}
                        <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-subtle)] select-none">
                          <span className="uppercase tracking-wider font-semibold text-[11px]">
                            {formatCleanCategory(topic.primaryCategory)}
                          </span>

                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1 text-[11px]">
                              <Clock className="w-3 h-3 text-[var(--text-subtle)]" />
                              <span>~{topic.revisionMinutes}m</span>
                            </span>

                            <button
                              onClick={() => handleToggleRead(topic.slug)}
                              className="hover:text-[var(--text-primary)]"
                              title={isRead ? "Mark as unread" : "Mark as read"}
                            >
                              {isRead ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                              )}
                            </button>

                            <Link
                              href={`/revision?topic=${topic.slug}`}
                              className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-900 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300/60 hover:bg-amber-200/80 transition-colors"
                              title="Practice Active Recall Drill"
                            >
                              <Zap className="w-2.5 h-2.5 fill-current" />
                              <span>Drill</span>
                            </Link>
                          </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                          <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--text-primary)] leading-snug tracking-tight">
                            <Link href={`/topics/${topic.slug}`} className="hover:underline">
                              {topic.title}
                            </Link>
                          </h3>
                          {topic.subtitle && (
                            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-serif italic">
                              {topic.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Change Alert (if active) */}
                        {topic.changeAlert?.isChangeSensitive && (
                          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/40 text-amber-950 dark:text-amber-200 text-xs flex items-start gap-2 select-none">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs leading-relaxed">
                              <FormattedText text={topic.changeAlert.currentFactSummary} />
                            </p>
                          </div>
                        )}

                        {/* Short Context / What Happened (if present) */}
                        {topic.whatHappened && topic.whatHappened.length > 0 && (
                          <div className="space-y-2 text-sm sm:text-[15px] text-[var(--text-primary)] font-serif leading-relaxed">
                            {topic.whatHappened.map((para, pIdx) => (
                              <p key={pIdx}><FormattedText text={para} /></p>
                            ))}
                          </div>
                        )}

                        {/* KEY FACTS */}
                        {topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <div className="text-xs font-mono font-bold tracking-wider text-[var(--text-subtle)] uppercase select-none">
                              KEY FACTS
                            </div>
                            <ul className="space-y-1.5 text-sm sm:text-[15px] font-serif leading-relaxed text-[var(--text-primary)] pl-1">
                              {topic.mustMemorizeFacts.map((fact, fIdx) => (
                                <li key={fIdx} className="flex items-start gap-2.5">
                                  <span className="text-amber-800 dark:text-amber-400 font-bold mt-0.5 text-xs select-none">•</span>
                                  <span className="flex-1 leading-relaxed"><FormattedText text={fact} /></span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* EXAM POINT (if examFocus present) */}
                        {topic.examFocus && topic.examFocus.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300/70 dark:border-amber-800/40 text-xs sm:text-sm font-sans space-y-1">
                            <div className="font-mono font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wider text-[11px] select-none">
                              EXAM POINT
                            </div>
                            <ul className="space-y-1 text-amber-950 dark:text-amber-200">
                              {topic.examFocus.map((focus, efIdx) => (
                                <li key={efIdx} className="flex items-start gap-2">
                                  <span className="font-bold text-amber-800 dark:text-amber-400 select-none">•</span>
                                  <span><FormattedText text={focus} /></span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Collapsed Provenance Details */}
                        <details className="pt-2 text-xs font-mono text-[var(--text-subtle)] select-none">
                          <summary className="cursor-pointer hover:text-[var(--text-primary)] transition-colors list-none flex items-center gap-1.5">
                            <FileText className="w-3 h-3 text-[var(--text-subtle)]" />
                            <span>Source details ▾</span>
                          </summary>
                          <div className="mt-2 p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-primary)] space-y-1.5 text-[11px]">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                              <span>Status: {topic.verificationStatus.replace(/_/g, " ")}</span>
                              <span>·</span>
                              <Calendar className="w-3 h-3 text-[var(--text-subtle)]" />
                              <span>Event: {topic.initialEventDate}</span>
                            </div>
                            {topic.sourceReferences && topic.sourceReferences.length > 0 && (
                              <div className="text-[var(--text-muted)]">
                                Sources: {topic.sourceReferences.map(s => `${s.sourceName} (${s.batchName})`).join(", ")}
                              </div>
                            )}
                          </div>
                        </details>
                      </article>
                    );
                  }

                  // ─── P1 CRITICAL DEEP TOPIC INLINE ───
                  return (
                    <article
                      key={topic.id}
                      id={topic.slug}
                      className={`py-9 first:pt-3 space-y-5 transition-opacity ${
                        isRead ? "opacity-85" : ""
                      }`}
                    >
                      {/* Header controls line */}
                      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-subtle)] select-none">
                        <span className="uppercase tracking-wider font-semibold text-[11px]">
                          {formatCleanCategory(topic.primaryCategory)}
                        </span>

                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 text-[11px]">
                            <Clock className="w-3 h-3 text-[var(--text-subtle)]" />
                            <span>~{topic.revisionMinutes} min</span>
                          </span>

                          <button
                            onClick={() => handleToggleRead(topic.slug)}
                            className="hover:text-[var(--text-primary)]"
                            title={isRead ? "Mark as unread" : "Mark as read"}
                          >
                            {isRead ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-[var(--text-subtle)]" />
                            )}
                          </button>

                          <Link
                            href={`/revision?topic=${topic.slug}`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-amber-900 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/40 hover:bg-amber-200/80 transition-colors"
                            title="Practice Active Recall Drill"
                          >
                            <Zap className="w-3 h-3 fill-current" />
                            <span>Drill</span>
                          </Link>
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)] leading-tight tracking-tight">
                          <Link href={`/topics/${topic.slug}`} className="hover:underline">
                            {topic.title}
                          </Link>
                        </h3>
                        {topic.subtitle && (
                          <p className="text-sm text-[var(--text-muted)] mt-1 font-serif italic">
                            {topic.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Change Alert (if active) */}
                      {topic.changeAlert?.isChangeSensitive && (
                        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200 select-none">
                          <AlertTriangle className="w-4 h-4 text-amber-800 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <FormattedText text={topic.changeAlert.currentFactSummary} />
                          </div>
                        </div>
                      )}

                      {/* WHAT HAPPENED */}
                      {topic.whatHappened && topic.whatHappened.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-mono font-bold tracking-wider text-[var(--text-subtle)] uppercase select-none">
                            WHAT HAPPENED
                          </div>
                          <div className="space-y-2.5 text-sm sm:text-[15px] text-[var(--text-primary)] font-serif leading-relaxed">
                            {topic.whatHappened.map((para, pIdx) => (
                              <p key={pIdx}><FormattedText text={para} /></p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* KEY NUMBERS / RULES */}
                      {topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-mono font-bold tracking-wider text-[var(--text-subtle)] uppercase select-none">
                            KEY NUMBERS / RULES
                          </div>
                          <ul className="space-y-2 text-sm sm:text-[15px] font-serif leading-relaxed text-[var(--text-primary)] pl-1">
                            {topic.mustMemorizeFacts.map((fact, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2.5">
                                <span className="text-amber-800 dark:text-amber-400 font-bold mt-0.5 text-xs select-none">•</span>
                                <span className="flex-1 leading-relaxed"><FormattedText text={fact} /></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* WHY IT MATTERS */}
                      {topic.knowUnderstandContext && topic.knowUnderstandContext.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-mono font-bold tracking-wider text-[var(--text-subtle)] uppercase select-none">
                            WHY IT MATTERS
                          </div>
                          <div className="space-y-2.5 text-sm sm:text-[15px] text-[var(--text-primary)] font-serif leading-relaxed">
                            {topic.knowUnderstandContext.map((para, pIdx) => (
                              <p key={pIdx}><FormattedText text={para} /></p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* EXAM TAKEAWAY */}
                      {topic.examFocus && topic.examFocus.length > 0 && (
                        <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300/80 dark:border-amber-800/40 text-xs sm:text-sm font-sans space-y-1.5">
                          <div className="font-mono font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wider text-[11px] select-none">
                            EXAM TAKEAWAY
                          </div>
                          <ul className="space-y-1 text-amber-950 dark:text-amber-200">
                            {topic.examFocus.map((focus, efIdx) => (
                              <li key={efIdx} className="flex items-start gap-2">
                                <span className="font-bold text-amber-800 dark:text-amber-400 select-none">•</span>
                                <span><FormattedText text={focus} /></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Collapsed Provenance Details */}
                      <details className="pt-2 text-xs font-mono text-[var(--text-subtle)] select-none">
                        <summary className="cursor-pointer hover:text-[var(--text-primary)] transition-colors list-none flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[var(--text-subtle)]" />
                          <span>Source &amp; verification details ▾</span>
                        </summary>
                        <div className="mt-2 p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-primary)] space-y-2 text-[11px]">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                            <span>Verification: {topic.verificationStatus.replace(/_/g, " ")}</span>
                            <span>·</span>
                            <Calendar className="w-3 h-3 text-[var(--text-subtle)]" />
                            <span>Event: {topic.initialEventDate}</span>
                          </div>
                          {topic.sourceReferences && topic.sourceReferences.length > 0 && (
                            <div className="text-[var(--text-muted)]">
                              Sources: {topic.sourceReferences.map(s => `${s.sourceName} (${s.batchName})`).join(", ")}
                            </div>
                          )}
                          <div className="pt-1 text-[10px]">
                            <Link href={`/topics/${topic.slug}`} className="text-amber-900 dark:text-amber-300 hover:underline">
                              Open standalone note page →
                            </Link>
                          </div>
                        </div>
                      </details>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
