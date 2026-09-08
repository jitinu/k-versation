"use client";
import { useRef } from "react";
import type { Video } from "@/lib/supabase/types";
import { VideoCard } from "./VideoCard";
export function Carousel({ title, videos }: { title: string; videos: Video[] }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-xl">{title}</h2>
        <div className="flex gap-2">
          <button
            aria-label="Previous"
            className="border-signal text-signal border px-3 py-1"
            onClick={() => ref.current?.scrollBy({ left: -400, behavior: "smooth" })}
          >
            ←
          </button>
          <button
            aria-label="Next"
            className="border-signal text-signal border px-3 py-1"
            onClick={() => ref.current?.scrollBy({ left: 400, behavior: "smooth" })}
          >
            →
          </button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto">
        {videos.map((video) => (
          <div className="min-w-[78vw] snap-start md:min-w-[34vw]" key={video.id}>
            <VideoCard video={video} />
          </div>
        ))}
      </div>
    </section>
  );
}
