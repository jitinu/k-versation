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
    const parsed = z.object({ status: z.enum(["new", "read", "answered", "archived"]) }).safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    const admin = createAdminSupabaseClient();
    if (!admin) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
    const { error } = await admin.from("questions").update({ status: parsed.data.status }).eq("id", id);
    if (error) throw error;
    await admin.from("audit_logs").insert({
      action: "status_change",
      entity_type: "question",
      entity_id: id,
      details: { status: parsed.data.status },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Question could not be updated." }, { status: 400 });
  }
}
