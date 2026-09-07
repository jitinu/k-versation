import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  assertSameOrigin,
  clientFingerprint,
  consumeRateLimit,
  isLikelyBot,
} from "@/lib/security";
import { impressionSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    await assertSameOrigin(request);
    if (
      isLikelyBot(request.headers.get("user-agent")) ||
      request.headers.get("purpose") === "prefetch" ||
      request.headers.get("next-router-prefetch") === "1"
    ) {
      return new NextResponse(null, { status: 204 });
    }
    const parsed = impressionSchema.safeParse(await request.json());
    if (!parsed.success || parsed.data.path.startsWith("/host") || parsed.data.path.startsWith("/api")) {
      return NextResponse.json({ error: "Invalid event." }, { status: 400 });
    }
    const fingerprint = await clientFingerprint("impression");
    if (!(await consumeRateLimit(`impression:${fingerprint}`, 120, 600))) {
      return new NextResponse(null, { status: 204 });
    }
    const admin = createAdminSupabaseClient();
    if (!admin) return new NextResponse(null, { status: 204 });
    const { error } = await admin.from("analytics_events").insert({
      event_id: parsed.data.eventId,
      event_type: "site_impression",
      path: parsed.data.path,
      referrer: parsed.data.referrer ?? null,
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
