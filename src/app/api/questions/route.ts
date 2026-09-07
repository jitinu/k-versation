import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { assertSameOrigin, clientFingerprint, consumeRateLimit } from "@/lib/security";
import { questionSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    await assertSameOrigin(request);
    const parsed = questionSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Check your submission." },
        { status: 400 },
      );
    }
    const fingerprint = await clientFingerprint("questions");
    if (!(await consumeRateLimit(`questions:${fingerprint}`, 4, 3600))) {
      return NextResponse.json(
        { error: "Please wait before sending another question." },
        { status: 429 },
      );
    }
    const admin = createAdminSupabaseClient();
    if (!admin) {
      return NextResponse.json(
        { error: "Questions are awaiting production configuration." },
        { status: 503 },
      );
    }
    const supabase = await createServerSupabaseClient();
    const { data: claims } = (await supabase?.auth.getClaims()) ?? { data: null };
    const { data: question, error } = await admin
      .from("questions")
      .insert({
        user_id: claims?.claims?.sub ?? null,
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject || null,
        question: parsed.data.question,
      })
      .select("id")
      .single();
    if (error) throw error;

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from:
          process.env.QUESTIONS_FROM_EMAIL ??
          "K-VERSATION <questions@example.com>",
        to: process.env.QUESTIONS_TO_EMAIL ?? "thekversation@gmail.com",
        replyTo: parsed.data.email,
        subject: `K-VERSATION question${parsed.data.subject ? `: ${parsed.data.subject}` : ""}`,
        text: [
          `From: ${parsed.data.name} <${parsed.data.email}>`,
          `Question ID: ${question.id}`,
          "",
          parsed.data.question,
        ].join("\n"),
      });
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "We could not receive your question. Please try again." },
      { status: 500 },
    );
  }
}
