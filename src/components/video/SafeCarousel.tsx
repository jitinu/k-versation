"use client";

import type { ComponentProps } from "react";
import { SafeBoundary } from "@/components/SafeBoundary";
import { Carousel } from "@/components/video/Carousel";
import { VideoCard } from "@/components/video/VideoCard";

export function SafeCarousel(props: ComponentProps<typeof Carousel>) {
  return (
    <SafeBoundary
      fallback={
        <div>
          <p className="eyebrow">{props.title}</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {props.videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      }
    >
      <Carousel {...props} />
    </SafeBoundary>
  );
}
