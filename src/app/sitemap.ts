import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/conversations", "/monologues", "/about", "/questions", "/privacy", "/terms"].map(
    (path) => ({ url: `${siteConfig.url}${path}`, lastModified: new Date() }),
  );
}
