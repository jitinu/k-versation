"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ThemeScroller() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dataset.theme = "";
    const elements = [...document.querySelectorAll<HTMLElement>("[data-theme]")];
    const triggers = elements.map((element) =>
      ScrollTrigger.create({
        trigger: element,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (!self.isActive) return;
          if (element.dataset.theme === "ink") document.documentElement.dataset.theme = "ink";
          else delete document.documentElement.dataset.theme;
        },
      }),
    );
    ScrollTrigger.refresh();
    return () => {
      triggers.forEach((trigger) => trigger.kill());
      delete document.documentElement.dataset.theme;
    };
  }, [pathname]);

  return null;
}
