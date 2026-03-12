import { NextRequest, NextResponse } from "next/server";
import { CURRENT_USER } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  const body: { name?: string; bio?: string; website?: string; avatarUrl?: string } =
    await req.json();

  if (body.name) CURRENT_USER.name = body.name;
  if (body.bio) CURRENT_USER.bio = body.bio;
  if (body.website !== undefined) CURRENT_USER.website = body.website;
  if (body.avatarUrl) CURRENT_USER.avatar = body.avatarUrl;

  return NextResponse.json(CURRENT_USER);
}
