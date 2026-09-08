"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { emailForUsername } from "@/lib/auth-actions";
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [next] = useState(() =>
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("next") ?? "/")
      : "/",
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const identity = String(form.get("identity"));
    const password = String(form.get("password"));
    if (!hasSupabaseEnv()) {
      setError("Sign in is not configured yet.");
      return;
    }
    const email = identity.includes("@") ? identity : await emailForUsername(identity);
    if (!email) {
      setError("No account with that username");
      return;
    }
    const { error: signInError } = await createClient().auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) setError(signInError.message);
    else router.push(next);
  }
  return (
    <AuthLayout title="Sign in">
      <form onSubmit={submit} className="space-y-4">
        <label>
          email or username
          <input name="identity" required />
        </label>
        <label>
          password
          <input name="password" type="password" required />
        </label>
        {error && <p className="text-signal normal-case">{error}</p>}
        <button className="border-signal text-signal border px-4 py-3">Sign in</button>
        <p className="text-xs">
          <Link className="link-draw" href="/signup">
            Create account
          </Link>{" "}
          ·{" "}
          <Link className="link-draw" href="/forgot-password">
            Forgot password?
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
export function AuthLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="page section-gap mx-auto max-w-xl pt-40">
      <h1 className="mb-12 text-5xl">{title}</h1>
      {children}
    </div>
  );
}
