import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { assertSameOrigin, clientFingerprint, consumeRateLimit } from "@/lib/security";
import { reactionSchema } from "@/lib/validation";

async function authenticatedClient() {
  const supabase = await createServerSupabaseClient();
  const { data } = (await supabase?.auth.getClaims()) ?? { data: null };
  return { supabase, userId: data?.claims?.sub };
}

export async function GET(request: Request) {
  const mediaId = new URL(request.url).searchParams.get("mediaId");
  const parsed = reactionSchema.shape.mediaId.safeParse(mediaId);
  if (!parsed.success) return NextResponse.json({ reaction: null });
  const { supabase, userId } = await authenticatedClient();
  if (!supabase || !userId) return NextResponse.json({ reaction: null });
  const { data } = await supabase
    .from("reactions")
    .select("reaction")
    .eq("media_id", parsed.data)
    .eq("user_id", userId)
    .maybeSingle();
  return NextResponse.json({ reaction: data?.reaction ?? null });
}

export async function POST(request: Request) {
  try {
    await assertSameOrigin(request);
    const parsed = reactionSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid reaction." }, { status: 400 });
    const { supabase, userId } = await authenticatedClient();
    if (!supabase || !userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    const fingerprint = await clientFingerprint("reactions");
    if (!(await consumeRateLimit(`reactions:${fingerprint}`, 60, 600))) {
      return NextResponse.json({ error: "Please slow down." }, { status: 429 });
    }
    const { error } = await supabase.from("reactions").upsert(
      { media_id: parsed.data.mediaId, user_id: userId, reaction: parsed.data.reaction },
      { onConflict: "media_id,user_id" },
    );
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Reaction could not be saved." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await assertSameOrigin(request);
    const parsed = reactionSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid reaction." }, { status: 400 });
    const { supabase, userId } = await authenticatedClient();
    if (!supabase || !userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    const { error } = await supabase
      .from("reactions")
      .delete()
      .eq("media_id", parsed.data.mediaId)
      .eq("user_id", userId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Reaction could not be removed." }, { status: 400 });
  }
}
