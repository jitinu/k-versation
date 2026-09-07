import { HostContentManager } from "@/components/host-content-manager";
import { getHostMedia } from "@/lib/data";

export default async function HostContentPage() {
  const items = await getHostMedia();
  return (
    <div className="host-page">
      <div className="host-section-heading">
        <div><p className="eyebrow">Library</p><h2>Conversations &amp; Dispatches</h2></div>
        <p>Create metadata, upload directly to Mux, and control publication without a code change.</p>
      </div>
      <HostContentManager items={items} />
    </div>
  );
}
