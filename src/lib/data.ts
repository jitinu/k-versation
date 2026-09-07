import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  CountryCount,
  HostOverview,
  MediaItem,
  MediaKind,
  PublicMetrics,
  Viewer,
} from "@/lib/types";

type MediaRow = {
  id: string;
  kind: MediaKind;
  slug: string;
  title: string;
  guest: string | null;
  description: string;
  excerpt: string;
  published_at: string | null;
  status: "draft" | "published" | "archived";
  poster_url: string | null;
  mux_playback_id: string | null;
  mux_asset_id: string | null;
  duration_seconds: number | null;
  captions_url: string | null;
  verified_views: number | null;
  view_adjustment: number | null;
  displayed_views: number | null;
  reaction_count: number | null;
  comment_count: number | null;
};

function mapMedia(row: MediaRow): MediaItem {
  return {
    id: row.id,
    kind: row.kind,
    slug: row.slug,
    title: row.title,
    guest: row.guest,
    description: row.description,
    excerpt: row.excerpt,
    publishedAt: row.published_at,
    status: row.status,
    posterUrl: row.poster_url,
    muxPlaybackId: row.mux_playback_id,
    muxAssetId: row.mux_asset_id,
    durationSeconds: row.duration_seconds,
    captionsUrl: row.captions_url,
    verifiedViews: row.verified_views ?? 0,
    viewAdjustment: row.view_adjustment ?? 0,
    displayedViews: row.displayed_views ?? 0,
    reactionCount: row.reaction_count ?? 0,
    commentCount: row.comment_count ?? 0,
  };
}

function publicClient() {
  if (!hasSupabasePublicEnv()) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}

export const getPublishedMedia = cache(async (kind: MediaKind) => {
  const client = publicClient();
  if (!client) return [] as MediaItem[];
  const { data, error } = await client
    .from("public_media")
    .select("*")
    .eq("kind", kind)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data as MediaRow[]).map(mapMedia);
});

export const getLatestMedia = cache(async (kind: MediaKind) => {
  const items = await getPublishedMedia(kind);
  return items[0] ?? null;
});

export const getMediaBySlug = cache(
  async (kind: MediaKind, slug: string) => {
    const client = publicClient();
    if (!client) return null;
    const { data, error } = await client
      .from("public_media")
      .select("*")
      .eq("kind", kind)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw error;
    return data ? mapMedia(data as MediaRow) : null;
  },
);

export const getPublicMetrics = cache(async (): Promise<PublicMetrics> => {
  const client = publicClient();
  const empty: PublicMetrics = {
    siteImpressions: 0,
    totalVideoViews: 0,
    totalMembers: 0,
    countriesReached: 0,
    countryCounts: [],
  };
  if (!client) return empty;

  const [metricsResult, countriesResult] = await Promise.all([
    client.from("public_metrics").select("*").single(),
    client
      .from("public_country_counts")
      .select("*")
      .order("member_count", { ascending: false }),
  ]);

  if (metricsResult.error) throw metricsResult.error;
  if (countriesResult.error) throw countriesResult.error;

  const metric = metricsResult.data as {
    site_impressions: number | null;
    total_video_views: number | null;
    total_members: number | null;
    countries_reached: number | null;
  };
  const countryCounts = (countriesResult.data as Array<{
    country_code: string;
    country_name: string;
    member_count: number;
  }>).map(
    (country): CountryCount => ({
      countryCode: country.country_code,
      countryName: country.country_name,
      count: country.member_count,
    }),
  );

  return {
    siteImpressions: metric.site_impressions ?? 0,
    totalVideoViews: metric.total_video_views ?? 0,
    totalMembers: metric.total_members ?? 0,
    countriesReached: metric.countries_reached ?? 0,
    countryCounts,
  };
});

export async function getViewer(): Promise<Viewer> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, username, email, country_code, phone")
    .eq("id", userId)
    .maybeSingle();
  if (!profile) return null;
  return {
    id: profile.id,
    name: profile.name,
    username: profile.username,
    email: profile.email,
    countryCode: profile.country_code,
    phone: profile.phone,
  };
}

export async function getHostOverview(): Promise<HostOverview> {
  const admin = createAdminSupabaseClient();
  const metrics = await getPublicMetrics();
  const empty = {
    ...metrics,
    conversations: 0,
    dispatches: 0,
    comments: 0,
    reactions: 0,
    questions: 0,
  };
  if (!admin) return empty;
  const { data, error } = await admin.from("host_overview").select("*").single();
  if (error) throw error;
  return {
    ...metrics,
    conversations: data.conversations ?? 0,
    dispatches: data.dispatches ?? 0,
    comments: data.comments ?? 0,
    reactions: data.reactions ?? 0,
    questions: data.questions ?? 0,
  };
}

export async function getHostMedia() {
  const admin = createAdminSupabaseClient();
  if (!admin) return [] as MediaItem[];
  const { data, error } = await admin
    .from("host_media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as MediaRow[]).map(mapMedia);
}
