import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Sign In", robots: { index: false } };

export default function SignInPage() {
  return (
    <AuthLayout eyebrow="Member access" title="Welcome back to the exchange.">
      <Suspense><AuthForm mode="sign-in" /></Suspense>
    </AuthLayout>
  );
}

function AuthLayout({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="auth-page">
      <aside>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>Watch without an account. Sign in to react, comment, and take part.</p>
        <Link href="/">← Return home</Link>
      </aside>
      <div>{children}</div>
    </div>
  );
}
