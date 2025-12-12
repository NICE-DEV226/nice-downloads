import { Download, Github } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">
            NICE<span className="text-blue-500">Downs</span>
          </span>
        </a>

        {/* Actions */}
        <a
          href="https://github.com/NICE-DEV226"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost px-3 py-2 text-sm"
        >
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}
