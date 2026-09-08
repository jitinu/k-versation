"use client";

import { FormEvent, useState } from "react";

export function HostLogin() {
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    const response = await fetch("/api/host/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setError("Incorrect password.");
      return;
    }
    window.location.reload();
  }

  return (
    <div className="page section-gap mx-auto max-w-xl pt-40">
      <h1 className="mb-10 text-5xl">Host mode</h1>
      <form onSubmit={submit} className="space-y-4">
        <input name="password" type="password" placeholder="Password" required />
        <button className="border-signal text-signal border px-4 py-3">Enter</button>
        {error && <p className="text-signal normal-case">{error}</p>}
      </form>
    </div>
  );
}
