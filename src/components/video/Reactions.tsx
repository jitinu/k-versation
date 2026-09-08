"use client";
import { useEffect, useState } from "react";
import type { ReactionKind, VideoStats } from "@/lib/supabase/types";
import { useRequireAuth } from "@/components/auth/AuthGate";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";
const reactions: [ReactionKind, string][] = [
  ["thumbs_up", "👍"],
  ["heart", "❤️"],
  ["laugh", "😂"],
  ["wow", "😮"],
  ["fire", "🔥"],
];
export function Reactions({ videoId, stats }: { videoId: string; stats: VideoStats }) {
  const gate = useRequireAuth();
  const [counts, setCounts] = useState(stats.reactions);
  const [selected, setSelected] = useState<Set<ReactionKind>>(new Set());

  useEffect(() => {
    if (!hasSupabaseEnv()) return;
    void createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (!user) return;
        return createClient()
          .from("reactions")
          .select("kind")
          .eq("video_id", videoId)
          .eq("user_id", user.id)
          .then(({ data }) => setSelected(new Set((data ?? []).map((row) => row.kind))));
      });
  }, [videoId]);

  function toggle(kind: ReactionKind) {
    gate(() => {
      void (async () => {
        const client = createClient();
        const {
          data: { user },
        } = await client.auth.getUser();
        if (!user) return;
        const active = selected.has(kind);
        const next = new Set(selected);
        if (active) {
          const { error } = await client
            .from("reactions")
            .delete()
            .eq("video_id", videoId)
            .eq("user_id", user.id)
            .eq("kind", kind);
          if (error) return;
          next.delete(kind);
        } else {
          const { error } = await client
            .from("reactions")
            .insert({ video_id: videoId, user_id: user.id, kind });
          if (error) return;
          next.add(kind);
        }
        setSelected(next);
        setCounts({
          ...counts,
          [kind]: Math.max(0, (counts[kind] ?? 0) + (active ? -1 : 1)),
        });
      })();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {reactions.map(([kind, emoji]) => (
        <button
          key={kind}
          className="border-line border px-3 py-2 text-sm"
          aria-pressed={selected.has(kind)}
          onClick={() => toggle(kind)}
        >
          {emoji} <span>{Math.max(0, counts[kind] ?? 0)}</span>
        </button>
      ))}
    </div>
  );
}
