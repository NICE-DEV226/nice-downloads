import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiUrl } from '../config';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string | null;
}

export default function RatingModal({ isOpen, onClose, platform }: RatingModalProps) {
  const [score, setScore] = useState(0);
  const [hoveredScore, setHoveredScore] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (score === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(apiUrl('/api/admin/rating'), {
        score,
        comment: comment.trim() || null,
        platform,
      });

      toast.success('Thanks for your feedback!');
      setScore(0);
      setComment('');
      onClose();
    } catch {
      toast.error('Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayScore = hoveredScore || score;

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
              className="w-full max-w-sm pointer-events-auto"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                  <div>
                    <h2 className="font-semibold text-white">Rate your experience</h2>
                    <p className="text-xs text-zinc-500">Your feedback helps us improve</p>
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
                  {/* Stars */}
                  <div className="flex justify-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setScore(value)}
                        onMouseEnter={() => setHoveredScore(value)}
                        onMouseLeave={() => setHoveredScore(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            value <= displayScore
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Score label */}
                  <p className="text-center text-sm text-zinc-400 mb-4">
                    {displayScore === 0 && 'Select a rating'}
                    {displayScore === 1 && 'Poor'}
                    {displayScore === 2 && 'Fair'}
                    {displayScore === 3 && 'Good'}
                    {displayScore === 4 && 'Very Good'}
                    {displayScore === 5 && 'Excellent!'}
                  </p>

                  {/* Comment */}
                  <div className="mb-4">
                    <label className="block text-sm text-zinc-400 mb-1.5">
                      Comment <span className="text-zinc-600">(optional)</span>
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us more..."
                      rows={2}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm resize-none focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || score === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Rating</span>
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
