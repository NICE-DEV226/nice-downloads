import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import DownloadForm from '@/components/DownloadForm';
import ResultCard from '@/components/ResultCard';
import Footer from '@/components/Footer';
import ReportModal from '@/components/ReportModal';
import RatingModal from '@/components/RatingModal';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import PollWidget from '@/components/PollWidget';
import Admin from '@/pages/Admin';
import { useDownloader } from '@/hooks/useDownloader';
import { detectPlatform, PlatformId } from '@/components/PlatformIcon';

function App() {
  const { state, download, reset, normalizedResult } = useDownloader();
  const [detectedPlatformId, setDetectedPlatformId] = useState<PlatformId | null>(null);
  const [lastUrl, setLastUrl] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  // Check if we're on admin page
  const isAdminPage = window.location.pathname === '/admin';

  const handleDownload = async (url: string) => {
    const platformId = detectPlatform(url);
    setDetectedPlatformId(platformId);
    setLastUrl(url);
    await download(url, platformId);
  };

  const handleReset = () => {
    reset();
    setDetectedPlatformId(null);
    setLastUrl('');
  };

  // Show report modal when there's an error
  const handleReportClick = () => {
    setShowReportModal(true);
  };

  // Show rating modal after successful download
  const handleRateClick = () => {
    setShowRatingModal(true);
  };

  const showResult = state.isLoading || normalizedResult;
  const hasError = state.error && !state.isLoading;

  // Render admin page
  if (isAdminPage) {
    return (
      <>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgb(39 39 42)',
              color: 'rgb(250 250 250)',
              border: '1px solid rgb(63 63 70)',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />
        <Admin />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgb(39 39 42)',
            color: 'rgb(250 250 250)',
            border: '1px solid rgb(63 63 70)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      {/* Modals */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        url={lastUrl}
        platform={detectedPlatformId}
        errorMessage={state.error}
      />
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        platform={detectedPlatformId}
      />

      <Header />

      <main className="flex-1">
        {/* Announcements */}
        <div className="max-w-2xl mx-auto px-4 pt-20">
          <AnnouncementBanner />
        </div>

        {!showResult && (
          <>
            <Hero />
            <section className="py-8">
              <DownloadForm
                onDownload={handleDownload}
                isLoading={state.isLoading}
                error={state.error}
                onReset={handleReset}
              />

              {/* Report button when error */}
              {hasError && (
                <div className="max-w-2xl mx-auto px-4 mt-8 text-center">
                  <button
                    onClick={handleReportClick}
                    className="text-sm text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Report this issue →
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {showResult && (
          <section className="pt-24 pb-8">
            <ResultCard
              result={normalizedResult}
              isLoading={state.isLoading}
              platformId={detectedPlatformId}
              onReset={handleReset}
            />

            {/* Rate button after successful download */}
            {normalizedResult && !state.isLoading && (
              <div className="max-w-2xl mx-auto px-4 mt-6 text-center">
                <button
                  onClick={handleRateClick}
                  className="text-sm text-zinc-500 hover:text-blue-400 transition-colors"
                >
                  ⭐ Rate your experience
                </button>
              </div>
            )}
          </section>
        )}

        {/* Features - only show when no result */}
        {!showResult && !hasError && (
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: '⚡', title: 'Fast', desc: 'Download in seconds' },
                  { icon: '🔒', title: 'Private', desc: 'No data stored' },
                  { icon: '🎨', title: 'Multiple formats', desc: 'Choose quality' },
                ].map((f) => (
                  <div key={f.title} className="card p-5 text-center">
                    <div className="text-2xl mb-2">{f.icon}</div>
                    <h3 className="font-medium text-white mb-1">{f.title}</h3>
                    <p className="text-zinc-500 text-sm">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Poll Widget */}
      <PollWidget />
    </div>
  );
}

export default App;
