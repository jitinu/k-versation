"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const formatted = (number: number) => Math.round(number).toLocaleString();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const state = { value: 0 };
        gsap.to(state, {
          value,
          duration: 1.6,
          ease: "power4.out",
          onUpdate: () => {
            if (ref.current) ref.current.textContent = formatted(state.value);
          },
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{visible ? formatted(value) : "0"}</span>;
}
