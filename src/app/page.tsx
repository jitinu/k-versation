import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { Globe } from "@/components/globe";
import { HeroWordmark } from "@/components/hero-wordmark";
import { MediaFeature } from "@/components/media-card";
import { getLatestMedia, getPublicMetrics } from "@/lib/data";

export default async function Home() {
  const [conversation, dispatch, metrics] = await Promise.all([
    getLatestMedia("conversation"),
    getLatestMedia("dispatch"),
    getPublicMetrics(),
  ]);
  const numbers = [
    ["Site impressions", metrics.siteImpressions],
    ["Video views", metrics.totalVideoViews],
    ["Members", metrics.totalMembers],
    ["Countries reached", metrics.countriesReached],
  ] as const;

  return (
    <>
      <section className="home-hero">
        <div className="hero-topline">
          <p>
            A moving archive of Korea, told through people, ideas, history,
            culture, and the forces shaping what comes next.
          </p>
          <Link href="/about" className="arrow-link">
            Meet Daniel <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <HeroWordmark />
        <div className="hero-foot">
          <span>Bay Area ↔ South Korea ↔ Everywhere</span>
          <ArrowDownRight aria-hidden="true" />
        </div>
      </section>
      <div className="editorial-rule" />
      <MediaFeature item={conversation} label="Latest Conversation" />
      <MediaFeature item={dispatch} label="Latest Dispatch" reverse />
      <section className="numbers-section" data-reveal>
        <div className="numbers-heading">
          <p className="eyebrow">A global exchange</p>
          <h2>By the<br />Numbers</h2>
          <p>
            A live measure of the people, places, and viewing moments that make
            up K-VERSATION.
          </p>
        </div>
        <div className="numbers-visual">
          <Globe countries={metrics.countryCounts} />
        </div>
        <dl className="number-list">
          {numbers.map(([label, value], index) => (
            <div
              key={label}
              data-reveal="right"
              style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
            >
              <dt>{label}</dt>
              <dd>
                <CountUp value={value} />
              </dd>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </dl>
      </section>
      <section className="join-band" data-reveal="scale">
        <div>
          <p className="eyebrow">Become part of the exchange</p>
          <h2>Watch openly. Participate meaningfully.</h2>
        </div>
        <p>
          Membership opens reactions, comments, and a direct line into the
          growing K-VERSATION community.
        </p>
        <Link className="button button--light" href="/join">
          Join K-VERSATION <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
