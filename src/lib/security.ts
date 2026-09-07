import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const localRateLimits = new Map<string, number[]>();

export async function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).origin !== new URL(request.url).origin) {
    throw new Error("Invalid request origin");
  }
}

export async function clientFingerprint(namespace: string) {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded ?? requestHeaders.get("x-real-ip") ?? "unknown";
  const agent = requestHeaders.get("user-agent") ?? "unknown";
  return createHash("sha256")
    .update(`${namespace}:${ip}:${agent}`)
    .digest("hex");
}

export async function consumeRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
) {
  const admin = createAdminSupabaseClient();
  if (admin) {
    const { data, error } = await admin.rpc("consume_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error) throw error;
    return Boolean(data);
  }

  if (process.env.NODE_ENV === "production") return false;
  const now = Date.now();
  const cutoff = now - windowSeconds * 1000;
  const events = (localRateLimits.get(key) ?? []).filter(
    (timestamp) => timestamp > cutoff,
  );
  if (events.length >= limit) return false;
  events.push(now);
  localRateLimits.set(key, events);
  return true;
}

export function isLikelyBot(userAgent: string | null) {
  return Boolean(
    userAgent &&
      /bot|crawler|spider|preview|facebookexternalhit|slackbot|discordbot/i.test(
        userAgent,
      ),
  );
}
