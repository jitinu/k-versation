import type { MetadataRoute } from "next";
import { getPublishedMedia } from "@/lib/data";
import { siteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [conversations, dispatches] = await Promise.all([
    getPublishedMedia("conversation"),
    getPublishedMedia("dispatch"),
  ]);
  const staticPages = ["", "/conversations", "/dispatches", "/about", "/questions", "/privacy", "/terms"];
  return [
    ...staticPages.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
    })),
    ...conversations.map((item) => ({
      url: `${base}/conversations/${item.slug}`,
      lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...dispatches.map((item) => ({
      url: `${base}/dispatches/${item.slug}`,
      lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
