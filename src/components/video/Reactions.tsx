"use client";

import { useEffect, useState } from "react";
import { useSubscribe } from "@/components/subscribe/SubscribeProvider";
import type { ReactionKind, VideoStats } from "@/lib/supabase/types";

const reactions: [ReactionKind, string][] = [
  ["thumbs_up", "👍"],
  ["heart", "❤️"],
  ["laugh", "😂"],
  ["wow", "😮"],
  ["fire", "🔥"],
];

export function Reactions({ videoId, stats }: { videoId: string; stats: VideoStats }) {
  const { subscriber, open } = useSubscribe();
  const [counts, setCounts] = useState(stats.reactions);
  const [selected, setSelected] = useState<Set<ReactionKind>>(new Set());

  useEffect(() => {
    void fetch(`/api/me?videoId=${videoId}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { reactions?: ReactionKind[] }) => setSelected(new Set(data.reactions ?? [])));
  }, [videoId]);

  async function performAction(kind: ReactionKind) {
    const response = await fetch("/api/reactions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ videoId, kind }),
    });
    if (!response.ok) return;
    const data = (await response.json()) as {
      active: boolean;
      counts: Partial<Record<ReactionKind, number>>;
    };
    setSelected((current) => {
      const next = new Set(current);
      if (data.active) next.add(kind);
      else next.delete(kind);
      return next;
    });
    setCounts(data.counts);
  }

  function toggle(kind: ReactionKind) {
    if (!subscriber) {
      open(() => void performAction(kind));
      return;
    }
    void performAction(kind);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {reactions.map(([kind, emoji]) => (
        <button
          key={kind}
          className="btn btn-ghost px-3 py-2 text-sm"
          aria-pressed={selected.has(kind)}
          onClick={() => toggle(kind)}
        >
          {emoji} <span>{Math.max(0, counts[kind] ?? 0)}</span>
        </button>
      ))}
    </div>
  );
}
