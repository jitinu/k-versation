import { CommentModeration } from "@/components/host-actions";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";

type Row = {
  id: string;
  body: string;
  hidden_at: string | null;
  created_at: string;
  profiles: { username: string } | null;
  media_items: { title: string } | null;
};

export default async function HostCommentsPage() {
  const admin = createAdminSupabaseClient();
  const { data } = admin
    ? await admin.from("comments").select("id, body, hidden_at, created_at, profiles(username), media_items(title)").order("created_at", { ascending: false }).limit(500)
    : { data: [] };
  const comments = (data ?? []) as unknown as Row[];
  return (
    <div className="host-page">
      <div className="host-section-heading">
        <div><p className="eyebrow">Moderation</p><h2>Comments</h2></div>
        <p>Hide, restore, or permanently remove community contributions.</p>
      </div>
      <div className="moderation-list">
        {comments.map((comment) => (
          <article key={comment.id} className={comment.hidden_at ? "is-hidden" : undefined}>
            <header>
              <div><strong>@{comment.profiles?.username ?? "deleted-member"}</strong><span>on {comment.media_items?.title ?? "deleted content"}</span></div>
              <time>{formatDate(comment.created_at)}</time>
            </header>
            <p>{comment.body}</p>
            <CommentModeration id={comment.id} hidden={Boolean(comment.hidden_at)} />
          </article>
        ))}
        {!comments.length && <p className="host-empty">No comments yet.</p>}
      </div>
    </div>
  );
}
