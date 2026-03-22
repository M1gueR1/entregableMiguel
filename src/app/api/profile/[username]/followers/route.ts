import { NextRequest, NextResponse } from "next/server";
import { MOCK_USERS, CURRENT_USER } from "@/lib/mock-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const followers =
    username === CURRENT_USER.username
      ? MOCK_USERS.map((u) => ({
          id: u.id,
          username: u.username,
          name: u.name,
          avatar: u.avatar,
          isVerified: u.isVerified,
        }))
      : [CURRENT_USER, ...MOCK_USERS.filter((u) => u.username !== username).slice(0, 3)].map(
          (u) => ({
            id: u.id,
            username: u.username,
            name: u.name,
            avatar: u.avatar,
            isVerified: u.isVerified,
          })
        );

  return NextResponse.json(followers);
}
