import { compare, hash } from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { requireServerEnv } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const cookieName = "kv_host_session";

function sessionKey() {
  return new TextEncoder().encode(requireServerEnv("HOST_SESSION_SECRET"));
}

export async function verifyHostPassword(password: string) {
  const admin = createAdminSupabaseClient();
  const { data } =
    (await admin
      ?.from("site_settings")
      .select("value")
      .eq("key", "host_password_hash")
      .maybeSingle()) ?? { data: null };
  const stored =
    typeof data?.value === "string"
      ? data.value
      : requireServerEnv("HOST_PASSWORD_HASH");
  return compare(password, stored);
}

export async function rotateHostPassword(password: string) {
  const admin = createAdminSupabaseClient();
  if (!admin) throw new Error("Database unavailable");
  const value = await hash(password, 12);
  const { error } = await admin
    .from("site_settings")
    .upsert({ key: "host_password_hash", value });
  if (error) throw error;
}

export async function createHostSession() {
  const token = await new SignJWT({ role: "host" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .setIssuer("k-versation")
    .setAudience("host")
    .sign(sessionKey());

  const store = await cookies();
  store.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8,
    path: "/",
    priority: "high",
  });
}

export async function destroyHostSession() {
  const store = await cookies();
  store.delete(cookieName);
}

export async function isHostAuthenticated() {
  try {
    const token = (await cookies()).get(cookieName)?.value;
    if (!token) return false;
    const { payload } = await jwtVerify(token, sessionKey(), {
      issuer: "k-versation",
      audience: "host",
    });
    return payload.role === "host";
  } catch {
    return false;
  }
}
