"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SplitText({
  children,
  mode = "word",
  className = "",
}: {
  children: string;
  mode?: "word" | "char";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const parts = useMemo(
    () => (mode === "char" ? [...children] : children.split(" ")),
    [children, mode],
  );
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = node.querySelectorAll(".split-word, .split-char");
    const tween = gsap.fromTo(
      targets,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out",
        stagger: mode === "char" ? 0.025 : 0.08,
        scrollTrigger: { trigger: node, start: "top 85%" },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [mode]);
  return (
    <span ref={ref} className={className} aria-label={children}>
      {parts.map((part, index) => (
        <span className="inline-block overflow-hidden align-bottom" key={`${part}-${index}`}>
          <span aria-hidden="true" className={mode === "char" ? "split-char" : "split-word"}>
            {part}
          </span>
          {mode === "word" && index < parts.length - 1 ? "\u00a0" : null}
        </span>
      ))}
    </span>
  );
}
