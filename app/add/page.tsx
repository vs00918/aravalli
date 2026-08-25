"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Sparkles, ChevronDown, ChevronUp, ArrowRight, ShieldCheck } from "lucide-react";

export default function AddToAravalliPage() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [sourceType, setSourceType] = useState("AUTO");
  const [notes, setNotes] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !url.trim() && !title.trim()) {
      setError("Please paste some text, a URL, or enter a title.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawContent: content.trim(),
          url: url.trim() || undefined,
          title: title.trim() || undefined,
          author: author.trim() || undefined,
          sourceType: sourceType === "AUTO" ? undefined : sourceType,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to capture source");

      // Redirect directly to the review desk
      router.push(`/inbox/${data.itemId}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
          <PlusCircle className="w-4 h-4" />
          <span>Capture & Ingestion</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 dark:text-slate-100">
          Add to Aravalli
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
          Capture a paper, lecture, video, book excerpt, or personal research note. Information will first land in your Inbox review staging buffer before joining the permanent knowledge tree.
        </p>
      </div>

      {/* Capture Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Primary Input */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">
            What did you discover?
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={7}
            placeholder="Paste raw text, lecture notes, paper abstract, transcript snippet, or theoretical thought..."
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-[#0f1520] p-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm font-sans leading-relaxed"
          />
        </div>

        {/* URL Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-slate-600 dark:text-slate-400">
            Source URL (optional)
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://... (YouTube, ArXiv, Article, Podcast link)"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-[#0f1520] px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm font-mono text-xs"
          />
        </div>

        {/* Source Type Selector */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-slate-500">Source Type:</span>
          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f1520] px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="AUTO">Auto-detect</option>
            <option value="PAPER">Research Paper</option>
            <option value="BOOK">Book / Textbook</option>
            <option value="LECTURE">University Lecture</option>
            <option value="ARTICLE">Article / Essay</option>
            <option value="YOUTUBE">YouTube Video</option>
            <option value="PODCAST">Podcast</option>
            <option value="NOTE">Personal Note</option>
          </select>
        </div>

        {/* Collapsible Metadata Details */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-[#0b1018] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span>Additional Reference Details (Optional)</span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="p-4 pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-slate-500">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Schroeder Thermal Physics Ch 3"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f1520] px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-slate-500">Author / Creator</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Daniel V. Schroeder"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f1520] px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-slate-500">Notes / Excerpt Context</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key takeaway or reasons this matters..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f1520] px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Lands safely in Inbox buffer</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            <span>{submitting ? "Adding to Staging..." : "Add to Inbox"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
