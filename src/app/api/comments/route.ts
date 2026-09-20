import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateActorId, guestName } from "@/lib/actor";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";
import { getSubscriber } from "@/lib/subscriber";

const schema = z.object({
  videoId: z.string().trim().min(1),
  body: z.string().trim().min(1).max(2000),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Please write a comment." }, { status: 400 });
  if (!hasSupabaseEnv())
    return NextResponse.json({ error: "Comments are not configured." }, { status: 503 });

  const admin = createAdminClient();
  const actorId = await getOrCreateActorId();
  const subscriber = await getSubscriber();
  const { data: inserted, error } = await admin
    .from("comments")
    .insert({
      video_id: parsed.data.videoId,
      subscriber_id: subscriber?.id ?? null,
      actor_id: actorId,
      author_name: subscriber?.name ?? guestName(actorId),
      body: parsed.data.body,
    })
    .select("id")
    .single();
  if (error || !inserted)
    return NextResponse.json({ error: "Unable to save comment." }, { status: 500 });
  await admin.rpc("record_impression");
  await admin.rpc("record_view", { p_video_id: parsed.data.videoId });
  const { data } = await admin.from("comments_public").select("*").eq("id", inserted.id).single();
  return NextResponse.json(data);
}
