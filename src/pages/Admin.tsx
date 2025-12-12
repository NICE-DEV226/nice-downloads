import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download, AlertTriangle, Star, BarChart3, Check, X, Trash2, RefreshCw,
  Lock, LogOut, Clock, ExternalLink, Megaphone, MessageSquare, Power, Plus,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiUrl } from '../config';

interface Report { id: string; url: string; platform: string; errorMessage: string | null; description: string | null; status: 'pending' | 'resolved' | 'dismissed'; createdAt: string; }
interface Rating { id: string; score: number; comment: string | null; platform: string | null; createdAt: string; }
interface Announcement { id: string; message: string; type: string; active: boolean; createdAt: string; }
interface Poll { id: string; question: string; active: boolean; responseCount: number; createdAt: string; }
interface PollResponse { id: string; response: string; createdAt: string; }
interface DisabledPlatform { platform: string; reason: string; disabledAt: string; }
interface Stats { totalDownloads: number; downloadsByPlatform: Record<string, number>; totalReports: number; pendingReports: number; totalRatings: number; averageRating: string; }

const ALL_PLATFORMS = ['tiktok', 'youtube', 'meta', 'twitter', 'spotify', 'pinterest', 'linkedin', 'reddit', 'soundcloud', 'snapchat', 'threads', 'tumblr', 'bluesky', 'dailymotion', 'capcut', 'douyin', 'kuaishou'];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'reports' | 'ratings' | 'announcements' | 'polls' | 'platforms'>('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [disabledPlatforms, setDisabledPlatforms] = useState<DisabledPlatform[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportFilter, setReportFilter] = useState<string>('all');
  const [newAnnouncement, setNewAnnouncement] = useState({ message: '', type: 'info' });
  const [newPoll, setNewPoll] = useState('');
  const [selectedPollResponses, setSelectedPollResponses] = useState<{ pollId: string; responses: PollResponse[] } | null>(null);

  const apiHeaders = { 'x-admin-key': adminKey };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.get(apiUrl('/api/admin/stats'), { headers: { 'x-admin-key': adminKey } });
      setIsAuthenticated(true);
      localStorage.setItem('adminKey', adminKey);
      toast.success('Logged in');
    } catch { toast.error('Invalid admin key'); }
    finally { setIsLoading(false); }
  };

  const handleLogout = () => { setIsAuthenticated(false); setAdminKey(''); localStorage.removeItem('adminKey'); };

  const fetchData = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const [statsRes, reportsRes, ratingsRes, announcementsRes, pollsRes, platformsRes] = await Promise.all([
        axios.get(apiUrl('/api/admin/stats'), { headers: apiHeaders }),
        axios.get(apiUrl('/api/admin/reports'), { headers: apiHeaders }),
        axios.get(apiUrl('/api/admin/ratings'), { headers: apiHeaders }),
        axios.get(apiUrl('/api/admin/announcements'), { headers: apiHeaders }),
        axios.get(apiUrl('/api/admin/polls'), { headers: apiHeaders }),
        axios.get(apiUrl('/api/admin/platforms'), { headers: apiHeaders }),
      ]);
      setStats(statsRes.data.data);
      setReports(reportsRes.data.data);
      setRatings(ratingsRes.data.data);
      setAnnouncements(announcementsRes.data.data);
      setPolls(pollsRes.data.data);
      setDisabledPlatforms(platformsRes.data.data);
    } catch { toast.error('Failed to fetch data'); }
    finally { setIsLoading(false); }
  };

  const updateReportStatus = async (id: string, status: string) => {
    try {
      await axios.patch(apiUrl(`/api/admin/reports/${id}`), { status }, { headers: apiHeaders });
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: status as Report['status'] } : r)));
      toast.success('Updated');
    } catch { toast.error('Failed'); }
  };

  const deleteReport = async (id: string) => {
    try {
      await axios.delete(apiUrl(`/api/admin/reports/${id}`), { headers: apiHeaders });
      setReports((prev) => prev.filter((r) => r.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const createAnnouncement = async () => {
    if (!newAnnouncement.message.trim()) return;
    try {
      await axios.post(apiUrl('/api/admin/announcements'), newAnnouncement, { headers: apiHeaders });
      setNewAnnouncement({ message: '', type: 'info' });
      fetchData();
      toast.success('Announcement created');
    } catch { toast.error('Failed'); }
  };

  const toggleAnnouncementActive = async (id: string, active: boolean) => {
    try {
      await axios.patch(apiUrl(`/api/admin/announcements/${id}`), { active }, { headers: apiHeaders });
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, active } : a)));
    } catch { toast.error('Failed'); }
  };

  const deleteAnnouncementItem = async (id: string) => {
    try {
      await axios.delete(apiUrl(`/api/admin/announcements/${id}`), { headers: apiHeaders });
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const createPoll = async () => {
    if (!newPoll.trim()) return;
    try {
      await axios.post(apiUrl('/api/admin/polls'), { question: newPoll }, { headers: apiHeaders });
      setNewPoll('');
      fetchData();
      toast.success('Poll created');
    } catch { toast.error('Failed'); }
  };

  const togglePollActive = async (id: string, active: boolean) => {
    try {
      await axios.patch(apiUrl(`/api/admin/polls/${id}`), { active }, { headers: apiHeaders });
      setPolls((prev) => prev.map((p) => (p.id === id ? { ...p, active } : p)));
    } catch { toast.error('Failed'); }
  };

  const deletePollItem = async (id: string) => {
    try {
      await axios.delete(apiUrl(`/api/admin/polls/${id}`), { headers: apiHeaders });
      setPolls((prev) => prev.filter((p) => p.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const viewPollResponses = async (pollId: string) => {
    try {
      const res = await axios.get(apiUrl(`/api/admin/polls/${pollId}/responses`), { headers: apiHeaders });
      setSelectedPollResponses({ pollId, responses: res.data.data });
    } catch { toast.error('Failed'); }
  };

  const togglePlatform = async (platform: string, disable: boolean, reason = '') => {
    try {
      if (disable) {
        await axios.post(apiUrl('/api/admin/platforms/disable'), { platform, reason }, { headers: apiHeaders });
        setDisabledPlatforms((prev) => [...prev, { platform, reason, disabledAt: new Date().toISOString() }]);
      } else {
        await axios.post(apiUrl('/api/admin/platforms/enable'), { platform }, { headers: apiHeaders });
        setDisabledPlatforms((prev) => prev.filter((p) => p.platform !== platform));
      }
      toast.success(disable ? 'Platform disabled' : 'Platform enabled');
    } catch { toast.error('Failed'); }
  };

  useEffect(() => {
    const savedKey = localStorage.getItem('adminKey');
    if (savedKey) { setAdminKey(savedKey); setIsAuthenticated(true); }
  }, []);

  useEffect(() => { if (isAuthenticated) fetchData(); }, [isAuthenticated]);

  const filteredReports = reportFilter === 'all' ? reports : reports.filter((r) => r.status === reportFilter);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center"><Lock className="w-6 h-6 text-white" /></div>
            </div>
            <h1 className="text-xl font-bold text-white text-center mb-2">Admin Dashboard</h1>
            <p className="text-zinc-500 text-sm text-center mb-6">Enter your admin key</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="password" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} placeholder="Admin Key" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500" />
              <button type="submit" disabled={isLoading || !adminKey} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-50">{isLoading ? 'Logging in...' : 'Login'}</button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center"><Download className="w-5 h-5 text-white" /></div>
            <span className="font-semibold text-white">NICE<span className="text-blue-500">DL</span><span className="text-zinc-500 font-normal ml-2">Admin</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} disabled={isLoading} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"><RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} /></button>
            <button onClick={handleLogout} className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex gap-2 mb-6 sm:mb-8 flex-wrap overflow-x-auto pb-2">
          {[
            { id: 'stats', label: 'Stats', icon: BarChart3 },
            { id: 'reports', label: 'Reports', icon: AlertTriangle, count: stats?.pendingReports },
            { id: 'ratings', label: 'Ratings', icon: Star },
            { id: 'announcements', label: 'Announcements', icon: Megaphone },
            { id: 'polls', label: 'Polls', icon: MessageSquare },
            { id: 'platforms', label: 'Platforms', icon: Power },
          ].map(({ id, label, icon: Icon, count }) => (
            <button key={id} onClick={() => setActiveTab(id as typeof activeTab)} className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${activeTab === id ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'}`}>
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="hidden sm:inline">{label}</span><span className="sm:hidden">{label.slice(0, 4)}</span>
              {count !== undefined && count > 0 && <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs">{count}</span>}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard icon={Download} label="Downloads" value={stats.totalDownloads} color="blue" />
              <StatCard icon={AlertTriangle} label="Pending" value={stats.pendingReports} color="red" />
              <StatCard icon={Star} label="Avg Rating" value={stats.averageRating} color="yellow" />
              <StatCard icon={Star} label="Ratings" value={stats.totalRatings} color="green" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
              <h3 className="font-semibold text-white mb-4 text-sm sm:text-base">Downloads by Platform</h3>
              <div className="space-y-3">
                {Object.entries(stats.downloadsByPlatform).sort(([, a], [, b]) => b - a).map(([platform, count]) => (
                  <div key={platform} className="flex items-center gap-2 sm:gap-3">
                    <span className="text-zinc-400 text-xs sm:text-sm w-20 sm:w-24 truncate">{platform}</span>
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${(count / stats.totalDownloads) * 100}%` }} /></div>
                    <span className="text-zinc-300 text-xs sm:text-sm w-10 sm:w-12 text-right">{count}</span>
                  </div>
                ))}
                {Object.keys(stats.downloadsByPlatform).length === 0 && <p className="text-zinc-500 text-xs sm:text-sm">No downloads yet</p>}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['all', 'pending', 'resolved', 'dismissed'].map((filter) => (
                <button key={filter} onClick={() => setReportFilter(filter)} className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm capitalize whitespace-nowrap ${reportFilter === filter ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}>{filter}</button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div key={report.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${report.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : report.status === 'resolved' ? 'bg-green-500/10 text-green-400' : 'bg-zinc-700 text-zinc-400'}`}>{report.status}</span>
                        <span className="text-zinc-500 text-xs">{report.platform}</span>
                        <span className="text-zinc-600 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                      <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs sm:text-sm hover:underline flex items-center gap-1 mb-2 break-all">{report.url.slice(0, 50)}...<ExternalLink className="w-3 h-3" /></a>
                      {report.errorMessage && <p className="text-red-400 text-xs sm:text-sm mb-1">{report.errorMessage}</p>}
                      {report.description && <p className="text-zinc-400 text-xs sm:text-sm">{report.description}</p>}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-1">
                      {report.status === 'pending' && (<><button onClick={() => updateReportStatus(report.id, 'resolved')} className="p-1.5 sm:p-2 rounded-lg text-green-400 hover:bg-green-500/10"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button><button onClick={() => updateReportStatus(report.id, 'dismissed')} className="p-1.5 sm:p-2 rounded-lg text-zinc-400 hover:bg-zinc-800"><X className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button></>)}
                      <button onClick={() => deleteReport(report.id)} className="p-1.5 sm:p-2 rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredReports.length === 0 && <p className="text-zinc-500 text-center py-8 text-xs sm:text-sm">No reports</p>}
            </div>
          </motion.div>
        )}

        {activeTab === 'ratings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {ratings.map((rating) => (
              <div key={rating.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className="flex">{[1, 2, 3, 4, 5].map((s) => (<Star key={s} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${s <= rating.score ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'}`} />))}</div>
                      {rating.platform && <span className="text-zinc-500 text-xs">{rating.platform}</span>}
                    </div>
                    {rating.comment && <p className="text-zinc-300 text-xs sm:text-sm">{rating.comment}</p>}
                  </div>
                  <span className="text-zinc-600 text-xs whitespace-nowrap">{new Date(rating.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {ratings.length === 0 && <p className="text-zinc-500 text-center py-8 text-xs sm:text-sm">No ratings</p>}
          </motion.div>
        )}

        {activeTab === 'announcements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
              <h3 className="font-semibold text-white mb-4 text-sm sm:text-base">Create Announcement</h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input value={newAnnouncement.message} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })} placeholder="Announcement message..." className="flex-1 px-3 sm:px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500" />
                <select value={newAnnouncement.type} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })} className="px-3 sm:px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm">
                  <option value="info">Info</option><option value="warning">Warning</option><option value="success">Success</option>
                </select>
                <button onClick={createAnnouncement} className="px-3 sm:px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center justify-center gap-2 text-sm"><Plus className="w-4 h-4" />Add</button>
              </div>
            </div>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className={`bg-zinc-900 border rounded-xl p-3 sm:p-4 ${a.active ? 'border-blue-500/50' : 'border-zinc-800 opacity-50'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${a.type === 'warning' ? 'bg-yellow-500/10 text-yellow-400' : a.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>{a.type}</span>
                      <p className="text-white text-xs sm:text-sm truncate">{a.message}</p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button onClick={() => toggleAnnouncementActive(a.id, !a.active)} className={`p-1.5 sm:p-2 rounded-lg ${a.active ? 'text-green-400 hover:bg-green-500/10' : 'text-zinc-500 hover:bg-zinc-800'}`}><Power className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                      <button onClick={() => deleteAnnouncementItem(a.id)} className="p-1.5 sm:p-2 rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && <p className="text-zinc-500 text-center py-8 text-xs sm:text-sm">No announcements</p>}
            </div>
          </motion.div>
        )}

        {activeTab === 'polls' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
              <h3 className="font-semibold text-white mb-4 text-sm sm:text-base">Create Poll</h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input value={newPoll} onChange={(e) => setNewPoll(e.target.value)} placeholder="Poll question..." className="flex-1 px-3 sm:px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500" />
                <button onClick={createPoll} className="px-3 sm:px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center justify-center gap-2 text-sm"><Plus className="w-4 h-4" />Add</button>
              </div>
            </div>
            <div className="space-y-3">
              {polls.map((p) => (
                <div key={p.id} className={`bg-zinc-900 border rounded-xl p-3 sm:p-4 ${p.active ? 'border-blue-500/50' : 'border-zinc-800 opacity-50'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-xs sm:text-sm truncate">{p.question}</p>
                      <p className="text-zinc-500 text-xs sm:text-sm">{p.responseCount} responses</p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button onClick={() => viewPollResponses(p.id)} className="px-2 sm:px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs sm:text-sm hover:bg-zinc-700 whitespace-nowrap">View</button>
                      <button onClick={() => togglePollActive(p.id, !p.active)} className={`p-1.5 sm:p-2 rounded-lg ${p.active ? 'text-green-400 hover:bg-green-500/10' : 'text-zinc-500 hover:bg-zinc-800'}`}><Power className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                      <button onClick={() => deletePollItem(p.id)} className="p-1.5 sm:p-2 rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {polls.length === 0 && <p className="text-zinc-500 text-center py-8 text-xs sm:text-sm">No polls</p>}
            </div>
            {selectedPollResponses && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white text-sm sm:text-base">Responses</h3>
                  <button onClick={() => setSelectedPollResponses(null)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedPollResponses.responses.map((r) => (<div key={r.id} className="p-2.5 sm:p-3 bg-zinc-800 rounded-lg"><p className="text-zinc-300 text-xs sm:text-sm">{r.response}</p><p className="text-zinc-600 text-xs mt-1">{new Date(r.createdAt).toLocaleString()}</p></div>))}
                  {selectedPollResponses.responses.length === 0 && <p className="text-zinc-500 text-xs sm:text-sm">No responses yet</p>}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'platforms' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <p className="text-zinc-400 text-xs sm:text-sm mb-4">Toggle platforms on/off. Disabled platforms will show a message to users.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {ALL_PLATFORMS.map((platform) => {
                const isDisabled = disabledPlatforms.some((p) => p.platform === platform);
                return (
                  <div key={platform} className={`bg-zinc-900 border rounded-xl p-3 sm:p-4 ${isDisabled ? 'border-red-500/50' : 'border-zinc-800'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-medium capitalize text-xs sm:text-sm truncate ${isDisabled ? 'text-red-400' : 'text-white'}`}>{platform}</span>
                      <button onClick={() => togglePlatform(platform, !isDisabled)} className={`p-1.5 sm:p-2 rounded-lg transition-colors ${isDisabled ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                        <Power className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    {isDisabled && <p className="text-red-400/70 text-xs mt-2">Disabled</p>}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number | string; color: 'blue' | 'red' | 'yellow' | 'green' }) {
  const colors = { blue: 'bg-blue-500/10 text-blue-400', red: 'bg-red-500/10 text-red-400', yellow: 'bg-yellow-500/10 text-yellow-400', green: 'bg-green-500/10 text-green-400' };
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${colors[color]} flex items-center justify-center mb-2 sm:mb-3`}><Icon className="w-4 h-4 sm:w-5 sm:h-5" /></div>
      <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
      <p className="text-zinc-500 text-xs sm:text-sm">{label}</p>
    </div>
  );
}
