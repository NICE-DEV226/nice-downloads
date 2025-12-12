import { useState, useEffect, FormEvent, useRef } from 'react';
import { Download, Loader2, Link2, X, Clipboard } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';
import axios from 'axios';
import { detectPlatform, getPlatformDisplayName, PLATFORMS, PlatformId, PlatformIcon } from './PlatformIcon';

// Cache for disabled platforms from backend
let disabledPlatformsCache: { platform: string; reason: string }[] | null = null;

async function fetchDisabledPlatforms() {
  if (disabledPlatformsCache !== null) return disabledPlatformsCache;
  try {
    const res = await axios.get('/api/admin/public/disabled-platforms');
    disabledPlatformsCache = res.data.data || [];
    return disabledPlatformsCache;
  } catch {
    return [];
  }
}

interface DownloadFormProps {
  onDownload: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

export default function DownloadForm({ onDownload, isLoading, error, onReset }: DownloadFormProps) {
  const [url, setUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformId | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDetectedPlatform(url.trim() ? detectPlatform(url) : null);
  }, [url]);

  const [disabledMessage, setDisabledMessage] = useState<string | null>(null);
  const [disabledPlatforms, setDisabledPlatforms] = useState<{ platform: string; reason: string }[]>([]);

  // Load disabled platforms on mount
  useEffect(() => {
    fetchDisabledPlatforms().then((data) => {
      if (data) setDisabledPlatforms(data);
    });
  }, []);

  // Check for disabled platforms
  useEffect(() => {
    if (!url.trim() || !detectedPlatform) {
      setDisabledMessage(null);
      return;
    }
    const disabled = disabledPlatforms.find((p) => p.platform === detectedPlatform);
    if (disabled) {
      const name = getPlatformDisplayName(detectedPlatform, url);
      setDisabledMessage(`${name} is temporarily unavailable`);
    } else {
      setDisabledMessage(null);
    }
  }, [url, detectedPlatform, disabledPlatforms]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading || disabledMessage) return;
    await onDownload(url);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        inputRef.current?.focus();
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleClear = () => {
    setUrl('');
    setDetectedPlatform(null);
    onReset();
    inputRef.current?.focus();
  };

  // platformInfo is available for future use
  const _platformInfo = detectedPlatform ? PLATFORMS[detectedPlatform] : null;
  void _platformInfo;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit}>
        {/* Input container */}
        <div className="relative">
          <div className={`relative bg-zinc-900 rounded-2xl border transition-colors duration-200 ${
            error ? 'border-red-500/50' : 'border-zinc-800 focus-within:border-blue-500'
          }`}>
            <div className="flex items-center">
              {/* Platform indicator or link icon */}
              <div className="pl-4 flex items-center">
                {detectedPlatform ? (
                  detectedPlatform === 'meta' && /facebook\.com|fb\.watch|fb\.com/i.test(url) ? (
                    <FaFacebook className="w-5 h-5" style={{ color: '#1877f2' }} />
                  ) : (
                    <PlatformIcon platform={detectedPlatform} size="md" />
                  )
                ) : (
                  <Link2 className="w-5 h-5 text-zinc-500" />
                )}
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your link here..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-white placeholder-zinc-500 text-base py-4 px-3 outline-none"
                autoComplete="off"
                spellCheck="false"
              />

              {/* Actions */}
              <div className="pr-2 flex items-center gap-1">
                {!url && (
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                    title="Paste"
                  >
                    <Clipboard className="w-4 h-4" />
                  </button>
                )}
                {url && !isLoading && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Clear"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!url.trim() || isLoading || !!disabledMessage}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    !url.trim() || isLoading || disabledMessage
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Loading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Platform detected badge */}
          {detectedPlatform && !error && !disabledMessage && (
            <div className="absolute -bottom-7 left-4 text-sm text-zinc-500">
              Detected: <span className="text-zinc-300">{getPlatformDisplayName(detectedPlatform, url)}</span>
            </div>
          )}

          {/* Disabled platform message */}
          {disabledMessage && !error && (
            <div className="absolute -bottom-7 left-4 text-sm text-yellow-500">
              ⚠️ {disabledMessage}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="absolute -bottom-7 left-4 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>
      </form>

      {/* Helper text */}
      <p className="text-center text-zinc-600 text-sm mt-12">
        Paste any link from supported platforms — we'll detect it automatically
      </p>
    </div>
  );
}
