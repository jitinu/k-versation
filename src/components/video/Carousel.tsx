"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Video } from "@/lib/supabase/types";
import { VideoCard } from "./VideoCard";

export function Carousel({
  title,
  videos,
  href,
  autoplay = false,
}: {
  title: string;
  videos: Video[];
  href?: string;
  autoplay?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);
  const paused = useRef(false);
  const drag = useRef({ start: 0, scroll: 0, moved: false, active: false });

  useEffect(() => {
    if (!autoplay || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const node = ref.current;
      if (!node) return;
      const elapsed = now - last;
      last = now;
      if (!paused.current && !drag.current.active && !hovered) {
        node.scrollLeft += (35 * elapsed) / 1000;
        if (node.scrollLeft >= node.scrollWidth / 2) node.scrollLeft -= node.scrollWidth / 2;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [autoplay, hovered, videos]);

  function updateProgress() {
    if (autoplay) return;
    const node = ref.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    setProgress(max > 0 ? node.scrollLeft / max : 0);
  }

  function scroll(direction: number) {
    ref.current?.scrollBy({
      left: direction * (ref.current.clientWidth * 0.8),
      behavior: "smooth",
    });
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl">{title}</h2>
        <div className="flex items-center gap-4">
          {href && (
            <Link href={href} className="link-draw hidden text-sm sm:block">
              See all <span aria-hidden="true">→</span>
            </Link>
          )}
          {!autoplay && (
            <div className="flex gap-2">
              <button
                type="button"
                aria-label={`Previous ${title}`}
                className="border-line hover:bg-canvas-2 flex h-[40px] w-[40px] items-center justify-center rounded-full border transition-colors disabled:opacity-30"
                onClick={() => scroll(-1)}
                disabled={progress <= 0.01}
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                  <path d="m10 3-5 5 5 5" fill="none" stroke="currentColor" />
                </svg>
              </button>
              <button
                type="button"
                aria-label={`Next ${title}`}
                className="border-line hover:bg-canvas-2 flex h-[40px] w-[40px] items-center justify-center rounded-full border transition-colors disabled:opacity-30"
                onClick={() => scroll(1)}
                disabled={progress >= 0.99}
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                  <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        ref={ref}
        className={`no-scrollbar flex ${
          autoplay ? "" : "snap-x snap-mandatory scroll-px-4"
        } gap-4 overflow-x-auto pr-[calc(var(--spacing)*8)] md:scroll-px-8`}
        onScroll={updateProgress}
        onPointerDown={(event) => {
          if (!ref.current || event.pointerType !== "mouse") return;
          drag.current = {
            start: event.clientX,
            scroll: ref.current.scrollLeft,
            moved: false,
            active: true,
          };
        }}
        onPointerMove={(event) => {
          if (!drag.current.active || !ref.current) return;
          const distance = event.clientX - drag.current.start;
          if (Math.abs(distance) > 6) {
            drag.current.moved = true;
            if (!ref.current.hasPointerCapture(event.pointerId)) {
              ref.current.setPointerCapture(event.pointerId);
            }
          }
          if (drag.current.moved) ref.current.scrollLeft = drag.current.scroll - distance;
        }}
        onPointerUp={(event) => {
          drag.current.active = false;
          if (ref.current?.hasPointerCapture(event.pointerId)) {
            ref.current.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={(event) => {
          drag.current.active = false;
          if (ref.current?.hasPointerCapture(event.pointerId)) {
            ref.current.releasePointerCapture(event.pointerId);
          }
          drag.current.active = false;
        }}
        onPointerEnter={() => {
          paused.current = true;
          setHovered(true);
        }}
        onPointerLeave={() => {
          paused.current = false;
          setHovered(false);
        }}
        onFocusCapture={() => {
          paused.current = true;
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            paused.current = false;
          }
        }}
        onClickCapture={(event) => {
          if (!drag.current.moved) return;
          event.preventDefault();
          event.stopPropagation();
          drag.current.moved = false;
        }}
      >
        {(autoplay ? [...videos, ...videos] : videos).map((video, index) => (
          <div
            className="min-w-[72vw] snap-start sm:min-w-[320px] lg:min-w-[300px] xl:min-w-[340px]"
            key={`${video.id}-${index}`}
          >
            <VideoCard video={video} variant="portrait" />
          </div>
        ))}
      </div>
      {!autoplay && (
        <div className="bg-line relative mt-6 h-px">
          <div
            className="bg-ink absolute inset-y-0 left-0"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
      )}
    </section>
  );
}
