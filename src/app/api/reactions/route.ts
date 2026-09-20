import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";
import { getSubscriber } from "@/lib/subscriber";
import type { ReactionKind } from "@/lib/supabase/types";

const schema = z.object({
  videoId: z.string().trim().min(1),
  kind: z.enum(["thumbs_up", "heart", "laugh", "wow", "fire"]),
});

export async function POST(request: Request) {
  const subscriber = await getSubscriber();
  if (!subscriber) return NextResponse.json({ error: "Subscribe to react." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid reaction." }, { status: 400 });
  if (!hasSupabaseEnv())
    return NextResponse.json({ error: "Reactions are not configured." }, { status: 503 });

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("reactions")
    .select("kind")
    .eq("video_id", parsed.data.videoId)
    .eq("subscriber_id", subscriber.id)
    .eq("kind", parsed.data.kind)
    .maybeSingle();
  let error;
  if (existing) {
    ({ error } = await admin
      .from("reactions")
      .delete()
      .eq("video_id", parsed.data.videoId)
      .eq("subscriber_id", subscriber.id)
      .eq("kind", parsed.data.kind));
  } else {
    ({ error } = await admin.from("reactions").insert({
      video_id: parsed.data.videoId,
      subscriber_id: subscriber.id,
      kind: parsed.data.kind,
    }));
  }
  if (error) return NextResponse.json({ error: "Unable to save reaction." }, { status: 500 });
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
