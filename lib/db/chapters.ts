import { prisma } from "./prisma";

export async function getAllChapters() {
  return prisma.chapter.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { concepts: true },
      },
    },
  });
}

export async function getChapterBySlug(slug: string) {
  return prisma.chapter.findUnique({
    where: { slug },
    include: {
      concepts: {
        orderBy: { order: "asc" },
      },
    },
  });
}
