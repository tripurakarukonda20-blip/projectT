import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { LoadingState } from '../components/LoadingState';
import { ErrorAlert } from '../components/ErrorAlert';
import { fetchApi } from '../lib/api';
import { InterviewSession } from '../types';

export const FinalReportPage: React.FC = () => {
  const { id: sessionId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  const loadReportData = async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<{ session: InterviewSession }>(`/api/interviews/${sessionId}`);
      setSession(data.session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load interview report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [sessionId]);

  const handleGenerateStudyPlan = async () => {
    if (!sessionId) return;
    setGeneratingPlan(true);
    try {
      await fetchApi('/api/study-plans', {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId }),
      });
      navigate('/study-plan');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate study plan');
      setGeneratingPlan(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {loading ? (
            <LoadingState message="Synthesizing final interview report..." />
          ) : error ? (
            <ErrorAlert message={error} onRetry={loadReportData} />
          ) : !session ? (
            <ErrorAlert message="Session data not found" />
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header Hero */}
              <div className="relative p-8 rounded-3xl glass-card border border-indigo-500/20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                  <ScoreDisplay score={session.overall_score || 0} maxScore={100} size="lg" />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Mock Interview Report
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {session.target_role} — {session.topic}
                    </h1>
                    <p className="text-xs text-slate-400">
                      Performance Level: <strong className="text-indigo-300 font-semibold">{session.performance_level || 'Intermediate'}</strong> • {session.difficulty} Difficulty
                    </p>
                  </div>
                </div>

                <div className="relative z-10 w-full sm:w-auto">
                  <button
                    onClick={handleGenerateStudyPlan}
                    disabled={generatingPlan}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {generatingPlan ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating Plan...</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4" />
                        <span>Generate 7-Day Study Plan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Encouraging Final Message */}
              {session.final_message && (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-0.5">Coach Summary Note</strong>
                    <span>{session.final_message}</span>
                  </div>
                </div>
              )}

              {/* Strong vs Weak Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strong Areas */}
                <div className="p-6 rounded-2xl glass-card border border-emerald-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    Identified Strengths
                  </div>
                  <ul className="space-y-2">
                    {(session.strong_areas || ['Core technical principles', 'Structured delivery']).map((str, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weak Areas */}
                <div className="p-6 rounded-2xl glass-card border border-amber-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5" />
                    Growth & Revision Focus
                  </div>
                  <ul className="space-y-2">
                    {(session.weak_areas || ['Edge-case analysis', 'Optimization tradeoffs']).map((wk, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technical & Communication Performance Summaries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <TrendingUp className="w-4 h-4" />
                    Technical Summary
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {session.technical_summary || 'Good technical foundation demonstrated across answers.'}
                  </p>
                </div>

                <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <MessageSquare className="w-4 h-4" />
                    Communication Summary
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {session.communication_summary || 'Clear delivery style with structured reasoning.'}
                  </p>
                </div>
              </div>

              {/* Recommended Revision Topics */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    Recommended Revision Topics
                  </span>
                  <span className="text-xs text-slate-400">
                    Suggested Next Difficulty: <strong className="text-indigo-300">{session.next_difficulty || 'Medium'}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(session.topics_to_revise || ['System Architecture', 'Async Control Flow', 'Security Best Practices']).map((topic, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-semibold text-slate-200">
                      <span className="text-indigo-400 block text-[10px] uppercase font-bold">Topic #{idx + 1}</span>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900">
                <Link
                  to="/history"
                  className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  ← Back to All Interview History
                </Link>

                <Link
                  to="/interview/new"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  Start New Interview Session <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
