"use client";

import { useEffect, useRef } from "react";

const letters = "VERSATION".split("");

export function HeroWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      !window.matchMedia("(hover: hover)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        node.style.setProperty("--pointer-x", x.toFixed(3));
        node.style.setProperty("--pointer-y", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="hero-wordmark" ref={ref} role="img" aria-label="K-VERSATION">
      <span className="hero-letter" style={{ "--letter-index": 0 } as React.CSSProperties}>
        K
      </span>
      <span className="hero-hyphen" aria-hidden="true" />
      <span>
        {letters.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className="hero-letter"
            style={{ "--letter-index": index + 1 } as React.CSSProperties}
          >
            {letter}
          </span>
        ))}
      </span>
    </div>
  );
}
