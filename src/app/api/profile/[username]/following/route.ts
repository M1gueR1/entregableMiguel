import { NextRequest, NextResponse } from "next/server";
import { MOCK_USERS, CURRENT_USER } from "@/lib/mock-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  // Return a mock list of users this person is following.
  // For the current user, they follow all mock users.
  // For other users, return a subset.
  const following =
    username === CURRENT_USER.username
      ? MOCK_USERS.map((u) => ({
          id: u.id,
          username: u.username,
          name: u.name,
          avatar: u.avatar,
          isVerified: u.isVerified,
        }))
      : [CURRENT_USER, ...MOCK_USERS.filter((u) => u.username !== username).slice(0, 2)].map(
          (u) => ({
            id: u.id,
            username: u.username,
            name: u.name,
            avatar: u.avatar,
            isVerified: u.isVerified,
          })
        );

  return NextResponse.json(following);
}
