"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const motionReadyScript =
  'try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("motion-ready")}}catch(e){}';

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"),
    );
    if (!targets.length) return;
    if (typeof IntersectionObserver === "undefined") {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

export function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="page-fade" key={pathname}>
      {children}
    </div>
  );
}
