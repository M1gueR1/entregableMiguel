import { NextResponse } from "next/server";
import { CURRENT_USER } from "@/lib/mock-data";

const MOCK_STORIES = [
  { username: CURRENT_USER.username, avatar: CURRENT_USER.avatar, isOwn: true },
  { username: "alex.photo", avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=alex", isOwn: false },
  { username: "maya.art", avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=maya", isOwn: false },
  { username: "javier.cooks", avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=javier", isOwn: false },
  { username: "sofia.travels", avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=sofia", isOwn: false },
  { username: "kai.fitness", avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=kai", isOwn: false },
];

export async function GET() {
  return NextResponse.json(MOCK_STORIES);
}
