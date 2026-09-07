"use client";

import MuxUploader from "@mux/mux-uploader-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { MediaItem } from "@/lib/types";

export function HostContentManager({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function save(event: React.FormEvent<HTMLFormElement>, id?: string) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/host/media", {
      method: id ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id,
        kind: form.get("kind"),
        slug: form.get("slug"),
        title: form.get("title"),
        guest: form.get("guest") || null,
        excerpt: form.get("excerpt"),
        description: form.get("description"),
        status: form.get("status"),
        publishedAt: form.get("publishedAt")
          ? new Date(String(form.get("publishedAt"))).toISOString()
          : null,
        posterUrl: form.get("posterUrl") || null,
        muxPlaybackId: form.get("muxPlaybackId") || null,
        muxAssetId: form.get("muxAssetId") || null,
        captionsUrl: form.get("captionsUrl") || null,
      }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(result.error ?? "Content could not be saved.");
      return;
    }
    setMessage(id ? "Content updated." : "Draft created.");
    if (!id) event.currentTarget.reset();
    router.refresh();
  }

  async function remove(item: MediaItem) {
    if (!confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/host/media?id=${item.id}`, {
      method: "DELETE",
    });
    setMessage(response.ok ? "Content deleted." : "Content could not be deleted.");
    router.refresh();
  }

  async function uploadEndpoint(item: MediaItem) {
    const response = await fetch("/api/host/uploads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mediaId: item.id }),
    });
    const result = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !result.url) throw new Error(result.error ?? "Upload unavailable");
    return result.url;
  }

  return (
    <div className="host-content-manager">
      {message && <p className="host-toast" role="status">{message}</p>}
      <details className="host-editor" open={!items.length}>
        <summary>Create a new film</summary>
        <MediaFields onSubmit={(event) => void save(event)} />
      </details>
      <div className="host-content-list">
        {items.map((item) => (
          <details key={item.id} className="host-editor">
            <summary>
              <span className={`status-dot status-dot--${item.status}`} />
              <strong>{item.title}</strong>
              <span>{item.kind} · {item.status}</span>
            </summary>
            <MediaFields item={item} onSubmit={(event) => void save(event, item.id)} />
            <div className="host-upload">
              <div>
                <p className="eyebrow">Direct video upload</p>
                <p>
                  Large files upload directly to Mux. Processing status is
                  returned securely by webhook.
                </p>
              </div>
              <MuxUploader
                endpoint={() => uploadEndpoint(item)}
                pausable
                dynamicChunkSize
                onSuccess={() => setMessage("Upload complete. Mux is processing the film.")}
                onUploadError={() => setMessage("Video upload failed. Try again.")}
              />
            </div>
            <button className="danger-button" type="button" onClick={() => void remove(item)}>
              Delete content
            </button>
          </details>
        ))}
      </div>
    </div>
  );
}

function MediaFields({
  item,
  onSubmit,
}: {
  item?: MediaItem;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="host-form" onSubmit={onSubmit}>
      <div className="form-grid form-grid--three">
        <label>
          <span>Format</span>
          <select name="kind" defaultValue={item?.kind ?? "conversation"}>
            <option value="conversation">Conversation</option>
            <option value="dispatch">Dispatch</option>
          </select>
        </label>
        <label>
          <span>Status</span>
          <select name="status" defaultValue={item?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label>
          <span>Publication date</span>
          <input
            name="publishedAt"
            type="datetime-local"
            defaultValue={item?.publishedAt ? item.publishedAt.slice(0, 16) : ""}
          />
        </label>
      </div>
      <div className="form-grid">
        <label>
          <span>Title</span>
          <input name="title" defaultValue={item?.title} required maxLength={180} />
        </label>
        <label>
          <span>URL slug</span>
          <input name="slug" defaultValue={item?.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
        </label>
      </div>
      <label>
        <span>Guest <em>Conversations only</em></span>
        <input name="guest" defaultValue={item?.guest ?? ""} maxLength={120} />
      </label>
      <label>
        <span>Short editorial introduction</span>
        <textarea name="excerpt" defaultValue={item?.excerpt} required minLength={20} maxLength={320} />
      </label>
      <label>
        <span>Full description</span>
        <textarea name="description" defaultValue={item?.description} required minLength={40} maxLength={20000} />
      </label>
      <div className="form-grid">
        <label>
          <span>Poster URL</span>
          <input name="posterUrl" type="url" defaultValue={item?.posterUrl ?? ""} />
        </label>
        <label>
          <span>Captions file URL</span>
          <input name="captionsUrl" type="url" defaultValue={item?.captionsUrl ?? ""} />
        </label>
      </div>
      <div className="form-grid">
        <label>
          <span>Mux playback ID</span>
          <input name="muxPlaybackId" defaultValue={item?.muxPlaybackId ?? ""} />
        </label>
        <label>
          <span>Mux asset ID</span>
          <input name="muxAssetId" defaultValue={item?.muxAssetId ?? ""} />
        </label>
      </div>
      <button className="button" type="submit">{item ? "Save changes" : "Create draft"}</button>
    </form>
  );
}
