import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Choose New Password", robots: { index: false } };

export default function ResetPasswordPage() {
  return (
    <div className="auth-page">
      <aside>
        <p className="eyebrow">Account security</p>
        <h1>Choose a new password.</h1>
        <p>Use a unique password with at least ten characters.</p>
      </aside>
      <div><Suspense><AuthForm mode="reset" /></Suspense></div>
    </div>
  );
}
