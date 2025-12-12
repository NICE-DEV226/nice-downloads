import { useState, useEffect } from 'react';
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '../config';

interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    axios.get(apiUrl('/api/admin/public/announcements'))
      .then((res) => setAnnouncements(res.data.data || []))
      .catch(() => {});
  }, []);

  const visibleAnnouncements = announcements.filter((a) => !dismissed.includes(a.id));

  if (visibleAnnouncements.length === 0) return null;

  const icons = { info: Info, warning: AlertTriangle, success: CheckCircle };
  const colors = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
  };

  return (
    <div className="space-y-2 mb-4">
      {visibleAnnouncements.map((a) => {
        const Icon = icons[a.type] || Info;
        return (
          <div key={a.id} className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border ${colors[a.type] || colors.info}`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <p className="flex-1 text-xs sm:text-sm">{a.message}</p>
            <button onClick={() => setDismissed([...dismissed, a.id])} className="p-1 hover:bg-white/10 rounded">
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
