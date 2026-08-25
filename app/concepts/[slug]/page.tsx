import React from "react";
import { notFound } from "next/navigation";
import { getConceptBySlug } from "@/lib/db/concepts";
import { ConceptHeader } from "@/components/concepts/ConceptHeader";
import { ConceptCoreIdea } from "@/components/concepts/ConceptCoreIdea";
import { ConceptWhyItMatters } from "@/components/concepts/ConceptWhyItMatters";
import { ConceptIntuition } from "@/components/concepts/ConceptIntuition";
import { ConceptMechanism } from "@/components/concepts/ConceptMechanism";
import { ConceptFirstPrinciples } from "@/components/concepts/ConceptFirstPrinciples";
import { ConceptMathematics } from "@/components/concepts/ConceptMathematics";
import { ConceptConnections } from "@/components/concepts/ConceptConnections";
import { ConceptLimitations } from "@/components/concepts/ConceptLimitations";
import { ConceptNavigation } from "@/components/concepts/ConceptNavigation";
import { ConceptSources } from "@/components/concepts/ConceptSources";
import { ConceptRelatedQuestions } from "@/components/concepts/ConceptRelatedQuestions";
import { ConceptTOC } from "@/components/concepts/ConceptTOC";

export const dynamic = "force-dynamic";

interface ConceptPageProps {
  params: {
    slug: string;
  };
}

export default async function ConceptPage({ params }: ConceptPageProps) {
  const concept = await getConceptBySlug(params.slug);

  if (!concept) {
    notFound();
  }

  return (
    <div className="flex justify-center gap-12 max-w-5xl mx-auto">
      {/* Primary Reading Column: 650–800px width */}
      <article className="w-full max-w-[760px] space-y-10 pb-16">
        {/* Header & Meta */}
        <ConceptHeader concept={concept as any} />

        {/* Level 1: The Core Idea */}
        <ConceptCoreIdea oneLiner={concept.oneLiner} />

        {/* Why It Matters */}
        <ConceptWhyItMatters whyItMatters={concept.whyItMatters} />

        {/* Level 2: Build the Intuition */}
        <ConceptIntuition intuition={concept.intuition} example={concept.example} />

        {/* Level 3: How It Actually Works */}
        <ConceptMechanism howItWorks={concept.howItWorks} />

        {/* Level 4: From First Principles */}
        <ConceptFirstPrinciples firstPrinciples={concept.firstPrinciples} />

        {/* Level 5: The Mathematics */}
        <ConceptMathematics mathematicalModel={concept.mathematicalModel} />

        {/* Level 6: Where It Connects */}
        <ConceptConnections
          conceptSlug={concept.slug}
          outgoingConnections={concept.outgoingConnections as any}
          incomingConnections={concept.incomingConnections as any}
        />

        {/* Limitations & What This Idea Does NOT Mean */}
        <ConceptLimitations commonMisconceptions={concept.commonMisconceptions} />

        {/* Source Attribution & Provenance */}
        <ConceptSources sources={concept.sources as any} />

        {/* Related Curiosity Radar Questions */}
        <ConceptRelatedQuestions questions={concept.questions as any} />

        {/* Chapter Navigation */}
        {concept.chapter && (
          <ConceptNavigation
            currentConcept={concept as any}
            chapter={concept.chapter as any}
          />
        )}
      </article>

      {/* Desktop Sticky Table of Contents */}
      <ConceptTOC />
    </div>
  );
}
