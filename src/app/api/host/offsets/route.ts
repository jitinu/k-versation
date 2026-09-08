import { NextResponse } from "next/server";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";
import { isHost } from "@/lib/host";
import { z } from "zod";

const offsetSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("video_views"),
    videoId: z.string().uuid(),
    offset: z.number().finite(),
  }),
  z.object({
    type: z.literal("video_comments"),
    videoId: z.string().uuid(),
    offset: z.number().finite(),
  }),
  z.object({
    type: z.literal("reaction"),
    videoId: z.string().uuid(),
    kind: z.enum(["thumbs_up", "heart", "laugh", "wow", "fire"]),
    offset: z.number().finite(),
  }),
  z.object({
    type: z.literal("site"),
    field: z.enum(["impressions_offset", "views_offset", "members_offset", "countries_offset"]),
    offset: z.number().finite(),
  }),
]);

export async function POST(request: Request) {
  if (!(await isHost())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: z.infer<typeof offsetSchema>;
  try {
    body = offsetSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid offset payload." }, { status: 400 });
  }
  if (!hasSupabaseEnv()) return NextResponse.json({ ok: true });
  const admin = createAdminClient();
  if (body.type === "video_views")
    await admin.from("videos").update({ view_offset: body.offset }).eq("id", body.videoId);
  if (body.type === "video_comments")
    await admin.from("videos").update({ comment_offset: body.offset }).eq("id", body.videoId);
  if (body.type === "reaction")
    await admin
      .from("reaction_offsets")
      .upsert({ video_id: body.videoId, kind: body.kind, offset_count: body.offset });
  if (body.type === "site") {
    if (body.field === "impressions_offset") {
      await admin.from("site_stats").update({ impressions_offset: body.offset }).eq("id", 1);
    } else if (body.field === "views_offset") {
      await admin.from("site_stats").update({ views_offset: body.offset }).eq("id", 1);
    } else if (body.field === "members_offset") {
      await admin.from("site_stats").update({ members_offset: body.offset }).eq("id", 1);
    } else {
      await admin.from("site_stats").update({ countries_offset: body.offset }).eq("id", 1);
    }
  }
  return NextResponse.json({ ok: true });
}
