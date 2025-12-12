import axios, { AxiosError } from "axios";

// Type definitions
export type Platform =
  | "tiktok"
  | "youtube"
  | "instagram"
  | "facebook"
  | "twitter"
  | "threads"
  | "reddit"
  | "pinterest"
  | "linkedin"
  | "spotify"
  | "soundcloud"
  | "snapchat"
  | "bluesky"
  | "douyin"
  | "capcut"
  | "dailymotion"
  | "kuaishou"
  | "tumblr";

export interface DownloadResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "/api",
  timeout: 60000, // 60 seconds timeout for large downloads
  headers: {
    "Content-Type": "application/json",
  },
});

// Platform to endpoint mapping
const platformEndpoints: Record<Platform, string> = {
  tiktok: "/tiktok/download",
  youtube: "/youtube/download",
  instagram: "/meta/download",
  facebook: "/meta/download",
  twitter: "/twitter/download",
  threads: "/threads/download",
  reddit: "/reddit/download",
  pinterest: "/pinterest/download",
  linkedin: "/linkedin/download",
  spotify: "/spotify/download",
  soundcloud: "/soundcloud/download",
  snapchat: "/snapchat/download",
  bluesky: "/bluesky/download",
  douyin: "/douyin/download",
  capcut: "/capcut/download",
  dailymotion: "/dailymotion/download",
  kuaishou: "/kuaishou/download",
  tumblr: "/tumblr/download",
};

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.error ||
        "An error occurred while processing your request";
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error(
        "Unable to reach the server. Please check your connection.",
      );
    } else {
      // Error in request configuration
      throw new Error("Failed to make request. Please try again.");
    }
  },
);

/**
 * Download media from a specific platform
 */
export async function downloadMedia(
  platform: Platform,
  url: string,
): Promise<DownloadResponse> {
  const endpoint = platformEndpoints[platform];

  if (!endpoint) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const response = await api.get<DownloadResponse>(endpoint, {
    params: { url },
  });

  return response.data;
}

/**
 * Get API health status
 */
export async function getApiStatus(): Promise<{
  success: boolean;
  message: string;
  endpoints: string[];
}> {
  const response = await api.get("/");
  return response.data;
}

/**
 * Download media with automatic platform detection
 */
export async function downloadWithAutoDetect(url: string): Promise<{
  platform: Platform;
  data: DownloadResponse;
}> {
  const platform = detectPlatformFromUrl(url);

  if (!platform) {
    throw new Error(
      "Could not detect platform from URL. Please select a platform manually.",
    );
  }

  const data = await downloadMedia(platform, url);

  return { platform, data };
}

/**
 * Detect platform from URL
 */
export function detectPlatformFromUrl(url: string): Platform | null {
  const urlLower = url.toLowerCase();

  const platformPatterns: { platform: Platform; patterns: RegExp[] }[] = [
    {
      platform: "tiktok",
      patterns: [/tiktok\.com/, /vm\.tiktok\.com/, /vt\.tiktok\.com/],
    },
    {
      platform: "youtube",
      patterns: [
        /youtube\.com/,
        /youtu\.be/,
        /youtube-nocookie\.com/,
        /music\.youtube\.com/,
      ],
    },
    {
      platform: "instagram",
      patterns: [/instagram\.com/, /instagr\.am/],
    },
    {
      platform: "facebook",
      patterns: [/facebook\.com/, /fb\.watch/, /fb\.com/, /m\.facebook\.com/],
    },
    {
      platform: "twitter",
      patterns: [/twitter\.com/, /x\.com/, /t\.co/],
    },
    {
      platform: "threads",
      patterns: [/threads\.net/],
    },
    {
      platform: "reddit",
      patterns: [/reddit\.com/, /redd\.it/, /v\.redd\.it/],
    },
    {
      platform: "pinterest",
      patterns: [/pinterest\.com/, /pin\.it/],
    },
    {
      platform: "linkedin",
      patterns: [/linkedin\.com/, /lnkd\.in/],
    },
    {
      platform: "spotify",
      patterns: [/open\.spotify\.com/, /spotify\.com/],
    },
    {
      platform: "soundcloud",
      patterns: [/soundcloud\.com/, /snd\.sc/],
    },
    {
      platform: "snapchat",
      patterns: [/snapchat\.com/, /snap\.com/, /story\.snapchat\.com/],
    },
    {
      platform: "bluesky",
      patterns: [/bsky\.app/, /bsky\.social/, /bluesky\.social/],
    },
    {
      platform: "douyin",
      patterns: [/douyin\.com/, /iesdouyin\.com/],
    },
    {
      platform: "capcut",
      patterns: [/capcut\.com/],
    },
    {
      platform: "dailymotion",
      patterns: [/dailymotion\.com/, /dai\.ly/],
    },
    {
      platform: "kuaishou",
      patterns: [/kuaishou\.com/, /kwai\.com/, /gifshow\.com/],
    },
    {
      platform: "tumblr",
      patterns: [/tumblr\.com/, /tmblr\.co/],
    },
  ];

  for (const { platform, patterns } of platformPatterns) {
    for (const pattern of patterns) {
      if (pattern.test(urlLower)) {
        return platform;
      }
    }
  }

  return null;
}

export default api;
