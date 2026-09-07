import type { Metadata } from "next";
import { MediaArchiveCard } from "@/components/media-card";
import { getPublishedMedia } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dispatches",
  description:
    "Original films in which Daniel Koo directly explores Korea’s history, culture, society, and ideas.",
  alternates: { canonical: "/dispatches" },
};

export default async function DispatchesPage() {
  const items = await getPublishedMedia("dispatch");
  return (
    <div className="archive-page">
      <header className="page-intro">
        <p className="eyebrow">Daniel directly exploring an idea</p>
        <h1>Dispatches</h1>
        <p>
          Focused visual essays that make room for context, curiosity, and a
          closer look at the stories carried through Korea.
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
            <h2>The archive opens with the first published Dispatch.</h2>
            <p>No placeholder films or manufactured engagement are shown.</p>
          </div>
        )}
      </div>
    </div>
  );
}
