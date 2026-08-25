import { NextRequest, NextResponse } from "next/server";
import { updateConcept } from "@/lib/db/concepts";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const updated = await updateConcept(params.slug, body);
    return NextResponse.json({ success: true, concept: updated });
  } catch (error: any) {
    console.error("Update Concept Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update concept" },
      { status: 500 }
    );
  }
}
