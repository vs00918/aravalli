import { prisma } from "./prisma";
import { SearchResultItem } from "@/lib/types";

export async function globalSearch(query: string): Promise<SearchResultItem[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  // Search across Concepts
  const concepts = await prisma.concept.findMany({
    where: {
      OR: [
        { title: { contains: cleanQuery } },
        { oneLiner: { contains: cleanQuery } },
        { intuition: { contains: cleanQuery } },
        { howItWorks: { contains: cleanQuery } },
        { firstPrinciples: { contains: cleanQuery } },
      ],
    },
    include: {
      chapter: true,
    },
    take: 8,
  });

  // Search across Chapters
  const chapters = await prisma.chapter.findMany({
    where: {
      OR: [
        { title: { contains: cleanQuery } },
        { description: { contains: cleanQuery } },
        { overview: { contains: cleanQuery } },
      ],
    },
    take: 4,
  });

  // Search across Connections
  const connections = await prisma.connection.findMany({
    where: {
      OR: [
        { explanation: { contains: cleanQuery } },
        { sourceConcept: { title: { contains: cleanQuery } } },
        { targetConcept: { title: { contains: cleanQuery } } },
      ],
    },
    include: {
      sourceConcept: true,
      targetConcept: true,
    },
    take: 6,
  });

  // Search across Questions
  const questions = await prisma.question.findMany({
    where: {
      OR: [
        { question: { contains: cleanQuery } },
        { description: { contains: cleanQuery } },
      ],
    },
    include: {
      chapter: true,
      relatedConcept: true,
    },
    take: 6,
  });

  // Search across Sources
  const sources = await prisma.source.findMany({
    where: {
      OR: [
        { title: { contains: cleanQuery } },
        { author: { contains: cleanQuery } },
        { description: { contains: cleanQuery } },
      ],
    },
    take: 6,
  });

  const results: SearchResultItem[] = [];

  // Map Concepts
  for (const c of concepts) {
    results.push({
      id: `concept-${c.id}`,
      title: c.title,
      snippet: c.oneLiner,
      type: "CONCEPT",
      url: `/concepts/${c.slug}`,
      meta: c.chapter?.title ?? c.difficulty,
    });
  }

  // Map Chapters
  for (const ch of chapters) {
    results.push({
      id: `chapter-${ch.id}`,
      title: `${ch.icon} ${ch.title}`,
      snippet: ch.description,
      type: "CHAPTER",
      url: `/chapters/${ch.slug}`,
      meta: "Master Chapter",
    });
  }

  // Map Connections
  for (const conn of connections) {
    results.push({
      id: `conn-${conn.id}`,
      title: `${conn.sourceConcept.title} ↔ ${conn.targetConcept.title}`,
      snippet: conn.explanation,
      type: "CONNECTION",
      url: `/concepts/${conn.sourceConcept.slug}#layer-connections`,
      meta: conn.relationshipType.replace(/_/g, " "),
    });
  }

  // Map Questions
  for (const q of questions) {
    results.push({
      id: `q-${q.id}`,
      title: q.question,
      snippet: q.description ?? undefined,
      type: "QUESTION",
      url: q.relatedConcept ? `/concepts/${q.relatedConcept.slug}#questions` : `/questions`,
      meta: q.chapter?.title ?? q.status,
    });
  }

  // Map Sources
  for (const s of sources) {
    results.push({
      id: `source-${s.id}`,
      title: s.title,
      snippet: s.description ?? (s.author ? `By ${s.author}` : undefined),
      type: "SOURCE",
      url: `/sources#source-${s.id}`,
      meta: s.type,
    });
  }

  return results;
}
