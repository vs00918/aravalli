import { NextRequest, NextResponse } from "next/server";
import { processIngestionItem } from "@/lib/ingestion/service";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await processIngestionItem(params.id);
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error("Process Ingestion Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process item" },
      { status: 500 }
    );
  }
}
