import { useState, useEffect } from 'react';
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    axios.get('/api/admin/public/announcements')
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
          <div key={a.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colors[a.type] || colors.info}`}>
            <Icon className="w-5 h-5 shrink-0" />
            <p className="flex-1 text-sm">{a.message}</p>
            <button onClick={() => setDismissed([...dismissed, a.id])} className="p-1 hover:bg-white/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
