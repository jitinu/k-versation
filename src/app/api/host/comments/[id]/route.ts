import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { isHostAuthenticated } from "@/lib/host-auth";
import { assertSameOrigin } from "@/lib/security";
import { z } from "zod";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  try {
    await assertSameOrigin(request);
    if (!(await isHostAuthenticated())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const { id } = await params;
    const parsed = z.object({ hidden: z.boolean(), reason: z.string().max(500).optional() }).safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid moderation action." }, { status: 400 });
    const admin = createAdminSupabaseClient();
    if (!admin) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
    const { error } = await admin.from("comments").update({
      hidden_at: parsed.data.hidden ? new Date().toISOString() : null,
      hidden_reason: parsed.data.hidden ? parsed.data.reason ?? "Hidden by host" : null,
    }).eq("id", id);
    if (error) throw error;
    await admin.from("audit_logs").insert({
      action: parsed.data.hidden ? "hide" : "unhide",
      entity_type: "comment",
      entity_id: id,
      details: { reason: parsed.data.reason ?? null },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Moderation action failed." }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    await assertSameOrigin(request);
    if (!(await isHostAuthenticated())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const { id } = await params;
    const admin = createAdminSupabaseClient();
    if (!admin) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
    const { error } = await admin.from("comments").delete().eq("id", id);
    if (error) throw error;
    await admin.from("audit_logs").insert({ action: "delete", entity_type: "comment", entity_id: id });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Comment could not be deleted." }, { status: 400 });
  }
}
