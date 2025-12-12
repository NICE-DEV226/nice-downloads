// This component is no longer used in the new minimal design
// Keeping it for backwards compatibility if needed

import { PLATFORMS, PlatformId, PlatformIcon } from './PlatformIcon';

interface PlatformGridProps {
  selectedPlatform: PlatformId | null;
  onSelectPlatform: (platform: PlatformId | null) => void;
}

export default function PlatformGrid({ selectedPlatform, onSelectPlatform }: PlatformGridProps) {
  const platforms = Object.values(PLATFORMS);

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-medium text-white mb-1">All supported platforms</h2>
        <p className="text-zinc-500 text-sm">Click to filter or just paste any URL above</p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
        {platforms.map((platform) => {
          const isSelected = selectedPlatform === platform.id;
          return (
            <button
              key={platform.id}
              onClick={() => onSelectPlatform(isSelected ? null : platform.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                isSelected
                  ? 'bg-zinc-800 ring-2 ring-blue-500'
                  : 'bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800'
              }`}
              title={platform.name}
            >
              <PlatformIcon platform={platform.id} size="md" />
              <span className="text-[10px] text-zinc-500 truncate w-full text-center">
                {platform.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {selectedPlatform && (
        <div className="mt-4 text-center">
          <button
            onClick={() => onSelectPlatform(null)}
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}
