import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireServerEnv } from "@/lib/env";

function validSignature(raw: string, header: string | null) {
  if (!header) return false;
  const values = Object.fromEntries(header.split(",").map((part) => part.split("=")));
  const timestamp = Number(values.t);
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > 300 || !values.v1) return false;
  const digest = createHmac("sha256", requireServerEnv("MUX_WEBHOOK_SECRET"))
    .update(`${values.t}.${raw}`)
    .digest("hex");
  const expected = Buffer.from(digest);
  const received = Buffer.from(values.v1);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (!validSignature(raw, request.headers.get("mux-signature"))) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }
    const event = JSON.parse(raw) as {
      type: string;
      data: {
        id: string;
        passthrough?: string;
        duration?: number;
        playback_ids?: Array<{ id: string; policy: string }>;
        errors?: { messages?: string[] };
      };
    };
    const admin = createAdminSupabaseClient();
    if (!admin) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
    if (event.type === "video.asset.ready" && event.data.passthrough) {
      await admin
        .from("media_items")
        .update({
          mux_asset_id: event.data.id,
          mux_playback_id: event.data.playback_ids?.find((value) => value.policy === "public")?.id ?? null,
          duration_seconds: Math.round(event.data.duration ?? 0),
        })
        .eq("id", event.data.passthrough);
    }
    if (event.type === "video.asset.errored" && event.data.passthrough) {
      await admin.from("audit_logs").insert({
        action: "video_processing_error",
        entity_type: "media",
        entity_id: event.data.passthrough,
        details: { assetId: event.data.id, errors: event.data.errors?.messages ?? [] },
      });
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook rejected." }, { status: 400 });
  }
}
