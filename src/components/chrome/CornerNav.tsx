"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";

const links = [
  ["/conversations", "Conversations"],
  ["/monologues", "Monologues"],
  ["/about", "About"],
  ["/questions", "Questions"],
];

export function CornerNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => {
    if (!hasSupabaseEnv()) return;
    const client = createClient();
    const loadProfile = async (nextUser: { id: string; email?: string } | null) => {
      setUser(nextUser);
      if (!nextUser) {
        setUsername(null);
        return;
      }
      const { data } = await client
        .from("profiles")
        .select("username")
        .eq("id", nextUser.id)
        .maybeSingle();
      setUsername(data?.username ?? null);
    };
    void client.auth.getUser().then(({ data }) => loadProfile(data.user));
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      void loadProfile(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);
  const signOut = async () => {
    await createClient().auth.signOut();
    setUser(null);
    setUsername(null);
    router.refresh();
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
          {user ? (
            <div className="flex items-center gap-2">
              <span className="px-2 text-sm">{username ?? user.email}</span>
              <button
                type="button"
                onClick={signOut}
                className="btn btn-primary px-4 py-1.5 text-sm"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href={`/login?next=${encodeURIComponent(pathname)}`}
              className="btn btn-primary px-4 py-1.5 text-sm"
            >
              Sign in <span className="arrow">↗</span>
            </Link>
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
            {user ? (
              <button type="button" onClick={signOut} className="mt-4 text-left text-sm">
                Sign out · {username ?? user.email}
              </button>
            ) : (
              <Link
                href={`/login?next=${encodeURIComponent(pathname)}`}
                onClick={() => setOpen(false)}
                className="mt-4 text-sm"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
