"use client";
import { FormEvent, useState } from "react";
export function QuestionForm() {
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
    });
    if (response.ok) {
      setState("sent");
      return;
    }
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setError(body?.error ?? "Something went wrong. Please try again.");
    setState("error");
  }
  if (state === "sent")
    return <p className="normal-case">Thanks for your question. We’ll be in touch.</p>;
  return (
    <form onSubmit={submit} className="space-y-4">
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Your question" rows={7} required />
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px]"
      />
      <button className="border-signal text-signal border px-4 py-3">Send question</button>
      {state === "error" && <p className="text-signal normal-case">{error}</p>}
    </form>
  );
}
