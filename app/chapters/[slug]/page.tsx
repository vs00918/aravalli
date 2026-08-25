import React from "react";
import { notFound } from "next/navigation";
import { getChapterBySlug, getAllChapters } from "@/lib/db/chapters";
import { ChapterHeader } from "@/components/chapters/ChapterHeader";
import { ChapterOverview } from "@/components/chapters/ChapterOverview";
import { ChapterTOC } from "@/components/chapters/ChapterTOC";
import { ChapterConceptList } from "@/components/chapters/ChapterConceptList";

export const dynamic = "force-dynamic";

interface ChapterPageProps {
  params: {
    slug: string;
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const chapter = await getChapterBySlug(params.slug);

  if (!chapter) {
    notFound();
  }

  const concepts = (chapter.concepts ?? []) as any[];

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* 1. Chapter Header */}
      <ChapterHeader chapter={chapter as any} />

      {/* 2. Domain Scope & Overview */}
      <ChapterOverview overview={chapter.overview} />

      {/* 3. Table of Contents */}
      <ChapterTOC concepts={concepts} />

      {/* 4. Concepts in this Chapter */}
      <ChapterConceptList concepts={concepts} />
    </div>
  );
}
