import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
  website: z.string().max(0).optional().default(""),
});
const attempts = new Map<string, number[]>();
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((time) => now - time < 3600000);
  if (recent.length >= 5)
    return NextResponse.json({ error: "Please try again later." }, { status: 429 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: "Please check the form.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  if (!process.env.RESEND_API_KEY)
    return NextResponse.json(
      { error: "Questions are not configured yet. Please try again soon." },
      { status: 503 },
    );
  attempts.set(ip, [...recent, now]);
  await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: process.env.QUESTIONS_FROM_EMAIL ?? "K-VERSATION <onboarding@resend.dev>",
    to: process.env.QUESTIONS_TO_EMAIL ?? "thekversation@gmail.com",
    replyTo: parsed.data.email,
    subject: `Question from ${parsed.data.name}`,
    text: parsed.data.message,
  });
  return NextResponse.json({ ok: true });
}
