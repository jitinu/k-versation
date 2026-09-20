"use client";

import { useEffect, useState } from "react";
import type { ReactionKind, VideoStats } from "@/lib/supabase/types";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";

const reactions: [ReactionKind, string][] = [
  ["thumbs_up", "👍"],
  ["heart", "❤️"],
  ["laugh", "😂"],
  ["wow", "😮"],
  ["fire", "🔥"],
];

export function Reactions({ videoId, stats }: { videoId: string; stats: VideoStats }) {
  const [counts, setCounts] = useState(stats.reactions);
  const [selected, setSelected] = useState<Set<ReactionKind>>(new Set());

  useEffect(() => {
    const refreshCounts = async () => {
      if (!hasSupabaseEnv()) return;
      const { data } = await createClient()
        .from("video_display_stats")
        .select("reactions")
        .eq("video_id", videoId)
        .maybeSingle();
      if (data?.reactions) setCounts(data.reactions);
    };
    void fetch(`/api/me?videoId=${videoId}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { reactions?: ReactionKind[] }) => setSelected(new Set(data.reactions ?? [])));
    if (!hasSupabaseEnv()) return;
    const client = createClient();
    const channel = client
      .channel(`reactions:${videoId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reactions", filter: `video_id=eq.${videoId}` },
        () => void refreshCounts(),
      )
      .subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, [videoId]);

  async function performAction(kind: ReactionKind) {
    const wasActive = selected.has(kind);
    setSelected((current) => {
      const next = new Set(current);
      if (wasActive) next.delete(kind);
      else next.add(kind);
      return next;
    });
    setCounts((current) => ({
      ...current,
      [kind]: Math.max(0, (current[kind] ?? 0) + (wasActive ? -1 : 1)),
    }));
    const response = await fetch("/api/reactions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ videoId, kind }),
    });
    if (!response.ok) {
      setSelected((current) => {
        const next = new Set(current);
        if (wasActive) next.add(kind);
        else next.delete(kind);
        return next;
      });
      return;
    }
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
