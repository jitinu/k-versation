"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Comment } from "@/lib/supabase/types";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";

export function Comments({ videoId }: { videoId: string }) {
  const [body, setBody] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasSupabaseEnv()) return;
    const client = createClient();
    const load = async () => {
      const { data } = await client
        .from("comments_public")
        .select("*")
        .eq("video_id", videoId)
        .order("created_at", { ascending: false });
      if (data) setComments(data as Comment[]);
    };
    const channel = client
      .channel(`comments:${videoId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `video_id=eq.${videoId}` },
        async (payload) => {
          const { data } = await client
            .from("comments_public")
            .select("*")
            .eq("id", payload.new.id)
            .single();
          if (data) {
            setComments((current) =>
              current.some((comment) => comment.id === data.id)
                ? current
                : [data as Comment, ...current],
            );
          }
        },
      )
      .subscribe();
    const interval = window.setInterval(() => void load(), 20_000);
    void load();
    return () => {
      window.clearInterval(interval);
      void client.removeChannel(channel);
    };
  }, [videoId]);

  async function performSubmit() {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ videoId, body: body.trim() }),
    });
    if (!response.ok) {
      setError("Unable to save your comment.");
      return;
    }
    const comment = (await response.json()) as Comment;
    setComments((current) => [comment, ...current]);
    setBody("");
    setError("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    void performSubmit();
  }

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-xl">Comments</h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <article key={comment.id} className="border-line border-t pt-4">
            <p className="text-ink-3 text-xs">
              {comment.author_name} · {new Date(comment.created_at).toLocaleDateString()}
            </p>
            <p className="mt-2 normal-case">{comment.body}</p>
          </article>
        ))}
      </div>
      <form className="mt-8" onSubmit={submit}>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Leave a thought..."
          rows={4}
        />
        <button className="btn btn-primary mt-3 px-4 py-2">
          Comment <span className="arrow">↗</span>
        </button>
        {error ? <p className="text-signal mt-2 text-sm normal-case">{error}</p> : null}
      </form>
    </section>
  );
}
