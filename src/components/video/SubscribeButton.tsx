"use client";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/components/auth/AuthGate";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";
export function SubscribeButton() {
  const gate = useRequireAuth();
  const [subscribed, setSubscribed] = useState(false);
  useEffect(() => {
    if (!hasSupabaseEnv()) return;
    void createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (!user) return;
        return createClient()
          .from("subscriptions")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle()
          .then(({ data }) => setSubscribed(Boolean(data)));
      });
  }, []);

  return (
    <button
      className="border-signal text-signal border px-4 py-3"
      onClick={() =>
        gate(() => {
          void (async () => {
            const client = createClient();
            const {
              data: { user },
            } = await client.auth.getUser();
            if (!user) return;
            if (subscribed) {
              const { error } = await client.from("subscriptions").delete().eq("user_id", user.id);
              if (!error) setSubscribed(false);
            } else {
              const { error } = await client.from("subscriptions").insert({ user_id: user.id });
              if (!error) setSubscribed(true);
            }
          })();
        })
      }
    >
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
