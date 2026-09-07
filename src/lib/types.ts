export type MediaKind = "conversation" | "dispatch";
export type MediaStatus = "draft" | "published" | "archived";
export type ReactionKind = "appreciate" | "insightful" | "inspired" | "curious";

export type MediaItem = {
  id: string;
  kind: MediaKind;
  slug: string;
  title: string;
  guest: string | null;
  description: string;
  excerpt: string;
  publishedAt: string | null;
  status: MediaStatus;
  posterUrl: string | null;
  muxPlaybackId: string | null;
  muxAssetId: string | null;
  durationSeconds: number | null;
  captionsUrl: string | null;
  verifiedViews: number;
  viewAdjustment: number;
  displayedViews: number;
  reactionCount: number;
  commentCount: number;
};

export type CountryCount = {
  countryCode: string;
  countryName: string;
  count: number;
};

export type PublicMetrics = {
  siteImpressions: number;
  totalVideoViews: number;
  totalMembers: number;
  countriesReached: number;
  countryCounts: CountryCount[];
};

export type Viewer = {
  id: string;
  name: string;
  username: string;
  email: string;
  countryCode: string;
  phone: string | null;
} | null;

export type Comment = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  viewerOwns: boolean;
};

export type HostOverview = PublicMetrics & {
  conversations: number;
  dispatches: number;
  comments: number;
  reactions: number;
  questions: number;
};
