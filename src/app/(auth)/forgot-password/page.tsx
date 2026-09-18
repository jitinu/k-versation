"use client";
import { FormEvent, useState } from "react";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { AuthLayout } from "../login/page";
export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasSupabaseEnv()) return;
    await createClient().auth.resetPasswordForEmail(
      String(new FormData(event.currentTarget).get("email")),
      { redirectTo: `${location.origin}/reset-password` },
    );
    setSent(true);
  }
  return (
    <AuthLayout title="Reset password">
      {sent ? (
        <p className="normal-case">Check your email for a reset link.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <input name="email" type="email" placeholder="Email" required />
          <button className="btn btn-primary">
            Send reset link <span className="arrow">↗</span>
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
