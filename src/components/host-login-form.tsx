"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HostLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/host/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    });
    if (!response.ok) {
      setError("The host credential was not recognized.");
      setLoading(false);
      return;
    }
    router.replace("/host/dashboard");
    router.refresh();
  }

  return (
    <form className="host-login-form" onSubmit={submit}>
      <label>
        <span>Host password</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button--wide" type="submit" disabled={loading}>
        {loading ? "Verifying…" : "Enter host studio"}
      </button>
    </form>
  );
}
