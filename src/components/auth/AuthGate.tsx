"use client";
import { useRouter, usePathname } from "next/navigation";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  return (action: () => void) => {
    if (!hasSupabaseEnv()) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    void createClient()
      .auth.getUser()
      .then(({ data }) =>
        data.user ? action() : router.push(`/login?next=${encodeURIComponent(pathname)}`),
      );
  };
}
