import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { hostToken } from "@/lib/host";
export async function POST(request: Request) {
  const { password } = await request.json();
  const expected = process.env.HOST_PASSWORD ?? "";
  const actual = createHash("sha256")
    .update(String(password ?? ""))
    .digest();
  const target = createHash("sha256").update(expected).digest();
  if (!expected || !timingSafeEqual(actual, target))
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set("kv_host", hostToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 43200,
    path: "/",
  });
  return response;
}
