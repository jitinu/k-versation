import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountForm } from "@/components/account-form";
import { getViewer } from "@/lib/data";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

export default async function AccountPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/sign-in?next=/account");
  return (
    <div className="account-page">
      <header className="page-intro">
        <p className="eyebrow">Member account</p>
        <h1>Hello, {viewer.name}.</h1>
        <p>Keep your profile accurate and your session secure.</p>
      </header>
      <AccountForm viewer={viewer} />
    </div>
  );
}
