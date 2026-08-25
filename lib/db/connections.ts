import { prisma } from "./prisma";

export async function getAllConnections() {
  return prisma.connection.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      sourceConcept: {
        include: {
          chapter: true,
        },
      },
      targetConcept: {
        include: {
          chapter: true,
        },
      },
    },
  });
}

export async function getConnectionById(id: string) {
  return prisma.connection.findUnique({
    where: { id },
    include: {
      sourceConcept: {
        include: {
          chapter: true,
        },
      },
      targetConcept: {
        include: {
          chapter: true,
        },
      },
    },
  });
}

export async function getConnectionsForConcept(conceptId: string) {
  const outgoing = await prisma.connection.findMany({
    where: { sourceConceptId: conceptId },
    include: {
      targetConcept: {
        include: {
          chapter: true,
        },
      },
    },
  });

  const incoming = await prisma.connection.findMany({
    where: { targetConceptId: conceptId },
    include: {
      sourceConcept: {
        include: {
          chapter: true,
        },
      },
    },
  });

  return { outgoing, incoming };
}
