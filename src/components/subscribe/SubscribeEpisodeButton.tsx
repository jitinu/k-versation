"use client";

import { useSubscribe } from "./SubscribeProvider";

export function SubscribeEpisodeButton() {
  const { subscriber, open } = useSubscribe();
  if (subscriber) return null;
  return (
    <button type="button" className="btn btn-ghost px-4 py-3" onClick={() => open()}>
      Subscribe for new episodes
    </button>
  );
}
