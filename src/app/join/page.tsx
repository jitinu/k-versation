import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Join", robots: { index: false } };

export default function JoinPage() {
  return (
    <div className="auth-page">
      <aside>
        <p className="eyebrow">Membership</p>
        <h1>Join a thoughtful exchange around Korea.</h1>
        <p>
          Membership is free and opens reactions, comments, and a growing
          community spanning countries and perspectives.
        </p>
        <Link href="/sign-in">Already a member? Sign in</Link>
      </aside>
      <div><Suspense><AuthForm mode="join" /></Suspense></div>
    </div>
  );
}
