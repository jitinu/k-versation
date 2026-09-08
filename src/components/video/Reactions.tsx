"use client";
import { useState } from "react";
import type { ReactionKind, VideoStats } from "@/lib/supabase/types";
import { useRequireAuth } from "@/components/auth/AuthGate";
const reactions: [ReactionKind, string][] = [
  ["thumbs_up", "👍"],
  ["heart", "❤️"],
  ["laugh", "😂"],
  ["wow", "😮"],
  ["fire", "🔥"],
];
export function Reactions({ stats }: { videoId: string; stats: VideoStats }) {
  const gate = useRequireAuth();
  const [counts, setCounts] = useState(stats.reactions);
  return (
    <div className="flex flex-wrap gap-2">
      {reactions.map(([kind, emoji]) => (
        <button
          key={kind}
          className="border-line border px-3 py-2 text-sm"
          onClick={() => gate(() => setCounts({ ...counts, [kind]: (counts[kind] ?? 0) + 1 }))}
        >
          {emoji} <span>{Math.max(0, counts[kind] ?? 0)}</span>
        </button>
      ))}
    </div>
  );
}
