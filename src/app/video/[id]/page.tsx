import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVideoBySlugOrId, getVideoStats } from "@/lib/data";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Reactions } from "@/components/video/Reactions";
import { SubscribeButton } from "@/components/video/SubscribeButton";
import { Comments } from "@/components/video/Comments";
import { duration } from "@/components/video/VideoCard";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const video = await getVideoBySlugOrId((await params).id);
  return video
    ? {
        title: video.title,
        description: video.description,
        openGraph: { images: [video.thumbnail_url] },
      }
    : { title: "Video not found" };
}
export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const video = await getVideoBySlugOrId((await params).id);
  if (!video) notFound();
  const stats = await getVideoStats(video.id);
  return (
    <article className="page section-gap pt-28 md:pt-40">
      <VideoPlayer video={video} />
      <div className="mx-auto max-w-4xl py-12">
        <p className="text-signal text-xs">
          {video.section} · {new Date(video.published_at).toLocaleDateString()} ·{" "}
          {duration(video.duration_seconds)} · {stats.views.toLocaleString()} views
        </p>
        <h1 className="font-display mt-5 text-5xl normal-case md:text-7xl">{video.title}</h1>
        {video.subtitle && <p className="text-ink-2 mt-4">{video.subtitle}</p>}
        <p className="text-ink-2 mt-10 text-lg whitespace-pre-line normal-case">
          {video.description}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Reactions videoId={video.id} stats={stats} />
          <SubscribeButton />
        </div>
        <Comments videoId={video.id} />
      </div>
    </article>
  );
}
