import { useState, useCallback } from 'react';
import axios from 'axios';
import {
  DownloadResult,
  DownloadState,
  NormalizedResult,
  NormalizedDownload,
  ApiResponse,
} from '@/types';
import {
  detectPlatform,
  getPlatformInfo,
  normalizeUrl,
  isValidUrl,
  PlatformInfo,
  Platform,
} from '@/utils/platformDetector';
import { apiUrl } from '@/config';

interface UseDownloaderReturn {
  state: DownloadState;
  download: (url: string, platform?: Platform | string | null) => Promise<void>;
  reset: () => void;
  normalizedResult: NormalizedResult | null;
}

const initialState: DownloadState = {
  isLoading: false,
  error: null,
  result: null,
  detectedPlatform: null,
};

function normalizeResult(data: DownloadResult, platform: PlatformInfo): NormalizedResult {
  const downloads: NormalizedDownload[] = [];

  // Handle TikTok format
  if (data.downloads && Array.isArray(data.downloads)) {
    data.downloads.forEach((item) => {
      const url = item.url || (item as any).href;
      if (!url || url === '#') return;

      const label = item.text || item.label || item.quality || 'Download';
      const format = item.format || item.extension || extractFormat(label);
      const isAudio = label.toLowerCase().includes('mp3') ||
        label.toLowerCase().includes('audio') ||
        item.type?.toLowerCase() === 'audio' ||
        format === 'mp3';
      const isImage = item.type?.toLowerCase() === 'image' ||
        ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(format?.toLowerCase() || '');

      downloads.push({
        url,
        label,
        quality: item.quality || extractQuality(label),
        format,
        type: isAudio ? 'audio' : (isImage ? 'image' : 'video'),
        isAudio,
      });
    });
  }

  // Handle YouTube formats
  if (data.formats && Array.isArray(data.formats)) {
    data.formats.forEach((item) => {
      if (!item.url) return;
      const isAudio = item.type?.toLowerCase() === 'audio';
      downloads.push({
        url: item.url,
        label: `${item.quality || 'Unknown'} (${item.extension || item.type || 'mp4'})`,
        quality: item.quality,
        format: item.extension,
        type: isAudio ? 'audio' : 'video',
        isAudio,
      });
    });
  }

  // Handle downloadLinks (Spotify, etc.)
  if (data.downloadLinks && Array.isArray(data.downloadLinks)) {
    data.downloadLinks.forEach((item) => {
      if (!item.url) return;
      downloads.push({
        url: item.url,
        label: `${item.quality || 'Download'} (${item.extension || 'mp3'})`,
        quality: item.quality,
        format: item.extension,
        type: item.type === 'audio' ? 'audio' : 'video',
        isAudio: item.type === 'audio' || item.extension === 'mp3',
      });
    });
  }

  // Handle videoLinks (Douyin)
  if (data.videoLinks && Array.isArray(data.videoLinks)) {
    data.videoLinks.forEach((item) => {
      if (!item.url) return;
      downloads.push({
        url: item.url,
        label: item.label || 'Download Video',
        quality: extractQuality(item.label || ''),
        type: 'video',
      });
    });
  }

  // Handle direct video URL
  if (data.videoUrl) {
    downloads.push({ url: data.videoUrl, label: 'Video (Direct)', type: 'video' });
  }

  // Handle direct download link
  if (data.downloadLink) {
    downloads.push({ url: data.downloadLink, label: 'Download', type: 'video' });
  }

  // Handle single download (Threads)
  if (data.download && typeof data.download === 'string') {
    downloads.push({
      url: data.download,
      label: data.quality || 'Download',
      quality: data.quality || undefined,
      type: 'video',
    });
  }

  // Handle Twitter array format
  if (Array.isArray(data)) {
    (data as any[]).forEach((item) => {
      if (!item.url) return;
      downloads.push({
        url: item.url,
        label: `${item.quality || 'Unknown'} (${item.type || 'video'})`,
        quality: item.quality,
        type: item.type?.toLowerCase() === 'audio' ? 'audio' : 'video',
      });
    });
  }

  // Handle Reddit format
  if ((data as any).video_url) {
    downloads.push({ url: (data as any).video_url, label: 'Video', type: 'video' });
  }
  if ((data as any).audio_url) {
    downloads.push({ url: (data as any).audio_url, label: 'Audio', type: 'audio', isAudio: true });
  }

  // Handle metadownloader format (Instagram/Facebook)
  // Format: { data: [{ url, thumbnail }] }
  if ((data as any).data && Array.isArray((data as any).data)) {
    (data as any).data.forEach((item: any, index: number) => {
      if (!item.url) return;
      downloads.push({
        url: item.url,
        label: item.resolution || item.quality || `Video ${index + 1}`,
        quality: item.resolution || item.quality || 'HD',
        type: 'video',
      });
    });

    // Get thumbnail from first item if not already set
    if (!(data as any).thumbnail && (data as any).data[0]?.thumbnail) {
      (data as any).thumbnail = (data as any).data[0].thumbnail;
    }
  }

  // Handle medias array format
  if ((data as any).medias && Array.isArray((data as any).medias)) {
    (data as any).medias.forEach((item: any) => {
      if (!item.url) return;
      downloads.push({
        url: item.url,
        label: item.quality || item.resolution || 'Download',
        quality: item.quality || item.resolution,
        format: item.extension,
        type: item.type === 'audio' ? 'audio' : 'video',
        isAudio: item.type === 'audio',
      });
    });
  }

  // Handle url array at root level
  if ((data as any).url && Array.isArray((data as any).url)) {
    (data as any).url.forEach((url: string, index: number) => {
      downloads.push({
        url,
        label: `Download ${index + 1}`,
        type: 'video',
      });
    });
  }

  // Handle single url string
  if ((data as any).url && typeof (data as any).url === 'string' && downloads.length === 0) {
    downloads.push({
      url: (data as any).url,
      label: 'Download',
      type: 'video',
    });
  }

  // Handle LinkedIn format { videos: ["url1", "url2"] }
  if ((data as any).videos && Array.isArray((data as any).videos)) {
    (data as any).videos.forEach((videoUrl: string, index: number) => {
      downloads.push({
        url: videoUrl,
        label: `Video ${index + 1}`,
        quality: 'HD',
        type: 'video',
      });
    });
  }

  // Extract thumbnail from nested data if needed
  let thumbnail = data.thumbnail || null;
  if (!thumbnail && (data as any).data?.[0]?.thumbnail) {
    thumbnail = (data as any).data[0].thumbnail;
  }

  return {
    title: data.title || data.caption || (downloads.length > 0 ? 'Media Download' : 'Untitled'),
    thumbnail,
    duration: data.duration || null,
    author: data.author || data.profile?.name || data.profile?.author || null,
    caption: data.caption || null,
    profile: data.profile || null,
    downloads,
    platform: platform as unknown as import('@/types').Platform,
    originalData: data,
  };
}

