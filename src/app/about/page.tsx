import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Daniel Koo and learn why K-VERSATION is building a thoughtful bridge between South Korea and the world.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <header className="about-hero">
        <p className="eyebrow">About the project</p>
        <h1>A bridge is not a shortcut. It is a place to meet.</h1>
      </header>
      <div className="about-portrait" role="img" aria-label="Portrait space for Daniel Koo">
        <div className="portrait-initials">DK</div>
        <p>Daniel Koo<br />Founder &amp; host</p>
      </div>
      <section className="about-story">
        <p className="story-lead">
          K-VERSATION began with a simple conviction: Korea deserves to be
          encountered in its full depth—not as a trend, a headline, or a
          collection of familiar symbols.
        </p>
        <div>
          <p>
            I’m Daniel Koo. Through conversations with people and direct
            dispatches, I’m creating a living record of the histories, ideas,
            tensions, creative work, and everyday experiences that connect
            South Korea with the wider world.
          </p>
          <p>
            The hyphen in K-VERSATION is deliberate. It represents exchange:
            the space between places and perspectives where listening becomes
            understanding. This publication is an invitation to spend time in
            that space.
          </p>
        </div>
      </section>
      <section className="about-values">
        {[
          ["Context over cliché", "Stories are grounded in the lives, work, and ideas of the people who carry them."],
          ["Curiosity over certainty", "Questions stay open long enough to uncover a perspective we may not expect."],
          ["Exchange over broadcast", "The audience is part of the conversation—not simply a number watching it."],
        ].map(([title, copy], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>
      <section className="about-cta">
        <h2>Bring a question.<br />Leave with a wider view.</h2>
        <div>
          <Link className="button" href="/conversations">Watch Conversations</Link>
          <Link className="text-link" href="/questions">Ask Daniel a question</Link>
        </div>
      </section>
    </div>
  );
}
