import {
  FaTiktok,
  FaYoutube,
  FaInstagram,
  FaSpotify,
  FaPinterest,
  FaLinkedin,
  FaRedditAlien,
  FaSoundcloud,
  FaSnapchatGhost,
  FaTumblr,
} from 'react-icons/fa';
import { FaXTwitter, FaThreads, FaBluesky } from 'react-icons/fa6';
import { SiDailymotion } from 'react-icons/si';
import { BiVideoRecording } from 'react-icons/bi';

// Platform IDs must match backend endpoints
export type PlatformId =
  | 'tiktok'
  | 'youtube'
  | 'meta' // Instagram + Facebook
  | 'twitter'
  | 'spotify'
  | 'pinterest'
  | 'linkedin'
  | 'reddit'
  | 'soundcloud'
  | 'snapchat'
  | 'threads'
  | 'tumblr'
  | 'bluesky'
  | 'dailymotion'
  | 'capcut'
  | 'douyin'
  | 'kuaishou';

interface PlatformConfig {
  id: PlatformId;
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bgColor: string;
  patterns: RegExp[];
}

export const PLATFORMS: Record<PlatformId, PlatformConfig> = {
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    icon: FaTiktok,
    color: '#ff0050',
    bgColor: 'bg-[#ff0050]/10',
    patterns: [/tiktok\.com/i, /vm\.tiktok\.com/i, /vt\.tiktok\.com/i],
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    icon: FaYoutube,
    color: '#ff0000',
    bgColor: 'bg-red-500/10',
    patterns: [/youtube\.com/i, /youtu\.be/i],
  },
  meta: {
    id: 'meta',
    name: 'Instagram / Facebook',
    icon: FaInstagram,
    color: '#e4405f',
    bgColor: 'bg-pink-500/10',
    patterns: [/instagram\.com/i, /instagr\.am/i, /facebook\.com/i, /fb\.watch/i, /fb\.com/i],
  },
  twitter: {
    id: 'twitter',
    name: 'X / Twitter',
    icon: FaXTwitter,
    color: '#ffffff',
    bgColor: 'bg-zinc-700/50',
    patterns: [], // Temporarily disabled - external services blocked
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    icon: FaSpotify,
    color: '#1db954',
    bgColor: 'bg-green-500/10',
    patterns: [], // Temporarily disabled
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    icon: FaPinterest,
    color: '#bd081c',
    bgColor: 'bg-red-600/10',
    patterns: [/pinterest\.com/i, /pin\.it/i],
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: FaLinkedin,
    color: '#0a66c2',
    bgColor: 'bg-blue-600/10',
    patterns: [/linkedin\.com/i],
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    icon: FaRedditAlien,
    color: '#ff4500',
    bgColor: 'bg-orange-500/10',
    patterns: [/reddit\.com/i, /redd\.it/i],
  },
  soundcloud: {
    id: 'soundcloud',
    name: 'SoundCloud',
    icon: FaSoundcloud,
    color: '#ff5500',
    bgColor: 'bg-orange-500/10',
    patterns: [/soundcloud\.com/i],
  },
  snapchat: {
    id: 'snapchat',
    name: 'Snapchat',
    icon: FaSnapchatGhost,
    color: '#fffc00',
    bgColor: 'bg-yellow-400/10',
    patterns: [/snapchat\.com/i, /story\.snapchat\.com/i],
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    icon: FaThreads,
    color: '#ffffff',
    bgColor: 'bg-zinc-700/50',
    patterns: [/threads\.net/i],
  },
  tumblr: {
    id: 'tumblr',
    name: 'Tumblr',
    icon: FaTumblr,
    color: '#35465c',
    bgColor: 'bg-slate-600/10',
    patterns: [/tumblr\.com/i],
  },
  bluesky: {
    id: 'bluesky',
    name: 'Bluesky',
    icon: FaBluesky,
    color: '#0085ff',
    bgColor: 'bg-sky-500/10',
    patterns: [/bsky\.app/i, /bluesky\.social/i],
  },
  dailymotion: {
    id: 'dailymotion',
    name: 'Dailymotion',
    icon: SiDailymotion,
    color: '#00aaff',
    bgColor: 'bg-cyan-500/10',
    patterns: [/dailymotion\.com/i, /dai\.ly/i],
  },
  capcut: {
    id: 'capcut',
    name: 'CapCut',
    icon: BiVideoRecording,
    color: '#00f0ff',
    bgColor: 'bg-cyan-400/10',
    patterns: [/capcut\.com/i],
  },
  douyin: {
    id: 'douyin',
    name: 'Douyin',
    icon: FaTiktok,
    color: '#ff0050',
    bgColor: 'bg-pink-500/10',
    patterns: [/douyin\.com/i, /iesdouyin\.com/i],
  },
  kuaishou: {
    id: 'kuaishou',
    name: 'Kuaishou',
    icon: BiVideoRecording,
    color: '#ff6600',
    bgColor: 'bg-orange-500/10',
    patterns: [/kuaishou\.com/i, /gifshow\.com/i],
  },
};

export function detectPlatform(url: string): PlatformId | null {
  const normalizedUrl = url.toLowerCase();
  for (const [id, platform] of Object.entries(PLATFORMS)) {
    if (platform.patterns.some((pattern) => pattern.test(normalizedUrl))) {
      return id as PlatformId;
    }
  }
  return null;
}

// Get specific platform name based on URL (for meta which handles both Instagram and Facebook)
export function getPlatformDisplayName(platformId: PlatformId | null, url?: string): string {
  if (!platformId) return 'Unknown';
  
  if (platformId === 'meta' && url) {
    const lowerUrl = url.toLowerCase();
    if (/facebook\.com|fb\.watch|fb\.com/.test(lowerUrl)) {
      return 'Facebook';
    }
    return 'Instagram';
  }
  
  return PLATFORMS[platformId]?.name || 'Unknown';
}

interface PlatformIconProps {
  platform: PlatformId;
  size?: 'sm' | 'md' | 'lg';
  showBg?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const containerSizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function PlatformIcon({ platform, size = 'md', showBg = false, className = '' }: PlatformIconProps) {
  const config = PLATFORMS[platform];
  if (!config) return null;

  const Icon = config.icon;

  if (showBg) {
    return (
      <div className={`${containerSizeMap[size]} ${config.bgColor} rounded-xl flex items-center justify-center ${className}`}>
        <Icon className={sizeMap[size]} style={{ color: config.color }} />
      </div>
    );
  }

  return <Icon className={`${sizeMap[size]} ${className}`} style={{ color: config.color }} />;
}

export default PlatformIcon;
