import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, PlayCircle, Filter } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { InterviewHistoryTable } from '../components/InterviewHistoryTable';
import { LoadingState } from '../components/LoadingState';
import { ErrorAlert } from '../components/ErrorAlert';
import { fetchApi } from '../lib/api';
import { InterviewSession } from '../types';

export const HistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in_progress'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<InterviewSession[]>('/api/interviews');
      setSessions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch interview history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (filterStatus === 'completed') return s.status === 'completed';
    if (filterStatus === 'in_progress') return s.status === 'in_progress';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
                <History className="w-3.5 h-3.5 text-indigo-400" /> Session History & Archive
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Interview Log History
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Review your past mock interviews, scores, and Gemini coach feedback reports.
              </p>
            </div>

            <Link
              to="/interview/new"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-indigo-600/20 shrink-0"
            >
              <PlayCircle className="w-4 h-4" /> Start New Interview
            </Link>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 pb-2">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {[
              { key: 'all', label: 'All Sessions' },
              { key: 'completed', label: 'Completed Reports' },
              { key: 'in_progress', label: 'In Progress' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilterStatus(item.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  filterStatus === item.key
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingState message="Fetching interview history..." />
          ) : error ? (
            <ErrorAlert message={error} onRetry={loadHistory} />
          ) : (
            <InterviewHistoryTable sessions={filteredSessions} />
          )}
        </main>
      </div>
    </div>
  );
};
