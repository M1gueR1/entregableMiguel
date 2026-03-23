import { NextRequest, NextResponse } from "next/server";

const followedUsers = new Set<string>();

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const isFollowing = followedUsers.has(username);
  followedUsers[isFollowing ? "delete" : "add"](username);

  return NextResponse.json({ isFollowing: !isFollowing });
}