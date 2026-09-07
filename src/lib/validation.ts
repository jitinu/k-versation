import { z } from "zod";

const usernamePattern = /^[a-zA-Z0-9_]{3,24}$/;
const reservedUsernames = new Set([
  "admin",
  "administrator",
  "daniel",
  "host",
  "kversation",
  "k-versation",
  "moderator",
  "root",
  "staff",
  "support",
]);

export const usernameSchema = z
  .string()
  .trim()
  .regex(
    usernamePattern,
    "Use 3–24 letters, numbers, or underscores.",
  )
  .refine(
    (value) => !reservedUsernames.has(value.toLowerCase()),
    "That username is reserved.",
  );

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  countryCode: z.string().length(2),
  username: usernameSchema,
  phone: z.string().trim().max(30).optional(),
  password: z
    .string()
    .min(10, "Use at least 10 characters.")
    .max(128)
    .regex(/[a-z]/, "Add a lowercase letter.")
    .regex(/[A-Z]/, "Add an uppercase letter.")
    .regex(/[0-9]/, "Add a number."),
});

export const questionSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  subject: z.string().trim().max(100).optional(),
  question: z.string().trim().min(15).max(4000),
  website: z.string().max(0).optional(),
});

export const commentSchema = z.object({
  mediaId: z.uuid(),
  body: z.string().trim().min(2).max(2000),
});

export const commentUpdateSchema = z.object({
  body: z.string().trim().min(2).max(2000),
});

export const reactionSchema = z.object({
  mediaId: z.uuid(),
  reaction: z.enum(["appreciate", "insightful", "inspired", "curious"]),
});

export const impressionSchema = z.object({
  eventId: z.uuid(),
  path: z.string().startsWith("/").max(300),
  referrer: z.string().max(500).optional(),
});

export const videoEventSchema = z.object({
  eventId: z.uuid(),
  mediaId: z.uuid(),
  playbackSessionId: z.uuid(),
  type: z.enum(["page", "start", "view", "progress", "complete"]),
  progress: z.union([
    z.literal(25),
    z.literal(50),
    z.literal(75),
    z.literal(100),
  ]).optional(),
});

export const mediaSchema = z.object({
  id: z.uuid().optional(),
  kind: z.enum(["conversation", "dispatch"]),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(3).max(180),
  guest: z.string().trim().max(120).nullable().optional(),
  excerpt: z.string().trim().min(20).max(320),
  description: z.string().trim().min(40).max(20_000),
  publishedAt: z.iso.datetime().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]),
  posterUrl: z.url().nullable().optional(),
  muxPlaybackId: z.string().trim().max(200).nullable().optional(),
  muxAssetId: z.string().trim().max(200).nullable().optional(),
  durationSeconds: z.number().int().nonnegative().nullable().optional(),
  captionsUrl: z.url().nullable().optional(),
}).refine(
  (value) => value.status !== "published" || Boolean(value.publishedAt),
  { message: "Published content requires a publication date.", path: ["publishedAt"] },
);

export const metricAdjustmentSchema = z.object({
  metric: z.enum([
    "site_impressions",
    "video_views",
    "reactions",
    "comments",
    "members",
    "countries_reached",
  ]),
  targetId: z.uuid().nullable().optional(),
  adjustment: z.number().int().min(-1_000_000_000).max(1_000_000_000),
  note: z.string().trim().max(500).optional(),
});
