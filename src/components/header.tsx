"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import type { Viewer } from "@/lib/types";

const links = [
  ["Home", "/"],
  ["Conversations", "/conversations"],
  ["Dispatches", "/dispatches"],
  ["About", "/about"],
  ["Questions", "/questions"],
] as const;

export function Header({ viewer }: { viewer: Viewer }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  if (pathname.startsWith("/host")) return null;

  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandMark compact />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? "is-active" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="account-actions">
          {viewer ? (
            <Link className="account-link" href="/account">
              @{viewer.username}
            </Link>
          ) : (
            <>
              <Link className="text-link" href="/sign-in">
                Sign In
              </Link>
              <Link className="button button--small" href="/join">
                Join K-VERSATION
              </Link>
            </>
          )}
        </div>
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="mobile-nav-panel">
          <nav aria-label="Mobile navigation">
            {links.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="mobile-account-actions">
            {viewer ? (
              <Link href="/account" onClick={() => setOpen(false)}>
                Account · @{viewer.username}
              </Link>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
                <Link
                  className="button"
                  href="/join"
                  onClick={() => setOpen(false)}
                >
                  Join K-VERSATION
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
