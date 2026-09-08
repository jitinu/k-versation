export type VideoSection = "conversation" | "monologue";
export type ReactionKind = "thumbs_up" | "heart" | "laugh" | "wow" | "fire";

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  country_code: string;
  country_name: string;
  phone: string | null;
  created_at: string;
};

export type Video = {
  id: string;
  slug: string;
  section: VideoSection;
  title: string;
  subtitle: string | null;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration_seconds: number;
  published_at: string;
  view_count: number;
  view_offset: number;
  comment_offset: number;
  created_at: string;
  is_new?: boolean;
};

export type Comment = {
  id: string;
  video_id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles?: Pick<Profile, "username" | "display_name"> | null;
};

export type Reaction = {
  video_id: string;
  user_id: string;
  kind: ReactionKind;
  created_at: string;
};

export type VideoStats = {
  video_id: string;
  views: number;
  comments: number;
  reactions: Partial<Record<ReactionKind, number>>;
};

export type SiteNumbers = {
  impressions: number;
  views: number;
  members: number;
  countries: number;
};

export type CountryMembers = {
  country_code: string;
  country_name: string;
  members: number;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at">;
        Update: Partial<Profile>;
        Relationships: [];
      };
      videos: { Row: Video; Insert: Partial<Video>; Update: Partial<Video>; Relationships: [] };
      reactions: {
        Row: Reaction;
        Insert: Omit<Reaction, "created_at">;
        Update: Partial<Reaction>;
        Relationships: [];
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, "id" | "created_at">;
        Update: Partial<Comment>;
        Relationships: [];
      };
      subscriptions: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string };
        Update: never;
        Relationships: [];
      };
      site_stats: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      reaction_offsets: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
    };
    Views: { video_display_stats: { Row: VideoStats; Relationships: [] } };
    Functions: {
      record_impression: { Args: Record<string, never>; Returns: undefined };
      record_view: { Args: { p_video_id: string }; Returns: undefined };
      username_available: { Args: { p_username: string }; Returns: boolean };
      email_for_username: { Args: { p_username: string }; Returns: string | null };
      site_numbers: { Args: Record<string, never>; Returns: SiteNumbers[] };
      members_by_country: { Args: Record<string, never>; Returns: CountryMembers[] };
    };
  };
};
