import { NextRequest, NextResponse } from "next/server";

// In-memory store of followed usernames (mock — resets on server restart)
const followedUsers = new Set<string>();

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const isNowFollowing = !followedUsers.has(username);
  if (isNowFollowing) {
    followedUsers.add(username);
  } else {
    followedUsers.delete(username);
  }

  return NextResponse.json({ isFollowing: isNowFollowing });
}
