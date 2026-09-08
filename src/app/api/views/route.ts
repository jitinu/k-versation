import { NextResponse } from "next/server";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";
export async function POST(request: Request) {
  const { videoId } = await request.json();
  if (hasSupabaseEnv() && videoId)
    await createAdminClient().rpc("record_view", { p_video_id: videoId });
  return NextResponse.json({ ok: true });
}
