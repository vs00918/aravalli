"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  CanonicalTopic,
  BankingCaMasterRegistry,
  PriorityLevel
} from "@/lib/banking-ca/schema";
import {
  MAGAZINE_SECTIONS,
  groupTopicsByMagazineSection,
  SectionGroup
} from "@/lib/banking-ca/monthly-magazine-sections";
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
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
  Filter,
  Check,
  Bookmark,
  Info
} from "lucide-react";
import { TopicRenderer } from "./TopicRenderer";
import { RapidRecallGrid } from "./primitives/RapidRecallGrid";

interface AugustMagazineViewProps {
  month: string;
  monthTitle: string;
  topics: CanonicalTopic[];
  registry: BankingCaMasterRegistry;
  initialPriority?: string;
  initialSection?: string;
}

export function AugustMagazineView({
  month,
  monthTitle,
  topics,
  registry,
  initialPriority,
  initialSection
}: AugustMagazineViewProps) {
  const [selectedPriority, setSelectedPriority] = useState<string>(initialPriority || "ALL");
  const [selectedSection, setSelectedSection] = useState<string>(initialSection || "ALL");
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

  const handleToggleRead = (slug: string) => {
    toggleTopicReadSlug(slug);
    setReadSlugs(getReadTopicSlugs());
  };

  // Filter topics by priority
  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      if (selectedPriority !== "ALL") {
        if (selectedPriority === "P1" && !t.priority.startsWith("P1")) return false;
        if (selectedPriority === "P2" && t.priority !== "P2_HIGH") return false;
        if (selectedPriority === "P3" && t.priority !== "P3_MODERATE") return false;
        if (selectedPriority === "P4" && t.priority !== "P4_LOW_YIELD") return false;
      }
      return true;
    });
  }, [topics, selectedPriority]);

  // Group filtered topics into the 10 magazine sections
  const sectionGroups: SectionGroup[] = useMemo(() => {
    const groups = groupTopicsByMagazineSection(filteredTopics);
    if (selectedSection === "ALL") return groups;
    return groups.filter((g) => g.section.id === selectedSection);
  }, [filteredTopics, selectedSection]);

  // Global month metrics
  const totalP1 = useMemo(() => topics.filter((t) => t.priority.startsWith("P1")).length, [topics]);
  const totalP2 = useMemo(() => topics.filter((t) => t.priority === "P2_HIGH").length, [topics]);
  const totalP3 = useMemo(() => topics.filter((t) => t.priority === "P3_MODERATE").length, [topics]);
  const totalP4 = useMemo(() => topics.filter((t) => t.priority === "P4_LOW_YIELD").length, [topics]);

  // P4 adds 0 study load to core revision estimate
  const totalEstMinutes = useMemo(() => {
    return topics.reduce((acc, t) => {
      if (t.priority === "P4_LOW_YIELD") return acc;
      return acc + (t.revisionMinutes || 2);
    }, 0);
  }, [topics]);

  const totalHours = Math.round((totalEstMinutes / 60) * 10) / 10;

  const readCount = useMemo(() => {
    return topics.filter((t) => readSlugs.has(t.slug)).length;
  }, [topics, readSlugs]);

  const readPercent = topics.length > 0 ? Math.round((readCount / topics.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      {/* 1. EXECUTIVE MAGAZINE MASTHEAD */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/briefing"
              className="text-xs font-mono text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← Back to Archives
            </Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                EXAM MAGAZINE V2
              </span>
              <h1 className="text-base font-bold tracking-tight text-[var(--text-primary)]">
                {monthTitle} Briefing
              </h1>
            </div>
          </div>

          {/* Quick Stats in Masthead */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{readCount}/{topics.length} read ({readPercent}%)</span>
            </div>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span className="text-[var(--text-subtle)]">~{totalHours}h core study load</span>
          </div>
        </div>

        {/* 2. SECTION NAV STRIP */}
        <div className="max-w-6xl mx-auto px-4 py-2 border-t border-gray-100 dark:border-gray-900 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setSelectedSection("ALL")}
            className={`shrink-0 px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedSection === "ALL"
                ? "bg-[var(--text-primary)] text-[var(--background)] shadow-xs"
                : "bg-gray-100 dark:bg-gray-900 text-[var(--text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            All 10 Sections
          </button>
          {MAGAZINE_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedSection === sec.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-900 text-[var(--text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.number}. {sec.shortTitle}</span>
            </button>
          ))}
        </div>
      </header>

      {/* 3. HERO STUDY MAP & PRIORITY FILTER */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <div className="rounded-3xl border border-gray-200/90 dark:border-gray-800/80 bg-gradient-to-br from-indigo-50/40 via-white dark:via-gray-950 to-emerald-50/30 dark:to-emerald-950/20 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 dark:border-gray-800 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-700 dark:text-indigo-400 font-semibold">
                Officer-Level Banking GA Briefing • Semantic Pipeline V2
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                August 2026 Executive Intelligence
              </h2>
              <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
                Strict semantic routing across 10 subject domains. Decoupled from source channels. Target profile: SBI PO Mains (Sep 2026) & IBPS PO Mains (Oct 2026).
              </p>
            </div>

            {/* Priority Filter Controls */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-subtle)]">
                Filter by Exam Priority:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
                {[
                  { key: "ALL", label: "All Items", count: topics.length },
                  { key: "P1", label: "🔴 P1 Critical", count: totalP1 },
                  { key: "P2", label: "🟠 P2 High-Yield", count: totalP2 },
                  { key: "P3", label: "🟡 P3 Rapid", count: totalP3 },
                  { key: "P4", label: "⚪ P4 Background", count: totalP4 }
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPriority(p.key)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedPriority === p.key
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {p.label} ({p.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Study Map Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-gray-900/60 border border-red-200/80 dark:border-red-900/30">
              <div className="text-[11px] text-red-700 dark:text-red-400 font-bold uppercase">P1 Critical Topics</div>
              <div className="text-2xl font-black text-[var(--text-primary)] mt-1">{totalP1}</div>
              <div className="text-[10px] text-[var(--text-subtle)] mt-0.5">Deep regulatory & policy overhauls</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-gray-900/60 border border-amber-200/80 dark:border-amber-900/30">
              <div className="text-[11px] text-amber-700 dark:text-amber-400 font-bold uppercase">P2 High-Yield</div>
              <div className="text-2xl font-black text-[var(--text-primary)] mt-1">{totalP2}</div>
              <div className="text-[10px] text-[var(--text-subtle)] mt-0.5">Core schemes, reports & banking</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-gray-900/60 border border-blue-200/80 dark:border-blue-900/30">
              <div className="text-[11px] text-blue-700 dark:text-blue-400 font-bold uppercase">P3 Rapid Recall</div>
              <div className="text-2xl font-black text-[var(--text-primary)] mt-1">{totalP3}</div>
              <div className="text-[10px] text-[var(--text-subtle)] mt-0.5">1-min scan factoids & records</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-gray-900/60 border border-emerald-200/80 dark:border-emerald-900/30">
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">Core Exam Load</div>
              <div className="text-2xl font-black text-[var(--text-primary)] mt-1">~{totalHours} hrs</div>
              <div className="text-[10px] text-[var(--text-subtle)] mt-0.5">Estimated active reading/scan time</div>
            </div>
          </div>
        </div>

        {/* 4. THE 10 FIXED MAGAZINE SECTIONS */}
        <div className="space-y-16">
          {sectionGroups.map((group) => {
            const sec = group.section;
            // Separate P1/P2 substantial topics from P3 rapid factoids and P4 background
            const deepTopics = group.topics.filter(
              (t) => t.priority.startsWith("P1") || t.priority === "P2_HIGH"
            );
            const rapidTopics = group.topics.filter(
              (t) => t.priority === "P3_MODERATE"
            );
            const backgroundTopics = group.topics.filter(
              (t) => t.priority === "P4_LOW_YIELD"
            );

            return (
              <section
                key={sec.id}
                id={sec.id}
                className="space-y-6 scroll-mt-28"
              >
                {/* SECTION HEADER BANNER (Quiet Editorial Style) */}
                <div className="pt-8 pb-3 border-b-2 border-gray-900/10 dark:border-gray-100/10 flex flex-col md:flex-row md:items-baseline justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                        SECTION {sec.number}
                      </span>
                      <span className="text-gray-300 dark:text-gray-700">•</span>
                      <span className="text-xs font-mono text-[var(--text-subtle)]">
                        {group.topics.length} Topics (~{group.totalRevisionTime} min study)
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl select-none">{sec.icon}</span>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[var(--text-primary)]">
                        {sec.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] font-sans">
                      {sec.description}
                    </p>
                  </div>

                  {/* Priority pills inside section header */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono shrink-0">
                    {group.p1Count > 0 && (
                      <span className="px-2 py-0.5 rounded font-semibold bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-300">
                        {group.p1Count} P1
                      </span>
                    )}
                    {group.p2Count > 0 && (
                      <span className="px-2 py-0.5 rounded font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">
                        {group.p2Count} P2
                      </span>
                    )}
                    {group.p3Count > 0 && (
                      <span className="px-2 py-0.5 rounded font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300">
                        {group.p3Count} P3
                      </span>
                    )}
                    {group.p4Count > 0 && (
                      <span className="px-2 py-0.5 rounded font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {group.p4Count} P4
                      </span>
                    )}
                  </div>
                </div>

                {/* SUBSTANTIAL TOPICS (P1 & P2) WITH INTERNAL SUBGROUPS WHERE APPROPRIATE */}
                {deepTopics.length > 0 && (
                  <div className="space-y-6">
                    {/* SECTION 06 SUBGROUPS */}
                    {sec.number === "06" ? (
                      <div className="space-y-8">
                        {/* Subgroup A: Sci-Tech */}
                        {(() => {
                          const sciTech = deepTopics.filter(
                            (t) =>
                              t.informationType === "SPACE" ||
                              t.informationType === "SCIENCE_DISCOVERY" ||
                              t.informationType === "TECHNOLOGY"
                          );
                          if (sciTech.length === 0) return null;
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-950 dark:text-indigo-300 border-b border-indigo-200/60 dark:border-indigo-900/40 pb-1.5 uppercase">
                                <span>🔬</span>
                                <span>SCIENCE & TECHNOLOGY ({sciTech.length} Items)</span>
                              </div>
                              <div className="divide-y divide-gray-100 dark:divide-gray-800/60 pl-1 md:pl-2">
                                {sciTech.map((topic) => (
                                  <TopicRenderer
                                    key={topic.slug}
                                    topic={topic}
                                    isRead={readSlugs.has(topic.slug)}
                                    onToggleRead={handleToggleRead}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Subgroup B: Defence */}
                        {(() => {
                          const defence = deepTopics.filter(
                            (t) =>
                              t.informationType === "DEFENCE_EXERCISE" ||
                              t.informationType === "DEFENCE_SYSTEM"
                          );
                          if (defence.length === 0) return null;
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 dark:text-slate-300 border-b border-slate-200/60 dark:border-slate-800/40 pb-1.5 uppercase">
                                <span>🛡️</span>
                                <span>DEFENCE & STRATEGIC SYSTEMS ({defence.length} Items)</span>
                              </div>
                              <div className="divide-y divide-gray-100 dark:divide-gray-800/60 pl-1 md:pl-2">
                                {defence.map((topic) => (
                                  <TopicRenderer
                                    key={topic.slug}
                                    topic={topic}
                                    isRead={readSlugs.has(topic.slug)}
                                    onToggleRead={handleToggleRead}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Subgroup C: Sports */}
                        {(() => {
                          const sports = deepTopics.filter(
                            (t) =>
                              t.informationType === "SPORTS_EVENT" ||
                              t.primaryCategory === "SPORTS_AND_AWARDS"
                          );
                          if (sports.length === 0) return null;
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-950 dark:text-emerald-300 border-b border-emerald-200/60 dark:border-emerald-900/40 pb-1.5 uppercase">
                                <span>🏅</span>
                                <span>SPORTS & ACHIEVEMENTS ({sports.length} Items)</span>
                              </div>
                              <div className="divide-y divide-gray-100 dark:divide-gray-800/60 pl-1 md:pl-2">
                                {sports.map((topic) => (
                                  <TopicRenderer
                                    key={topic.slug}
                                    topic={topic}
                                    isRead={readSlugs.has(topic.slug)}
                                    onToggleRead={handleToggleRead}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : sec.number === "10" ? (
                      /* SECTION 10 SUBGROUPS */
                      <div className="space-y-8">
                        {/* Subgroup A: Government Schemes */}
                        {(() => {
                          const schemes = deepTopics.filter(
                            (t) =>
                              t.informationType === "SCHEME" ||
                              t.informationType === "PROGRAMME" ||
                              t.primaryCategory === "GOVERNMENT_SCHEMES"
                          );
                          if (schemes.length === 0) return null;
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-950 dark:text-teal-300 border-b border-teal-200/60 dark:border-teal-900/40 pb-1.5 uppercase">
                                <span>📌</span>
                                <span>GOVERNMENT SCHEMES & MISSIONS ({schemes.length} Items)</span>
                              </div>
                              <div className="divide-y divide-gray-100 dark:divide-gray-800/60 pl-1 md:pl-2">
                                {schemes.map((topic) => (
                                  <TopicRenderer
                                    key={topic.slug}
                                    topic={topic}
                                    isRead={readSlugs.has(topic.slug)}
                                    onToggleRead={handleToggleRead}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Subgroup B: Static GK & Institutional Facts */}
                        {(() => {
                          const staticGk = deepTopics.filter(
                            (t) =>
                              t.informationType !== "SCHEME" &&
                              t.informationType !== "PROGRAMME" &&
                              t.primaryCategory !== "GOVERNMENT_SCHEMES"
                          );
                          if (staticGk.length === 0) return null;
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-950 dark:text-amber-300 border-b border-amber-200/60 dark:border-amber-900/40 pb-1.5 uppercase">
                                <span>📚</span>
                                <span>STATIC GK & INSTITUTIONAL ARCHITECTURE ({staticGk.length} Items)</span>
                              </div>
                              <div className="divide-y divide-gray-100 dark:divide-gray-800/60 pl-1 md:pl-2">
                                {staticGk.map((topic) => (
                                  <TopicRenderer
                                    key={topic.slug}
                                    topic={topic}
                                    isRead={readSlugs.has(topic.slug)}
                                    onToggleRead={handleToggleRead}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      /* STANDARD SECTION LIST */
                      <div className="divide-y divide-gray-100 dark:divide-gray-800/60 pl-1 md:pl-2">
                        {deepTopics.map((topic) => (
                          <TopicRenderer
                            key={topic.slug}
                            topic={topic}
                            isRead={readSlugs.has(topic.slug)}
                            onToggleRead={handleToggleRead}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* GROUPED RAPID RECALL CAPSULE (P3 FACTOIDS) */}
                {rapidTopics.length > 0 && (
                  <RapidRecallGrid
                    topics={rapidTopics}
                    readSlugs={readSlugs}
                    onToggleRead={handleToggleRead}
                  />
                )}

                {/* BACKGROUND / OPTIONAL STRIP (P4 FACTOIDS) */}
                {backgroundTopics.length > 0 && (
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-subtle)] font-medium">
                      <Info className="w-3.5 h-3.5" />
                      <span>BACKGROUND REFERENCE & OPTIONAL GK ({backgroundTopics.length} Items • Zero Study Burden)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                      {backgroundTopics.map((t) => (
                        <div key={t.slug} className="p-2 rounded-lg bg-white/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 flex items-center justify-between gap-2">
                          <span className="truncate">{t.title}</span>
                          <Link href={`/topics/${t.slug}`} className="text-[10px] text-indigo-600 hover:underline shrink-0">
                            View ↗
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