function extractQuality(label: string): string | undefined {
  const match = label.match(/(\d{3,4}p|HD|SD|4K|1080|720|480|360|240|144)/i);
  return match ? match[1] : undefined;
}

function extractFormat(label: string): string | undefined {
  const match = label.match(/\.(mp4|mp3|webm|m4a|wav|avi|mkv|mov|jpg|jpeg|png|webp|gif)/i);
  if (match) return match[1].toLowerCase();

  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('mp4')) return 'mp4';
  if (lowerLabel.includes('mp3')) return 'mp3';
  if (lowerLabel.includes('webm')) return 'webm';
  if (lowerLabel.includes('jpg') || lowerLabel.includes('jpeg')) return 'jpg';
  if (lowerLabel.includes('png')) return 'png';
  if (lowerLabel.includes('webp')) return 'webp';
  if (lowerLabel.includes('gif')) return 'gif';
  if (lowerLabel.includes('original image')) return 'png'; // Pinterest default

  return undefined;
}

export function useDownloader(): UseDownloaderReturn {
  const [state, setState] = useState<DownloadState>(initialState);

  const download = useCallback(async (url: string, platform?: Platform | string | null) => {
    if (!url || !url.trim()) {
      setState((prev) => ({ ...prev, error: 'Please enter a valid URL' }));
      return;
    }

    const normalizedUrl = normalizeUrl(url);

    if (!isValidUrl(normalizedUrl)) {
      setState((prev) => ({ ...prev, error: 'Invalid URL format' }));
      return;
    }

    const detectedPlatformId = (platform as Platform) || detectPlatform(normalizedUrl);

    if (!detectedPlatformId) {
      setState((prev) => ({ ...prev, error: 'Platform not detected. Check the URL.' }));
      return;
    }

    const platformInfo = getPlatformInfo(detectedPlatformId);

    if (!platformInfo) {
      setState((prev) => ({ ...prev, error: 'Unsupported platform' }));
      return;
    }

    setState({ isLoading: true, error: null, result: null, detectedPlatform: platformInfo as unknown as import('@/types').Platform });

    try {
      const response = await axios.get<ApiResponse>(apiUrl(platformInfo.endpoint), {
        params: { url: normalizedUrl },
        timeout: 60000,
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch media');
      }

      const result = response.data.data;
      const finalResult = Array.isArray(result) ? { downloads: result } as DownloadResult : result;

      setState({ isLoading: false, error: null, result: finalResult || null, detectedPlatform: platformInfo as unknown as import('@/types').Platform });
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out';
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = 'Network error';
        } else if (error.response?.status === 404) {
          errorMessage = 'Media not found';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({ isLoading: false, error: errorMessage, result: null, detectedPlatform: platformInfo as unknown as import('@/types').Platform });
    }
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const normalizedResult = state.result && state.detectedPlatform
    ? normalizeResult(state.result, state.detectedPlatform as unknown as PlatformInfo)
    : null;

  return { state, download, reset, normalizedResult };
}

export default useDownloader;
