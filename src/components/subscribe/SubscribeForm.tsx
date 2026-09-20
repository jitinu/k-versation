"use client";

import { FormEvent, useState } from "react";
import { countries } from "@/lib/countries";

export function SubscribeForm({ onSuccess }: { onSuccess: (name: string) => void }) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setErrors({});
    setError("");
    setPending(true);
    const values = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await response.json()) as {
      name?: string;
      error?: string;
      issues?: Record<string, string[]>;
    };
    setPending(false);
    if (!response.ok) {
      setErrors(data.issues ?? {});
      setError(data.error ?? "Please check the form.");
      return;
    }
    form.reset();
    onSuccess(data.name ?? "");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm">
        Name
        <input name="name" autoComplete="name" required className="mt-2" />
        {errors.name?.map((message) => (
          <span key={message} className="text-signal mt-1 block text-xs normal-case">
            {message}
          </span>
        ))}
      </label>
      <label className="block text-sm">
        Email
        <input name="email" type="email" autoComplete="email" required className="mt-2" />
        {errors.email?.map((message) => (
          <span key={message} className="text-signal mt-1 block text-xs normal-case">
            {message}
          </span>
        ))}
      </label>
      <label className="block text-sm">
        Country
        <select name="countryCode" defaultValue="" required className="mt-2">
          <option value="" disabled>
            Choose your country
          </option>
          {countries.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        {errors.countryCode?.map((message) => (
          <span key={message} className="text-signal mt-1 block text-xs normal-case">
            {message}
          </span>
        ))}
      </label>
      <label className="block text-sm">
        Phone <span className="text-ink-3">(optional)</span>
        <input name="phone" type="tel" autoComplete="tel" className="mt-2" />
      </label>
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />
      {error ? <p className="text-signal text-sm normal-case">{error}</p> : null}
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Joining…" : "Subscribe ↗"}
      </button>
    </form>
  );
}
