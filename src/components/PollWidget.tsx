import { useState, useEffect } from 'react';
import { Send, MessageSquare, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiUrl } from '../config';

interface Poll {
  id: string;
  question: string;
}

export default function PollWidget() {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasResponded = localStorage.getItem('poll_responded');
    if (hasResponded) return;
    
    axios.get(apiUrl('/api/admin/public/poll'))
      .then((res) => { if (res.data.data) setPoll(res.data.data); })
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!response.trim() || !poll) return;
    try {
      await axios.post(apiUrl(`/api/admin/public/poll/${poll.id}/respond`), { response });
      setSubmitted(true);
      localStorage.setItem('poll_responded', poll.id);
      toast.success('Thanks for your feedback!');
    } catch { toast.error('Failed to submit'); }
  };

  if (!poll || submitted) return null;

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg z-40">
        <MessageSquare className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-40 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <span className="font-medium text-white text-sm">Quick Poll</span>
        <button onClick={() => setIsOpen(false)} className="p-1 text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-4">
        <p className="text-zinc-300 text-sm mb-3">{poll.question}</p>
        <textarea value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Your thoughts..." rows={3} className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm resize-none focus:outline-none focus:border-blue-500" />
        <button onClick={handleSubmit} disabled={!response.trim()} className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm disabled:opacity-50">
          <Send className="w-4 h-4" /><span>Submit</span>
        </button>
      </div>
    </div>
  );
}
