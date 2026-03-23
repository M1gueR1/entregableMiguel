import { NextRequest, NextResponse } from "next/server";
import { MOCK_USERS, CURRENT_USER } from "@/lib/mock-data";

const followedUsers = new Set<string>();

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const user = MOCK_USERS.find((u) => u.username === username);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isFollowing = followedUsers.has(username);
  followedUsers[isFollowing ? "delete" : "add"](username);

  user.followersCount += isFollowing ? -1 : 1;
  CURRENT_USER.followingCount += isFollowing ? -1 : 1;

  return NextResponse.json({ isFollowing: !isFollowing });
}