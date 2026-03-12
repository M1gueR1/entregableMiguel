import { NextRequest, NextResponse } from "next/server";
import { MOCK_POSTS } from "@/lib/mock-data";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = MOCK_POSTS.find((p) => p.id === id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  post.isLiked = !post.isLiked;
  post.likesCount += post.isLiked ? 1 : -1;

  return NextResponse.json({ isLiked: post.isLiked, likesCount: post.likesCount });
}
