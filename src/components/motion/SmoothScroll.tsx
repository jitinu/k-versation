"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;
    const lenis = new Lenis();
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);
  return null;
}
