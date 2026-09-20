import { NextResponse } from "next/server";
import { z } from "zod";
import { getActorId } from "@/lib/actor";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";
import { getSubscriber } from "@/lib/subscriber";

const querySchema = z.object({ videoId: z.string().trim().min(1).optional() });

export async function GET(request: Request) {
  const subscriber = await getSubscriber();
  const actorId = await getActorId();
  const videoId = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams)).data
    ?.videoId;
  const response: { subscriber: { name: string; email: string } | null; reactions?: string[] } = {
    subscriber: subscriber ? { name: subscriber.name, email: subscriber.email } : null,
  };
  if (videoId) {
    if (!actorId || !hasSupabaseEnv()) response.reactions = [];
    else {
      const { data } = await createAdminClient()
        .from("reactions")
        .select("kind")
        .eq("video_id", videoId)
        .eq("actor_id", actorId);
      response.reactions = (data ?? []).map((row) => row.kind);
    }
  }
  return NextResponse.json(response);
}
