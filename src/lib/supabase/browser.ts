"use client";

import { createBrowserClient } from "@supabase/ssr";
import { hasSupabasePublicEnv } from "@/lib/env";

export function createBrowserSupabaseClient() {
  if (!hasSupabasePublicEnv()) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
