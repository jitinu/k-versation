import Image from "next/image";
export const metadata = { title: "About", description: "Meet Daniel Koo, founder of K-VERSATION." };
export default function About() {
  return (
    <div className="page section-gap pt-40">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div className="grain relative aspect-[4/5]">
          <Image
            src="/images/daniel-koo.jpg"
            priority
            alt="Daniel Koo, founder of K-VERSATION"
            fill
            className="duotone object-cover"
          />
        </div>
        <div>
          <h1 className="text-6xl">About</h1>
          <div className="text-ink-2 mt-10 space-y-6 text-lg">
            <p className="normal-case">
              {
                "I'm Daniel Koo, a Korean American high school student passionate about exploring and sharing Korean culture. Born and raised in the Bay Area, I've always been curious about my heritage and the rich traditions that connect me to Korea."
              }
            </p>
            <p className="normal-case">
              {
                "Through K-versation, I hope to create a bridge between cultures, sharing insights, stories, and experiences that resonate with both Korean Americans and anyone interested in Korean culture."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
