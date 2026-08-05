import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { InterviewAnswer } from '../types';

interface FeedbackPanelProps {
  evaluation: Partial<InterviewAnswer>;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ evaluation }) => {
  return (
    <div className="space-y-5 text-left">
      {/* Points breakdown: Correct, Missing, Incorrect */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Correct Points */}
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-2">
            <CheckCircle2 className="w-4 h-4" />
            Correct Key Points
          </div>
          {evaluation.correct_points && evaluation.correct_points.length > 0 ? (
            <ul className="space-y-1.5">
              {evaluation.correct_points.map((pt, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No specific correct points detected.</p>
          )}
        </div>

        {/* Missing Points */}
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-2">
            <AlertTriangle className="w-4 h-4" />
            Missing Points
          </div>
          {evaluation.missing_points && evaluation.missing_points.length > 0 ? (
            <ul className="space-y-1.5">
              {evaluation.missing_points.map((pt, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-amber-400">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">None. All major expected points covered!</p>
          )}
        </div>

        {/* Incorrect Points */}
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-2">
            <XCircle className="w-4 h-4" />
            Incorrect / Misleading
          </div>
          {evaluation.incorrect_points && evaluation.incorrect_points.length > 0 ? (
            <ul className="space-y-1.5">
              {evaluation.incorrect_points.map((pt, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-rose-400">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No inaccurate claims identified.</p>
          )}
        </div>
      </div>

      {/* Technical & Communication Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl glass-card border border-indigo-500/20">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Technical Insight
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {evaluation.technical_feedback || 'Solid overall technical attempt.'}
          </p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-cyan-500/20">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs mb-1.5">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            Communication Feedback
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {evaluation.communication_feedback || 'Clear delivery style.'}
          </p>
        </div>
      </div>

      {/* Improved Interview-Ready Answer */}
      {evaluation.improved_answer && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Improved Interview-Ready Answer
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 font-mono">
            {evaluation.improved_answer}
          </p>
        </div>
      )}

      {/* Recommended Topic & Follow Up */}
      <div className="flex flex-wrap gap-3">
        {evaluation.recommended_topic && (
          <div className="flex-1 min-w-[200px] p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-xs flex items-center gap-2.5 text-indigo-300">
            <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="font-semibold block text-[10px] text-slate-400 uppercase">Recommended Topic</span>
              <span>{evaluation.recommended_topic}</span>
            </div>
          </div>
        )}

        {evaluation.follow_up_question && (
          <div className="flex-1 min-w-[200px] p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs flex items-center gap-2.5 text-cyan-300">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="font-semibold block text-[10px] text-slate-400 uppercase">Follow-up Challenge</span>
              <span>{evaluation.follow_up_question}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
