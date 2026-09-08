import { isHost } from "@/lib/host";
import { listVideos, getSiteNumbers } from "@/lib/data";
import { HostPanel } from "./panel";
import { HostLogin } from "./login";
export default async function HostPage() {
  const host = await isHost();
  return host ? (
    <HostPanel videos={await listVideos()} numbers={await getSiteNumbers()} />
  ) : (
    <HostLogin />
  );
}
