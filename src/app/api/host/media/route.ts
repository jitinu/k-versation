import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { isHostAuthenticated } from "@/lib/host-auth";
import { assertSameOrigin } from "@/lib/security";
import { mediaSchema } from "@/lib/validation";

function row(data: ReturnType<typeof mediaSchema.parse>) {
  return {
    kind: data.kind,
    slug: data.slug,
    title: data.title,
    guest: data.kind === "conversation" ? data.guest ?? null : null,
    excerpt: data.excerpt,
    description: data.description,
    status: data.status,
    published_at: data.status === "published" ? data.publishedAt : data.publishedAt ?? null,
    poster_url: data.posterUrl ?? null,
    mux_playback_id: data.muxPlaybackId ?? null,
    mux_asset_id: data.muxAssetId ?? null,
    duration_seconds: data.durationSeconds ?? null,
    captions_url: data.captionsUrl ?? null,
  };
}

async function authorize(request: Request) {
  await assertSameOrigin(request);
  return isHostAuthenticated();
}

export async function POST(request: Request) {
  try {
    if (!(await authorize(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const parsed = mediaSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    const admin = createAdminSupabaseClient();
    if (!admin) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
    const { data, error } = await admin.from("media_items").insert(row(parsed.data)).select("*").single();
    if (error) throw error;
    await admin.from("audit_logs").insert({
      action: "create",
      entity_type: "media",
      entity_id: data.id,
      details: { title: data.title, status: data.status },
    });
    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && /duplicate/i.test(error.message)
      ? "That slug is already in use."
      : "Content could not be created.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await authorize(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const parsed = mediaSchema.safeParse(await request.json());
    if (!parsed.success || !parsed.data.id) return NextResponse.json({ error: parsed.error?.issues[0]?.message ?? "Missing content ID." }, { status: 400 });
    const admin = createAdminSupabaseClient();
    if (!admin) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
    const { data, error } = await admin.from("media_items").update(row(parsed.data)).eq("id", parsed.data.id).select("*").single();
    if (error) throw error;
    await admin.from("audit_logs").insert({
      action: "update",
      entity_type: "media",
      entity_id: data.id,
      details: { title: data.title, status: data.status },
    });
    return NextResponse.json({ item: data });
  } catch {
    return NextResponse.json({ error: "Content could not be updated." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await authorize(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing content ID." }, { status: 400 });
    const admin = createAdminSupabaseClient();
    if (!admin) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
    const { data } = await admin.from("media_items").select("title, mux_asset_id").eq("id", id).single();
    const { error } = await admin.from("media_items").delete().eq("id", id);
    if (error) throw error;
    await admin.from("audit_logs").insert({
      action: "delete",
      entity_type: "media",
      entity_id: id,
      details: { title: data?.title, muxAssetId: data?.mux_asset_id },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Content could not be deleted." }, { status: 400 });
  }
}
