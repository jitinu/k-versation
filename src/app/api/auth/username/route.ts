import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { clientFingerprint, consumeRateLimit } from "@/lib/security";
import { usernameSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const value = new URL(request.url).searchParams.get("value");
  const parsed = usernameSchema.safeParse(value);
  if (!parsed.success) return NextResponse.json({ available: false });
  const fingerprint = await clientFingerprint("username");
  if (!(await consumeRateLimit(`username:${fingerprint}`, 30, 300))) {
    return NextResponse.json({ available: false }, { status: 429 });
  }
  const admin = createAdminSupabaseClient();
  if (!admin) return NextResponse.json({ available: false });
  const { data } = await admin
    .from("profiles")
    .select("id")
    .eq("username", parsed.data)
    .maybeSingle();
  return NextResponse.json({ available: !data });
}
