import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Reset Password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <div className="auth-page">
      <aside>
        <p className="eyebrow">Account recovery</p>
        <h1>Find your way back.</h1>
        <p>Enter your member email and we’ll send a secure password reset link.</p>
      </aside>
      <div><Suspense><AuthForm mode="forgot" /></Suspense></div>
    </div>
  );
}
