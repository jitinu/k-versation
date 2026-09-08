"use client";

import { useEffect, useRef } from "react";

export function Parallax({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const rect = node.getBoundingClientRect();
      node.style.transform = `translateY(${(rect.top - window.innerHeight / 2) * -0.035}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
