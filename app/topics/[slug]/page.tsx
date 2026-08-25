import React from "react";
import { notFound } from "next/navigation";
import { getBankingCaRegistry, getTopicBySlug } from "@/lib/banking-ca/data";
import { TopicHeader } from "@/components/topic-reader/TopicHeader";
import { WhatHappenedSection } from "@/components/topic-reader/WhatHappenedSection";
import { MustMemorizeSection } from "@/components/topic-reader/MustMemorizeSection";
import { ExamFocusSection } from "@/components/topic-reader/ExamFocusSection";
import { UnderstandSection } from "@/components/topic-reader/UnderstandSection";
import { ChangeAlertSection } from "@/components/topic-reader/ChangeAlertSection";
import { ProvenanceSection } from "@/components/topic-reader/ProvenanceSection";
import { TopicNavigation } from "@/components/topic-reader/TopicNavigation";
import { FileText, ChevronDown } from "lucide-react";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const registry = getBankingCaRegistry();
  return Object.values(registry.topics).map((topic) => ({
    slug: topic.slug,
  }));
}

export default function TopicDetailPage({ params }: { params: { slug: string } }) {
  const registry = getBankingCaRegistry();
  const topic = getTopicBySlug(params.slug);

  if (!topic) {
    notFound();
  }

  // Deterministic Next / Previous Topic Calculation
  const allTopicIds = Object.keys(registry.topics).sort();
  const currentIndex = allTopicIds.indexOf(topic.id);
  const prevTopic = currentIndex > 0 ? registry.topics[allTopicIds[currentIndex - 1]] : null;
  const nextTopic = currentIndex < allTopicIds.length - 1 ? registry.topics[allTopicIds[currentIndex + 1]] : null;

  return (
    <article className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* 1. Header with Metadata, Badges, and Revision Estimate */}
      <TopicHeader topic={topic} />

      {/* 2. Change-Sensitive / Regulatory Draft Alert (if applicable) */}
      <ChangeAlertSection alert={topic.changeAlert} status={topic.regulatoryStatus} />

      {/* 3. What Happened (Orientation) */}
      <WhatHappenedSection whatHappened={topic.whatHappened} />

      {/* 4. Must Memorize (Core Exam Numbers & Thresholds) */}
      <MustMemorizeSection facts={topic.mustMemorizeFacts} priority={topic.priority} />

      {/* 5. Exam Focus (Tested Angles) */}
      <ExamFocusSection
        examFocus={topic.examFocus}
        priority={topic.priority}
        category={topic.primaryCategory}
      />

      {/* 6. Understand & Policy Context */}
      <UnderstandSection context={topic.knowUnderstandContext} />

      {/* 7. Collapsible Detailed Canonical Markdown View */}
      <details className="p-4 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] group">
        <summary className="flex items-center justify-between cursor-pointer font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] list-none">
          <span className="flex items-center gap-2 font-semibold">
            <FileText className="w-4 h-4 text-[var(--text-subtle)]" />
            <span>Detailed Notes &amp; Raw Canonical Markdown</span>
          </span>
          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-4 pt-4 border-t border-[var(--border-primary)] whitespace-pre-wrap font-mono text-[11px] text-[var(--text-muted)] leading-relaxed bg-[var(--surface-elevated)] p-4 rounded-lg overflow-x-auto">
          {topic.contentMarkdown}
        </div>
      </details>

      {/* 8. Source Provenance & Verification Details */}
      <ProvenanceSection
        sources={topic.sourceReferences}
        verificationStatus={topic.verificationStatus}
        initialEventDate={topic.initialEventDate}
        lastUpdatedDate={topic.lastUpdatedDate}
      />

      {/* 9. Deterministic Navigation (Previous / Next) */}
      <TopicNavigation prevTopic={prevTopic} nextTopic={nextTopic} />
    </article>
  );
}
