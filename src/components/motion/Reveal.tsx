"use client";

import { useEffect, useRef } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: "up" | "mask" | "fade";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.firstElementChild?.classList.add("is-inview");
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, variant]);
  return (
    <div ref={ref} className={className}>
      <div data-reveal={variant} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
        {children}
      </div>
    </div>
  );
}
