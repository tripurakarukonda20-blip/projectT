import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Award, CheckCircle2, BookOpen, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DashboardCard } from '../components/DashboardCard';
import { InterviewHistoryTable } from '../components/InterviewHistoryTable';
import { LoadingState } from '../components/LoadingState';
import { ErrorAlert } from '../components/ErrorAlert';
import { useAuth } from '../hooks/useAuth';
import { fetchApi } from '../lib/api';
import { InterviewSession, StudyPlan } from '../types';

interface DashboardResponse {
  profile: any;
  stats: {
    total_interviews: number;
    completed_interviews: number;
    average_score: number;
    topics_covered: number;
  };
  recent_sessions: InterviewSession[];
  latest_study_plan: StudyPlan | null;
}

export const DashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchApi<DashboardResponse>('/api/dashboard');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {loading ? (
            <LoadingState message="Loading your interview coach dashboard..." />
          ) : error ? (
            <ErrorAlert message={error} onRetry={loadDashboard} />
          ) : (
            <>
              {/* Welcome Header */}
              <div className="relative p-6 sm:p-8 rounded-3xl glass-card border border-indigo-500/20 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-2 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Real-Time AI Coach Active
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Welcome back, {profile?.full_name || 'Student'}! 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    Target Role: <strong className="text-indigo-400 font-semibold">{profile?.target_role || 'Full-Stack Developer'}</strong> • Daily Goal: <strong className="text-slate-200">{profile?.daily_preparation_minutes || 60} mins</strong>
                  </p>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <Link
                    to="/interview/new"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
                  >
                    <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Start Mock Interview
                  </Link>
                </div>
              </div>

              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard
                  title="Total Interviews"
                  value={data?.stats.total_interviews || 0}
                  subtitle="Mock sessions launched"
                  icon={Layers}
                  color="indigo"
                />
                <DashboardCard
                  title="Completed"
                  value={data?.stats.completed_interviews || 0}
                  subtitle="Full reports generated"
                  icon={CheckCircle2}
                  color="emerald"
                />
                <DashboardCard
                  title="Average Score"
                  value={`${data?.stats.average_score || 0}%`}
                  subtitle="Gemini evaluation metric"
                  icon={Award}
                  color="amber"
                />
                <DashboardCard
                  title="Topics Covered"
                  value={data?.stats.topics_covered || 0}
                  subtitle="Technical areas practiced"
                  icon={BookOpen}
                  color="cyan"
                />
              </div>

              {/* Latest AI Study Plan Card Preview */}
              {data?.latest_study_plan && (
                <div className="p-6 rounded-2xl glass-card border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Active Roadmap</span>
                      <h3 className="text-base font-bold text-white">{data.latest_study_plan.plan_title}</h3>
                      <p className="text-xs text-slate-400">7-Day customized practice curriculum</p>
                    </div>
                  </div>
                  <Link
                    to="/study-plan"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    View Plan <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Recent Interview History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-white tracking-tight">Recent Mock Interviews</h2>
                    <p className="text-xs text-slate-400">Track past session questions, evaluations, and reports</p>
                  </div>
                  <Link
                    to="/history"
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                  >
                    View All History <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <InterviewHistoryTable sessions={data?.recent_sessions || []} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
