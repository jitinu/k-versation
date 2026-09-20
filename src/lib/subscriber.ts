import "server-only";

import { cookies } from "next/headers";
import type { Subscriber } from "@/lib/supabase/types";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";

export async function getSubscriber(): Promise<Subscriber | null> {
  if (!hasSupabaseEnv()) return null;
  const token = (await cookies()).get("kv_sub")?.value;
  if (!token) return null;
  const { data } = await createAdminClient()
    .from("subscribers")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  return data;
}

export async function setSubscriberCookie(token: string) {
  (await cookies()).set("kv_sub", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}
