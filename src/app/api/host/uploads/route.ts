import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireServerEnv, siteUrl } from "@/lib/env";
import { isHostAuthenticated } from "@/lib/host-auth";
import { assertSameOrigin } from "@/lib/security";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    await assertSameOrigin(request);
    if (!(await isHostAuthenticated())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const parsed = z.object({ mediaId: z.uuid() }).safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid media ID." }, { status: 400 });
    const token = Buffer.from(
      `${requireServerEnv("MUX_TOKEN_ID")}:${requireServerEnv("MUX_TOKEN_SECRET")}`,
    ).toString("base64");
    const muxResponse = await fetch("https://api.mux.com/video/v1/uploads", {
      method: "POST",
      headers: {
        authorization: `Basic ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        cors_origin: new URL(siteUrl()).origin,
        new_asset_settings: {
          playback_policies: ["public"],
          video_quality: "basic",
          passthrough: parsed.data.mediaId,
        },
      }),
    });
    if (!muxResponse.ok) throw new Error("Mux rejected upload creation");
    const result = (await muxResponse.json()) as {
      data: { id: string; url: string };
    };
    const admin = createAdminSupabaseClient();
    await admin?.from("media_items").update({ mux_upload_id: result.data.id }).eq("id", parsed.data.mediaId);
    return NextResponse.json({ url: result.data.url });
  } catch {
    return NextResponse.json({ error: "Direct upload could not be created." }, { status: 503 });
  }
}
