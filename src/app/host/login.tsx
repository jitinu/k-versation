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
    <div data-theme="ivory" className="page section-gap mx-auto max-w-xl">
      <p className="eyebrow">Private workspace</p>
      <h1 className="mt-6 mb-10 text-5xl tracking-[-0.03em] md:text-7xl">Host mode</h1>
      <form onSubmit={submit} className="space-y-4">
        <input name="password" type="password" placeholder="Password" required />
        <button className="btn btn-primary">
          Enter <span className="arrow">↗</span>
        </button>
        {error && <p className="text-signal normal-case">{error}</p>}
      </form>
    </div>
  );
}
