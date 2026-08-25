"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BankingCaMasterRegistry, CanonicalTopic } from "@/lib/banking-ca/schema";
import { 
  buildRevisionDeck, 
  buildSingleTopicDeck, 
  generateRecallPrompts, 
  SelectedRevisionDeck, 
  RecallPrompt 
} from "@/lib/banking-ca/revision-engine";
import { 
  revisionRepository, 
  TopicRevisionRecord, 
  SelfRating 
} from "@/lib/banking-ca/revision-state";
import { ActiveRecallSession } from "./ActiveRecallSession";
import { SessionCompleteView } from "./SessionCompleteView";
import { 
  Clock, 
  Flame, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  ShieldAlert
} from "lucide-react";

interface RevisionHubClientProps {
  registry: BankingCaMasterRegistry;
  initialTopicSlug?: string;
}

export function RevisionHubClient({ registry, initialTopicSlug }: RevisionHubClientProps) {
  const [selectedBudget, setSelectedBudget] = useState<15 | 30 | 60 | 'ALL_P1'>(30);
  const [userState, setUserState] = useState<Record<string, TopicRevisionRecord>>({});
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [sessionPrompts, setSessionPrompts] = useState<RecallPrompt[]>([]);
  const [sessionResult, setSessionResult] = useState<{
    totalPrompts: number;
    ratingCounts: Record<SelfRating, number>;
    reviewedTopicIds: string[];
    weakTopicIds: string[];
  } | null>(null);

  useEffect(() => {
    // Load student revision records on client mount
    setUserState(revisionRepository.getAllRecords());
  }, [isSessionComplete]);

  // Handle single-topic revision request
  const singleTopic = initialTopicSlug ? registry.topics[registry.topicSlugMap[initialTopicSlug] || initialTopicSlug] : null;

  // Build deck deterministically
  const currentDeck: SelectedRevisionDeck = singleTopic 
    ? buildSingleTopicDeck(singleTopic, userState[singleTopic.id])
    : buildRevisionDeck(selectedBudget as any, registry, userState);

  const startSession = () => {
    // Flatten prompts across all selected topics
    const allPrompts: RecallPrompt[] = [];
    currentDeck.items.forEach(item => {
      const prompts = generateRecallPrompts(item.topic);
      allPrompts.push(...prompts);
    });

    setSessionPrompts(allPrompts);
    setIsSessionActive(true);
    setIsSessionComplete(false);
  };

  const handleSessionComplete = (results: {
    totalPrompts: number;
    ratingCounts: Record<SelfRating, number>;
    reviewedTopicIds: string[];
    weakTopicIds: string[];
  }) => {
    setSessionResult(results);
    setIsSessionActive(false);
    setIsSessionComplete(true);

    // Save session record
    revisionRepository.saveSession({
      sessionId: `session-${Date.now()}`,
      completedAt: new Date().toISOString(),
      totalTopics: results.reviewedTopicIds.length,
      totalPrompts: results.totalPrompts,
      ratingCounts: results.ratingCounts,
      weakTopicIds: results.weakTopicIds
    });
  };

  if (isSessionActive) {
    return (
      <ActiveRecallSession
        prompts={sessionPrompts}
        onSessionComplete={handleSessionComplete}
        onExit={() => setIsSessionActive(false)}
      />
    );
  }

  if (isSessionComplete && sessionResult) {
    const reviewedTopics = sessionResult.reviewedTopicIds.map(id => registry.topics[id]).filter(Boolean);
    const weakTopics = sessionResult.weakTopicIds.map(id => registry.topics[id]).filter(Boolean);

    return (
      <SessionCompleteView
        totalPrompts={sessionResult.totalPrompts}
        ratingCounts={sessionResult.ratingCounts}
        reviewedTopics={reviewedTopics}
        weakTopics={weakTopics}
        onRestart={() => setIsSessionComplete(false)}
      />
    );
  }

  // Count weak topics
  const weakTopicEntries = Object.values(userState).filter(r => r.isWeak);
  const weakTopics = weakTopicEntries.map(r => registry.topics[r.topicId]).filter(Boolean);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <RotateCcw className="w-4 h-4" />
          <span>Active Recall Engine · Phase W5</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          Time-Budgeted Revision Hub
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Select your available study time. The engine deterministically packs the highest-yield topics into your budget and triggers active recall.
        </p>
      </div>

      {/* Time Budget Selector Bar */}
      <section className="p-6 rounded-3xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-serif font-bold text-[var(--text-primary)]">
            How much time do you have right now?
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            {currentDeck.actualRevisionMinutes} min Planned Deck
          </span>
        </div>

        {/* Budget Pill Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 15, label: "15 MIN", desc: "Quick Core Scan" },
            { id: 30, label: "30 MIN", desc: "Standard High-Yield" },
            { id: 60, label: "60 MIN", desc: "Deep Retention" },
            { id: "ALL_P1", label: `ALL P1 (${registry.summary.activeP1RevisionMinutes}m)`, desc: `${registry.summary.activeP1Count} Master Topics` }
          ].map((budget) => (
            <button
              key={budget.id}
              onClick={() => setSelectedBudget(budget.id as any)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedBudget === budget.id
                  ? "bg-emerald-950/40 border-emerald-500/80 text-emerald-300 ring-1 ring-emerald-500 shadow-sm"
                  : "bg-[var(--surface-elevated)] border-[var(--border-primary)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
              }`}
            >
              <div className="font-mono font-bold text-xs">{budget.label}</div>
              <div className="text-[10px] opacity-80 mt-1 font-sans">{budget.desc}</div>
            </button>
          ))}
        </div>

        {/* Selected Deck Overview Box */}
        <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--text-primary)]">
              <span>Deck Payload:</span>
              <span className="text-emerald-400">{currentDeck.items.length} Topics</span>
              <span>·</span>
              <span className="text-emerald-400">~{currentDeck.actualRevisionMinutes} min total</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Includes core thresholds, dates, and must-memorize facts ready for flash testing.
            </p>
          </div>

          <button
            onClick={startSession}
            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 flex-shrink-0"
          >
            <span>Start Active Recall</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Selected Topics List & Explainable Selection Rationale */}
      <section className="space-y-4">
        <h2 className="text-sm font-serif font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Topics Selected in this Deck &amp; Rationale</span>
        </h2>

        <div className="space-y-3">
          {currentDeck.items.map((item, index) => (
            <div
              key={item.topic.id}
              className="p-4 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950/40 text-emerald-400 font-bold border border-emerald-800/40">
                    #{index + 1} · {item.topic.priority.replace(/_/g, " ")}
                  </span>
                  <span className="text-[var(--text-muted)]">{item.topic.primaryInstitution}</span>
                </div>
                <h3 className="font-serif font-semibold text-xs sm:text-sm text-[var(--text-primary)]">
                  {item.topic.title}
                </h3>
                {/* Rationale Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.reasons.map((r, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface-elevated)] text-[var(--text-subtle)] border border-[var(--border-primary)]">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 text-xs font-mono text-[var(--text-muted)]">
                <Clock className="w-3.5 h-3.5" />
                <span>~{item.topic.revisionMinutes} min</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weak Topics Section (if any student weakness exists) */}
      {weakTopics.length > 0 && (
        <section className="p-5 rounded-3xl bg-amber-950/15 border border-amber-800/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Prioritized Weak Areas ({weakTopics.length} Topics Marked Hard)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {weakTopics.map(topic => (
              <div key={topic.id} className="p-3 rounded-xl bg-[var(--surface-primary)] border border-amber-900/30 text-xs space-y-1">
                <div className="font-serif font-semibold text-[var(--text-primary)] line-clamp-1">{topic.title}</div>
                <div className="text-[10px] font-mono text-amber-400">~{topic.revisionMinutes} min · {topic.priority.replace(/_/g, ' ')}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
