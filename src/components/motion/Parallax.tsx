"use client";

import { useEffect, useRef } from "react";

export function Parallax({
  children,
  className = "",
  speed = -0.035,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const rect = node.getBoundingClientRect();
      node.style.transform = `translateY(${(rect.top - window.innerHeight / 2) * speed}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
