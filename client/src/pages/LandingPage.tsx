import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  Zap,
  BrainCircuit,
  BookOpen,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="text-center space-y-6 max-w-3xl mx-auto relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Powered by Google Gemini Generative AI SDK
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Master Technical Interviews with{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Real-Time AI Coaching
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              CareerPilot AI gives undergraduate students and entry-level developers realistic mock interviews, instant technical & communication feedback, score evaluations, and custom 7-day preparation plans.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                Start Mock Interview Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white glass-panel border border-slate-800 hover:border-slate-700 transition-all duration-200 flex items-center justify-center"
              >
                Existing Student Login
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Frontend, Backend & Full-Stack Tracks
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Realtime Session Status
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> 7-Day Custom Study Plan
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-20 bg-slate-900/50 border-t border-b border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-16">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Everything You Need to Ace Your First Tech Role
              </h2>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                Built specifically for entry-level candidates facing modern software engineering interview rounds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4 hover:border-indigo-500/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Dynamic Gemini AI Questions</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tailored technical and behavioral questions generated in real-time according to your target role, difficulty, and weak areas.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4 hover:border-cyan-500/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Instant Answer Evaluation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Receive scores out of 10, identified correct/missing points, technical advice, and polished interview-ready answer scripts.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4 hover:border-purple-500/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">7-Day Personalized Study Roadmap</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Convert mock interview weak points into an actionable day-by-day learning & practice curriculum with time estimates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-400">CareerPilot AI</span> — Software Interview Coach
          </div>
          <p>© 2026 CareerPilot AI. Built with React, Node, Supabase, and Gemini API.</p>
        </div>
      </footer>
    </div>
  );
};
