import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatCompactNumber, formatDate, formatDuration } from "@/lib/format";
import type { MediaItem } from "@/lib/types";

export function MediaArtwork({
  item,
  priority = false,
}: {
  item: MediaItem;
  priority?: boolean;
}) {
  if (item.posterUrl) {
    return (
      <Image
        src={item.posterUrl}
        alt={`${item.title} poster`}
        fill
        priority={priority}
        sizes="(max-width: 800px) 100vw, 60vw"
      />
    );
  }
  return (
    <div className="media-placeholder" aria-hidden="true">
      <span>{item.kind === "conversation" ? "C" : "D"}</span>
      <span>K—V</span>
    </div>
  );
}

export function MediaFeature({
  item,
  label,
  reverse = false,
}: {
  item: MediaItem | null;
  label: string;
  reverse?: boolean;
}) {
  if (!item) {
    return (
      <section className={`media-feature media-feature--empty${reverse ? " is-reverse" : ""}`}>
        <div className="feature-artwork empty-artwork">
          <span className="outline-type">{label.at(0)}</span>
          <span className="empty-rule" />
        </div>
        <div className="feature-copy">
          <p className="eyebrow">{label}</p>
          <h2>The first story is taking shape.</h2>
          <p>
            New original K-VERSATION films will appear here automatically when
            Daniel publishes them.
          </p>
        </div>
      </section>
    );
  }
  const href = `/${item.kind === "conversation" ? "conversations" : "dispatches"}/${item.slug}`;
  return (
    <section className={`media-feature${reverse ? " is-reverse" : ""}`}>
      <Link href={href} className="feature-artwork">
        <MediaArtwork item={item} priority />
        <span className="artwork-index">{item.kind === "conversation" ? "C" : "D"}—01</span>
      </Link>
      <div className="feature-copy">
        <p className="eyebrow">{label}</p>
        <h2>
          <Link href={href}>{item.title}</Link>
        </h2>
        {item.guest && <p className="feature-guest">with {item.guest}</p>}
        <p>{item.excerpt}</p>
        <div className="feature-meta">
          <span>{formatDate(item.publishedAt)}</span>
          {formatDuration(item.durationSeconds) && (
            <span>{formatDuration(item.durationSeconds)}</span>
          )}
        </div>
        <Link href={href} className="arrow-link">
          Watch the film <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export function MediaArchiveCard({
  item,
  index,
}: {
  item: MediaItem;
  index: number;
}) {
  const href = `/${item.kind === "conversation" ? "conversations" : "dispatches"}/${item.slug}`;
  return (
    <article className="archive-item">
      <p className="archive-index">{String(index + 1).padStart(2, "0")}</p>
      <Link href={href} className="archive-artwork">
        <MediaArtwork item={item} />
      </Link>
      <div className="archive-copy">
        <div className="archive-meta">
          <span>{formatDate(item.publishedAt)}</span>
          <span>{formatCompactNumber(item.displayedViews)} views</span>
        </div>
        <h2>
          <Link href={href}>{item.title}</Link>
        </h2>
        {item.guest && <p className="feature-guest">with {item.guest}</p>}
        <p>{item.excerpt}</p>
      </div>
      <Link href={href} className="archive-arrow" aria-label={`Watch ${item.title}`}>
        ↗
      </Link>
    </article>
  );
}
