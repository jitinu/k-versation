"use client";
import Script from "next/script";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import { CornerNav } from "./CornerNav";
import { FooterStrip } from "./FooterStrip";
import { CookieBanner } from "./CookieBanner";
import { ImpressionTracker } from "./ImpressionTracker";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <CornerNav />
      <aside
        aria-hidden="true"
        className="border-signal text-signal fixed top-8 right-8 z-40 hidden border px-3 py-2 text-xs md:block"
      >
        Korean culture · Bay Area · Est. 2024
      </aside>
      <main className="min-h-[100dvh] pt-24 pb-24 md:pt-44">{children}</main>
      <FooterStrip />
      <CookieBanner />
      <ImpressionTracker />
      {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? (
        <Script
          defer
          data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
        />
      ) : null}
    </>
  );
}
