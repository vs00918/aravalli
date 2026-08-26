"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  CanonicalTopic, 
  BankingCaMasterRegistry,
  PriorityLevel 
} from "@/lib/banking-ca/schema";
import { FormattedText } from "@/components/common/FormattedText";
import { formatTopicCategory, formatTopicDate } from "@/lib/banking-ca/formatters";
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
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Circle
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
  month,
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

  let globalNoteCounter = 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 font-serif">
      {/* 1. Quiet Stream Header */}
      <header className="space-y-4 pb-6 border-b border-[var(--border-primary)] select-none">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <div className="text-xs font-mono text-[var(--text-subtle)] uppercase tracking-wider">
              Monthly Current Affairs
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
          <Link
            href="/briefing/2026-08"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-mono font-bold mt-2 shadow-xs"
          >
            <span>Read Active August 2026 Stream</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 3. Category Sections */}
      <div className="space-y-10">
        {categoryGroups.map((group) => {
          return (
            <section
              key={group.categoryKey}
              id={`category-${group.categoryKey}`}
              className="space-y-4 scroll-mt-24"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between pb-2 border-b border-amber-800/30 dark:border-amber-700/30 select-none">
                <div className="flex items-center gap-2">
                  <span className="text-base">{group.icon}</span>
                  <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-amber-950 dark:text-amber-300">
                    {group.label}
                  </h2>
                </div>
                <span className="text-xs font-mono text-[var(--text-subtle)]">
                  {group.topics.length} {group.topics.length === 1 ? "Topic" : "Topics"}
                </span>
              </div>

              {/* Topics inside Category */}
              <div className="space-y-4">
                {group.topics.map((topic) => {
                  globalNoteCounter++;
                  const isP1 = topic.priority.startsWith("P1");
                  const isP2 = topic.priority === "P2_HIGH";
                  const isP3 = topic.priority === "P3_MODERATE" || topic.priority === "P4_LOW_YIELD";
                  const isRead = readSlugs.has(topic.slug);

                  // ─── P3 ULTRA-COMPACT FACTOID ───
                  if (isP3) {
                    return (
                      <article
                        key={topic.id}
                        id={topic.slug}
                        className={`p-3.5 sm:p-4 rounded-xl bg-[var(--surface-primary)] border transition-all ${
                          isRead
                            ? "border-[var(--border-primary)]/60 opacity-80"
                            : "border-[var(--border-primary)] hover:border-amber-800/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--text-primary)] leading-snug">
                              <Link href={`/topics/${topic.slug}`} className="hover:underline">
                                {topic.title}
                              </Link>
                            </h3>

                            {topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0 && (
                              <p className="text-xs sm:text-[13px] text-[var(--text-primary)] font-serif leading-relaxed">
                                <FormattedText text={topic.mustMemorizeFacts[0]} />
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => handleToggleRead(topic.slug)}
                            className="text-[var(--text-subtle)] hover:text-amber-800 dark:hover:text-amber-400 p-1 flex-shrink-0"
                            title={isRead ? "Mark as unread" : "Mark as read"}
                          >
                            {isRead ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  }

                  // ─── P1 & P2 CONTENT CARDS ───
                  return (
                    <article
                      key={topic.id}
                      id={topic.slug}
                      className={`p-5 sm:p-6 rounded-2xl bg-[var(--surface-primary)] border transition-all ${
                        isP1
                          ? "border-amber-800/40 dark:border-amber-700/40 space-y-4"
                          : "border-[var(--border-primary)] space-y-3.5"
                      } ${isRead ? "opacity-85" : ""}`}
                    >
                      {/* Quiet Header Line */}
                      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-subtle)] select-none">
                        <span className="uppercase tracking-wider font-semibold">
                          {formatTopicCategory(topic.primaryInstitution, topic.primaryCategory)}
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
                              <CheckCircle2 className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className={`font-serif font-bold text-[var(--text-primary)] leading-snug tracking-tight ${
                          isP1 ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                        }`}>
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
                        <div className="p-3 rounded-xl bg-amber-100/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs space-y-1 select-none">
                          <div className="flex items-center gap-1.5 font-mono font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Change-Sensitive Notice</span>
                          </div>
                          <p className="text-[11px] leading-relaxed">
                            <FormattedText text={topic.changeAlert.currentFactSummary} />
                          </p>
                        </div>
                      )}

                      {/* Context / What Happened snippet */}
                      {topic.whatHappened && topic.whatHappened.length > 0 && (
                        <div className="text-xs sm:text-sm text-[var(--text-primary)] font-serif leading-relaxed">
                          <p><FormattedText text={topic.whatHappened[0]} /></p>
                        </div>
                      )}

                      {/* KEY FACTS Bullets */}
                      {topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] select-none">
                            Key Facts
                          </div>
                          <ul className="space-y-1 text-xs sm:text-sm text-[var(--text-primary)] font-serif pl-1">
                            {topic.mustMemorizeFacts.slice(0, isP1 ? 4 : 3).map((fact, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <span className="text-amber-800 dark:text-amber-400 font-bold select-none">•</span>
                                <span><FormattedText text={fact} /></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Links */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-primary)] select-none text-xs font-mono">
                        <Link
                          href={`/topics/${topic.slug}`}
                          className="text-amber-900 dark:text-amber-300 hover:underline font-semibold inline-flex items-center gap-1"
                        >
                          <span>Read Full Note →</span>
                        </Link>

                        <Link
                          href={`/revision?topic=${topic.slug}`}
                          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] inline-flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3 fill-current" />
                          <span>Drill</span>
                        </Link>
                      </div>
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
