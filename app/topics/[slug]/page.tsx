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

  const isP1 = topic.priority.startsWith("P1");
  const isP2 = topic.priority === "P2_HIGH";
  const isP3 = topic.priority === "P3_MODERATE" || topic.priority === "P4_LOW_YIELD";

  // Deterministic Next / Previous Topic Calculation
  const allTopicIds = Object.keys(registry.topics).sort();
  const currentIndex = allTopicIds.indexOf(topic.id);
  const prevTopic = currentIndex > 0 ? registry.topics[allTopicIds[currentIndex - 1]] : null;
  const nextTopic = currentIndex < allTopicIds.length - 1 ? registry.topics[allTopicIds[currentIndex + 1]] : null;

  return (
    <article className="max-w-2xl mx-auto space-y-6 pb-16 font-serif">
      {/* 1. Header (Clean, Content-First, Stripped Jargon) */}
      <TopicHeader topic={topic} />

      {/* 2. Change / Draft Alert (Only if applicable) */}
      <ChangeAlertSection alert={topic.changeAlert} status={topic.regulatoryStatus} />

      {/* ─── P1 CRITICAL READER (Structured Deep Dive) ─── */}
      {isP1 && (
        <div className="space-y-6">
          {/* WHAT HAPPENED */}
          <WhatHappenedSection whatHappened={topic.whatHappened} heading="WHAT HAPPENED" />

          {/* KEY NUMBERS / RULES */}
          <MustMemorizeSection
            facts={topic.mustMemorizeFacts}
            heading="KEY NUMBERS / RULES"
            isP1
          />

          {/* WHY IT MATTERS (Conceptual Explanation) */}
          <UnderstandSection
            context={topic.knowUnderstandContext}
            heading="WHY IT MATTERS"
          />

          {/* EXAM TAKEAWAY */}
          <ExamFocusSection
            examFocus={topic.examFocus}
            heading="EXAM TAKEAWAY"
          />
        </div>
      )}

      {/* ─── P2 HIGH-YIELD READER (Medium Density, Rapid Scan) ─── */}
      {isP2 && (
        <div className="space-y-5">
          {/* Context Paragraph */}
          {topic.whatHappened && topic.whatHappened.length > 0 && (
            <div className="text-sm sm:text-[15px] text-[var(--text-primary)] leading-relaxed pt-1">
              {topic.whatHappened.map((p, idx) => (
                <p key={idx} className="mb-2 leading-relaxed">{p}</p>
              ))}
            </div>
          )}

          {/* KEY FACTS */}
          <MustMemorizeSection
            facts={topic.mustMemorizeFacts}
            heading="KEY FACTS"
          />

          {/* EXAM POINT */}
          {topic.examFocus && topic.examFocus.length > 0 && (
            <ExamFocusSection
              examFocus={topic.examFocus}
              heading="EXAM POINT"
            />
          )}
        </div>
      )}

      {/* ─── P3 ULTRA-COMPACT READER (15-30s Quick Scan) ─── */}
      {isP3 && (
        <div className="space-y-4">
          {/* KEY FACTS */}
          <MustMemorizeSection
            facts={topic.mustMemorizeFacts.length > 0 ? topic.mustMemorizeFacts : topic.whatHappened}
            heading="KEY FACTS"
          />

          {/* REMEMBER */}
          {topic.examFocus && topic.examFocus.length > 0 && (
            <ExamFocusSection
              examFocus={topic.examFocus}
              heading="REMEMBER"
            />
          )}
        </div>
      )}

      {/* 3. Optional Technical Metadata & Raw Markdown (Collapsed Disclosure) */}
      <ProvenanceSection
        sources={topic.sourceReferences}
        verificationStatus={topic.verificationStatus}
        initialEventDate={topic.initialEventDate}
        lastUpdatedDate={topic.lastUpdatedDate}
        category={topic.primaryCategory}
        institution={topic.primaryInstitution}
        rawMarkdown={topic.contentMarkdown}
      />

      {/* 4. Subordinate Previous / Next Navigation */}
      <TopicNavigation
        prevTopic={prevTopic}
        nextTopic={nextTopic}
        currentMonth={topic.chronologicalMonth}
      />
    </article>
  );
}
