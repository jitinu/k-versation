import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/supabase/types";

export function duration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function VideoCard({
  video,
  featured = false,
  variant = "default",
  showTitle = true,
}: {
  video: Video;
  featured?: boolean;
  variant?: "default" | "portrait";
  showTitle?: boolean;
}) {
  return (
    <Link
      href={`/video/${video.slug}`}
      data-cursor="play"
      className={`group bg-surface relative block overflow-hidden rounded-[var(--radius-media)] transition-transform duration-500 hover:-translate-y-1 ${
        variant === "portrait" ? "aspect-[3/4]" : featured ? "aspect-[16/8]" : "aspect-video"
      }`}
    >
      <Image
        src={video.thumbnail_url}
        alt={video.title}
        fill
        sizes={featured ? "100vw" : "(max-width: 768px) 80vw, 34vw"}
        className="object-cover opacity-100 transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-[#e8e8e3] md:p-6">
        <div className="mb-2 flex items-center gap-3 text-xs">
          {video.is_new && (
            <span className="bg-signal rounded-full px-2 py-0.5 text-[10px] tracking-[.12em] text-white uppercase">
              NEW
            </span>
          )}
          <span>{duration(video.duration_seconds)}</span>
        </div>
        {showTitle ? (
          <>
            <h3
              className={`font-display leading-[1.05] normal-case ${
                featured
                  ? "text-3xl md:text-5xl"
                  : variant === "portrait"
                    ? "text-2xl md:text-[28px]"
                    : "text-2xl md:text-3xl"
              }`}
            >
              {video.title}
            </h3>
            {video.subtitle && <p className="mt-2 text-xs text-[#e8e8e3]/75">{video.subtitle}</p>}
          </>
        ) : null}
      </div>
    </Link>
  );
}
