import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateActorId } from "@/lib/actor";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";
import type { ReactionKind } from "@/lib/supabase/types";

const schema = z.object({
  videoId: z.string().trim().min(1),
  kind: z.enum(["thumbs_up", "heart", "laugh", "wow", "fire"]),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid reaction." }, { status: 400 });
  if (!hasSupabaseEnv())
    return NextResponse.json({ error: "Reactions are not configured." }, { status: 503 });

  const admin = createAdminClient();
  const actorId = await getOrCreateActorId();
  const { data: existing } = await admin
    .from("reactions")
    .select("kind")
    .eq("video_id", parsed.data.videoId)
    .eq("actor_id", actorId)
    .eq("kind", parsed.data.kind)
    .maybeSingle();
  let error;
  if (existing) {
    ({ error } = await admin
      .from("reactions")
      .delete()
      .eq("video_id", parsed.data.videoId)
      .eq("actor_id", actorId)
      .eq("kind", parsed.data.kind));
  } else {
    ({ error } = await admin.from("reactions").insert({
      video_id: parsed.data.videoId,
      actor_id: actorId,
      kind: parsed.data.kind,
    }));
  }
  if (error) return NextResponse.json({ error: "Unable to save reaction." }, { status: 500 });
  await admin.rpc("record_impression");
  await admin.rpc("record_view", { p_video_id: parsed.data.videoId });
  const { data: stats } = await admin
    .from("video_display_stats")
    .select("reactions")
    .eq("video_id", parsed.data.videoId)
    .maybeSingle();
  const counts = Object.fromEntries(
    Object.entries(stats?.reactions ?? {}).map(([kind, count]) => [kind, Number(count) || 0]),
  ) as Partial<Record<ReactionKind, number>>;
  return NextResponse.json({ active: !existing, counts });
}
