import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { assertSameOrigin, clientFingerprint, consumeRateLimit, isLikelyBot } from "@/lib/security";
import { videoEventSchema } from "@/lib/validation";

const eventTypes = {
  page: "video_page",
  start: "video_start",
  view: "video_view",
  progress: "video_progress",
  complete: "video_complete",
} as const;

export async function POST(request: Request) {
  try {
    await assertSameOrigin(request);
    if (isLikelyBot(request.headers.get("user-agent"))) {
      return new NextResponse(null, { status: 204 });
    }
    const parsed = videoEventSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid event." }, { status: 400 });
    const fingerprint = await clientFingerprint("video");
    if (!(await consumeRateLimit(`video:${fingerprint}`, 180, 3600))) {
      return new NextResponse(null, { status: 204 });
    }
    const admin = createAdminSupabaseClient();
    if (!admin) return new NextResponse(null, { status: 204 });
    const { data: media } = await admin
      .from("media_items")
      .select("id")
      .eq("id", parsed.data.mediaId)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    if (!media) return NextResponse.json({ error: "Media not found." }, { status: 404 });
    const supabase = await createServerSupabaseClient();
    const { data: claims } = (await supabase?.auth.getClaims()) ?? { data: null };
    const { error } = await admin.from("analytics_events").insert({
      event_id: parsed.data.eventId,
      event_type: eventTypes[parsed.data.type],
      media_id: parsed.data.mediaId,
      user_id: claims?.claims?.sub ?? null,
      playback_session_id: parsed.data.playbackSessionId,
      progress: parsed.data.progress ?? null,
      visitor_hash: fingerprint,
      country_code:
        request.headers.get("x-vercel-ip-country") ??
        request.headers.get("cf-ipcountry"),
    });
    if (error?.code !== "23505" && error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Event rejected." }, { status: 400 });
  }
}
