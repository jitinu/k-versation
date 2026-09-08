"use client";

import { useEffect } from "react";

export function Cursor() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const cursor = document.createElement("div");
    cursor.className =
      "pointer-events-none fixed left-0 top-0 z-[100] hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 border border-signal text-[9px] text-signal md:flex md:items-center md:justify-center md:whitespace-nowrap";
    cursor.style.transition = "width .25s, height .25s";
    document.body.appendChild(cursor);
    let x = 0,
      y = 0,
      tx = 0,
      ty = 0;
    const move = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
    };
    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    const hover = (event: Event) => {
      const target = event.target as HTMLElement;
      const kind = target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      cursor.textContent = kind === "play" ? "PLAY" : kind === "view" ? "VIEW" : "";
      cursor.style.width = kind ? "58px" : "16px";
      cursor.style.height = kind ? "58px" : "16px";
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", hover);
    tick();
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", hover);
      cursor.remove();
    };
  }, []);
  return null;
}
