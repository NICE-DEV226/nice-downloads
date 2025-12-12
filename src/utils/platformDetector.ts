export type Platform =
  | 'tiktok'
  | 'youtube'
  | 'twitter'
  | 'meta'
  | 'spotify'
  | 'reddit'
  | 'pinterest'
  | 'linkedin'
  | 'threads'
  | 'soundcloud'
  | 'snapchat'
  | 'bluesky'
  | 'douyin'
  | 'capcut'
  | 'dailymotion'
  | 'kuaishou'
  | 'tumblr'
  | null;

export interface PlatformInfo {
  id: Platform;
  name: string;
  color: string;
  gradient: string;
  icon: string;
  patterns: RegExp[];
  endpoint: string;
  placeholder: string;
}

export const PLATFORMS: Record<Exclude<Platform, null>, PlatformInfo> = {
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    color: '#00f2ea',
    gradient: 'from-[#00f2ea] to-[#ff0050]',
    icon: '🎵',
    patterns: [
      /tiktok\.com/i,
      /vm\.tiktok\.com/i,
      /vt\.tiktok\.com/i,
    ],
    endpoint: '/api/tiktok/download',
    placeholder: 'https://www.tiktok.com/@user/video/...',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    color: '#ff0000',
    gradient: 'from-red-500 to-red-700',
    icon: '▶️',
    patterns: [
      /youtube\.com\/watch/i,
      /youtube\.com\/shorts/i,
      /youtu\.be/i,
      /youtube\.com\/embed/i,
      /youtube\.com\/v\//i,
      /music\.youtube\.com/i,
    ],
    endpoint: '/api/youtube/download',
    placeholder: 'https://www.youtube.com/watch?v=...',
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter / X',
    color: '#1da1f2',
    gradient: 'from-gray-800 to-black',
    icon: '𝕏',
    patterns: [
      /twitter\.com/i,
      /x\.com/i,
      /t\.co/i,
    ],
    endpoint: '/api/twitter/download',
    placeholder: 'https://twitter.com/user/status/...',
  },
  meta: {
    id: 'meta',
    name: 'Instagram / Facebook',
    color: '#e4405f',
    gradient: 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
    icon: '📸',
    patterns: [
      /instagram\.com/i,
      /instagr\.am/i,
      /facebook\.com/i,
      /fb\.watch/i,
      /fb\.com/i,
      /m\.facebook\.com/i,
    ],
    endpoint: '/api/meta/download',
    placeholder: 'https://www.instagram.com/p/...',
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    color: '#1db954',
    gradient: 'from-green-500 to-green-700',
    icon: '🎧',
    patterns: [
      /open\.spotify\.com/i,
      /spotify\.com/i,
    ],
    endpoint: '/api/spotify/download',
    placeholder: 'https://open.spotify.com/track/...',
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    color: '#ff4500',
    gradient: 'from-orange-500 to-orange-700',
    icon: '🤖',
    patterns: [
      /reddit\.com/i,
      /redd\.it/i,
      /v\.redd\.it/i,
    ],
    endpoint: '/api/reddit/download',
    placeholder: 'https://www.reddit.com/r/.../comments/...',
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    color: '#e60023',
    gradient: 'from-red-600 to-red-800',
    icon: '📌',
    patterns: [
      /pinterest\.com/i,
      /pin\.it/i,
    ],
    endpoint: '/api/pinterest/download',
    placeholder: 'https://www.pinterest.com/pin/...',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0077b5',
    gradient: 'from-blue-600 to-blue-800',
    icon: '💼',
    patterns: [
      /linkedin\.com/i,
      /lnkd\.in/i,
    ],
    endpoint: '/api/linkedin/download',
    placeholder: 'https://www.linkedin.com/posts/...',
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    color: '#000000',
    gradient: 'from-gray-900 to-black',
    icon: '🧵',
    patterns: [
      /threads\.net/i,
    ],
    endpoint: '/api/threads/download',
    placeholder: 'https://www.threads.net/@user/post/...',
  },
  soundcloud: {
    id: 'soundcloud',
    name: 'SoundCloud',
    color: '#ff5500',
    gradient: 'from-orange-500 to-orange-600',
    icon: '☁️',
    patterns: [
      /soundcloud\.com/i,
      /snd\.sc/i,
    ],
    endpoint: '/api/soundcloud/download',
    placeholder: 'https://soundcloud.com/artist/track',
  },
  snapchat: {
    id: 'snapchat',
    name: 'Snapchat',
    color: '#fffc00',
    gradient: 'from-yellow-400 to-yellow-500',
    icon: '👻',
    patterns: [
      /snapchat\.com/i,
      /snap\.com/i,
      /story\.snapchat\.com/i,
    ],
    endpoint: '/api/snapchat/download',
    placeholder: 'https://www.snapchat.com/...',
  },
  bluesky: {
    id: 'bluesky',
    name: 'Bluesky',
    color: '#0085ff',
    gradient: 'from-blue-400 to-blue-600',
    icon: '🦋',
    patterns: [
      /bsky\.app/i,
      /bsky\.social/i,
      /bluesky\.social/i,
    ],
    endpoint: '/api/bluesky/download',
    placeholder: 'https://bsky.app/profile/.../post/...',
  },
  douyin: {
    id: 'douyin',
    name: 'Douyin',
    color: '#161823',
    gradient: 'from-[#00f2ea] to-[#ff0050]',
    icon: '🎬',
    patterns: [
      /douyin\.com/i,
      /iesdouyin\.com/i,
    ],
    endpoint: '/api/douyin/download',
    placeholder: 'https://www.douyin.com/video/...',
  },
  capcut: {
    id: 'capcut',
    name: 'CapCut',
    color: '#000000',
    gradient: 'from-black to-gray-800',
    icon: '✂️',
    patterns: [
      /capcut\.com/i,
    ],
    endpoint: '/api/capcut/download',
    placeholder: 'https://www.capcut.com/...',
  },
  dailymotion: {
    id: 'dailymotion',
    name: 'Dailymotion',
    color: '#00aaff',
    gradient: 'from-blue-400 to-blue-600',
    icon: '📺',
    patterns: [
      /dailymotion\.com/i,
      /dai\.ly/i,
    ],
    endpoint: '/api/dailymotion/download',
    placeholder: 'https://www.dailymotion.com/video/...',
  },
  kuaishou: {
    id: 'kuaishou',
    name: 'Kuaishou',
    color: '#ff6600',
    gradient: 'from-orange-500 to-orange-700',
    icon: '🎥',
    patterns: [
      /kuaishou\.com/i,
      /gifshow\.com/i,
      /v\.kuaishou\.com/i,
    ],
    endpoint: '/api/kuaishou/download',
    placeholder: 'https://www.kuaishou.com/...',
  },
  tumblr: {
    id: 'tumblr',
    name: 'Tumblr',
    color: '#36465d',
    gradient: 'from-[#36465d] to-[#2c3e50]',
    icon: '📝',
    patterns: [
      /tumblr\.com/i,
      /\.tumblr\.com/i,
      /tmblr\.co/i,
    ],
    endpoint: '/api/tumblr/download',
    placeholder: 'https://username.tumblr.com/post/...',
  },
};

