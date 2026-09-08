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
    <header className="bg-canvas fixed top-0 left-0 z-40 w-full p-4 md:w-auto md:p-8 md:pr-12 md:pb-10">
      <div className="flex items-start justify-between gap-8 md:block">
        <Link href="/" className="text-signal text-sm">
          K-VERSATION
        </Link>
        <button
          className="border-line border px-2 py-1 text-xs md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          Menu
        </button>
      </div>
      <nav className={`${open ? "flex" : "hidden"} mt-4 flex-col gap-2 text-xs md:flex`}>
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className="link-draw w-max"
            aria-current={pathname.startsWith(href) ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
        {user ? (
          <span className="text-signal mt-3 flex w-max items-center gap-3">
            <span>{username ?? user.email}</span>
            <button type="button" onClick={signOut} className="link-draw">
              Sign out
            </button>
          </span>
        ) : (
          <Link
            href={`/login?next=${encodeURIComponent(pathname)}`}
            className="link-draw text-signal mt-3 w-max"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
