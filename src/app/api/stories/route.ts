import { NextResponse } from "next/server";
import { MOCK_USERS, CURRENT_USER } from "@/lib/mock-data";

export async function GET() {
  const stories = [
    {
      username: CURRENT_USER.username,
      avatar: CURRENT_USER.avatar,
      isOwn: true,
      storyUrl: null,
    },
    ...MOCK_USERS.map((u) => ({
      username: u.username,
      avatar: u.avatar,
      isOwn: false,
      storyUrl: `https://picsum.photos/seed/story_${u.username}/400/700`,
    })),
  ];
  return NextResponse.json(stories);
}