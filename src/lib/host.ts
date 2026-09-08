import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

function token() {
  return createHmac("sha256", process.env.HOST_SESSION_SECRET ?? "development-secret")
    .update("host")
    .digest("hex");
}

export async function isHost() {
  const value = (await cookies()).get("kv_host")?.value;
  if (!value) return false;
  try {
    return timingSafeEqual(Buffer.from(value), Buffer.from(token()));
  } catch {
    return false;
  }
}

export { token as hostToken };
