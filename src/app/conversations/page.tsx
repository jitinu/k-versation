import type { Metadata } from "next";
import { MediaArchiveCard } from "@/components/media-card";
import { getPublishedMedia } from "@/lib/data";

export const metadata: Metadata = {
  title: "Conversations",
  description:
    "Daniel Koo speaks with people whose lives and work offer a meaningful perspective on South Korea.",
  alternates: { canonical: "/conversations" },
};

export default async function ConversationsPage() {
  const items = await getPublishedMedia("conversation");
  return (
    <div className="archive-page">
      <header className="page-intro">
        <p className="eyebrow">Daniel with another person</p>
        <h1>Conversations</h1>
        <p>
          Interviews across culture, policy, art, technology, identity, sport,
          education, and the many ways Korea meets the world.
        </p>
      </header>
      <div className="archive-list">
        {items.length ? (
          items.map((item, index) => (
            <MediaArchiveCard key={item.id} item={item} index={index} />
          ))
        ) : (
          <div className="archive-empty">
            <span>01</span>
            <h2>The archive opens with the first published conversation.</h2>
            <p>No placeholder interviews or invented view counts are shown.</p>
          </div>
        )}
      </div>
    </div>
  );
}
