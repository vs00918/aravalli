import { NextRequest, NextResponse } from "next/server";
import { captureSourceAndItem } from "@/lib/ingestion/service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawContent, url, title, author, sourceType, notes } = body;

    if (!rawContent && !url && !title) {
      return NextResponse.json(
        { error: "Please provide either text, a URL, or a title." },
        { status: 400 }
      );
    }

    const { source, item } = await captureSourceAndItem({
      rawContent: rawContent || "",
      url: url || undefined,
      title: title || undefined,
      author: author || undefined,
      sourceType: sourceType || undefined,
      notes: notes || undefined,
    });

    return NextResponse.json({ success: true, sourceId: source.id, itemId: item.id });
  } catch (error: any) {
    console.error("Capture API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to capture source" },
      { status: 500 }
    );
  }
}
