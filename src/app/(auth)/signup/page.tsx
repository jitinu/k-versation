"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { countries } from "@/lib/countries";
import { createProfile } from "@/lib/auth-actions";
import { AuthLayout } from "../login/page";
export default function SignupPage() {
  const router = useRouter();
  const [next] = useState(() =>
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("next") ?? "/")
      : "/",
  );
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!hasSupabaseEnv()) {
      setError("Sign up is not configured yet.");
      return;
    }
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const username = String(form.get("username")).toLowerCase();
    const { data, error: signUpError } = await createClient().auth.signUp({
      email,
      password,
      options: { data: { display_name: form.get("name"), username } },
    });
    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Unable to create account.");
      return;
    }
    const profileResult = await createProfile({
      id: data.user.id,
      username,
      displayName: String(form.get("name")),
      countryCode: String(form.get("country")),
      countryName: countries.find(([code]) => code === form.get("country"))?.[1] ?? "",
      phone: String(form.get("phone") ?? "") || null,
    });
    if (profileResult.error) {
      setError(profileResult.error);
      return;
    }
    router.push(next);
  }
  return (
    <AuthLayout title="Create account">
      <form onSubmit={submit} className="space-y-4">
        <input name="email" type="email" placeholder="Email" required />
        <input name="name" placeholder="Name" required />
        <select name="country" required>
          <option value="">Country</option>
          {countries.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <input name="phone" placeholder="Phone (optional)" />
        <input name="username" pattern="[a-z0-9_]{3,20}" placeholder="Username" required />
        <input name="password" type="password" minLength={6} placeholder="Password" required />
        {error && <p className="text-signal normal-case">{error}</p>}
        <button className="border-signal text-signal border px-4 py-3">Create account</button>
      </form>
    </AuthLayout>
  );
}
