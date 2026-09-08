"use client";
import { FormEvent, useState } from "react";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { AuthLayout } from "../login/page";
export default function ResetPassword() {
  const [done, setDone] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasSupabaseEnv()) return;
    await createClient().auth.updateUser({
      password: String(new FormData(event.currentTarget).get("password")),
    });
    setDone(true);
  }
  return (
    <AuthLayout title="Choose a new password">
      {done ? (
        <p>Password updated.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <input name="password" type="password" minLength={6} required />
          <button className="border-signal text-signal border px-4 py-3">Update password</button>
        </form>
      )}
    </AuthLayout>
  );
}
