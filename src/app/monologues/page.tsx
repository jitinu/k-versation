import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Carousel } from "@/components/video/Carousel";
import { VideoCard } from "@/components/video/VideoCard";
import { listPopular, listVideos } from "@/lib/data";

export const metadata = {
  title: "Monologues",
  description: "Personal monologues by Daniel Koo.",
};

export default async function Monologues() {
  const [videos, popular] = await Promise.all([
    listVideos("monologue"),
    listPopular("monologue", 6),
  ]);
  return (
    <div data-theme="ivory">
      <div className="page section-gap">
        <p className="eyebrow">K-VERSATION monologues</p>
        <h1 className="mt-8 text-4xl tracking-[-0.03em] sm:text-5xl md:text-7xl">
          <SplitText>Monologues</SplitText>
        </h1>
        <p className="eyebrow mt-6">{videos.length} monologues</p>
        {videos.length ? (
          <>
            <div className="mt-24">
              <Carousel title="Popular now" videos={popular} autoplay />
            </div>
            <div className="mt-24 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video, index) => (
                <Reveal key={video.id} delay={index * 60}>
                  <VideoCard video={video} />
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          <p className="font-display mt-24 text-4xl normal-case">First monologue coming soon.</p>
        )}
      </div>
    </div>
  );
}
