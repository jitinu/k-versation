import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";
import { getSubscriber } from "@/lib/subscriber";

const schema = z.object({
  videoId: z.string().trim().min(1),
  body: z.string().trim().min(1).max(2000),
});

export async function POST(request: Request) {
  const subscriber = await getSubscriber();
  if (!subscriber) return NextResponse.json({ error: "Subscribe to comment." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Please write a comment." }, { status: 400 });
  if (!hasSupabaseEnv())
    return NextResponse.json({ error: "Comments are not configured." }, { status: 503 });

  const admin = createAdminClient();
  const { data: inserted, error } = await admin
    .from("comments")
    .insert({
      video_id: parsed.data.videoId,
      subscriber_id: subscriber.id,
      body: parsed.data.body,
    })
    .select("id")
    .single();
  if (error || !inserted)
    return NextResponse.json({ error: "Unable to save comment." }, { status: 500 });
  const { data } = await admin.from("comments_public").select("*").eq("id", inserted.id).single();
  return NextResponse.json(data);
}
