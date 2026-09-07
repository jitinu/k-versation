"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { countries } from "@/lib/countries";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Viewer } from "@/lib/types";

export function AccountForm({ viewer }: { viewer: NonNullable<Viewer> }) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    const data = new FormData(event.currentTarget);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: String(data.get("name")),
        country_code: String(data.get("countryCode")),
        phone: String(data.get("phone")) || null,
      })
      .eq("id", viewer.id);
    setMessage(error ? "Changes could not be saved." : "Account updated.");
    router.refresh();
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  async function deleteAccount() {
    if (!supabase || !confirm("Permanently delete your K-VERSATION account?"))
      return;
    const response = await fetch("/api/account", { method: "DELETE" });
    if (response.ok) {
      await supabase.auth.signOut();
      router.replace("/");
      router.refresh();
    } else {
      setMessage("Account deletion could not be completed.");
    }
  }

  return (
    <div className="account-panel">
      <form className="editorial-form" onSubmit={updateProfile}>
        <label>
          <span>Name</span>
          <input name="name" defaultValue={viewer.name} required minLength={2} maxLength={80} />
        </label>
        <label>
          <span>Username</span>
          <input value={viewer.username} disabled aria-describedby="username-note" />
          <small id="username-note">Contact the host to request a username change.</small>
        </label>
        <label>
          <span>Email</span>
          <input value={viewer.email} disabled />
        </label>
        <label>
          <span>Country</span>
          <select name="countryCode" defaultValue={viewer.countryCode}>
            {countries.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Phone <em>Optional</em></span>
          <input name="phone" type="tel" defaultValue={viewer.phone ?? ""} maxLength={30} />
        </label>
        {message && <p className="form-message" role="status">{message}</p>}
        <button className="button" type="submit">Save changes</button>
      </form>
      <aside className="account-actions-panel">
        <div>
          <p className="eyebrow">Security</p>
          <h3>Password &amp; session</h3>
          <a className="text-link" href="/forgot-password">Change password</a>
          <button className="text-link" type="button" onClick={() => void signOut()}>
            Log out
          </button>
        </div>
        <div className="danger-zone">
          <p className="eyebrow">Account removal</p>
          <p>Deleting your account removes your profile and anonymizes community activity where required.</p>
          <button type="button" onClick={() => void deleteAccount()}>Delete account</button>
        </div>
      </aside>
    </div>
  );
}
