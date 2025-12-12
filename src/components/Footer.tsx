import { Download, Github, Heart, ExternalLink } from 'lucide-react';
import {
  FaTiktok,
  FaYoutube,
  FaInstagram,
  FaSpotify,
  FaPinterest,
  FaLinkedin,
  FaRedditAlien,
  FaSoundcloud,
  FaFacebook,
  FaSnapchatGhost,
  FaTumblr,
} from 'react-icons/fa';
import { FaXTwitter, FaThreads, FaBluesky } from 'react-icons/fa6';
import { SiDailymotion } from 'react-icons/si';

const PLATFORM_ICONS = [
  { icon: FaTiktok, color: '#ff0050', name: 'TikTok' },
  { icon: FaYoutube, color: '#ff0000', name: 'YouTube' },
  { icon: FaInstagram, color: '#e4405f', name: 'Instagram' },
  { icon: FaXTwitter, color: '#ffffff', name: 'X' },
  { icon: FaSpotify, color: '#1db954', name: 'Spotify' },
  { icon: FaRedditAlien, color: '#ff4500', name: 'Reddit' },
  { icon: FaPinterest, color: '#bd081c', name: 'Pinterest' },
  { icon: FaLinkedin, color: '#0a66c2', name: 'LinkedIn' },
  { icon: FaSoundcloud, color: '#ff5500', name: 'SoundCloud' },
  { icon: FaFacebook, color: '#1877f2', name: 'Facebook' },
  { icon: FaSnapchatGhost, color: '#fffc00', name: 'Snapchat' },
  { icon: FaThreads, color: '#ffffff', name: 'Threads' },
  { icon: FaTumblr, color: '#35465c', name: 'Tumblr' },
  { icon: FaBluesky, color: '#0085ff', name: 'Bluesky' },
  { icon: SiDailymotion, color: '#00aaff', name: 'Dailymotion' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-800/50">
      <div className="container mx-auto px-4 py-12">
        {/* Platforms section */}
        <div className="mb-10">
          <h3 className="text-sm font-medium text-zinc-400 text-center mb-6">
            Supported Platforms
          </h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-2xl mx-auto">
            {PLATFORM_ICONS.map(({ icon: Icon, color, name }) => (
              <div
                key={name}
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:border-zinc-700 transition-colors cursor-default"
                title={name}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            ))}
            <div className="w-9 h-9 rounded-lg bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center text-zinc-600 text-xs font-medium">
              +3
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-800/50 mb-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-semibold text-white">
                NICE<span className="text-blue-500">Downs</span>
              </span>
              <p className="text-xs text-zinc-600">All Media Downloader</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/NICE-DEV226"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Credits */}
          <p className="text-zinc-500 text-xs sm:text-sm flex flex-wrap items-center justify-center gap-1.5">
            <span>© {currentYear}</span>
            <span className="text-zinc-700">•</span>
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>by</span>
            <a
              href="https://nice-dev226.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              NICE-DEV
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
