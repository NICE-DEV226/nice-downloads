import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiUrl } from '../config';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  platform: string | null;
  errorMessage: string | null;
}

export default function ReportModal({ isOpen, onClose, url, platform, errorMessage }: ReportModalProps) {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(apiUrl('/api/admin/report'), {
        url,
        platform: platform || 'unknown',
        errorMessage,
        description: description.trim() || null,
        userAgent: navigator.userAgent,
      });

      toast.success('Report submitted. Thank you!');
      setDescription('');
      onClose();
    } catch {
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Modal - centered with flexbox */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md pointer-events-auto"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">Report an Issue</h2>
                      <p className="text-xs text-zinc-500">Help us improve</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-5">
                  {/* URL */}
                  <div className="mb-4">
                    <label className="block text-sm text-zinc-400 mb-1.5">URL</label>
                    <div className="px-3 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-300 text-sm truncate">
                      {url || 'No URL provided'}
                    </div>
                  </div>

                  {/* Platform */}
                  {platform && (
                    <div className="mb-4">
                      <label className="block text-sm text-zinc-400 mb-1.5">Platform</label>
                      <div className="px-3 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-300 text-sm">
                        {platform}
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {errorMessage && (
                    <div className="mb-4">
                      <label className="block text-sm text-zinc-400 mb-1.5">Error</label>
                      <div className="px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {errorMessage}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block text-sm text-zinc-400 mb-1.5">
                      Additional details <span className="text-zinc-600">(optional)</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what happened..."
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm resize-none focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Report</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
