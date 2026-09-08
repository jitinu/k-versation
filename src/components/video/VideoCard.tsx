import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/supabase/types";
export function duration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
export function VideoCard({ video, featured = false }: { video: Video; featured?: boolean }) {
  return (
    <Link
      href={`/video/${video.slug}`}
      data-cursor="play"
      className={`group relative block overflow-hidden ${featured ? "aspect-[16/8]" : "aspect-video"}`}
    >
      <Image
        src={video.thumbnail_url}
        alt={video.title}
        fill
        sizes={featured ? "100vw" : "(max-width: 768px) 100vw, 33vw"}
        className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="bg-canvas/85 absolute inset-x-0 bottom-0 p-4 md:p-6">
        <div className="mb-2 flex items-center gap-3 text-xs">
          {video.is_new && <span className="border-signal text-signal border px-2 py-1">NEW</span>}
          <span>{duration(video.duration_seconds)}</span>
        </div>
        <h3
          className={`font-display normal-case ${featured ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl"}`}
        >
          {video.title}
        </h3>
        {video.subtitle && <p className="text-ink-2 mt-2 text-xs">{video.subtitle}</p>}
      </div>
    </Link>
  );
}
