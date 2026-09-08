"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
export function ImpressionTracker() {
  const pathname = usePathname();
  useEffect(() => {
    void fetch("/api/impressions", { method: "POST" });
  }, [pathname]);
  return null;
}