/**
 * Detect platform from URL
 */
export function detectPlatform(url: string): Platform {
  if (!url || typeof url !== 'string') return null;

  const trimmedUrl = url.trim().toLowerCase();

  // Check if it looks like a URL
  if (!trimmedUrl.includes('.') && !trimmedUrl.startsWith('http')) {
    return null;
  }

  for (const [platformId, platformInfo] of Object.entries(PLATFORMS)) {
    for (const pattern of platformInfo.patterns) {
      if (pattern.test(trimmedUrl)) {
        return platformId as Platform;
      }
    }
  }

  return null;
}

/**
 * Get platform info by ID
 */
export function getPlatformInfo(platform: Platform): PlatformInfo | null {
  if (!platform) return null;
  return PLATFORMS[platform] || null;
}

/**
 * Get all platforms as an array
 */
export function getAllPlatforms(): PlatformInfo[] {
  return Object.values(PLATFORMS);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;

  try {
    // Try to construct a URL - if it fails, it's not valid
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Normalize URL (ensure it has a protocol)
 */
export function normalizeUrl(url: string): string {
  if (!url) return '';

  const trimmed = url.trim();

  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

/**
 * Get platform color for styling
 */
export function getPlatformColor(platform: Platform): string {
  if (!platform) return '#64748b'; // Default gray
  return PLATFORMS[platform]?.color || '#64748b';
}

/**
 * Get platform gradient for styling
 */
export function getPlatformGradient(platform: Platform): string {
  if (!platform) return 'from-gray-500 to-gray-700';
  return PLATFORMS[platform]?.gradient || 'from-gray-500 to-gray-700';
}
