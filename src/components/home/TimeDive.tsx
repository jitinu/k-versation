"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type Era = {
  year: string;
  place: string;
  line: string;
  src: string;
  alt: string;
};

const DEPTH = 0.55;
const PASS = 2.6;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function frame(camera: number, index: number, count: number) {
  const z = index - camera;
  let scale: number;
  let opacity: number;
  let brightness: number;
  if (z >= 0) {
    scale = 1 / (1 + z * DEPTH);
    opacity = clamp01(1.4 - z * 0.35);
    brightness = clamp01(1 - z * 0.22);
  } else {
    const passed = -z;
    const last = index === count - 1;
    scale = 1 + Math.min(passed, last ? 0.5 : 2) * (last ? 0.6 : PASS);
    opacity = last ? Math.max(0.35, 1 - passed * 0.9) : clamp01(1 - passed * 1.15);
    brightness = last ? clamp01(1 - passed * 0.7) : 1;
  }
  const local = camera - index;
  const captionOpacity = clamp01(1 - Math.abs(local - 0.15) * 1.7);
  const captionY = (0.15 - local) * 40;
  return { scale, opacity, brightness, captionOpacity, captionY };
}

export function TimeDive({ eras, closing }: { eras: Era[]; closing: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closingRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const count = eras.length;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = (progress: number) => {
      const camera = progress * (count + 1);
      layerRefs.current.forEach((layer, index) => {
        if (!layer) return;
        const { scale, opacity, brightness, captionOpacity, captionY } = frame(
          camera,
          index,
          count,
        );
        layer.style.transform = `translate3d(0,0,0) scale(${scale.toFixed(4)})`;
        layer.style.opacity = opacity.toFixed(3);
        layer.style.visibility = opacity <= 0.001 ? "hidden" : "visible";
        const overlay = overlayRefs.current[index];
        if (overlay) overlay.style.opacity = (1 - (0.35 + brightness * 0.65)).toFixed(3);

        const caption = captionRefs.current[index];
        if (!caption) return;
        caption.style.opacity = captionOpacity.toFixed(3);
        caption.style.transform = `translate3d(0, ${captionY.toFixed(2)}px, 0)`;
        caption.style.visibility = captionOpacity <= 0.001 ? "hidden" : "visible";
      });
      const closingNode = closingRef.current;
      if (closingNode) {
        const local = camera - count + 0.55;
        const visible = clamp01(local * 2.4);
        closingNode.style.opacity = visible.toFixed(3);
        closingNode.style.transform = `translate3d(0, ${((0.4 - local) * 30).toFixed(2)}px, 0)`;
      }
      if (hintRef.current) hintRef.current.style.opacity = clamp01(1 - progress * 12).toFixed(3);
    };

    if (reduced) {
      render(0);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => render(self.progress),
    });
    render(0);

    // Trackpad pinch arrives as ctrl+wheel; turn it into a dive through the timeline.
    let pinchTarget: number | null = null;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      const rect = wrap.getBoundingClientRect();
      if (rect.top > 0 || rect.bottom < window.innerHeight) return;
      event.preventDefault();
      const delta = -event.deltaY * 6;
      if (window.__lenis) {
        pinchTarget = (pinchTarget ?? window.scrollY) + delta;
        window.__lenis.scrollTo(pinchTarget, { lerp: 0.12 });
      } else {
        window.scrollBy({ top: delta });
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      trigger.kill();
      window.removeEventListener("wheel", onWheel);
    };
  }, [count]);

  const skip = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const target = wrap.offsetTop + wrap.offsetHeight;
    if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.4 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <div
      ref={wrapRef}
      data-theme="ink"
      data-dive
      className="relative -mt-[88px] bg-[#080807] text-[#e8e8e3] md:-mt-[104px]"
      style={{ height: `${(count + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {eras.map((era, index) => {
          const initial = frame(0, index, count);
          return (
            <div
              key={era.src}
              ref={(node) => {
                layerRefs.current[index] = node;
              }}
              className="absolute inset-0 origin-center will-change-transform"
              style={{
                zIndex: count - index,
                transform: `translate3d(0,0,0) scale(${initial.scale.toFixed(4)})`,
                opacity: initial.opacity,
                visibility: initial.opacity <= 0.001 ? "hidden" : "visible",
              }}
            >
              <Image
                src={era.src}
                alt={era.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div
                ref={(node) => {
                  overlayRefs.current[index] = node;
                }}
                className="pointer-events-none absolute inset-0 bg-black"
                style={{ opacity: 1 - (0.35 + initial.brightness * 0.65) }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080807]/80 via-[#080807]/20 to-[#080807]/40" />
            </div>
          );
        })}

        <div className="grain pointer-events-none absolute inset-0 z-[60]" />

        {eras.map((era, index) => (
          <div
            key={`${era.src}-caption`}
            ref={(node) => {
              captionRefs.current[index] = node;
            }}
            className="page pointer-events-none absolute inset-x-0 bottom-[24vh] z-[70] will-change-transform md:bottom-[16vh]"
            style={(() => {
              const initial = frame(0, index, count);
              return {
                opacity: initial.captionOpacity,
                transform: `translate3d(0, ${initial.captionY.toFixed(2)}px, 0)`,
                visibility: initial.captionOpacity <= 0.001 ? "hidden" : "visible",
              };
            })()}
          >
            <p className="eyebrow !text-[#b5b3ab]">
              {era.year} · {era.place}
            </p>
            <p className="font-display mt-4 max-w-[22ch] text-[clamp(1.7rem,4.2vw,3.6rem)] leading-[1.05] tracking-[-0.02em]">
              {era.line}
            </p>
          </div>
        ))}

        <div
          ref={closingRef}
          className="page pointer-events-none absolute inset-x-0 top-1/2 z-[70] -translate-y-1/2 text-center will-change-transform"
          style={{ opacity: 0 }}
        >
          <p className="eyebrow !text-[#b5b3ab]">Why K-VERSATION</p>
          <p className="font-display mx-auto mt-5 max-w-[26ch] text-[clamp(1.9rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.02em]">
            {closing}
          </p>
        </div>

        <div className="page absolute inset-x-0 bottom-6 z-[80] flex items-center justify-between text-xs">
          <div ref={hintRef} className="flex items-center gap-3 text-[#b5b3ab]">
            <span className="dive-hint inline-block h-8 w-px bg-[#e8e8e3]/60" />
            Scroll, or pinch to zoom through time
          </div>
          <button
            type="button"
            onClick={skip}
            className="link-draw cursor-pointer text-[#e8e8e3]/80 hover:text-[#e8e8e3]"
          >
            Skip intro
          </button>
        </div>
      </div>
    </div>
  );
}
