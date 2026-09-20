"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSubscribe } from "@/components/subscribe/SubscribeProvider";

const links = [
  ["/conversations", "Conversations"],
  ["/monologues", "Monologues"],
  ["/about", "About"],
  ["/questions", "Questions"],
];

export function CornerNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { subscriber, open: openSubscribe } = useSubscribe();
  const subscribe = () => {
    setOpen(false);
    openSubscribe();
  };
  return (
    <header className="fixed top-5 left-1/2 z-50 w-[calc(100%-24px)] -translate-x-1/2">
      <div className="border-line bg-canvas/70 flex items-center justify-between gap-2 rounded-full border px-2 py-1.5 backdrop-blur-md">
        <Link href="/" className="shrink-0 px-3 py-1.5 text-sm tracking-[-0.01em]">
          K-VERSATION
        </Link>
        <button
          className="btn btn-ghost px-3 py-1.5 text-sm md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          Menu
        </button>
        <nav className="hidden items-center gap-0.5 md:flex">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                pathname.startsWith(href) ? "bg-canvas-2" : "hover:bg-canvas-2"
              }`}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center md:flex">
          {subscriber ? (
            <span className="border-line rounded-full border px-4 py-1.5 text-sm opacity-65">
              Subscribed ✓
            </span>
          ) : (
            <button
              type="button"
              onClick={subscribe}
              className="btn btn-primary px-4 py-1.5 text-sm"
            >
              Subscribe <span className="arrow">↗</span>
            </button>
          )}
        </div>
      </div>
      {open ? (
        <div className="bg-canvas fixed inset-0 -z-10 flex min-h-screen flex-col justify-center px-6">
          <button
            type="button"
            className="btn btn-ghost absolute top-5 right-5 px-4 py-2"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
          <nav className="flex flex-col gap-2 text-3xl">
            {links.map(([href, label], index) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="animate-[menu-fade_600ms_var(--ease-out-expo)_both]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {label}
              </Link>
            ))}
            {subscriber ? (
              <span className="mt-4 text-sm opacity-65">Subscribed ✓</span>
            ) : (
              <button type="button" onClick={subscribe} className="mt-4 text-left text-sm">
                Subscribe ↗
              </button>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
