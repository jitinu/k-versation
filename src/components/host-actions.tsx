"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CommentModeration({ id, hidden }: { id: string; hidden: boolean }) {
  const router = useRouter();
  async function update(method: "PATCH" | "DELETE") {
    if (method === "DELETE" && !confirm("Permanently delete this comment?")) return;
    await fetch(`/api/host/comments/${id}`, {
      method,
      headers: { "content-type": "application/json" },
      body: method === "PATCH" ? JSON.stringify({ hidden: !hidden }) : undefined,
    });
    router.refresh();
  }
  return (
    <div className="table-actions">
      <button type="button" onClick={() => void update("PATCH")}>{hidden ? "Unhide" : "Hide"}</button>
      <button type="button" onClick={() => void update("DELETE")}>Delete</button>
    </div>
  );
}

export function QuestionStatus({ id, current }: { id: string; current: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  return (
    <select
      value={status}
      onChange={async (event) => {
        const value = event.target.value;
        setStatus(value);
        await fetch(`/api/host/questions/${id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status: value }),
        });
        router.refresh();
      }}
    >
      <option value="new">New</option>
      <option value="read">Read</option>
      <option value="answered">Answered</option>
      <option value="archived">Archived</option>
    </select>
  );
}

export function HostPasswordForm() {
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("password") !== data.get("confirmPassword")) {
      setMessage("Passwords do not match.");
      return;
    }
    const response = await fetch("/api/host/password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        currentPassword: data.get("currentPassword"),
        password: data.get("password"),
      }),
    });
    const result = (await response.json()) as { error?: string };
    setMessage(response.ok ? "Host password updated." : result.error ?? "Password could not be updated.");
    if (response.ok) event.currentTarget.reset();
  }
  return (
    <form className="host-form" onSubmit={submit}>
      <label><span>Current password</span><input name="currentPassword" type="password" required /></label>
      <label><span>New password</span><input name="password" type="password" required minLength={12} /></label>
      <label><span>Confirm new password</span><input name="confirmPassword" type="password" required minLength={12} /></label>
      {message && <p className="form-message" role="status">{message}</p>}
      <button className="button" type="submit">Rotate host password</button>
    </form>
  );
}
