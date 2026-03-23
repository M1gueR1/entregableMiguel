import { NextRequest, NextResponse } from "next/server";
import { MOCK_POSTS, CURRENT_USER } from "@/lib/mock-data";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const post = MOCK_POSTS.find((p) => p.id === id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const newComment = {
    id: `comment_${Date.now()}`,
    author: CURRENT_USER,
    text,
    createdAt: new Date().toISOString(),
    likesCount: 0,
  };

  post.comments.push(newComment);
  post.commentsCount++;

  return NextResponse.json(newComment, { status: 201 });
}