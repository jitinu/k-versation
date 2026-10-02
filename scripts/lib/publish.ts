import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createAdminClient } from "../supabase-admin";
import { uploadMedia } from "./media-storage";

export type PublishSection = "conversation" | "monologue" | "intro";

export type PublishVideoInput = {
  file: string;
  thumbnail?: string;
  section: PublishSection;
  title: string;
  subtitle?: string | null;
  description: string;
  publish: string;
};

export type PosterOptions = {
  outputDir?: string;
  fallbackText?: string;
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function durationOf(file: string) {
  return Number(
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
}

function transcode(file: string, output: string) {
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      "-i",
      file,
      "-vf",
      "scale=1920:1080:force_original_aspect_ratio=decrease",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      output,
    ],
    { stdio: "inherit" },
  );
}

function meanLuma(file: string) {
  const output = execFileSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      file,
      "-vf",
      "signalstats,metadata=print:file=-",
      "-frames:v",
      "1",
      "-f",
      "null",
      "-",
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  const match = output.match(/lavfi\.signalstats\.YAVG=([0-9.]+)/);
  return match ? Number(match[1]) : 0;
}

function posterCandidate(
  file: string,
  output: string,
  start: number,
  duration: number,
  thumbnailSize: number,
) {
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      "-ss",
      start.toFixed(3),
      "-i",
      file,
      "-t",
      duration.toFixed(3),
      "-vf",
      `thumbnail=${thumbnailSize},scale=1280:-2`,
      "-frames:v",
      "1",
      "-q:v",
      "3",
      output,
    ],
    { stdio: "inherit" },
  );
}

export function extractPoster(file: string, output: string, options: PosterOptions = {}) {
  const outputDir = options.outputDir ?? path.dirname(output);
  fs.mkdirSync(outputDir, { recursive: true });
  const duration = durationOf(file);
  const temp = path.join(os.tmpdir(), `kv-poster-${process.pid}-${Date.now()}.jpg`);
  const attempts = [
    { start: duration * 0.1, window: Math.max(duration * 0.5, 1), size: 100 },
    { start: duration * 0.35, window: 1, size: 2 },
    { start: duration * 0.5, window: 1, size: 2 },
    { start: duration * 0.65, window: 1, size: 2 },
  ];
  try {
    for (const attempt of attempts) {
      posterCandidate(file, temp, attempt.start, attempt.window, attempt.size);
      if (meanLuma(temp) >= 25) {
        fs.copyFileSync(temp, output);
        return {
          output,
          meanLuma: meanLuma(output),
          attempt: attempt.start / duration,
          fallback: false,
        };
      }
    }
    if (options.fallbackText) {
      execFileSync("ffmpeg", [
        "-y",
        "-loglevel",
        "error",
        "-f",
        "lavfi",
        "-i",
        "color=c=0x24211c:s=1280x720:d=1",
        "-vf",
        "drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text=K-VERSATION:fontcolor=0xf2c27a:fontsize=28:x=96:y=80",
        "-frames:v",
        "1",
        "-q:v",
        "3",
        output,
      ]);
      return { output, meanLuma: meanLuma(output), attempt: null, fallback: true };
    }
    throw new Error(`No usable poster frame found for ${file}`);
  } finally {
    fs.rmSync(temp, { force: true });
  }
}

export async function publishVideo(input: PublishVideoInput) {
  const file = path.resolve(input.file);
  const slug = slugify(input.title);
  if (!slug) throw new Error(`Unable to create a slug from "${input.title}"`);
  const workDir = process.env.PUBLISH_WORK_DIR ?? path.join(os.tmpdir(), "kv-publish");
  await fs.promises.mkdir(workDir, { recursive: true });
  const videoOutput = path.join(workDir, `${slug}.mp4`);
  const thumbnail = input.thumbnail ?? path.join(workDir, `${slug}.jpg`);
  if (!input.thumbnail) {
    execFileSync("ffmpeg", [
      "-y",
      "-loglevel",
      "error",
      "-ss",
      "3",
      "-i",
      file,
      "-frames:v",
      "1",
      "-vf",
      "scale=1280:-2",
      "-q:v",
      "3",
      thumbnail,
    ]);
  }
  try {
    transcode(file, videoOutput);

    const admin = createAdminClient();
    const [videoUrl, thumbnailUrl] = await Promise.all([
      uploadMedia(`videos/videos/${slug}.mp4`, videoOutput, "video/mp4"),
      uploadMedia(`thumbnails/thumbnails/${slug}.jpg`, thumbnail, "image/jpeg"),
    ]);
    const { data: video, error } = await admin
      .from("videos")
      .upsert(
        {
          slug,
          section: input.section,
          title: input.title,
          subtitle: input.subtitle ?? null,
          description: input.description,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          duration_seconds: Math.round(durationOf(file)),
          published_at: `${input.publish}T00:00:00.000Z`,
          view_offset: 350 + Math.floor(Math.random() * 501),
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) throw error;

    const { data: existingOffsets, error: offsetsError } = await admin
      .from("reaction_offsets")
      .select("kind")
      .eq("video_id", video.id);
    if (offsetsError) throw offsetsError;

    const existingKinds = new Set(existingOffsets.map(({ kind }) => kind));
    const reactionRanges = [
      { kind: "thumbs_up", min: 25, max: 90 },
      { kind: "heart", min: 20, max: 75 },
      { kind: "fire", min: 12, max: 50 },
      { kind: "laugh", min: 4, max: 28 },
      { kind: "wow", min: 6, max: 32 },
    ] as const;
    const missingOffsets = reactionRanges
      .filter(({ kind }) => !existingKinds.has(kind))
      .map(({ kind, min, max }) => ({
        video_id: video.id,
        kind,
        offset_count: min + Math.floor(Math.random() * (max - min + 1)),
      }));
    if (missingOffsets.length) {
      const { error: insertOffsetsError } = await admin
        .from("reaction_offsets")
        .insert(missingOffsets);
      if (insertOffsetsError) throw insertOffsetsError;
    }

    return { slug, videoUrl, thumbnailUrl };
  } finally {
    await fs.promises.rm(videoOutput, { force: true });
    if (!input.thumbnail) await fs.promises.rm(thumbnail, { force: true });
  }
}
