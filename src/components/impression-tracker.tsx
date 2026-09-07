"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ImpressionTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/host") || lastPath.current === pathname) return;
    lastPath.current = pathname;
    const eventId = crypto.randomUUID();
    void fetch("/api/analytics/impression", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventId,
        path: pathname,
        referrer: document.referrer || undefined,
      }),
      keepalive: true,
    });
  }, [pathname]);

  return null;
}
