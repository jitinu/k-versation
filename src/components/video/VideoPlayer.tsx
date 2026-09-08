"use client";
import { useRef, useState } from "react";
import type { Video } from "@/lib/supabase/types";
export function VideoPlayer({ video }: { video: Video }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  function play() {
    void ref.current?.play();
    setStarted(true);
    void fetch("/api/views", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ videoId: video.id }),
    });
  }
  return (
    <div className="relative aspect-video bg-black">
      <video
        ref={ref}
        className="h-full w-full"
        controls
        poster={video.thumbnail_url}
        src={video.video_url}
        onPlay={() => {
          if (!started) {
            setStarted(true);
            void fetch("/api/views", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ videoId: video.id }),
            });
          }
        }}
      />
      {!started && (
        <button
          data-cursor="play"
          aria-label="Play video"
          onClick={play}
          className="border-signal text-signal absolute top-1/2 left-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center border text-3xl"
        >
          ▶
        </button>
      )}
    </div>
  );
}
