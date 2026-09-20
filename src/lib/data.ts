import { hasSupabaseEnv as hasServerSupabaseEnv, createClient } from "@/lib/supabase/server";
import type {
  CountryMembers,
  SiteNumbers,
  Video,
  VideoSection,
  VideoStats,
} from "@/lib/supabase/types";

const clamp = (value: number) => Math.max(0, Number(value) || 0);
const fallbackStats: SiteNumbers = { impressions: 0, views: 0, members: 0, countries: 0 };

export function toLocalMedia(url: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!supabaseUrl || !url.startsWith(`${supabaseUrl}/storage/`)) return url;
  return url.slice(supabaseUrl.length);
}

function normalizeVideo(video: Video): Video {
  return {
    ...video,
    video_url: toLocalMedia(video.video_url),
    thumbnail_url: toLocalMedia(video.thumbnail_url),
  };
}

export async function listVideos(section?: VideoSection): Promise<Video[]> {
  if (!hasServerSupabaseEnv()) return [];
  const supabase = await createClient();
  let query = supabase
    .from("videos")
    .select("*")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  if (section) query = query.eq("section", section);
  const { data } = await query;
  const monthAgo = Date.now() - 30 * 86400000;
  return (data ?? []).map((video) => ({
    ...normalizeVideo(video as Video),
    view_offset: clamp(video.view_offset),
    comment_offset: clamp(video.comment_offset),
    is_new: new Date(video.published_at).getTime() >= monthAgo,
  })) as Video[];
}

export async function listPopular(section: VideoSection, limit: number): Promise<Video[]> {
  const videos = await listVideos(section);
  if (!videos.length || !hasServerSupabaseEnv()) return videos.slice(0, limit);
  const supabase = await createClient();
  const { data } = await supabase
    .from("video_display_stats")
    .select("video_id, views")
    .in(
      "video_id",
      videos.map((video) => video.id),
    );
  const views = new Map((data ?? []).map((row) => [row.video_id, Number(row.views) || 0]));
  return videos
    .slice()
    .sort(
      (a, b) =>
        (views.get(b.id) ?? 0) - (views.get(a.id) ?? 0) ||
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    )
    .slice(0, limit)
    .map(normalizeVideo);
}

export async function getLatest(section: VideoSection) {
  return (await listVideos(section))[0] ?? null;
}

export async function getVideoBySlugOrId(idOrSlug: string): Promise<Video | null> {
  if (!hasServerSupabaseEnv()) return null;
  const supabase = await createClient();
  const field = idOrSlug.includes("-") ? "slug" : "id";
  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq(field, idOrSlug)
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  return data
    ? ({
        ...normalizeVideo(data as Video),
        view_offset: clamp(data.view_offset),
        comment_offset: clamp(data.comment_offset),
        is_new: new Date(data.published_at).getTime() >= Date.now() - 30 * 86400000,
      } as Video)
    : null;
}

export async function getVideoStats(videoId: string): Promise<VideoStats> {
  if (!hasServerSupabaseEnv()) return { video_id: videoId, views: 0, comments: 0, reactions: {} };
  const supabase = await createClient();
  const { data } = await supabase
    .from("video_display_stats")
    .select("*")
    .eq("video_id", videoId)
    .maybeSingle();
  return data
    ? {
        video_id: videoId,
        views: clamp(data.views),
        comments: clamp(data.comments),
        reactions: Object.fromEntries(
          Object.entries(data.reactions ?? {}).map(([kind, count]) => [kind, clamp(Number(count))]),
        ),
      }
    : { video_id: videoId, views: 0, comments: 0, reactions: {} };
}

export async function getSiteNumbers(): Promise<SiteNumbers> {
  if (!hasServerSupabaseEnv()) return fallbackStats;
  const supabase = await createClient();
  const { data } = await supabase.rpc("site_numbers");
  const row = data?.[0];
  return row
    ? {
        impressions: clamp(row.impressions),
        views: clamp(row.views),
        members: clamp(row.members),
        countries: clamp(row.countries),
      }
    : fallbackStats;
}

export async function getMembersByCountry(): Promise<CountryMembers[]> {
  if (!hasServerSupabaseEnv()) return [];
  const supabase = await createClient();
  const { data } = await supabase.rpc("members_by_country");
  return (data ?? []).map((row) => ({ ...row, members: clamp(row.members) }));
}
