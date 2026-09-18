"use client";

import { useEffect } from "react";

export function Cursor() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const cursor = document.createElement("div");
    cursor.className =
      "pointer-events-none fixed left-0 top-0 z-[100] flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--fg)] text-[10px] text-[var(--bg)] mix-blend-difference";
    cursor.style.transition =
      "width .45s var(--ease-out-expo), height .45s var(--ease-out-expo), background-color .45s var(--ease-out-expo)";
    document.body.appendChild(cursor);
    let x = 0,
      y = 0,
      tx = 0,
      ty = 0;
    let frame = 0;
    const move = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
    };
    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };
    const hover = (event: Event) => {
      const target = event.target as HTMLElement;
      const custom = target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      const interactive = target.closest("a,button");
      cursor.textContent = custom === "play" ? "Play" : custom === "view" ? "View" : "";
      const size = custom ? 64 : interactive ? 6 : 12;
      cursor.style.width = `${size}px`;
      cursor.style.height = `${size}px`;
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", hover);
    tick();
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", hover);
      cancelAnimationFrame(frame);
      cursor.remove();
    };
  }, []);
  return null;
}
