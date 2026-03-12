import { NextRequest, NextResponse } from "next/server";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === id);

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  return NextResponse.json(conversation);
}
