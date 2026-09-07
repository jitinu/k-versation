import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { assertSameOrigin, clientFingerprint, consumeRateLimit } from "@/lib/security";
import type { Comment } from "@/lib/types";
import { commentSchema } from "@/lib/validation";

type CommentRow = {
  id: string;
  body: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles: { username: string } | null;
};

function mapComment(row: CommentRow, userId?: string): Comment {
  return {
    id: row.id,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    username: row.profiles?.username ?? "member",
    viewerOwns: row.user_id === userId,
  };
}

async function currentUserId() {
  const supabase = await createServerSupabaseClient();
  const { data } = (await supabase?.auth.getClaims()) ?? { data: null };
  return data?.claims?.sub;
}

export async function GET(request: Request) {
  const mediaId = new URL(request.url).searchParams.get("mediaId");
  const parsed = commentSchema.shape.mediaId.safeParse(mediaId);
  if (!parsed.success) return NextResponse.json({ comments: [] });
  const admin = createAdminSupabaseClient();
  if (!admin) return NextResponse.json({ comments: [] });
  const [userId, result] = await Promise.all([
    currentUserId(),
    admin
      .from("comments")
      .select("id, body, user_id, created_at, updated_at, profiles(username)")
      .eq("media_id", parsed.data)
      .is("hidden_at", null)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);
  if (result.error) return NextResponse.json({ comments: [] });
  return NextResponse.json({
    comments: (result.data as unknown as CommentRow[]).map((row) =>
      mapComment(row, userId),
    ),
  });
}

export async function POST(request: Request) {
  try {
    await assertSameOrigin(request);
    const parsed = commentSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    const supabase = await createServerSupabaseClient();
    const { data: claims } = (await supabase?.auth.getClaims()) ?? { data: null };
    const userId = claims?.claims?.sub;
    if (!supabase || !userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    const fingerprint = await clientFingerprint("comments");
    if (!(await consumeRateLimit(`comments:${fingerprint}`, 10, 600))) {
      return NextResponse.json({ error: "Please wait before posting again." }, { status: 429 });
    }
    const { data, error } = await supabase
      .from("comments")
      .insert({ media_id: parsed.data.mediaId, user_id: userId, body: parsed.data.body })
      .select("id, body, user_id, created_at, updated_at, profiles(username)")
      .single();
    if (error) throw error;
    return NextResponse.json({ comment: mapComment(data as unknown as CommentRow, userId) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Comment could not be posted." }, { status: 400 });
  }
}
