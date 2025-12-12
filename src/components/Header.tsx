import { Download, Github } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800/50">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 sm:gap-2.5 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-base sm:text-lg font-semibold text-white">
            NICE<span className="text-blue-500">Downs</span>
          </span>
        </a>

        {/* Actions */}
        <a
          href="https://github.com/NICE-DEV226"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost px-2 sm:px-3 py-2 text-xs sm:text-sm"
        >
          <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}
