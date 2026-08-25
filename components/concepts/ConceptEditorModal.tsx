"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, X, Save, CheckCircle2 } from "lucide-react";
import { Concept } from "@/lib/types";

interface ConceptEditorModalProps {
  concept: Concept;
  isOpen: boolean;
  onClose: () => void;
}

export function ConceptEditorModal({ concept, isOpen, onClose }: ConceptEditorModalProps) {
  const [title, setTitle] = useState(concept.title);
  const [oneLiner, setOneLiner] = useState(concept.oneLiner);
  const [whyItMatters, setWhyItMatters] = useState(concept.whyItMatters || "");
  const [intuition, setIntuition] = useState(concept.intuition || "");
  const [example, setExample] = useState(concept.example || "");
  const [howItWorks, setHowItWorks] = useState(concept.howItWorks || "");
  const [firstPrinciples, setFirstPrinciples] = useState(concept.firstPrinciples || "");
  const [mathematicalModel, setMathematicalModel] = useState(concept.mathematicalModel || "");
  const [commonMisconceptions, setCommonMisconceptions] = useState(concept.commonMisconceptions || "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/concepts/${concept.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          oneLiner,
          whyItMatters,
          intuition,
          example,
          howItWorks,
          firstPrinciples,
          mathematicalModel,
          commonMisconceptions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update concept");

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#fbfaf8] dark:bg-[#0b1018] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0f1520]/80">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
            <Edit3 className="w-4 h-4" />
            <span>Edit Concept · {concept.title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-5 text-xs font-mono">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Concept updated successfully!</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1">
            <label className="block text-slate-500 uppercase font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131a26] p-2.5 text-sm text-slate-900 dark:text-slate-100 font-sans"
              required
            />
          </div>

          {/* Level 1: One-Liner */}
          <div className="space-y-1">
            <label className="block text-slate-500 uppercase font-semibold">Level 1 · The Core Idea (Definition)</label>
            <textarea
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131a26] p-2.5 text-xs text-slate-900 dark:text-slate-100 font-sans leading-relaxed"
              required
            />
          </div>

          {/* Why It Matters */}
          <div className="space-y-1">
            <label className="block text-slate-500 uppercase font-semibold">Why It Matters (Significance)</label>
            <textarea
              value={whyItMatters}
              onChange={(e) => setWhyItMatters(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131a26] p-2.5 text-xs text-slate-900 dark:text-slate-100 font-sans leading-relaxed"
            />
          </div>

          {/* Level 2: Intuition & Example */}
          <div className="space-y-1">
            <label className="block text-slate-500 uppercase font-semibold">Level 2 · Build Intuition</label>
            <textarea
              value={intuition}
              onChange={(e) => setIntuition(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131a26] p-2.5 text-xs text-slate-900 dark:text-slate-100 font-sans leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-500 uppercase font-semibold">Everyday Example / Observation</label>
            <input
              type="text"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131a26] p-2.5 text-xs text-slate-900 dark:text-slate-100 font-sans"
            />
          </div>

          {/* Level 3: How It Works */}
          <div className="space-y-1">
            <label className="block text-slate-500 uppercase font-semibold">Level 3 · Mechanism & How It Works</label>
            <textarea
              value={howItWorks}
              onChange={(e) => setHowItWorks(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131a26] p-2.5 text-xs text-slate-900 dark:text-slate-100 font-sans leading-relaxed"
            />
          </div>

          {/* Level 4: First Principles */}
          <div className="space-y-1">
            <label className="block text-slate-500 uppercase font-semibold">Level 4 · From First Principles</label>
            <textarea
              value={firstPrinciples}
              onChange={(e) => setFirstPrinciples(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131a26] p-2.5 text-xs text-slate-900 dark:text-slate-100 font-sans leading-relaxed"
            />
          </div>

          {/* Level 5: Mathematics */}
          <div className="space-y-1">
            <label className="block text-slate-500 uppercase font-semibold">Level 5 · The Mathematics (Markdown + LaTeX)</label>
            <textarea
              value={mathematicalModel}
              onChange={(e) => setMathematicalModel(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131a26] p-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono leading-relaxed"
            />
          </div>

          {/* Limitations */}
          <div className="space-y-1">
            <label className="block text-slate-500 uppercase font-semibold">Limitations & Misconceptions</label>
            <textarea
              value={commonMisconceptions}
              onChange={(e) => setCommonMisconceptions(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131a26] p-2.5 text-xs text-slate-900 dark:text-slate-100 font-sans leading-relaxed"
            />
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
