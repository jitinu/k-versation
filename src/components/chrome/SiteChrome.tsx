"use client";
import Script from "next/script";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import { CornerNav } from "./CornerNav";
import { FooterStrip } from "./FooterStrip";
import { CookieBanner } from "./CookieBanner";
import { ImpressionTracker } from "./ImpressionTracker";
import { ThemeScroller } from "@/components/motion/ThemeScroller";
import { PageTransition } from "@/components/motion/PageTransition";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <CornerNav />
      <ThemeScroller />
      <main className="min-h-[100dvh] pt-[88px] md:pt-[104px]">
        <PageTransition>{children}</PageTransition>
      </main>
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
