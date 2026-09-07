"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const koreaPath =
  "M113 9c7 12 8 23 3 35 8 13 7 24-3 33l4 22-11 17 3 20-15 15-8 25-17 10-10 25-15 11-8-7 5-25-6-19 4-20-7-15 8-21-3-20 11-18 2-20 10-12 5-22 13-10 8-17 10-8 11 7 6-8 7 7 9-5Z";

export function SessionIntro() {
  const [visible, setVisible] = useState(false);
  const [rotation, setRotation] = useState({ x: -8, y: 16 });
  const dragging = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const enterButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (
      !pathname.startsWith("/host") &&
      !sessionStorage.getItem("kv-intro-seen") &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      window.setTimeout(() => setVisible(true), 0);
    }
  }, [pathname]);

  useEffect(() => {
    if (visible) enterButton.current?.focus();
  }, [visible]);

  function enter() {
    sessionStorage.setItem("kv-intro-seen", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="session-intro"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to K-VERSATION"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          enterButton.current?.focus();
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          enter();
        }
      }}
    >
      <p className="eyebrow intro-kicker">Korea ↔ the world</p>
      <div
        className="korea-object"
        aria-hidden="true"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
        onPointerDown={(event) => {
          dragging.current = true;
          lastPoint.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragging.current) return;
          const dx = event.clientX - lastPoint.current.x;
          const dy = event.clientY - lastPoint.current.y;
          setRotation((value) => ({
            x: Math.max(-40, Math.min(40, value.x - dy * 0.3)),
            y: value.y + dx * 0.4,
          }));
          lastPoint.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
      >
        {[16, 12, 8, 4, 0].map((depth) => (
          <svg
            key={depth}
            viewBox="0 0 140 240"
            className="korea-layer"
            style={{ transform: `translateZ(${depth}px)` }}
          >
            <path d={koreaPath} />
          </svg>
        ))}
      </div>
      <button
        ref={enterButton}
        type="button"
        className="intro-enter"
        onClick={enter}
      >
        <span>Click to Start</span>
        <span aria-hidden="true">↗</span>
      </button>
      <p className="intro-note">Drag to explore · Enter or Space to continue</p>
    </div>
  );
}
