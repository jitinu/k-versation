import { NextResponse } from "next/server";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";
export async function POST() {
  if (hasSupabaseEnv()) await createAdminClient().rpc("record_impression");
  return NextResponse.json({ ok: true });
}
