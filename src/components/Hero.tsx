import { motion } from 'framer-motion';
import { PLATFORMS, PlatformId } from './PlatformIcon';
import {
  FaTiktok,
  FaYoutube,
  FaInstagram,
  FaPinterest,
  FaRedditAlien,
  FaLinkedin,
} from 'react-icons/fa';

const FEATURED_PLATFORMS: {
  id: PlatformId;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}[] = [
  { id: 'tiktok', icon: FaTiktok, color: '#ff0050' },
  { id: 'youtube', icon: FaYoutube, color: '#ff0000' },
  { id: 'meta', icon: FaInstagram, color: '#e4405f' },
  { id: 'pinterest', icon: FaPinterest, color: '#bd081c' },
  { id: 'reddit', icon: FaRedditAlien, color: '#ff4500' },
  { id: 'linkedin', icon: FaLinkedin, color: '#0a66c2' },
];

export default function Hero() {
  const totalPlatforms = Object.keys(PLATFORMS).length;

  return (
    <section className="pt-32 pb-10 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-slow" />
          <span>{totalPlatforms} platforms supported</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance leading-tight"
        >
          Download media from{' '}
          <span className="relative inline-block">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl -skew-y-1 origin-left"
              style={{ padding: '0 8px', margin: '-4px -8px', width: 'calc(100% + 16px)', height: 'calc(100% + 8px)' }}
            />
            <span className="relative z-10 text-white">anywhere</span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-zinc-400 text-lg sm:text-xl mb-10 max-w-xl mx-auto"
        >
          Videos, images, and audio from your favorite platforms. Fast, free, no registration.
        </motion.p>

        {/* Platform icons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          {FEATURED_PLATFORMS.map(({ id, icon: Icon, color }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
              whileHover={{ scale: 1.1, y: -2 }}
              className="w-11 h-11 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center hover:bg-zinc-800 hover:border-zinc-600 transition-colors cursor-default"
              title={PLATFORMS[id].name}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="w-11 h-11 rounded-xl bg-zinc-800/30 border border-zinc-700/30 flex items-center justify-center text-zinc-500 text-sm font-medium"
          >
            +{totalPlatforms - FEATURED_PLATFORMS.length}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
