"use client";
import { FormEvent, useState } from "react";
import { useRequireAuth } from "@/components/auth/AuthGate";
import type { Comment } from "@/lib/supabase/types";
export function Comments({ comments = [] }: { comments?: Comment[] }) {
  const gate = useRequireAuth();
  const [body, setBody] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    gate(() => setBody(""));
  }
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-xl">Comments</h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <article key={comment.id} className="border-line border-t pt-4">
            <p className="text-ink-3 text-xs">
              {comment.profiles?.username ?? "Member"} ·{" "}
              {new Date(comment.created_at).toLocaleDateString()}
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
        <button className="border-signal text-signal mt-3 border px-4 py-2">Comment</button>
      </form>
    </section>
  );
}
