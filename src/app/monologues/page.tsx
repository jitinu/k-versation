import { SplitText } from "@/components/motion/SplitText";
import { Carousel } from "@/components/video/Carousel";
import { VideoCard } from "@/components/video/VideoCard";
import { listVideos } from "@/lib/data";
export const metadata = { title: "Monologues", description: "Personal monologues by Daniel Koo." };
export default async function Monologues() {
  const videos = await listVideos("monologue");
  return (
    <div className="page section-gap pt-40">
      <h1 className="mb-20 text-6xl">
        <SplitText>Monologues</SplitText>
      </h1>
      {videos.length ? (
        <>
          <Carousel title="Popular now" videos={videos.slice(0, 6)} />
          <div className="mt-24 grid gap-6 md:grid-cols-2">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </>
      ) : (
        <p className="font-display text-4xl normal-case">First monologue coming soon.</p>
      )}
    </div>
  );
}
