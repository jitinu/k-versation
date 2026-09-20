import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Carousel } from "@/components/video/Carousel";
import { VideoCard } from "@/components/video/VideoCard";
import { listPopular, listVideos } from "@/lib/data";

export const metadata = {
  title: "Conversations",
  description: "Long-form conversations about Korean culture and identity.",
};

export default async function Conversations() {
  const [videos, popular] = await Promise.all([
    listVideos("conversation"),
    listPopular("conversation", 6),
  ]);
  return (
    <div data-theme="ivory">
      <div className="page section-gap">
        <p className="eyebrow">K-VERSATION conversations</p>
        <h1 className="mt-8 text-5xl tracking-[-0.03em] md:text-7xl">
          <SplitText>Conversations</SplitText>
        </h1>
        <p className="eyebrow mt-6">{videos.length} conversations</p>
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
          <p className="font-display mt-24 text-4xl normal-case">First conversation coming soon.</p>
        )}
      </div>
    </div>
  );
}
