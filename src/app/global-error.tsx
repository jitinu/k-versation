"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const button = {
    padding: "14px 22px",
    borderRadius: 999,
    border: "1px solid #0b0a09",
    font: "inherit",
    cursor: "pointer",
    textDecoration: "none",
  } as const;

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          background: "#e8e8e3",
          color: "#0b0a09",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <main style={{ padding: "0 8vw" }}>
          <p style={{ letterSpacing: "0.2em", fontSize: 12 }}>K-VERSATION</p>
          <h1 style={{ fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 400, margin: "24px 0" }}>
            Something didn&apos;t load.
          </h1>
          <p>Please try again. It usually works on the second try.</p>
          <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{ ...button, background: "#0b0a09", color: "#fff" }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ ...button, color: "#0b0a09" }}>
              Go to the homepage
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
