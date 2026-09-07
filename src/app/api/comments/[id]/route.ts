import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { assertSameOrigin } from "@/lib/security";
import { commentUpdateSchema } from "@/lib/validation";

type Props = { params: Promise<{ id: string }> };

async function session() {
  const supabase = await createServerSupabaseClient();
  const { data } = (await supabase?.auth.getClaims()) ?? { data: null };
  return { supabase, userId: data?.claims?.sub };
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    await assertSameOrigin(request);
    const { id } = await params;
    const parsed = commentUpdateSchema.safeParse(await request.json());
    const { supabase, userId } = await session();
    if (!parsed.success) return NextResponse.json({ error: "Invalid comment." }, { status: 400 });
    if (!supabase || !userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    const { data, error } = await supabase
      .from("comments")
      .update({ body: parsed.data.body })
      .eq("id", id)
      .eq("user_id", userId)
      .select("id, body, user_id, created_at, updated_at, profiles(username)")
      .single();
    if (error) throw error;
    const profile = data.profiles as unknown as { username?: string } | null;
    return NextResponse.json({
      comment: {
        id: data.id,
        body: data.body,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        username: profile?.username ?? "member",
        viewerOwns: true,
      },
    });
  } catch {
    return NextResponse.json({ error: "Comment could not be updated." }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    await assertSameOrigin(request);
    const { id } = await params;
    const { supabase, userId } = await session();
    if (!supabase || !userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    const { error } = await supabase.from("comments").delete().eq("id", id).eq("user_id", userId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Comment could not be deleted." }, { status: 400 });
  }
}
