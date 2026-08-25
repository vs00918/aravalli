"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RecallPrompt } from "@/lib/banking-ca/revision-engine";
import { SelfRating, revisionRepository } from "@/lib/banking-ca/revision-state";
import { Eye } from "lucide-react";
import { FormattedText } from "@/components/common/FormattedText";

interface ActiveRecallSessionProps {
  prompts: RecallPrompt[];
  onSessionComplete: (results: {
    totalPrompts: number;
    ratingCounts: Record<SelfRating, number>;
    reviewedTopicIds: string[];
    weakTopicIds: string[];
  }) => void;
  onExit: () => void;
}

export function ActiveRecallSession({
  prompts,
  onSessionComplete,
  onExit
}: ActiveRecallSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [ratingCounts, setRatingCounts] = useState<Record<SelfRating, number>>({
    AGAIN: 0,
    HARD: 0,
    GOOD: 0,
    EASY: 0
  });
  const [reviewedTopicIds, setReviewedTopicIds] = useState<Set<string>>(new Set());
  const [weakTopicIds, setWeakTopicIds] = useState<Set<string>>(new Set());

  const currentPrompt = prompts[currentIndex];

  const handleRate = useCallback((rating: SelfRating) => {
    if (!currentPrompt) return;

    // Record to local storage repository
    revisionRepository.recordReview(currentPrompt.topicId, rating);

    // Update session tracking
    setRatingCounts(prev => ({ ...prev, [rating]: prev[rating] + 1 }));
    setReviewedTopicIds(prev => new Set(prev).add(currentPrompt.topicId));

    if (rating === "AGAIN" || rating === "HARD") {
      setWeakTopicIds(prev => new Set(prev).add(currentPrompt.topicId));
    }

    if (currentIndex < prompts.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsRevealed(false);
    } else {
      // Session Complete
      onSessionComplete({
        totalPrompts: prompts.length,
        ratingCounts: {
          ...ratingCounts,
          [rating]: ratingCounts[rating] + 1
        },
        reviewedTopicIds: Array.from(new Set(reviewedTopicIds).add(currentPrompt.topicId)),
        weakTopicIds: Array.from(
          rating === "AGAIN" || rating === "HARD"
            ? new Set(weakTopicIds).add(currentPrompt.topicId)
            : weakTopicIds
        )
      });
    }
  }, [currentIndex, currentPrompt, onSessionComplete, prompts.length, ratingCounts, reviewedTopicIds, weakTopicIds]);

  useEffect(() => {
    // Keyboard shortcuts (Space to reveal, 1-4 for ratings)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space" && !isRevealed) {
        e.preventDefault();
        setIsRevealed(true);
      } else if (isRevealed) {
        if (e.key === "1") handleRate("AGAIN");
        if (e.key === "2") handleRate("HARD");
        if (e.key === "3") handleRate("GOOD");
        if (e.key === "4") handleRate("EASY");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRevealed, handleRate]);

  if (!currentPrompt) {
    return null;
  }

  const progressPercent = Math.round(((currentIndex + 1) / prompts.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Session Progress Bar & Controls */}
      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
        <button
          onClick={onExit}
          className="hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1 font-semibold"
        >
          ✕ Exit Session
        </button>
        <div className="flex items-center gap-3">
          <span>
            Card {currentIndex + 1} of {prompts.length}
          </span>
          <span className="text-emerald-800 dark:text-emerald-400 font-bold">{progressPercent}%</span>
        </div>
      </div>

      <div className="w-full bg-[var(--surface-elevated)] h-2 rounded-full overflow-hidden border border-[var(--border-primary)]">
        <div
          className="bg-emerald-700 dark:bg-emerald-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Recall Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-sm space-y-6 min-h-[380px] flex flex-col justify-between">
        <div className="space-y-4">
          {/* Card Header */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-800/40">
              {currentPrompt.priority.replace(/_/g, " ")} · {currentPrompt.institution}
            </span>
            <span className="text-[var(--text-subtle)] font-semibold">
              Fact {currentPrompt.promptNumber} of {currentPrompt.totalInTopic}
            </span>
          </div>

          {/* Topic Context */}
          <h3 className="text-xs sm:text-sm font-mono text-[var(--text-subtle)] uppercase tracking-wider font-semibold">
            {currentPrompt.topicTitle}
          </h3>

          {/* Question / Prompt */}
          <div className="pt-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[var(--text-primary)] leading-snug">
              {currentPrompt.question}
            </h2>
          </div>
        </div>

        {/* Answer Section */}
        <div className="pt-4 border-t border-[var(--border-primary)]/80">
          {!isRevealed ? (
            <button
              onClick={() => setIsRevealed(true)}
              className="w-full py-4 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] hover:border-emerald-700/50 text-emerald-800 dark:text-emerald-400 font-mono text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs group"
            >
              <Eye className="w-4 h-4 text-emerald-800 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Reveal Answer (Press Space)</span>
            </button>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {/* Answer Content */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-100/60 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/40 space-y-1.5">
                <div className="text-[10px] font-mono text-emerald-900 dark:text-emerald-400 uppercase font-bold tracking-wider">
                  Canonical Fact
                </div>
                <div className="text-sm sm:text-base font-sans font-medium text-[var(--text-primary)] leading-relaxed">
                  <FormattedText text={currentPrompt.answer} />
                </div>
              </div>

              {/* Self Rating Bar */}
              <div className="space-y-2">
                <div className="text-center text-[11px] font-mono text-[var(--text-subtle)] font-medium">
                  How well did you recall this? (Keys 1 – 4)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => handleRate("AGAIN")}
                    className="py-2.5 px-3 rounded-xl bg-red-100 dark:bg-red-950/30 hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-300 dark:border-red-800/40 text-red-900 dark:text-red-300 font-mono text-xs font-bold transition-colors flex flex-col items-center gap-0.5 shadow-xs"
                  >
                    <span>Again</span>
                    <span className="text-[10px] opacity-75 font-normal">[1] Forgot</span>
                  </button>

                  <button
                    onClick={() => handleRate("HARD")}
                    className="py-2.5 px-3 rounded-xl bg-amber-100 dark:bg-amber-950/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 border border-amber-300 dark:border-amber-800/40 text-amber-900 dark:text-amber-300 font-mono text-xs font-bold transition-colors flex flex-col items-center gap-0.5 shadow-xs"
                  >
                    <span>Hard</span>
                    <span className="text-[10px] opacity-75 font-normal">[2] Partial</span>
                  </button>

                  <button
                    onClick={() => handleRate("GOOD")}
                    className="py-2.5 px-3 rounded-xl bg-blue-100 dark:bg-blue-950/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 border border-blue-300 dark:border-blue-800/40 text-blue-900 dark:text-blue-300 font-mono text-xs font-bold transition-colors flex flex-col items-center gap-0.5 shadow-xs"
                  >
                    <span>Good</span>
                    <span className="text-[10px] opacity-75 font-normal">[3] Recalled</span>
                  </button>

                  <button
                    onClick={() => handleRate("EASY")}
                    className="py-2.5 px-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300 font-mono text-xs font-bold transition-colors flex flex-col items-center gap-0.5 shadow-xs"
                  >
                    <span>Easy</span>
                    <span className="text-[10px] opacity-75 font-normal">[4] Mastered</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
