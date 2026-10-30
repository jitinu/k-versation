import { NextResponse } from "next/server";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";
export async function POST(request: Request) {
  const { videoId } = await request.json();
  if (hasSupabaseEnv() && videoId) {
    const admin = createAdminClient();
    await Promise.all([
      admin.rpc("record_view", { p_video_id: videoId }),
      admin.rpc("record_impression"),
    ]);
  }
  return NextResponse.json({ ok: true });
}
