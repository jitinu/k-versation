"use client";

import { useEffect, useRef } from "react";
import { formatCompactNumber } from "@/lib/format";

export function CountUp({
  value,
  duration = 1500,
}: {
  value: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || value <= 0) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let frame = 0;
    let started = 0;
    node.textContent = formatCompactNumber(0);
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const step = (time: number) => {
          if (!started) started = time;
          const progress = Math.min(1, (time - started) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = formatCompactNumber(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = formatCompactNumber(value);
    };
  }, [value, duration]);

  return <span ref={ref}>{formatCompactNumber(value)}</span>;
}
