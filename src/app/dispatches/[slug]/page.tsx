import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Engagement } from "@/components/engagement";
import { VideoPlayer } from "@/components/video-player";
import { getMediaBySlug, getPublishedMedia, getViewer } from "@/lib/data";
import { formatCompactNumber, formatDate, formatDuration } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMediaBySlug("dispatch", slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `/dispatches/${slug}` },
    openGraph: {
      type: "video.episode",
      title: item.title,
      description: item.excerpt,
      images: item.posterUrl ? [item.posterUrl] : undefined,
    },
  };
}

export default async function DispatchPage({ params }: Props) {
  const { slug } = await params;
  const [item, viewer, related] = await Promise.all([
    getMediaBySlug("dispatch", slug),
    getViewer(),
    getPublishedMedia("dispatch"),
  ]);
  if (!item) notFound();
  return (
    <article className="watch-page">
      <header className="watch-header">
        <div>
          <p className="eyebrow">Dispatch</p>
          <h1>{item.title}</h1>
        </div>
        <div className="watch-facts">
          <p><span>Written &amp; presented by</span>Daniel Koo</p>
          <p><span>Published</span>{formatDate(item.publishedAt)}</p>
          {item.durationSeconds && <p><span>Duration</span>{formatDuration(item.durationSeconds)}</p>}
        </div>
      </header>
      <div className="player-frame"><VideoPlayer item={item} /></div>
      <div className="watch-body" data-reveal>
        <div className="watch-description">
          {item.description.split("\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="watch-stat">
          <span>{formatCompactNumber(item.displayedViews)}</span>
          <p>meaningful views</p>
        </aside>
      </div>
      <Engagement mediaId={item.id} viewer={viewer} initialReactions={item.reactionCount} initialComments={item.commentCount} />
      {related.filter((value) => value.id !== item.id).length > 0 && (
        <section className="related-section" data-reveal>
          <p className="eyebrow">More Dispatches</p>
          {related.filter((value) => value.id !== item.id).slice(0, 3).map((relatedItem) => (
            <Link key={relatedItem.id} href={`/dispatches/${relatedItem.slug}`}>
              <span>{formatDate(relatedItem.publishedAt)}</span>
              <h3>{relatedItem.title}</h3>
              <span>↗</span>
            </Link>
          ))}
        </section>
      )}
    </article>
  );
}
