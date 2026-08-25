import { prisma } from "./prisma";

export async function getAllIngestionItems() {
  return prisma.ingestionItem.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      source: true,
    },
  });
}

export async function getIngestionItemById(id: string) {
  return prisma.ingestionItem.findUnique({
    where: { id },
    include: {
      source: true,
    },
  });
}

export async function updateIngestionItemStatus(
  id: string,
  status: "INBOX" | "PROCESSING" | "REVIEW" | "ACCEPTED" | "REJECTED" | "ARCHIVED"
) {
  return prisma.ingestionItem.update({
    where: { id },
    data: { status },
  });
}
