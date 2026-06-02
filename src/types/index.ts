// Platform definitions
export type PlatformId =
  | 'tiktok'
  | 'youtube'
  | 'twitter'
  | 'meta'
  | 'threads'
  | 'reddit'
  | 'pinterest'
  | 'linkedin'
  | 'spotify'
  | 'soundcloud'
  | 'snapchat'
  | 'bluesky'
  | 'douyin'
  | 'capcut'
  | 'dailymotion'
  | 'kuaishou'
  | 'tumblr';

export interface Platform {
  id: PlatformId;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  patterns: RegExp[];
  endpoint: string;
  placeholder: string;
}

// Download types
export interface DownloadLink {
  url: string;
  quality?: string;
  format?: string;
  type?: string;
  extension?: string;
  text?: string;
  label?: string;
}

export interface MediaProfile {
  name?: string | null;
  handle?: string | null;
  profileImg?: string | null;
  author?: string | null;
}

// Generic download result
export interface DownloadResult {
  title?: string | null;
  thumbnail?: string | null;
  duration?: string | number | null;
  caption?: string | null;
  timestamp?: string | null;
  profile?: MediaProfile | null;
  downloads?: DownloadLink[];
  downloadLinks?: DownloadLink[];
  formats?: DownloadLink[];
  videoLinks?: DownloadLink[];
  videoUrl?: string | null;
  downloadLink?: string | null;
  download?: string | null;
  quality?: string | null;
  // For specific platforms
  status?: string;
  author?: string;
}

// API Response types
export interface ApiResponse<T = DownloadResult> {
  success: boolean;
  data?: T;
  error?: string;
}

// TikTok specific
export interface TikTokDownload {
  text: string;
  url: string;
  type?: 'video' | 'image' | 'audio';
  quality?: string;
  format?: string;
  label?: string;
}

export interface TikTokSlide {
  url: string;
  thumbnail?: string;
  description?: string;
}

export interface TikTokResult {
  status: string;
  title: string | null;
  thumbnail: string | null;
  downloads: TikTokDownload[];
  slides?: TikTokSlide[];
  music?: { url: string; label?: string };
  hasMusic?: boolean;
  isSlideshow?: boolean;
}

// YouTube specific
export interface YouTubeFormat {
  type: string;
  quality: string;
  extension: string;
  url: string;
}

export interface YouTubeResult {
  title: string;
  thumbnail: string;
  duration: string | number;
  formats: YouTubeFormat[];
}

// Twitter specific
export interface TwitterResult {
  quality: string;
  type: string;
  url: string;
}

// Spotify specific
export interface SpotifyResult {
  title: string;
  author: string;
  duration: string | number;
  thumbnail: string | null;
  downloadLinks: DownloadLink[];
}

// Pinterest specific
export interface PinterestResult {
  title: string;
  thumbnail: string;
  downloads: DownloadLink[];
}

// Bluesky specific
export interface BlueskyResult {
  profile: MediaProfile;
  caption: string | null;
  videoUrl: string | null;
  thumbnail: string | null;
  downloadLink: string | null;
}

// Threads specific
export interface ThreadsResult {
  download: string;
  thumbnail: string;
  quality: string;
}

// Reddit specific
export interface RedditResult {
  title?: string;
  url?: string;
  thumbnail?: string;
  duration?: number;
  audio_url?: string;
  video_url?: string;
}

// Douyin specific
export interface DouyinResult {
  thumbnail: string | null;
  title: string | null;
  timestamp: string | null;
  videoLinks: { label: string; url: string }[];
}

// Dailymotion specific
export interface DailymotionResult {
  success: boolean;
  title: string;
  thumbnail: string;
  downloads: DownloadLink[];
}

// UI State types
export interface DownloadState {
  isLoading: boolean;
  error: string | null;
  result: DownloadResult | null;
  detectedPlatform: Platform | null;
}

export interface ToastType {
  id: string;
  type: 'success' | 'error' | 'info' | 'loading';
  message: string;
}

// Normalized download item for display
export interface NormalizedDownload {
  url: string;
  label: string;
  quality?: string;
  format?: string;
  type?: 'video' | 'audio' | 'image' | 'unknown';
  isAudio?: boolean;
}

export interface NormalizedResult {
  title: string;
  thumbnail: string | null;
  duration?: string | number | null;
  author?: string | null;
  caption?: string | null;
  profile?: MediaProfile | null;
  downloads: NormalizedDownload[];
  platform: Platform;
  originalData: DownloadResult;
  isSlideshow?: boolean;
}
