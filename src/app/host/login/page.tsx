import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { HostLoginForm } from "@/components/host-login-form";
import { isHostAuthenticated } from "@/lib/host-auth";

export const metadata: Metadata = { title: "Host Login", robots: { index: false, follow: false } };

export default async function HostLoginPage() {
  if (await isHostAuthenticated()) redirect("/host/dashboard");
  return (
    <div className="host-login-page">
      <div className="host-login-brand">
        <BrandMark />
        <p>Private publishing and moderation studio.</p>
      </div>
      <div>
        <p className="eyebrow">Protected access</p>
        <h1>Host Studio</h1>
        <HostLoginForm />
      </div>
    </div>
  );
}
