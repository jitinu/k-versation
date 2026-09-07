"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MetricAdjuster({
  targets,
}: {
  targets: Array<{ id: string; title: string }>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const metric = String(data.get("metric"));
    const response = await fetch("/api/host/metrics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        metric,
        targetId:
          ["video_views", "reactions", "comments"].includes(metric)
            ? data.get("targetId")
            : null,
        adjustment: Number(data.get("adjustment")),
        note: data.get("note") || undefined,
      }),
    });
    const result = (await response.json()) as { error?: string };
    setMessage(response.ok ? "Adjustment saved and audited." : result.error ?? "Could not save adjustment.");
    router.refresh();
  }

  return (
    <form className="host-form metric-form" onSubmit={submit}>
      <div className="form-grid form-grid--three">
        <label>
          <span>Metric</span>
          <select name="metric">
            <option value="site_impressions">Site impressions</option>
            <option value="video_views">Video views</option>
            <option value="reactions">Reactions</option>
            <option value="comments">Comments</option>
            <option value="members">Members</option>
            <option value="countries_reached">Countries reached</option>
          </select>
        </label>
        <label>
          <span>Film target <em>For item metrics</em></span>
          <select name="targetId" defaultValue="">
            <option value="">Select a film</option>
            {targets.map((target) => <option key={target.id} value={target.id}>{target.title}</option>)}
          </select>
        </label>
        <label>
          <span>New adjustment</span>
          <input name="adjustment" type="number" defaultValue={0} required />
        </label>
      </div>
      <label>
        <span>Audit note <em>Optional</em></span>
        <input name="note" maxLength={500} placeholder="Reason for this change" />
      </label>
      {message && <p className="form-message" role="status">{message}</p>}
      <button className="button" type="submit">Save adjustment</button>
    </form>
  );
}
