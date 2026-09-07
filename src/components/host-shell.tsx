"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  FileVideo2,
  Gauge,
  LogOut,
  MessageSquare,
  Settings,
  ShieldCheck,
  UserRound,
  CircleHelp,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

const hostLinks = [
  ["Overview", "/host/dashboard", Gauge],
  ["Content", "/host/content", FileVideo2],
  ["Members", "/host/members", UserRound],
  ["Questions", "/host/questions", CircleHelp],
  ["Comments", "/host/comments", MessageSquare],
  ["Analytics", "/host/analytics", BarChart3],
  ["Audit log", "/host/audit", ShieldCheck],
  ["Settings", "/host/settings", Settings],
] as const;

export function HostShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/host/session", { method: "DELETE" });
    router.replace("/host/login");
    router.refresh();
  }

  return (
    <div className="host-app">
      <aside className="host-sidebar">
        <BrandMark compact />
        <p className="host-label">Host studio</p>
        <nav aria-label="Host navigation">
          {hostLinks.map(([label, href, Icon]) => (
            <Link key={href} href={href} className={pathname === href ? "is-active" : undefined}>
              <Icon aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <button type="button" onClick={() => void logout()}>
          <LogOut aria-hidden="true" />
          Log out
        </button>
      </aside>
      <main className="host-main">
        <header className="host-main-header">
          <div>
            <p className="eyebrow">K-VERSATION / Host</p>
            <h1>Studio</h1>
          </div>
          <Link href="/" target="_blank">View live site ↗</Link>
        </header>
        {children}
      </main>
    </div>
  );
}
