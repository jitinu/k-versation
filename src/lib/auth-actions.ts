"use server";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";

const usernamePattern = /^[a-z0-9_]{3,20}$/;

export async function emailForUsername(username: string) {
  if (!hasSupabaseEnv()) return null;
  const { data } = await createAdminClient().rpc("email_for_username", {
    p_username: username.toLowerCase(),
  });
  return data;
}

export async function createProfile(input: {
  id: string;
  username: string;
  displayName: string;
  countryCode: string;
  countryName: string;
  phone?: string | null;
}) {
  const username = input.username.toLowerCase();
  if (!usernamePattern.test(username)) {
    return { error: "Username must be 3–20 lowercase letters, numbers, or underscores." };
  }
  if (!hasSupabaseEnv()) return { error: "Sign up is not configured yet." };
  const { error } = await createAdminClient()
    .from("profiles")
    .upsert({
      id: input.id,
      username,
      display_name: input.displayName,
      country_code: input.countryCode,
      country_name: input.countryName,
      phone: input.phone ?? null,
    });
  return { error: error?.message ?? null };
}
