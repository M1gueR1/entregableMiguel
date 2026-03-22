import { NextResponse } from "next/server";
import { CURRENT_USER } from "@/lib/mock-data";

const MOCK_STORIES = [
  { username: CURRENT_USER.username, avatar: CURRENT_USER.avatar, isOwn: true, storyUrl: null },
  { username: "alex.photo", avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=alex", isOwn: false, storyUrl: "https://picsum.photos/seed/story_alex.photo/400/700" },
  { username: "maya.art", avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=maya", isOwn: false, storyUrl: "https://picsum.photos/seed/story_maya.art/400/700" },
  { username: "javier.cooks", avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=javier", isOwn: false, storyUrl: "https://picsum.photos/seed/story_javier.cooks/400/700" },
  { username: "sofia.travels", avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=sofia", isOwn: false, storyUrl: "https://picsum.photos/seed/story_sofia.travels/400/700" },
  { username: "kai.fitness", avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=kai", isOwn: false, storyUrl: "https://picsum.photos/seed/story_kai.fitness/400/700" },
];

export async function GET() {
  return NextResponse.json(MOCK_STORIES);
}