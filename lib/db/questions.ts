import { prisma } from "./prisma";

export async function getAllQuestions() {
  return prisma.question.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      chapter: true,
      relatedConcept: true,
    },
  });
}

export async function getQuestionById(id: string) {
  return prisma.question.findUnique({
    where: { id },
    include: {
      chapter: true,
      relatedConcept: true,
    },
  });
}

export async function getQuestionsForConcept(conceptId: string) {
  return prisma.question.findMany({
    where: { relatedConceptId: conceptId },
    include: {
      chapter: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getQuestionsForChapter(chapterId: string) {
  return prisma.question.findMany({
    where: { chapterId },
    include: {
      relatedConcept: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
