import { NextResponse } from "next/server";
import { isHostAuthenticated, rotateHostPassword, verifyHostPassword } from "@/lib/host-auth";
import { assertSameOrigin, clientFingerprint, consumeRateLimit } from "@/lib/security";
import { z } from "zod";

const schema = z.object({
  currentPassword: z.string().min(1).max(256),
  password: z.string().min(12).max(128)
    .regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
});

export async function POST(request: Request) {
  try {
    await assertSameOrigin(request);
    if (!(await isHostAuthenticated())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Use 12+ characters with upper/lowercase, a number, and a symbol." }, { status: 400 });
    }
    const fingerprint = await clientFingerprint("host-password");
    if (!(await consumeRateLimit(`host-password:${fingerprint}`, 5, 3600))) {
      return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
    }
    if (!(await verifyHostPassword(parsed.data.currentPassword))) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
    await rotateHostPassword(parsed.data.password);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Password could not be updated." }, { status: 400 });
  }
}
