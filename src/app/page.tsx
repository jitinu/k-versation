import Link from "next/link";
import { CountUp } from "@/components/motion/CountUp";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import Globe from "@/components/Globe";
import { Carousel } from "@/components/video/Carousel";
import { VideoCard } from "@/components/video/VideoCard";
import { getLatest, getMembersByCountry, getSiteNumbers, listVideos } from "@/lib/data";

export default async function Home() {
  const [conversation, monologue, conversations, monologues, numbers, members] = await Promise.all([
    getLatest("conversation"),
    getLatest("monologue"),
    listVideos("conversation"),
    listVideos("monologue"),
    getSiteNumbers(),
    getMembersByCountry(),
  ]);

  return (
    <>
      <section
        data-theme="ivory"
        className="grain -mt-[88px] pt-[88px] md:-mt-[104px] md:pt-[104px]"
      >
        <div className="page flex min-h-[calc(100dvh-9rem)] flex-col justify-between pt-6 pb-16 md:pt-10">
          <div>
            <p className="eyebrow">K-VERSATION · Korean culture, in conversation</p>
            <div className="mt-10 max-w-4xl md:mt-14">
              <h1 className="max-w-[16ch] text-[clamp(2.4rem,7.2vw,6.75rem)] leading-[1] tracking-[-0.03em]">
                <SplitText mode="word">Korean culture, told through real conversations.</SplitText>
              </h1>
              <p className="text-ink-2 mt-8 max-w-xl text-lg">
                Sharing Korean culture with the world through conversations and monologues by Daniel
                Koo. Stories, ideas, and experiences connecting where we come from with where we are
                going.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={conversation ? `/video/${conversation.slug}` : "/conversations"}
                  className="btn btn-primary"
                >
                  Watch the latest <span className="arrow">↗</span>
                </Link>
                <Link href="/about" className="btn btn-ghost">
                  About Daniel <span className="arrow">↗</span>
                </Link>
              </div>
            </div>
          </div>
          <Parallax speed={-0.06} className="mt-16 overflow-hidden">
            <p className="display-clamp text-ink">
              <SplitText mode="char">K-VERSATION</SplitText>
            </p>
          </Parallax>
        </div>
      </section>

      <section data-theme="ink" className="section-gap">
        <div className="page">
          <div className="mb-8 flex items-end justify-between gap-6">
            <p className="eyebrow">Latest conversation</p>
            {conversation && (
              <Link href={`/video/${conversation.slug}`} className="link-draw text-sm">
                Go watch the latest Conversation!
              </Link>
            )}
          </div>
          {conversation ? (
            <Reveal variant="mask">
              <VideoCard video={conversation} featured />
            </Reveal>
          ) : (
            <Empty title="Latest conversation" />
          )}
        </div>
      </section>

      {conversations.length ? (
        <section data-theme="ink" className="section-gap pt-0">
          <div className="page">
            <Carousel title="Conversations" videos={conversations} href="/conversations" />
          </div>
        </section>
      ) : null}

      <section data-theme="ivory" className="section-gap">
        <div className="page">
          {monologue ? (
            <>
              <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-5">
                  <p className="eyebrow">Latest monologue</p>
                  <h2 className="font-display mt-6 text-3xl normal-case md:text-5xl">
                    {monologue.title}
                  </h2>
                  {monologue.subtitle && (
                    <p className="text-ink-2 mt-6 max-w-md">{monologue.subtitle}</p>
                  )}
                  <Link href={`/video/${monologue.slug}`} className="btn btn-primary mt-8">
                    Go watch the latest Monologue! <span className="arrow">↗</span>
                  </Link>
                </div>
                <div className="lg:col-span-7">
                  <Reveal variant="mask">
                    <VideoCard video={monologue} />
                  </Reveal>
                </div>
              </div>
              {monologues.length ? (
                <div className="mt-28">
                  <Carousel title="Monologues" videos={monologues} href="/monologues" />
                </div>
              ) : null}
            </>
          ) : (
            <Empty title="Latest monologue" />
          )}
        </div>
      </section>

      <section data-theme="ink" className="section-gap">
        <div className="page">
          <p className="eyebrow">By the numbers</p>
          <h2 className="mt-6 max-w-[18ch] text-[clamp(2rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.03em]">
            Members in {numbers.countries} countries, one conversation at a time.
          </h2>
          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <Globe members={members} />
            <div className="grid grid-cols-2 gap-x-6 gap-y-12">
              {[
                ["impressions", numbers.impressions, "Total site impressions"],
                ["views", numbers.views, "Total site views"],
                ["members", numbers.members, "Total members"],
                ["countries", numbers.countries, "Countries reached"],
              ].map(([key, value, label], index) => (
                <Reveal
                  key={String(key)}
                  delay={index * 80}
                  variant="fade"
                  className="border-line border-t pt-4"
                >
                  <p className="text-5xl tabular-nums md:text-6xl">
                    <CountUp value={Number(value)} />
                  </p>
                  <p className="eyebrow mt-3">{label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-theme="ivory" className="section-gap">
        <div className="page flex flex-col items-center text-center">
          <h2 className="max-w-[18ch] text-[clamp(2rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.03em]">
            Start with one conversation.
          </h2>
          <Link href="/conversations" className="btn btn-primary mt-10">
            Start watching <span className="arrow">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}

function Empty({ title }: { title: string }) {
  return (
    <div className="border-line border-y py-12">
      <p className="eyebrow">{title}</p>
      <p className="font-display mt-4 text-4xl normal-case">First conversation coming soon.</p>
    </div>
  );
}
