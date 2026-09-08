import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createAdminClient } from "../src/lib/supabase/admin";

function arg(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
const file = arg("--file");
const section = arg("--section");
const title = arg("--title");
const subtitle = arg("--subtitle") ?? null;
const descriptionFile = arg("--description-file");
const publish = arg("--publish");
if (
  !file ||
  !title ||
  !descriptionFile ||
  !publish ||
  !section ||
  !["conversation", "monologue"].includes(section)
)
  throw new Error("Required: --file --section --title --description-file --publish");
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");
const duration = Number(
  execFileSync("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    file,
  ]).toString(),
);
const thumbnail = arg("--thumbnail") ?? `${file}.jpg`;
if (!arg("--thumbnail"))
  execFileSync("ffmpeg", ["-y", "-ss", "3", "-i", file, "-frames:v", "1", thumbnail]);
const admin = createAdminClient();
async function main() {
  const videoPath = `videos/${slug}${path.extname(file!)}`;
  const thumbPath = `thumbnails/${slug}${path.extname(thumbnail!)}`;
  const [videoBuffer, thumbBuffer] = await Promise.all([
    fs.promises.readFile(file!),
    fs.promises.readFile(thumbnail!),
  ]);
  const videoUpload = await admin.storage
    .from("videos")
    .upload(videoPath, videoBuffer, { upsert: true, contentType: "video/mp4" });
  const thumbUpload = await admin.storage
    .from("thumbnails")
    .upload(thumbPath, thumbBuffer, { upsert: true, contentType: "image/jpeg" });
  if (videoUpload.error || thumbUpload.error) throw videoUpload.error ?? thumbUpload.error;
  const videoUrl = admin.storage.from("videos").getPublicUrl(videoPath).data.publicUrl;
  const thumbnailUrl = admin.storage.from("thumbnails").getPublicUrl(thumbPath).data.publicUrl;
  const { error } = await admin.from("videos").insert({
    slug,
    section: section as "conversation" | "monologue",
    title,
    subtitle,
    description: await fs.promises.readFile(descriptionFile!, "utf8"),
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl,
    duration_seconds: Math.round(duration),
    published_at: `${publish}T00:00:00.000Z`,
  });
  if (error) throw error;
  console.log(`Added ${title} (${slug})`);
}
void main();
