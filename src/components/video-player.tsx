"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useCallback, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { progressMilestone } from "@/lib/metrics";
import type { MediaItem } from "@/lib/types";

export function VideoPlayer({ item }: { item: MediaItem }) {
  const playbackSessionId = useRef(crypto.randomUUID());
  const milestones = useRef(new Set<number>());
  const started = useRef(false);
  const viewed = useRef(false);

  const sendEvent = useCallback((
    type: "page" | "start" | "view" | "progress" | "complete",
    progress?: 25 | 50 | 75 | 100,
  ) => {
    void fetch("/api/analytics/video", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventId: crypto.randomUUID(),
        mediaId: item.id,
        playbackSessionId: playbackSessionId.current,
        type,
        progress,
      }),
      keepalive: true,
    });
  }, [item.id]);

  useEffect(() => {
    sendEvent("page");
  }, [sendEvent]);

  if (!item.muxPlaybackId) {
    return (
      <div className="video-pending">
        <div>
          <Play aria-hidden="true" />
          <p>Film processing</p>
          <span>Playback will appear here when the media asset is ready.</span>
        </div>
      </div>
    );
  }

  return (
    <MuxPlayer
      className="mux-player"
      playbackId={item.muxPlaybackId}
      poster={item.posterUrl ?? undefined}
      metadata={{
        video_id: item.id,
        video_title: item.title,
      }}
      streamType="on-demand"
      accentColor="#e9eff4"
      onPlay={() => {
        if (!started.current) {
          started.current = true;
          sendEvent("start");
        }
      }}
      onTimeUpdate={(event) => {
        const player = event.currentTarget as HTMLVideoElement | null;
        if (!player || !player.duration) return;
        const ratio = player.currentTime / player.duration;
        if (!viewed.current && (player.currentTime >= 30 || ratio >= 0.25)) {
          viewed.current = true;
          sendEvent("view");
        }
        const milestone = progressMilestone(ratio);
        if (
          milestone &&
          !milestones.current.has(milestone) &&
          milestone !== 100
        ) {
          milestones.current.add(milestone);
          sendEvent("progress", milestone);
        }
      }}
      onEnded={() => {
        if (!milestones.current.has(100)) {
          milestones.current.add(100);
          sendEvent("complete", 100);
        }
      }}
    />
  );
}
