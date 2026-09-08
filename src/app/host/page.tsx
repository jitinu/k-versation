import { isHost } from "@/lib/host";
import { listVideos, getSiteNumbers } from "@/lib/data";
import { HostPanel } from "./panel";
export default async function HostPage() {
  const host = await isHost();
  return host ? (
    <HostPanel videos={await listVideos()} numbers={await getSiteNumbers()} />
  ) : (
    <HostLogin />
  );
}
function HostLogin() {
  return (
    <div className="page section-gap mx-auto max-w-xl pt-40">
      <h1 className="mb-10 text-5xl">Host mode</h1>
      <form action="/api/host/login" method="post" className="space-y-4">
        <input name="password" type="password" placeholder="Password" required />
        <button className="border-signal text-signal border px-4 py-3">Enter</button>
      </form>
    </div>
  );
}
