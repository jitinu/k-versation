"use client";

import { useState } from "react";
import type { Viewer } from "@/lib/types";

export function QuestionForm({ viewer }: { viewer: Viewer }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(result.error ?? "We could not send your question.");
      return;
    }
    event.currentTarget.reset();
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="form-success" role="status">
        <p className="eyebrow">Received</p>
        <h2>Thank you for adding to the conversation.</h2>
        <p>Daniel will see your question in the K-VERSATION host studio.</p>
        <button className="text-link" type="button" onClick={() => setStatus("idle")}>
          Ask another question
        </button>
      </div>
    );
  }

  return (
    <form className="editorial-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          <span>Name</span>
          <input name="name" defaultValue={viewer?.name ?? ""} required minLength={2} maxLength={80} />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" defaultValue={viewer?.email ?? ""} required maxLength={254} />
        </label>
      </div>
      <label>
        <span>Subject or category <em>Optional</em></span>
        <input name="subject" maxLength={100} placeholder="Culture, history, technology…" />
      </label>
      <label>
        <span>Your question</span>
        <textarea
          name="question"
          required
          minLength={15}
          maxLength={4000}
          placeholder="What would you like K-VERSATION to explore?"
        />
      </label>
      <label className="honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {status === "error" && (
        <p className="form-error" role="alert">
          {message}
        </p>
      )}
      <button className="button button--wide" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send question"}
      </button>
    </form>
  );
}
