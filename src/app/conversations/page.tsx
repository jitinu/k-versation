import { SplitText } from "@/components/motion/SplitText";
import { Carousel } from "@/components/video/Carousel";
import { VideoCard } from "@/components/video/VideoCard";
import { listVideos } from "@/lib/data";
export const metadata = {
  title: "Conversations",
  description: "Long-form conversations about Korean culture and identity.",
};
export default async function Conversations() {
  const videos = await listVideos("conversation");
  return (
    <div className="page section-gap pt-40">
      <h1 className="mb-20 text-6xl">
        <SplitText>Conversations</SplitText>
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
        <p className="font-display text-4xl normal-case">First conversation coming soon.</p>
      )}
    </div>
  );
}
