import { NextRequest, NextResponse } from "next/server";
import { promoteIngestionItem } from "@/lib/ingestion/service";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const { targetConceptSlug, notes, relevance } = body;

    const item = await promoteIngestionItem(params.id, {
      targetConceptSlug,
      notes,
      relevance,
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error("Promote Ingestion Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to promote item" },
      { status: 500 }
    );
  }
}
