import { isHost } from "@/lib/host";
import { listVideos, getSiteNumbers } from "@/lib/data";
import { HostPanel } from "./panel";
import { HostLogin } from "./login";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";
export default async function HostPage() {
  const host = await isHost();
  const subscriberCount =
    host && hasSupabaseEnv()
      ? ((
          await createAdminClient().from("subscribers").select("id", { count: "exact", head: true })
        ).count ?? 0)
      : 0;
  return host ? (
    <HostPanel
      videos={await listVideos()}
      numbers={await getSiteNumbers()}
      subscriberCount={subscriberCount}
    />
  ) : (
    <HostLogin />
  );
}
