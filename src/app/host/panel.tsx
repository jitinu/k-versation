"use client";
import { useState } from "react";
import type { SiteNumbers, Video } from "@/lib/supabase/types";
export function HostPanel({ videos, numbers }: { videos: Video[]; numbers: SiteNumbers }) {
  const [message, setMessage] = useState("");
  const save = async (body: object) => {
    await fetch("/api/host/offsets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    setMessage("Saved");
    setTimeout(() => setMessage(""), 1200);
  };
  return (
    <div className="page section-gap pt-40">
      <div className="flex justify-between">
        <h1 className="text-5xl">Host mode</h1>
        <button
          onClick={() =>
            fetch("/api/host/logout", { method: "POST" }).then(() => location.reload())
          }
          className="link-draw"
        >
          Log out
        </button>
      </div>
      <p className="text-signal mt-3">{message}</p>
      <h2 className="mt-16 text-xl">Site offsets</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {(["impressions", "views", "members", "countries"] as const).map((field) => (
          <label key={field} className="text-xs">
            {field}
            <input
              type="number"
              defaultValue={numbers[field]}
              onBlur={(event) =>
                save({ type: "site", field: `${field}_offset`, offset: Number(event.target.value) })
              }
            />
          </label>
        ))}
      </div>
      <h2 className="mt-16 text-xl">Videos</h2>
      <div className="mt-4 space-y-3">
        {videos.map((video) => (
          <div
            className="border-line grid gap-3 border-t py-4 md:grid-cols-[1fr_repeat(2,160px)]"
            key={video.id}
          >
            <span className="normal-case">{video.title}</span>
            <label className="text-xs">
              View offset
              <input
                type="number"
                defaultValue={video.view_offset}
                onBlur={(event) =>
                  save({
                    type: "video_views",
                    videoId: video.id,
                    offset: Number(event.target.value),
                  })
                }
              />
            </label>
            <label className="text-xs">
              Comment offset
              <input
                type="number"
                defaultValue={video.comment_offset}
                onBlur={(event) =>
                  save({
                    type: "video_comments",
                    videoId: video.id,
                    offset: Number(event.target.value),
                  })
                }
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
