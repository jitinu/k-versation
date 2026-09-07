"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Share2 } from "lucide-react";
import type { Comment, ReactionKind, Viewer } from "@/lib/types";

const reactions: Array<[ReactionKind, string]> = [
  ["appreciate", "Appreciate"],
  ["insightful", "Insightful"],
  ["inspired", "Inspired"],
  ["curious", "Curious"],
];

export function Engagement({
  mediaId,
  viewer,
  initialReactions,
  initialComments,
}: {
  mediaId: string;
  viewer: Viewer;
  initialReactions: number;
  initialComments: number;
}) {
  const [selected, setSelected] = useState<ReactionKind | null>(null);
  const [reactionCount, setReactionCount] = useState(initialReactions);
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    void Promise.all([
      fetch(`/api/comments?mediaId=${mediaId}`).then((response) =>
        response.json(),
      ),
      viewer
        ? fetch(`/api/reactions?mediaId=${mediaId}`).then((response) =>
            response.json(),
          )
        : Promise.resolve({ reaction: null }),
    ]).then(([commentResult, reactionResult]) => {
      setComments(
        (commentResult as { comments?: Comment[] }).comments ?? [],
      );
      setSelected(
        (reactionResult as { reaction?: ReactionKind | null }).reaction ?? null,
      );
    });
  }, [mediaId, viewer]);

  async function react(reaction: ReactionKind) {
    if (!viewer) return;
    const previous = selected;
    const next = selected === reaction ? null : reaction;
    setSelected(next);
    setReactionCount((count) =>
      previous ? (next ? count : Math.max(0, count - 1)) : count + 1,
    );
    const response = await fetch("/api/reactions", {
      method: next ? "POST" : "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mediaId, reaction }),
    });
    if (!response.ok) {
      setSelected(previous);
      setReactionCount(initialReactions);
      setError("Your reaction could not be saved.");
    }
  }

  async function submitComment(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mediaId, body }),
    });
    const result = (await response.json()) as {
      comment?: Comment;
      error?: string;
    };
    if (!response.ok || !result.comment) {
      setError(result.error ?? "Your comment could not be posted.");
      return;
    }
    setComments((value) => [result.comment!, ...value]);
    setBody("");
  }

  async function updateComment(comment: Comment, nextBody: string) {
    const response = await fetch(`/api/comments/${comment.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: nextBody }),
    });
    const result = (await response.json()) as { comment?: Comment };
    if (response.ok && result.comment) {
      setComments((values) =>
        values.map((value) =>
          value.id === comment.id ? result.comment! : value,
        ),
      );
      setEditing(null);
    } else {
      setError("Your comment could not be updated.");
    }
  }

  async function deleteComment(comment: Comment) {
    if (!confirm("Delete this comment?")) return;
    const response = await fetch(`/api/comments/${comment.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setComments((values) => values.filter((value) => value.id !== comment.id));
    } else {
      setError("Your comment could not be deleted.");
    }
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({ url: location.href });
      return;
    }
    await navigator.clipboard.writeText(location.href);
  }

  return (
    <section className="engagement">
      <div className="reaction-row">
        <div>
          <p className="eyebrow">Respond</p>
          <div className="reaction-buttons">
            {reactions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={selected === value ? "is-selected" : undefined}
                onClick={() => void react(value)}
                disabled={!viewer}
              >
                <span className={`reaction-glyph reaction-glyph--${value}`} />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="engagement-counts">
          <span>{reactionCount} responses</span>
          <span>
            <MessageCircle aria-hidden="true" />{" "}
            {Math.max(initialComments, comments.length)} comments
          </span>
          <button
            type="button"
            onClick={() => void share()}
          >
            <Share2 aria-hidden="true" /> Share
          </button>
        </div>
      </div>

      {!viewer && (
        <div className="auth-prompt">
          <div>
            <p className="eyebrow">Join the exchange</p>
            <h3>Join K-VERSATION to participate.</h3>
          </div>
          <div>
            <Link href={`/sign-in?next=${encodeURIComponent(pathname)}`}>
              Sign In
            </Link>
            <Link className="button" href={`/join?next=${encodeURIComponent(pathname)}`}>
              Create Account
            </Link>
          </div>
        </div>
      )}

      <div className="comments-section">
        <div className="comments-heading">
          <p className="eyebrow">Community notes</p>
          <h3>Continue the conversation.</h3>
        </div>
        {viewer && (
          <form className="comment-form" onSubmit={submitComment}>
            <label htmlFor="comment">Add your perspective</label>
            <textarea
              id="comment"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              minLength={2}
              maxLength={2000}
              required
            />
            <button className="button" type="submit">
              Post comment
            </button>
          </form>
        )}
        {error && <p className="form-error">{error}</p>}
        <div className="comment-list">
          {comments.length ? (
            comments.map((comment) => (
              <article key={comment.id} className="comment">
                <div>
                  <div>
                    <strong>@{comment.username}</strong>
                    <time dateTime={comment.createdAt}>
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(comment.createdAt))}
                    </time>
                  </div>
                  {comment.viewerOwns && (
                    <div className="comment-actions">
                      <button type="button" onClick={() => setEditing(comment.id)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => void deleteComment(comment)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                {editing === comment.id ? (
                  <EditComment
                    comment={comment}
                    onCancel={() => setEditing(null)}
                    onSave={updateComment}
                  />
                ) : (
                  <p>{comment.body}</p>
                )}
              </article>
            ))
          ) : (
            <p className="empty-comments">
              No comments yet. The first thoughtful note can be yours.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function EditComment({
  comment,
  onCancel,
  onSave,
}: {
  comment: Comment;
  onCancel: () => void;
  onSave: (comment: Comment, body: string) => Promise<void>;
}) {
  const [body, setBody] = useState(comment.body);
  return (
    <form
      className="comment-edit"
      onSubmit={(event) => {
        event.preventDefault();
        void onSave(comment, body);
      }}
    >
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        minLength={2}
        maxLength={2000}
        required
      />
      <div>
        <button className="button" type="submit">Save</button>
        <button className="text-link" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
