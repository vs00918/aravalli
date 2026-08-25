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
          toConcept: true,
        },
      },
      incomingConnections: {
        include: {
          fromConcept: true,
        },
      },
    },
  });
}
