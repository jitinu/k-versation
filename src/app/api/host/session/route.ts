import { NextResponse } from "next/server";
import {
  createHostSession,
  destroyHostSession,
  verifyHostPassword,
} from "@/lib/host-auth";
import { assertSameOrigin, clientFingerprint, consumeRateLimit } from "@/lib/security";

export async function POST(request: Request) {
  try {
    await assertSameOrigin(request);
    const fingerprint = await clientFingerprint("host-login");
    if (!(await consumeRateLimit(`host-login:${fingerprint}`, 8, 900))) {
      return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
    }
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password !== "string" || body.password.length > 256) {
      return NextResponse.json({ error: "Invalid credential." }, { status: 400 });
    }
    if (!(await verifyHostPassword(body.password))) {
      return NextResponse.json({ error: "Invalid credential." }, { status: 401 });
    }
    await createHostSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Host login unavailable." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  try {
    await assertSameOrigin(request);
    await destroyHostSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not end session." }, { status: 400 });
  }
}
