import { NextRequest, NextResponse } from "next/server";
import { MOCK_USERS, CURRENT_USER } from "@/lib/mock-data";

const toFollowerDTO = (u: typeof CURRENT_USER) => ({
  id: u.id,
  username: u.username,
  name: u.name,
  avatar: u.avatar,
  isVerified: u.isVerified,
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const isCurrentUser = username === CURRENT_USER.username;

  const users = isCurrentUser
    ? MOCK_USERS
    : [CURRENT_USER, ...MOCK_USERS.filter((u) => u.username !== username).slice(0, 3)];

  return NextResponse.json(users.map(toFollowerDTO));
}