"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { countries } from "@/lib/countries";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { signupSchema } from "@/lib/validation";

type Mode = "join" | "sign-in" | "forgot" | "reset";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const next = searchParams.get("next")?.startsWith("/")
    ? searchParams.get("next")!
    : "/account";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!supabase) {
      setError("Membership is awaiting production database configuration.");
      return;
    }
    setLoading(true);
    const fields = Object.fromEntries(new FormData(event.currentTarget));

    if (mode === "join") {
      const parsed = signupSchema.safeParse({
        ...fields,
        phone: fields.phone || undefined,
      });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Check your details.");
        setLoading(false);
        return;
      }
      const usernameResponse = await fetch(
        `/api/auth/username?value=${encodeURIComponent(parsed.data.username)}`,
      );
      const usernameResult = (await usernameResponse.json()) as {
        available: boolean;
      };
      if (!usernameResult.available) {
        setError("That username is already in use.");
        setLoading(false);
        return;
      }
      const { error: signupError } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          data: {
            name: parsed.data.name,
            username: parsed.data.username,
            country_code: parsed.data.countryCode,
            phone: parsed.data.phone ?? null,
          },
        },
      });
      if (signupError) setError(signupError.message);
      else
        setMessage(
          "Check your email to verify your account and continue the conversation.",
        );
    }

    if (mode === "sign-in") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: String(fields.email),
        password: String(fields.password),
      });
      if (signInError) setError("The email or password was not recognized.");
      else {
        router.push(next);
        router.refresh();
      }
    }

    if (mode === "forgot") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        String(fields.email),
        { redirectTo: `${location.origin}/reset-password` },
      );
      if (resetError) setError("We could not send the reset email.");
      else
        setMessage(
          "If an account exists for that address, a reset link is on its way.",
        );
    }

    if (mode === "reset") {
      const password = String(fields.password);
      if (password.length < 10) {
        setError("Use at least 10 characters.");
      } else {
        const { error: updateError } = await supabase.auth.updateUser({
          password,
        });
        if (updateError) setError(updateError.message);
        else {
          setMessage("Password updated. You can continue to your account.");
          router.refresh();
        }
      }
    }
    setLoading(false);
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {mode === "join" && (
        <>
          <label>
            <span>Name</span>
            <input name="name" autoComplete="name" required minLength={2} maxLength={80} />
          </label>
          <label>
            <span>Username</span>
            <input
              name="username"
              autoComplete="username"
              required
              minLength={3}
              maxLength={24}
              pattern="[A-Za-z0-9_]+"
            />
          </label>
          <div className="form-grid">
            <label>
              <span>Country</span>
              <select name="countryCode" required defaultValue="">
                <option value="" disabled>
                  Select country
                </option>
                {countries.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Phone <em>Optional</em></span>
              <input name="phone" type="tel" autoComplete="tel" maxLength={30} />
            </label>
          </div>
        </>
      )}
      {mode !== "reset" && (
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
      )}
      {(mode === "join" || mode === "sign-in" || mode === "reset") && (
        <label>
          <span>{mode === "reset" ? "New password" : "Password"}</span>
          <input
            name="password"
            type="password"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            required
            minLength={mode === "sign-in" ? 1 : 10}
            maxLength={128}
          />
        </label>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-message" role="status">{message}</p>}
      <button className="button button--wide" type="submit" disabled={loading}>
        {loading
          ? "Please wait…"
          : mode === "join"
            ? "Join K-VERSATION"
            : mode === "sign-in"
              ? "Sign In"
              : mode === "forgot"
                ? "Send reset link"
                : "Update password"}
      </button>
      {mode === "sign-in" && (
        <div className="auth-subnav">
          <Link href="/forgot-password">Forgot password?</Link>
          <Link href="/join">Create an account</Link>
        </div>
      )}
      {mode === "join" && (
        <p className="form-legal">
          By joining, you agree to the <Link href="/terms">Terms</Link> and
          acknowledge the <Link href="/privacy">Privacy Policy</Link>.
        </p>
      )}
    </form>
  );
}
