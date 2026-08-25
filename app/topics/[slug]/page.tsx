import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBankingCaRegistry, getTopicBySlug } from "@/lib/banking-ca/data";
import { ArrowLeft, Clock, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const registry = getBankingCaRegistry();
  return Object.values(registry.topics).map((topic) => ({
    slug: topic.slug,
  }));
}

export default function TopicDetailPage({ params }: { params: { slug: string } }) {
  const topic = getTopicBySlug(params.slug);

  if (!topic) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Back to Directory */}
      <div>
        <Link
          href="/topics"
          className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Canonical Directory</span>
        </Link>
      </div>

      {/* Topic Header & Metadata */}
      <header className="space-y-3 pb-6 border-b border-[var(--border-primary)]">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 font-bold border border-emerald-800/40">
            {topic.priority.replace(/_/g, " ")}
          </span>
          <span className="px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)] font-semibold border border-[var(--border-primary)]">
            {topic.primaryInstitution}
          </span>
          <span className="px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)] font-semibold border border-[var(--border-primary)]">
            {topic.regulatoryStatus}
          </span>
          <span className="flex items-center gap-1 text-[var(--text-subtle)] ml-auto">
            <Clock className="w-3.5 h-3.5" /> ~{topic.revisionMinutes} min revision
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] leading-tight">
          {topic.title}
        </h1>

        {topic.subtitle && (
          <p className="text-sm font-serif italic text-[var(--text-muted)]">
            {topic.subtitle}
          </p>
        )}
      </header>

      {/* 3-Minute Must Memorize Deck */}
      {topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0 && (
        <section className="p-5 rounded-xl bg-emerald-950/15 border border-emerald-800/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>3-Minute Must-Memorize Deck (Core Exam Numbers)</span>
          </div>
          <ul className="space-y-2 text-xs text-[var(--text-primary)] font-mono leading-relaxed">
            {topic.mustMemorizeFacts.map((fact, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Change Alert if present */}
      {topic.changeAlert && (
        <section className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300 font-mono space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <span>Change-Sensitive Alert</span>
          </div>
          <p>⚠️ {topic.changeAlert.currentFactSummary}</p>
          <p className="text-[11px] text-amber-400/80">Action: {topic.changeAlert.actionBeforeExam}</p>
        </section>
      )}

      {/* Full Note Body */}
      <section className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
        <div className="whitespace-pre-wrap font-sans text-[var(--text-muted)]">
          {topic.contentMarkdown}
        </div>
      </section>

      {/* Source Provenance Footer */}
      <footer className="pt-6 border-t border-[var(--border-primary)] space-y-2 text-xs font-mono text-[var(--text-subtle)]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="font-semibold text-[var(--text-muted)]">Source Attribution:</span>
          <span>{topic.verificationStatus}</span>
        </div>
        {topic.sourceReferences && topic.sourceReferences.length > 0 && (
          <div className="text-[11px]">
            Ingested from: {topic.sourceReferences.map(s => `${s.sourceName} (${s.batchName})`).join(", ")}
          </div>
        )}
      </footer>
    </article>
  );
}
