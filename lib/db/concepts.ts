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
