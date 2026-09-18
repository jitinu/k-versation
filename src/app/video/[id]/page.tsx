import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Comments } from "@/components/video/Comments";
import { Reactions } from "@/components/video/Reactions";
import { SubscribeButton } from "@/components/video/SubscribeButton";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { duration } from "@/components/video/VideoCard";
import { getVideoBySlugOrId, getVideoStats } from "@/lib/data";

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
    <>
      <section data-theme="ink" className="section-gap pt-0">
        <div className="page">
          <VideoPlayer video={video} />
        </div>
      </section>
      <section data-theme="ivory" className="section-gap pt-0">
        <div className="page">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow">
              {video.section} · {new Date(video.published_at).toLocaleDateString()} ·{" "}
              {duration(video.duration_seconds)} · {stats.views.toLocaleString()} views
            </p>
            <h1 className="font-display mt-6 text-3xl normal-case md:text-5xl">{video.title}</h1>
            {video.subtitle && <p className="text-ink-2 mt-4 text-lg">{video.subtitle}</p>}
            <p className="text-ink-2 mt-10 max-w-3xl text-lg whitespace-pre-line normal-case">
              {video.description}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Reactions videoId={video.id} stats={stats} />
              <SubscribeButton />
            </div>
            <Comments videoId={video.id} />
          </div>
        </div>
      </section>
    </>
  );
}
