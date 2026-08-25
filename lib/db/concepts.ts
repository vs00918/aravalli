import { prisma } from "./prisma";

export async function getAllConcepts() {
  return prisma.concept.findMany({
    orderBy: { order: "asc" },
    include: {
      chapter: true,
    },
  });
}

export async function getConceptBySlug(slug: string) {
  return prisma.concept.findUnique({
    where: { slug },
    include: {
      chapter: {
        include: {
          concepts: {
            orderBy: { order: "asc" },
          },
        },
      },
      sources: {
        include: {
          source: true,
        },
      },
      outgoingConnections: {
        include: {
          targetConcept: {
            include: {
              chapter: true,
            },
          },
        },
      },
      incomingConnections: {
        include: {
          sourceConcept: {
            include: {
              chapter: true,
            },
          },
        },
      },
      questions: {
        where: {
          status: { in: ["OPEN", "EXPLORING", "ANSWERED"] },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function updateConcept(
  slug: string,
  data: {
    title?: string;
    oneLiner?: string;
    whyItMatters?: string;
    intuition?: string;
    howItWorks?: string;
    firstPrinciples?: string;
    mathematicalModel?: string;
    commonMisconceptions?: string;
    example?: string;
    difficulty?: string;
  }
) {
  return prisma.concept.update({
    where: { slug },
    data,
  });
}
