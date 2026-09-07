import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { isHostAuthenticated } from "@/lib/host-auth";
import { assertSameOrigin } from "@/lib/security";
import { metricAdjustmentSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    await assertSameOrigin(request);
    if (!(await isHostAuthenticated())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const parsed = metricAdjustmentSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    const itemMetric = ["video_views", "reactions", "comments"].includes(parsed.data.metric);
    if (itemMetric !== Boolean(parsed.data.targetId)) {
      return NextResponse.json({ error: itemMetric ? "Select a film target." : "This metric cannot have a film target." }, { status: 400 });
    }
    const admin = createAdminSupabaseClient();
    if (!admin) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
    const { error } = await admin.rpc("set_metric_adjustment", {
      p_metric: parsed.data.metric,
      p_target_id: parsed.data.targetId ?? null,
      p_adjustment: parsed.data.adjustment,
      p_note: parsed.data.note ?? null,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Adjustment could not be saved." }, { status: 400 });
  }
}
