import { prisma } from "./prisma";

export async function getAllSources() {
  return prisma.source.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      concepts: {
        include: {
          concept: {
            include: {
              chapter: true,
            },
          },
        },
      },
    },
  });
}

export async function getSourceById(id: string) {
  return prisma.source.findUnique({
    where: { id },
    include: {
      concepts: {
        include: {
          concept: {
            include: {
              chapter: true,
            },
          },
        },
      },
    },
  });
}

export async function getSourcesByConceptId(conceptId: string) {
  return prisma.sourceConcept.findMany({
    where: { conceptId },
    include: {
      source: true,
    },
    orderBy: { createdAt: "asc" },
  });
}
