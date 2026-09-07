import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { assertSameOrigin, clientFingerprint, consumeRateLimit } from "@/lib/security";

export async function DELETE(request: Request) {
  try {
    await assertSameOrigin(request);
    const supabase = await createServerSupabaseClient();
    const { data } = (await supabase?.auth.getClaims()) ?? { data: null };
    const userId = data?.claims?.sub;
    if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    const fingerprint = await clientFingerprint("account-delete");
    if (!(await consumeRateLimit(`account-delete:${fingerprint}`, 3, 3600))) {
      return NextResponse.json({ error: "Request limit reached." }, { status: 429 });
    }
    const admin = createAdminSupabaseClient();
    if (!admin) return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Account could not be deleted." }, { status: 400 });
  }
}
