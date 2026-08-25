import { prisma } from "@/lib/db/prisma";
import { defaultProcessor } from "./localProcessor";
import { KnowledgeProposal } from "./types";

export async function captureSourceAndItem(input: {
  rawContent: string;
  url?: string;
  title?: string;
  author?: string;
  sourceType?: string;
  notes?: string;
}) {
  // Infer source type if not provided
  let inferredType = input.sourceType || "NOTE";
  if (!input.sourceType && input.url) {
    const urlLower = input.url.toLowerCase();
    if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) {
      inferredType = "YOUTUBE";
    } else if (urlLower.includes("podcast") || urlLower.includes("spotify.com")) {
      inferredType = "PODCAST";
    } else if (urlLower.includes("arxiv.org") || urlLower.includes("doi.org") || urlLower.includes("nature.com")) {
      inferredType = "PAPER";
    } else {
      inferredType = "ARTICLE";
    }
  }

  // Create Source record
  const source = await prisma.source.create({
    data: {
      title: input.title || (input.url ? `Captured Source (${new URL(input.url).hostname})` : "Pasted Research Note"),
      type: inferredType,
      url: input.url || null,
      author: input.author || null,
      description: input.notes || (input.rawContent ? input.rawContent.slice(0, 300) : null),
      transcript: input.rawContent || null,
    },
  });

  // Create IngestionItem staging buffer in INBOX status
  const item = await prisma.ingestionItem.create({
    data: {
      title: source.title,
      sourceId: source.id,
      rawContent: input.rawContent,
      status: "INBOX",
    },
  });

  return { source, item };
}

export async function processIngestionItem(id: string) {
  const item = await prisma.ingestionItem.findUnique({
    where: { id },
    include: { source: true },
  });

  if (!item) throw new Error(`Ingestion item ${id} not found`);

  const contentToProcess = item.rawContent || item.source?.description || item.title;
  const proposal: KnowledgeProposal = await defaultProcessor.process(
    contentToProcess,
    item.title,
    item.source?.url || undefined
  );

  // Update item with generated proposal and set status to REVIEW
  return prisma.ingestionItem.update({
    where: { id },
    data: {
      extractedSummary: proposal.extractedSummary,
      candidateConcepts: JSON.stringify(proposal.matchedConceptSlugs),
      candidateConnections: JSON.stringify(proposal.candidateConnections),
      targetChapterId: proposal.targetChapterSlug,
      status: "REVIEW",
    },
    include: { source: true },
  });
}

export async function promoteIngestionItem(id: string, overrides?: {
  targetConceptSlug?: string;
  notes?: string;
  relevance?: string;
}) {
  const item = await prisma.ingestionItem.findUnique({
    where: { id },
    include: { source: true },
  });

  if (!item) throw new Error(`Ingestion item ${id} not found`);
  if (!item.sourceId) throw new Error(`Ingestion item ${id} has no attached source`);

  // Parse candidate concepts or use override
  let conceptSlug = overrides?.targetConceptSlug;
  if (!conceptSlug && item.candidateConcepts) {
    try {
      const parsed = JSON.parse(item.candidateConcepts);
      if (Array.isArray(parsed) && parsed.length > 0) {
        conceptSlug = parsed[0];
      }
    } catch {
      // fallback
    }
  }

  if (!conceptSlug) {
    conceptSlug = "entropy"; // default safe fallback
  }

  // Find target concept
  const concept = await prisma.concept.findUnique({
    where: { slug: conceptSlug },
  });

  if (concept) {
    // Link Source to Concept via SourceConcept
    await prisma.sourceConcept.upsert({
      where: {
        sourceId_conceptId: {
          sourceId: item.sourceId,
          conceptId: concept.id,
        },
      },
      create: {
        sourceId: item.sourceId,
        conceptId: concept.id,
        relevance: overrides?.relevance || "supporting",
        contributionType: "mechanism",
        notes: overrides?.notes || item.extractedSummary || "Contributed through research ingestion review.",
        evidenceStatus: "verified",
      },
      update: {
        notes: overrides?.notes || item.extractedSummary,
      },
    });
  }

  // Parse and create candidate connections if present
  if (item.candidateConnections) {
    try {
      const connections: KnowledgeProposal["candidateConnections"] = JSON.parse(item.candidateConnections);
      for (const conn of connections) {
        const sourceConcept = await prisma.concept.findUnique({ where: { slug: conn.sourceConceptSlug } });
        const targetConcept = await prisma.concept.findUnique({ where: { slug: conn.targetConceptSlug } });

        if (sourceConcept && targetConcept && sourceConcept.id !== targetConcept.id) {
          await prisma.connection.upsert({
            where: {
              sourceConceptId_targetConceptId: {
                sourceConceptId: sourceConcept.id,
                targetConceptId: targetConcept.id,
              },
            },
            create: {
              sourceConceptId: sourceConcept.id,
              targetConceptId: targetConcept.id,
              relationshipType: conn.relationshipType,
              explanation: conn.explanation,
              strength: 0.85,
            },
            update: {
              explanation: conn.explanation,
            },
          });
        }
      }
    } catch {
      // Connection parse handled safely
    }
  }

  // Mark ingestion item as ACCEPTED
  return prisma.ingestionItem.update({
    where: { id },
    data: { status: "ACCEPTED" },
    include: { source: true },
  });
}
