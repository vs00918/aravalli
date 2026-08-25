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
  Calendar, 
  RotateCw, 
  CheckCircle2, 
  Circle,
  Bookmark,
  Layers,
  ChevronDown
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
  const [activeNoteIndex, setActiveNoteIndex] = useState<number>(1);
  const [activeCategoryName, setActiveCategoryName] = useState<string>("");

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
        if (selectedPriority === "P3" && t.priority !== "P3_MODERATE") return false;
      }
      if (selectedCategory !== "ALL" && t.primaryCategory !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [topics, selectedPriority, selectedCategory]);

  // Group topics by Category for newspaper section layout
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
      // Sort topics within category: P1 -> P2 -> P3 -> Event Date -> Slug
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

  // Personal study reading stats
  const readStats: MonthlyReadStats = useMemo(() => {
    return calculateMonthlyReadStats(topics, readSlugs);
  }, [topics, readSlugs]);

  // Compute metrics
  const p1Count = topics.filter(t => t.priority.startsWith("P1")).length;
  const p2Count = topics.filter(t => t.priority === "P2_HIGH").length;
  const p3Count = topics.filter(t => t.priority === "P3_MODERATE").length;
  const totalMinutes = topics.reduce((acc, t) => acc + t.revisionMinutes, 0);

  const availableCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of topics) {
      counts[t.primaryCategory] = (counts[t.primaryCategory] || 0) + 1;
    }
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  }, [topics]);

  // Scroll listener for reading position indicator
  useEffect(() => {
    const handleScroll = () => {
      const articles = document.querySelectorAll("article[id]");
      if (articles.length === 0) return;

      let currentNote = 1;
      let currentCategory = "";

      for (let i = 0; i < articles.length; i++) {
        const rect = articles[i].getBoundingClientRect();
        if (rect.top <= 200) {
          currentNote = i + 1;
          const sectionEl = articles[i].closest("section");
          if (sectionEl) {
            const h2 = sectionEl.querySelector("h2");
            if (h2) currentCategory = h2.textContent || "";
          }
        }
      }

      setActiveNoteIndex(currentNote);
      setActiveCategoryName(currentCategory);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredTopics]);

  const handleToggleRead = (slug: string) => {
    toggleTopicReadSlug(slug);
  };

  let globalNoteCounter = 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      {/* 1. Sticky Reading Position Bar (Kindle Style) */}
      <aside aria-label="Reading Position" className="sticky top-14 z-20 -mx-4 px-4 py-2 bg-[var(--surface-primary)]/90 backdrop-blur-md border-b border-[var(--border-primary)] shadow-2xs flex items-center justify-between text-xs font-mono select-none">
        <div className="flex items-center gap-2 text-[var(--text-muted)] truncate">
          <span className="font-bold text-[var(--text-primary)]">{monthTitle}</span>
          <span>·</span>
          <span className="truncate text-amber-900 dark:text-amber-400 font-semibold">
            {activeCategoryName || "Briefing Stream"}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[11px] text-[var(--text-subtle)] font-bold">
            Note {activeNoteIndex} of {filteredTopics.length}
          </span>
          <div className="w-16 sm:w-24 h-1.5 rounded-full bg-[var(--surface-elevated)] overflow-hidden border border-[var(--border-primary)]">
            <div 
              className="h-full bg-amber-800 dark:bg-amber-600 transition-all duration-300"
              style={{ width: `${filteredTopics.length > 0 ? (activeNoteIndex / filteredTopics.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </aside>

      {/* 2. Header & Summary Banner */}
      <header className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-sm space-y-4 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-amber-900 dark:text-amber-400 font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Current Affairs Briefing Stream</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1 tracking-tight">
              {monthTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-mono">
              {topics.length} Canonical Briefings · ~{totalMinutes} min Study Load
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

        {/* Personal Study Reading Progress Bar */}
        {topics.length > 0 && (
          <div className="p-3 rounded-xl bg-[var(--surface-elevated)]/60 border border-[var(--border-primary)] space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-muted)] flex items-center gap-1.5 font-semibold">
                <Bookmark className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                <span>Reading Progress</span>
              </span>
              <span className="text-[var(--text-primary)] font-bold">
                {readStats.readCount} / {readStats.totalTopics} ({readStats.progressPercent}%)
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-[var(--surface-primary)] border border-[var(--border-primary)] overflow-hidden">
              <div 
                className="h-full bg-amber-800 dark:bg-amber-600 transition-all duration-500 rounded-full"
                style={{ width: `${readStats.progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-subtle)] pt-0.5">
              <span>P1: {readStats.p1Read} / {readStats.p1Total}</span>
              <span>P2: {readStats.p2Read} / {readStats.p2Total}</span>
              <span>P3: {readStats.p3Read} / {readStats.p3Total}</span>
            </div>
          </div>
        )}

        {/* 3. Interactive Filter Controls */}
        <div className="pt-3 border-t border-[var(--border-primary)] space-y-3">
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

          {/* Category Navigation Pills (Scroll to Anchor or Filter) */}
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
                    onClick={() => {
                      if (selectedCategory === "ALL") {
                        // Smooth scroll to category anchor
                        const el = document.getElementById(`category-${catKey}`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      } else {
                        setSelectedCategory(catKey);
                      }
                    }}
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
      </header>

      {/* 4. Empty Month State (if no topics ingested yet) */}
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

      {/* 5. Category-Grouped Newspaper Stream */}
      <div className="space-y-10">
        {categoryGroups.map((group) => {
          return (
            <section
              key={group.categoryKey}
              id={`category-${group.categoryKey}`}
              className="space-y-4 scroll-mt-24"
            >
              {/* Category Separator Header */}
              <div className="flex items-center justify-between pb-2 border-b-2 border-amber-800/30 dark:border-amber-700/30 select-none">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{group.icon}</span>
                  <h2 className="text-sm sm:text-base font-mono font-bold uppercase tracking-wider text-amber-950 dark:text-amber-300">
                    {group.label}
                  </h2>
                </div>
                <span className="text-xs font-mono text-[var(--text-subtle)] font-bold">
                  {group.topics.length} {group.topics.length === 1 ? "Briefing" : "Briefings"}
                </span>
              </div>

              {/* Notes within Category */}
              <div className="space-y-4">
                {group.topics.map((topic) => {
                  globalNoteCounter++;
                  const noteNumber = globalNoteCounter;
                  const isP1 = topic.priority.startsWith("P1");
                  const isP2 = topic.priority === "P2_HIGH";
                  const isP3 = topic.priority === "P3_MODERATE";
                  const isRead = readSlugs.has(topic.slug);

                  const dateDisplay = formatTopicDate(topic.initialEventDate, topic.chronologicalMonth, topic.chronologicalWeek);

                  // ─── P3 ULTRA-COMPACT FACTOID CARD ───
                  if (isP3) {
                    return (
                      <article
                        key={topic.id}
                        id={topic.slug}
                        className={`p-3.5 sm:p-4 rounded-xl bg-[var(--surface-primary)] border transition-all ${
                          isRead
                            ? "border-[var(--border-primary)]/50 opacity-80"
                            : "border-[var(--border-primary)] shadow-2xs hover:border-amber-800/40"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-1">
                          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                            <button
                              onClick={() => handleToggleRead(topic.slug)}
                              className="text-[var(--text-subtle)] hover:text-amber-800 dark:hover:text-amber-400"
                              title={isRead ? "Mark as unread" : "Mark as read"}
                            >
                              {isRead ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                              ) : (
                                <Circle className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <span className="font-bold text-[var(--text-primary)]">
                              NOTE {String(noteNumber).padStart(2, "0")}
                            </span>
                            <span>·</span>
                            <span>{dateDisplay}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--surface-elevated)] text-[var(--text-subtle)] border border-[var(--border-primary)]">
                              P3 · ~1m
                            </span>
                          </div>
                        </div>

                        {/* P3 Content */}
                        <div className="space-y-1.5 pt-1">
                          <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--text-primary)] leading-snug">
                            <Link href={`/topics/${topic.slug}`} className="hover:underline">
                              {topic.title}
                            </Link>
                          </h3>

                          {topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0 && (
                            <p className="text-xs text-[var(--text-primary)] leading-relaxed font-sans">
                              <FormattedText text={topic.mustMemorizeFacts[0]} />
                            </p>
                          )}

                          {/* P3 Action strip */}
                          <div className="flex items-center justify-between pt-2 text-[11px] font-mono border-t border-[var(--border-primary)]/50 select-none">
                            <div className="flex items-center gap-3">
                              <Link
                                href={`/topics/${topic.slug}`}
                                className="text-amber-900 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
                              >
                                <span>📖 Deep Reader</span>
                              </Link>
                              <Link
                                href={`/revision?topic=${topic.slug}`}
                                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1"
                              >
                                <span>⚡ Drill</span>
                              </Link>
                            </div>

                            <button
                              onClick={() => handleToggleRead(topic.slug)}
                              className="text-[10px] text-[var(--text-subtle)] hover:text-[var(--text-primary)]"
                            >
                              {isRead ? "✓ Read" : "Mark Read"}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  }

                  // ─── P1 & P2 HIGH-DENSITY BRIEFING CARDS ───
                  return (
                    <article
                      key={topic.id}
                      id={topic.slug}
                      className={`rounded-2xl bg-[var(--surface-primary)] border transition-all ${
                        isP1
                          ? "p-6 sm:p-7 border-amber-800/40 dark:border-amber-700/40 shadow-xs space-y-4"
                          : "p-5 sm:p-6 border-[var(--border-primary)] space-y-3.5 shadow-2xs"
                      } ${isRead ? "opacity-85" : ""}`}
                    >
                      {/* Card Meta Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-primary)]/80 select-none">
                        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                          <button
                            onClick={() => handleToggleRead(topic.slug)}
                            className="text-[var(--text-subtle)] hover:text-amber-800 dark:hover:text-amber-400"
                            title={isRead ? "Mark as unread" : "Mark as read"}
                          >
                            {isRead ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                          <span className="font-bold text-[var(--text-primary)]">
                            NOTE {String(noteNumber).padStart(2, "0")}
                          </span>
                          <span>·</span>
                          <span>{dateDisplay}</span>
                          <span>·</span>
                          <span className="font-semibold text-amber-900 dark:text-amber-400">
                            {formatTopicCategory(topic.primaryInstitution, topic.primaryCategory)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            isP1
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50"
                              : "bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)]"
                          }`}>
                            {topic.priority.replace(/_/g, " ")} · ~{topic.revisionMinutes}m
                          </span>

                          {topic.regulatoryStatus && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800/40">
                              {topic.regulatoryStatus}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title */}
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
                            Must Memorize (Core Exam Facts)
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
                            🎯 Exam Focus &amp; Tested Angles
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
                            <span>📖 Deep Reader</span>
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

                        <button
                          onClick={() => handleToggleRead(topic.slug)}
                          className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          {isRead ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-3.5 h-3.5" />
                              <span>Mark Read</span>
                            </>
                          )}
                        </button>
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
