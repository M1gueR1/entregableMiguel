import { NextRequest, NextResponse } from "next/server";
import { MOCK_REELS, CURRENT_USER } from "@/lib/mock-data";
import { CreateReelPayload } from "@/lib/types";

export async function GET() {
  return NextResponse.json(MOCK_REELS);
}

export async function POST(req: NextRequest) {
  const body: CreateReelPayload = await req.json();

  if (!body.videoUrl || !body.caption) {
    return NextResponse.json(
      { error: "videoUrl and caption are required" },
      { status: 400 }
    );
  }

  const newReel = {
    id: `reel_${Date.now()}`,
    author: CURRENT_USER,
    videoUrl: body.videoUrl,
    thumbnailUrl: body.thumbnailUrl ?? body.videoUrl,
    caption: body.caption,
    audioTrack: body.audioTrack,
    likesCount: 0,
    commentsCount: 0,
    viewsCount: 0,
    createdAt: new Date().toISOString(),
    isLiked: false,
  };

  MOCK_REELS.unshift(newReel);

  return NextResponse.json(newReel, { status: 201 });
}
