import Link from "next/link";
import { getLatest, getMembersByCountry, getSiteNumbers } from "@/lib/data";
import { VideoCard } from "@/components/video/VideoCard";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import Globe from "@/components/Globe";

export default async function Home() {
  const [conversation, monologue, numbers, members] = await Promise.all([
    getLatest("conversation"),
    getLatest("monologue"),
    getSiteNumbers(),
    getMembersByCountry(),
  ]);
  return (
    <div className="page">
      <section className="grain flex min-h-[calc(100dvh-20rem)] flex-col justify-between pb-16">
        <div>
          <p className="text-signal text-xs">K-VERSATION / EST. BAY AREA</p>
          <p className="text-ink-2 mt-12 max-w-xl text-lg normal-case">
            Sharing Korean culture with the world through conversations and monologues by Daniel
            Koo. Stories, ideas, and experiences connecting where we come from with where we are
            going.
          </p>
        </div>
        <h1 className="display-clamp">
          <SplitText mode="char">K-VERSATION</SplitText>
        </h1>
      </section>
      <section className="section-gap">
        {conversation ? (
          <>
            <p className="text-signal mb-4 text-xs">Latest Conversation</p>
            <VideoCard video={conversation} featured />
            <Link
              className="link-draw mt-6 inline-block text-sm"
              href={`/video/${conversation.slug}`}
            >
              Go watch the latest Conversation!
            </Link>
          </>
        ) : (
          <Empty title="Latest Conversation" />
        )}
      </section>
      <section className="section-gap">
        {monologue ? (
          <>
            <p className="text-signal mb-4 text-xs">Latest Monologue</p>
            <VideoCard video={monologue} featured />
            <Link className="link-draw mt-6 inline-block text-sm" href={`/video/${monologue.slug}`}>
              Go watch the latest Monologue!
            </Link>
          </>
        ) : (
          <Empty title="Latest Monologue" />
        )}
      </section>
      <section className="section-gap">
        <p className="text-signal mb-10 text-xs">By the numbers</p>
        <div className="grid gap-12 lg:grid-cols-2">
          <Globe members={members} />
          <div className="grid grid-cols-2 gap-x-6 gap-y-12">
            {[
              ["impressions", numbers.impressions, "Total site impressions"],
              ["views", numbers.views, "Total site views"],
              ["members", numbers.members, "Total members"],
              ["countries", numbers.countries, "Countries reached"],
            ].map(([key, value, label], index) => (
              <Reveal key={String(key)} delay={index * 80}>
                <p className="text-5xl md:text-6xl">{Number(value).toLocaleString()}</p>
                <p className="text-ink-3 mt-2 text-xs">{label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section-gap text-center">
        <Link href="/conversations" className="border-signal text-signal border px-6 py-4">
          Start watching
        </Link>
      </section>
    </div>
  );
}
function Empty({ title }: { title: string }) {
  return (
    <div className="border-line border-y py-12">
      <p className="text-signal text-xs">{title}</p>
      <p className="font-display mt-4 text-4xl normal-case">First conversation coming soon.</p>
    </div>
  );
}
