import { Download, Copy, Check, ArrowLeft, Music, Image as ImageIcon, Film, User, Clock } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { NormalizedResult, NormalizedDownload } from '@/types';
import { PlatformIcon, PlatformId, PLATFORMS } from './PlatformIcon';
import { apiUrl } from '../config';

interface ResultCardProps {
  result: NormalizedResult | null;
  isLoading: boolean;
  platformId: PlatformId | null;
  onReset: () => void;
}

export default function ResultCard({ result, isLoading, platformId, onReset }: ResultCardProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success('Link copied!');
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDownload = (url: string, label: string) => {
    // Use proxy for cross-origin downloads
    const filename = `${label.replace(/[^a-z0-9]/gi, '_')}.mp4`;
    const proxyUrl = apiUrl(`/api/proxy/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`);
    
    // Create link and trigger download
    const link = document.createElement('a');
    link.href = proxyUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloading ${label}...`);
    
    // Track download
    if (platformId) {
      axios.post(apiUrl('/api/admin/track'), { platform: platformId }).catch(() => {});
    }
  };

  const formatDuration = (duration: string | number | null | undefined): string => {
    if (!duration) return '';
    if (typeof duration === 'string') return duration;
    const total = Math.floor(duration);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = (d: NormalizedDownload) => {
    if (d.isAudio || d.type === 'audio') return <Music className="w-4 h-4" />;
    if (d.type === 'image') return <ImageIcon className="w-4 h-4" />;
    return <Film className="w-4 h-4" />;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 animate-fade-in">
        <div className="card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full sm:w-32 h-24 bg-zinc-800 rounded-xl animate-pulse shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 sm:h-5 w-3/4 bg-zinc-800 rounded animate-pulse" />
              <div className="h-3 sm:h-4 w-1/2 bg-zinc-800 rounded animate-pulse" />
              <div className="h-8 sm:h-10 w-full bg-zinc-800 rounded-xl animate-pulse mt-4" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6 text-zinc-500 text-xs sm:text-sm">
            <div className="w-4 h-4 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
            <span>Fetching media...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const videoDownloads = result.downloads.filter(d => d.type === 'video' || (!d.isAudio && d.type !== 'audio'));
  const audioDownloads = result.downloads.filter(d => d.type === 'audio' || d.isAudio);
  const platform = platformId ? PLATFORMS[platformId] : null;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 animate-fade-in">
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-zinc-800">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 sm:gap-2 text-zinc-400 hover:text-white transition-colors text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>New download</span>
          </button>
          {platform && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <PlatformIcon platform={platformId!} size="sm" />
              <span className="text-xs sm:text-sm text-zinc-400">{platform.name}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Thumbnail */}
            <div className="relative w-full sm:w-32 md:w-40 shrink-0">
              <div className="aspect-video rounded-xl overflow-hidden bg-zinc-800">
                {result.thumbnail ? (
                  <img src={result.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800/50">
                    {platformId ? (
                      <PlatformIcon platform={platformId} size="lg" />
                    ) : (
                      <Film className="w-8 h-8 text-zinc-600" />
                    )}
                  </div>
                )}
              </div>
              {result.duration && (
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(result.duration)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white line-clamp-2 mb-1 text-sm sm:text-base">
                {result.title || 'Untitled'}
              </h3>
              {result.author && (
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs sm:text-sm">
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="truncate">{result.author}</span>
                </div>
              )}
            </div>
          </div>

          {/* Downloads */}
          <div className="mt-4 space-y-2">
            {videoDownloads.slice(0, 4).map((d, i) => (
              <DownloadRow
                key={`v-${i}`}
                download={d}
                icon={getTypeIcon(d)}
                onDownload={handleDownload}
                onCopy={handleCopy}
                isCopied={copiedUrl === d.url}
              />
            ))}
            {audioDownloads.slice(0, 2).map((d, i) => (
              <DownloadRow
                key={`a-${i}`}
                download={d}
                icon={getTypeIcon(d)}
                onDownload={handleDownload}
                onCopy={handleCopy}
                isCopied={copiedUrl === d.url}
                isAudio
              />
            ))}
          </div>

          {result.downloads.length === 0 && (
            <p className="text-center text-zinc-500 py-6">No downloadable media found.</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-4 py-3 border-t border-zinc-800 bg-zinc-900/50">
          <p className="text-zinc-600 text-xs text-center">
            {result.downloads.length} download option{result.downloads.length !== 1 ? 's' : ''} available
          </p>
          {platformId === 'youtube' && (
            <p className="text-yellow-500/70 text-xs text-center mt-1">
              ⚠️ YouTube links may expire. Use "Copy" and paste in a new tab if download fails.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface DownloadRowProps {
  download: NormalizedDownload;
  icon: React.ReactNode;
  onDownload: (url: string, label: string) => void;
  onCopy: (url: string) => void;
  isCopied: boolean;
  isAudio?: boolean;
}

function DownloadRow({ download, icon, onDownload, onCopy, isCopied, isAudio }: DownloadRowProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors group">
      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${
        isAudio ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-white truncate">{download.label}</p>
        <p className="text-xs text-zinc-500">
          {[download.quality, download.format?.toUpperCase()].filter(Boolean).join(' • ')}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onCopy(download.url)}
          className="p-1.5 sm:p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
          title="Copy link"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
        <button
          onClick={() => onDownload(download.url, download.label)}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            isAudio
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>
    </div>
  );
}
